import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConversionRateContext from '../contexts/ConversionRateContext'
import ErrorContext from '../contexts/ErrorContext'
import findMaxRoute from '../helpers/findMaxRoute'
import React, { useState, useEffect, useContext } from 'react'
import round from '../helpers/round'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from '@depay/web3-constants'
import { Decimal } from 'decimal.js'
import { route } from '@depay/web3-exchanges'
import { Token } from '@depay/web3-tokens'

export default (props)=>{
  const configurationsMissAmounts = (configurations)=>{
    return !configurations.every((configuration)=>(typeof configuration.amount != 'undefined'))
  }
  const { amount: amountConfiguration, recover } = useContext(ConfigurationContext)
  const [ amountsMissing, setAmountsMissing ] = useState(recover == undefined ? configurationsMissAmounts(props.accept) : false)
  let { account } = useContext(WalletContext)
  const { conversionRate } = useContext(ConversionRateContext)
  const { setError } = useContext(ErrorContext)
  const [ acceptWithAmount, setAcceptWithAmount ] = useState()
  const [ amount, setAmount ] = useState(amountsMissing ? (typeof amountConfiguration == "object" && amountConfiguration.start ? amountConfiguration.start : 1) : null)
  const [ maxRoute, setMaxRoute ] = useState()
  const [ maxAmount, setMaxAmount ] = useState(100)

  useEffect(()=>{
    if(recover) { return }
    setAmountsMissing(configurationsMissAmounts(props.accept))
  }, [props.accept, recover])

  const getAmounts = ()=>{
    return new Promise((resolve, reject)=>{
      if(amountConfiguration && amountConfiguration.token) {
        resolve(props.accept.map(()=>amount))
      } else {
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
          })).then(resolve).catch(setError)
        }).catch(setError)
      }
    })
  }

  useEffect(()=>{
    if(recover) { return }
    if(amountsMissing && account && conversionRate) {
      getAmounts().then((amounts)=>{
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
    }
  }, [amountsMissing, account, conversionRate, amount, recover])

  useEffect(()=>{
    if(amountsMissing && maxRoute) {
      maxRoute.fromToken.readable(maxRoute.fromBalance)
        .then((readableMaxAmount)=>{
          if(amountConfiguration && amountConfiguration.token) {
            route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: maxRoute.toToken.address,
              amountIn: parseFloat(readableMaxAmount),
              fromAddress: account,
              toAddress: account
            }).then((routes)=>{
              Token.readable({
                amount: routes[0].amountOut,
                blockchain: maxRoute.blockchain,
                address: maxRoute.toToken.address
              }).then((readableMaxAmount)=>{
                let slippage = 1.01
                let maxAmount = parseFloat(
                  new Decimal(readableMaxAmount).div(slippage).mul(conversionRate).toString()
                )
                setMaxAmount(maxAmount > 10 ? Math.round(maxAmount) : round(maxAmount))
              }).catch(setError)
            }).catch(setError)
          } else if(maxRoute.fromToken.address == CONSTANTS[maxRoute.blockchain].USD) {
            let maxAmount = parseFloat(
              new Decimal(readableMaxAmount).mul(conversionRate).toString()
            )
            setMaxAmount(maxAmount > 10 ? Math.round(maxAmount) : maxAmount)
          } else {
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
