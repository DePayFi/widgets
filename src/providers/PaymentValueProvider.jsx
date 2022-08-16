import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import PaymentContext from '../contexts/PaymentContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useState, useEffect, useContext } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from '@depay/web3-constants'
import { Currency } from '@depay/local-currency'
import { ethers } from 'ethers'
import { route } from '@depay/web3-exchanges'
import { Token } from '@depay/web3-tokens'

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
    Promise.all([
      route({
        blockchain: payment.route.blockchain,
        tokenIn: payment.route.fromToken.address,
        tokenOut: CONSTANTS[payment.route.blockchain].USD,
        amountIn: payment.route.fromAmount,
        fromAddress: account,
        toAddress: account
      }),
      !payment.route.directTransfer ? route({
        blockchain: payment.route.blockchain,
        tokenIn: payment.route.toToken.address,
        tokenOut: payment.route.fromToken.address,
        amountIn: payment.route.toAmount,
        fromAddress: account,
        toAddress: account
      }) : Promise.resolve([]),
      (new Token({ blockchain: payment.route.blockchain, address: CONSTANTS[payment.route.blockchain].USD })).decimals()
    ]).then(([fromTokenUSDExchangeRoutes, reverseRoutes, USDDecimals])=>{
      let fromTokenUSDRoute = fromTokenUSDExchangeRoutes[0]
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

      let fromTokenUSDAmount
      if(payment.route.fromToken.address.toLowerCase() == CONSTANTS[payment.route.blockchain].USD.toLowerCase()) {
        fromTokenUSDAmount = payment.route.fromAmount.toString()
      } else if (fromTokenUSDRoute == undefined) {
        setPaymentValue('')
        return
      } else {
        fromTokenUSDAmount = fromTokenUSDRoute.amountOut.toString()
      }

      let fromTokenUSDValue = ethers.utils.formatUnits(fromTokenUSDAmount, USDDecimals)
      Currency.fromUSD({ amount: fromTokenUSDValue, code: currency })
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
