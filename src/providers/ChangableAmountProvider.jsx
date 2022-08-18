import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConversionRateContext from '../contexts/ConversionRateContext'
import ErrorContext from '../contexts/ErrorContext'
import findMaxRoute from '../helpers/findMaxRoute'
import React, { useCallback, useState, useEffect, useContext } from 'react'
import round from '../helpers/round'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from '@depay/web3-constants'
import { debounce } from 'lodash'
import { Decimal } from 'decimal.js'
import { route } from '@depay/web3-exchanges'
import { Token } from '@depay/web3-tokens'

export default (props)=>{
  const configurationsMissAmounts = (configurations)=>{
    return !configurations.every((configuration)=>{
      return(
        typeof configuration.amount != 'undefined' || typeof configuration.fromAmount != 'undefined'
      )
    })
  }
  const { amount: configuredAmount, toAmount, recover } = useContext(ConfigurationContext)
  const [ amountsMissing, setAmountsMissing ] = useState(recover == undefined ? configurationsMissAmounts(props.accept) : false)
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
    setAmountsMissing(configurationsMissAmounts(props.accept))
  }, [props.accept, recover])

  const getAmounts = ({ amount, conversionRate, fixedCurrencyConversionRate })=>{
    return new Promise((resolve, reject)=>{
      if(configuredAmount && configuredAmount.token) {
        resolve(props.accept.map(()=>amount))
      } else {
        Promise.all(props.accept.map((configuration)=>{
          if(fixedAmount) {
            if(CONSTANTS[configuration.blockchain].USD.toLowerCase() == configuration.token.toLowerCase()) {
              return 1.00/fixedCurrencyConversionRate * fixedAmount
            } else {
              return route({
                blockchain: configuration.blockchain,
                tokenIn: CONSTANTS[configuration.blockchain].USD,
                amountIn: (1.00/fixedCurrencyConversionRate) * fixedAmount,
                tokenOut: configuration.token,
                fromAddress: account,
                toAddress: account
              })
            }
          } else {
            if(CONSTANTS[configuration.blockchain].USD.toLowerCase() == configuration.token.toLowerCase()) {
              return 1.00/conversionRate * amount
            } else {
              return route({
                blockchain: configuration.blockchain,
                tokenIn: CONSTANTS[configuration.blockchain].USD,
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
                blockchain: props.accept[index].blockchain,
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
      setAcceptWithAmount(props.accept.map((configuration, index)=>{
        if(amounts[index] == undefined) { return }
        return(
          {
            blockchain: configuration.blockchain,
            amount: round(amounts[index]),
            token: configuration.token,
            receiver: configuration.receiver || account
          }
        )
      }).filter((configuration)=>{
        return !!configuration
      }))
    }).catch(setError)
  }, 500), [])

  useEffect(()=>{
    if(recover) { return }
    if(amountsMissing && account && conversionRate && (fixedAmount ? fixedCurrencyConversionRate : true)) {
      updateAmounts({ account, amount, conversionRate, fixedCurrencyConversionRate })
    }
  }, [amountsMissing, account, conversionRate, fixedAmount, fixedCurrencyConversionRate, amount, recover])

  useEffect(()=>{
    if(amountsMissing && maxRoute) {
      maxRoute.fromToken.readable(maxRoute.fromBalance)
        .then((readableMaxAmount)=>{
          if(configuredAmount && configuredAmount.token) {
            route({
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
                  address: maxRoute.toToken.address
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
          } else if(maxRoute.fromToken.address == CONSTANTS[maxRoute.blockchain].USD) {
            let maxAmount = parseFloat(
              new Decimal(readableMaxAmount).mul(conversionRate).toString()
            )
            setMaxAmount(maxAmount > 10 ? Math.round(maxAmount-1) : maxAmount-1)
          } else {
            route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: CONSTANTS[maxRoute.blockchain].USD,
              amountIn: parseFloat(readableMaxAmount),
              fromAddress: account,
              toAddress: account
            }).then((routes)=>{
              if(routes[0] == undefined){ return }
              Token.readable({
                amount: routes[0].amountOut,
                blockchain: maxRoute.blockchain,
                address: CONSTANTS[maxRoute.blockchain].USD
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
