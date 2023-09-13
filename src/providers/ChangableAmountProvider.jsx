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
import ConversionRateContext from '../contexts/ConversionRateContext'
import ErrorContext from '../contexts/ErrorContext'
import findMaxRoute from '../helpers/findMaxRoute'
import React, { useCallback, useState, useEffect, useContext } from 'react'
import round from '../helpers/round'
import WalletContext from '../contexts/WalletContext'
import { debounce } from 'lodash'
import { Decimal } from 'decimal.js'

export default (props)=>{
  const configurationsMissAmounts = (configurations)=>{
    return !configurations.every((configuration)=>{
      return(
        typeof configuration.amount != 'undefined' || typeof configuration.fromAmount != 'undefined'
      )
    })
  }
  const { amount: configuredAmount, toAmount, recover } = useContext(ConfigurationContext)
  let { accept } = useContext(ConfigurationContext)
  if (!accept) { accept = props.accept }
  const configuration = useContext(ConfigurationContext)
  const [ amountsMissing, setAmountsMissing ] = useState(recover == undefined ? configurationsMissAmounts(accept) : false)
  let { account } = useContext(WalletContext)
  const { conversionRate, fixedCurrencyConversionRate } = useContext(ConversionRateContext)
  const { setError } = useContext(ErrorContext)
  const [ acceptWithAmount, setAcceptWithAmount ] = useState()
  const [ fixedAmount ] = useState((typeof configuredAmount == 'object' && configuredAmount.fix && configuredAmount.currency) ? configuredAmount.fix : null)
  const [ fixedCurrency ] = useState((typeof configuredAmount == 'object' && configuredAmount.fix && configuredAmount.currency) ? configuredAmount.currency : null)
  let startAmount
  if(amountsMissing) {
    if((typeof configuredAmount == "object" && configuredAmount.start && configuredAmount.start)) {
      startAmount = configuredAmount.start
    } else if (typeof configuredAmount == "object" && configuredAmount.fix) {
      startAmount = configuredAmount.fix
    } else {
      startAmount = 1
    }
  }
  const [ amount, setAmount ] = useState(startAmount)
  const [ maxRoute, setMaxRoute ] = useState()
  const [ maxAmount, setMaxAmount ] = useState()

  useEffect(()=>{
    if(recover) { return }
    setAmountsMissing(configurationsMissAmounts(accept))
  }, [accept, recover])

  const getAmounts = ({ amount, conversionRate, fixedCurrencyConversionRate })=>{
    return new Promise((resolve, reject)=>{
      if(configuredAmount && configuredAmount.token) {
        resolve(accept.map(()=>amount))
      } else {
        Promise.all(accept.map((configuration)=>{
          if(fixedAmount) {
            if(Blockchains[configuration.blockchain].stables.usd[0] == configuration.token) {
              return 1.00/fixedCurrencyConversionRate * fixedAmount
            } else {
              return Exchanges.route({
                blockchain: configuration.blockchain,
                tokenIn: Blockchains[configuration.blockchain].stables.usd[0],
                amountIn: (1.00/fixedCurrencyConversionRate) * fixedAmount,
                tokenOut: configuration.token,
                fromAddress: account,
                toAddress: account
              })
            }
          } else {
            if(Blockchains[configuration.blockchain].stables.usd.find((stable)=> stable.toLowerCase() === configuration.token.toLowerCase())) {
              return 1.00/conversionRate * amount
            } else {
              return Exchanges.route({
                blockchain: configuration.blockchain,
                tokenIn: Blockchains[configuration.blockchain].stables.usd[0],
                amountIn: (1.00/conversionRate) * amount,
                tokenOut: configuration.token,
                fromAddress: account,
                toAddress: account
              })
            }
          }
        })).then((results)=>{
          Promise.all(results.map((result, index)=>{
            if(typeof result == 'number'){
              return result
            } else if(result[0] == undefined){ 
              return
            } else {
              return Token.readable({
                blockchain: accept[index].blockchain,
                amount: result[0].amountOut,
                address: result[0].tokenOut
              })
            }
          })).then(resolve).catch(setError)
        }).catch(setError)
      }
    })
  }

  const updateAmounts = useCallback(debounce(({ account, amount, conversionRate, fixedCurrencyConversionRate })=>{
    getAmounts({ amount, conversionRate, fixedCurrencyConversionRate }).then((amounts)=>{
      setAcceptWithAmount(accept.map((configuration, index)=>{
        if(amounts[index] == undefined) { return }
        return(
          {...configuration, amount: round(amounts[index]) }
        )
      }).filter((configuration)=>{
        return !!configuration
      }))
    }).catch(setError)
  }, 500), [])

  useEffect(()=>{
    if(recover) { return }
    if(amountsMissing && account && conversionRate && (fixedAmount ? fixedCurrencyConversionRate : true)) {
      setAcceptWithAmount()
      updateAmounts({ account, amount, conversionRate, fixedCurrencyConversionRate })
    }
  }, [amountsMissing, account, conversionRate, fixedAmount, fixedCurrencyConversionRate, amount, recover])

  useEffect(()=>{
    if(amountsMissing && maxRoute) {
      maxRoute.fromToken.readable(maxRoute.fromBalance)
        .then((readableMaxAmount)=>{
          if(configuredAmount && configuredAmount.token) {
            Exchanges.route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: maxRoute.toToken.address,
              amountIn: parseFloat(readableMaxAmount),
              fromAddress: account,
              toAddress: account
            }).then((routes)=>{
              if(routes[0] == undefined){
                Token.readable({
                  amount: maxRoute.fromBalance,
                  blockchain: maxRoute.blockchain,
                  address: maxRoute.fromToken.address
                }).then(setMaxAmount)
                return
              }
              Token.readable({
                amount: routes[0].amountOut,
                blockchain: maxRoute.blockchain,
                address: maxRoute.toToken.address
              }).then((readableMaxAmount)=>{
                let slippage = 1.01
                let maxAmount = parseFloat(
                  new Decimal(readableMaxAmount).div(slippage).mul(conversionRate).toString()
                )
                setMaxAmount(maxAmount > 10 ? Math.round(maxAmount-1) : round(maxAmount-1))
              }).catch(setError)
            }).catch(setError)
          } else if(maxRoute.fromToken.address == Blockchains[maxRoute.blockchain].stables.usd[0]) {
            let maxAmount = parseFloat(
              new Decimal(readableMaxAmount).mul(conversionRate).toString()
            )
            setMaxAmount(maxAmount > 10 ? Math.round(maxAmount-1) : maxAmount-1)
          } else {
            Exchanges.route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: Blockchains[maxRoute.blockchain].stables.usd[0],
              amountIn: parseFloat(readableMaxAmount),
              fromAddress: account,
              toAddress: account
            }).then((routes)=>{
              if(routes[0] == undefined){ return }
              Token.readable({
                amount: routes[0].amountOut,
                blockchain: maxRoute.blockchain,
                address: Blockchains[maxRoute.blockchain].stables.usd[0]
              }).then((readableMaxAmount)=>{
                let slippage = 1.01
                let maxAmount = parseFloat(
                  new Decimal(readableMaxAmount).div(slippage).mul(conversionRate).toString()
                )
                setMaxAmount(maxAmount > 10 ? Math.round(maxAmount) : round(maxAmount))
              }).catch(setError)
            }).catch(setError)
          }
        }).catch(setError)
    } else {
      setMaxAmount(100)
    }
  }, [account, maxRoute])

  return(
    <ChangableAmountContext.Provider value={{
      amountsMissing,
      fixedAmount,
      fixedCurrency,
      acceptWithAmount,
      amount,
      setAmount,
      setMaxRoute,
      maxAmount
    }}>
      { props.children }
    </ChangableAmountContext.Provider>
  )
}
