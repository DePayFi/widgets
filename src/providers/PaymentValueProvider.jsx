/*#if _EVM

import Exchanges from '@depay/web3-exchanges-evm'
import Token from '@depay/web3-tokens-evm'

/*#elif _SOLANA

import Exchanges from '@depay/web3-exchanges-solana'
import Token from '@depay/web3-tokens-solana'

//#else */

import Exchanges from '@depay/web3-exchanges'
import Token from '@depay/web3-tokens'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import PaymentContext from '../contexts/PaymentContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useState, useEffect, useContext } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { Currency } from '@depay/local-currency'
import { ethers } from 'ethers'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const { account } = useContext(WalletContext)
  const { updatable } = useContext(UpdatableContext)
  const { amount: configuredAmount, currencyCode } = useContext(ConfigurationContext)
  const { amount } = useContext(ChangableAmountContext)
  const { payment } = useContext(PaymentContext)
  const [ paymentValue, setPaymentValue ] = useState()
  const [ displayedPaymentValue, setDisplayedPaymentValue ] = useState()
  const [ paymentValueLoss, setPaymentValueLoss ] = useState()
  const { currency } = useContext(ConfigurationContext)
  const [ reloadCount, setReloadCount ] = useState(0)
  
  const updatePaymentValue = ({ updatable, payment })=>{
    if(updatable == false || payment?.route == undefined) { return }
    setPaymentValue(null)
    setPaymentValueLoss(null)
    Promise.all([
      Promise.all(
        Blockchains[payment.route.blockchain].stables.usd.map((stable)=>{
          return Exchanges.route({
            blockchain: payment.route.blockchain,
            tokenIn: payment.route.fromToken.address,
            tokenOut: stable,
            amountIn: payment.route.fromAmount,
            fromAddress: account,
            toAddress: account
          })
        })
      ),
      !payment.route.directTransfer ? Exchanges.route({
        blockchain: payment.route.blockchain,
        tokenIn: payment.route.toToken.address,
        tokenOut: payment.route.fromToken.address,
        amountIn: payment.route.feeAmount ? ethers.BigNumber.from(payment.route.toAmount).add(ethers.BigNumber.from(payment.route.feeAmount)) : payment.route.toAmount,
        fromAddress: account,
        toAddress: account
      }) : Promise.resolve([])
    ]).then(([fromTokenUSDExchangeRoutes, reverseRoutes])=>{
      let reverseRoute = reverseRoutes[0]

      if(reverseRoute) {
        let reverseAmountOutBN = ethers.BigNumber.from(reverseRoute.amountOut)
        let paymentAmountInBN = ethers.BigNumber.from(payment.route.fromAmount)
        let divPercent = 100-reverseAmountOutBN.mul(ethers.BigNumber.from('100')).div(paymentAmountInBN).abs().toString()
        if(divPercent >= 10) {
          setPaymentValueLoss(divPercent)
        } else {
          setPaymentValueLoss(null)
        }
      }

      let USDValue
      if(Blockchains[payment.route.blockchain].stables.usd.includes(payment.route.fromToken.address)) {
        // is stable

        const decimals = Blockchains[payment.route.blockchain].tokens.find(
          (token)=>token.address===payment.route.fromToken.address
        ).decimals

        USDValue = ethers.utils.formatUnits(
          payment.route.fromAmount.toString(),
          decimals
        )

      } else {
        
        const USDRoutes = fromTokenUSDExchangeRoutes.map((routes)=>routes ? routes[0] : undefined).filter(Boolean)
        
        if(USDRoutes.length == 0) {
          setPaymentValue('')
          return
        } else {

          let amounts = USDRoutes.map((route)=>{
            
            const decimals = Blockchains[payment.route.blockchain].tokens.find(
              (token)=>token.address===route.tokenOut
            ).decimals

            return parseFloat(ethers.utils.formatUnits(route.amountOut, decimals))
          })

          // remove outliers
          const average = amounts.reduce((a, b)=>a+b)/amounts.length
          const diff = 0.1 // 10%
          const filteredAmounts = amounts.filter((amount)=>{
            return (amount < (average + average*diff) && amount > (average - average*diff))
          })

          if(filteredAmounts.length) {
            USDValue = filteredAmounts.reduce((a, b)=>a+b)/filteredAmounts.length
          } else {
            USDValue = amounts.reduce((a, b)=>a+b)/amounts.length
          }
        }
      }

      Currency.fromUSD({ amount: USDValue, code: currency })
        .then(setPaymentValue)
    }).catch(setError)
  }

  useEffect(()=>{
    if(paymentValue && amount && configuredAmount && configuredAmount.currency && configuredAmount.fix) {
      setDisplayedPaymentValue(paymentValue.toString())
    } else if(amount && (configuredAmount == undefined || configuredAmount?.token != true)) {
      setDisplayedPaymentValue(new Currency({ amount: amount.toFixed(2), code: currencyCode }).toString())
    } else if(paymentValue && paymentValue.toString().length && configuredAmount?.token != true) {
      setDisplayedPaymentValue(paymentValue.toString())
    } else if(payment) {
      setDisplayedPaymentValue(`${payment.symbol} ${payment.amount}`)
    }
  }, [paymentValue, payment, amount, configuredAmount])
  
  useEffect(()=>{
    if(account && payment) { updatePaymentValue({ updatable, payment }) }
  }, [payment, account])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReloadCount(reloadCount + 1)
      updatePaymentValue({ updatable })
    }, 15000);

    return () => clearTimeout(timeout)
  }, [reloadCount, updatable])
  
  return(
    <PaymentValueContext.Provider value={{
      paymentValue,
      paymentValueLoss,
      displayedPaymentValue,
    }}>
      { props.children }
    </PaymentValueContext.Provider>
  )
}
