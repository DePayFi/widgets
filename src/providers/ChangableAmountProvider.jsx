import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConversionRateContext from '../contexts/ConversionRateContext'
import ErrorContext from '../contexts/ErrorContext'
import findMaxRoute from '../helpers/findMaxRoute'
import React, { useState, useEffect, useContext } from 'react'
import round from '../helpers/round'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from 'depay-web3-constants'
import { Decimal } from 'decimal.js'
import { route } from 'depay-web3-exchanges'
import { Token } from 'depay-web3-tokens'

export default (props)=>{
  const configurationsMissAmounts = (configurations)=>{
    return !configurations.every((configuration)=>(typeof configuration.amount != 'undefined'))
  }
  const [ amountsMissing, setAmountsMissing ] = useState(configurationsMissAmounts(props.accept))
  const { account } = useContext(WalletContext)
  const { amount: configuredAmount } = useContext(ConfigurationContext)
  const { conversionRate } = useContext(ConversionRateContext)
  const { setError } = useContext(ErrorContext)
  const [ acceptWithAmount, setAcceptWithAmount ] = useState()
  const [ amount, setAmount ] = useState(amountsMissing ? (typeof configuredAmount == "object" && configuredAmount.start ? configuredAmount.start : 1) : null)
  const [ maxRoute, setMaxRoute ] = useState()
  const [ maxAmount, setMaxAmount ] = useState(100)

  useEffect(()=>{
    setAmountsMissing(configurationsMissAmounts(props.accept))
  }, [props.accept])

  useEffect(()=>{
    if(amountsMissing && account && conversionRate) {
      Promise.all(props.accept.map((configuration)=>{
        return route({
          blockchain: configuration.blockchain,
          tokenIn: CONSTANTS[configuration.blockchain].USD,
          amountIn: (1.00/conversionRate) * amount,
          tokenOut: configuration.token,
          fromAddress: account,
          toAddress: account
        })
      })).then((routes)=>{
        Promise.all(routes.map((routes, index)=>{
          if(routes[0] == undefined){ return }
          return Token.readable({
            blockchain: props.accept[index].blockchain,
            amount: routes[0].amountOut,
            address: routes[0].tokenOut
          })
        })).then((amounts)=>{
          setAcceptWithAmount(props.accept.map((configuration, index)=>{
            return(
              {
                blockchain: configuration.blockchain,
                amount: round(amounts[index]) || 1,
                token: configuration.token,
                receiver: configuration.receiver || account
              }
            )
          }))
        }).catch(setError)
      }).catch(setError)
    }
  }, [account, conversionRate, amount])

  useEffect(()=>{
    if(amountsMissing && maxRoute) {
      maxRoute.fromToken.readable(maxRoute.fromBalance)
        .then((readableMaxAmount)=>{
          if(maxRoute.fromToken.address == CONSTANTS[maxRoute.blockchain].USD) {
            let maxAmount = parseFloat(
              new Decimal(readableMaxAmount).mul(conversionRate).toString()
            )
            setMaxAmount(maxAmount > 10 ? Math.round(maxAmount) : maxAmount)
          } else {
            console.log('MAX AMOUNT ROUTE', maxRoute)
            route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: CONSTANTS[maxRoute.blockchain].USD,
              amountIn: parseFloat(readableMaxAmount),
              fromAddress: account,
              toAddress: account
            }).then((routes)=>{
              Token.readable({
                amount: routes[0].amountOut,
                blockchain: maxRoute.blockchain,
                address: CONSTANTS[maxRoute.blockchain].USD
              }).then((readableMaxAmount)=>{
                let slippage = 1.01
                let maxAmount = parseFloat(
                  new Decimal(readableMaxAmount).div(slippage).mul(conversionRate).toString()
                )
                setMaxAmount(maxAmount > 10 ? Math.round(maxAmount) : maxAmount)
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
