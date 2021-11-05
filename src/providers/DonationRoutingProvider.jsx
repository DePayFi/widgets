import apiKey from '../helpers/apiKey'
import ConfigurationContext from '../contexts/ConfigurationContext'
import DonationRoutingContext from '../contexts/DonationRoutingContext'
import ErrorContext from '../contexts/ErrorContext'
import findMaxRoute from '../helpers/findMaxRoute'
import PaymentProvider from '../providers/PaymentProvider'
import PaymentRoutingProvider from '../providers/PaymentRoutingProvider'
import PaymentValueProvider from '../providers/PaymentValueProvider'
import React, { useState, useContext, useEffect } from 'react'
import round from '../helpers/round'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from 'depay-web3-constants'
import { Currency } from 'depay-local-currency'
import { route } from 'depay-web3-exchanges'
import { Token } from 'depay-web3-tokens'

export default (props)=>{
  let { blacklist } = useContext(ConfigurationContext)
  const { setError } = useContext(ErrorContext)
  const { accept } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)
  const { currency } = useContext(ConfigurationContext)
  const [ amount, setAmount ] = useState(1)
  const [ maxRoute, setMaxRoute ] = useState()
  const [ maxAmount, setMaxAmount ] = useState(100)
  const [ acceptWithAmount, setAcceptWithAmount ] = useState()
  const [ conversionRate, setConversionRate ] = useState()

  useEffect(()=>{
    Currency.fromUSD({ amount: 1, code: currency, apiKey })
      .then((conversion)=>setConversionRate(conversion.amount))
      .catch(setError)
  }, [])

  useEffect(()=>{
    if(account && conversionRate) {
      Promise.all(accept.map((configuration)=>{
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
          return Token.readable({
            blockchain: accept[index].blockchain,
            amount: routes[0].amountOut,
            address: routes[0].tokenOut
          })
        })).then((amounts)=>{
          setAcceptWithAmount(accept.map((configuration, index)=>{
            return(
              {
                blockchain: configuration.blockchain,
                amount: round(amounts[index]),
                token: configuration.token,
                receiver: configuration.receiver
              }
            )
          }))
        })
      })
    }
  }, [account, conversionRate, amount])

  useEffect(()=>{
    if(maxRoute) {
      console.log(maxRoute)
      maxRoute.fromToken.readable(maxRoute.fromBalance)
        .then((readableMaxAmount)=>{
          if(maxRoute.fromToken.address == CONSTANTS[maxRoute.blockchain].USD) {
            let slippage = 1.01
            setMaxAmount(
              parseInt(
                (parseFloat(readableMaxAmount)/slippage*conversionRate).toFixed(0)
              , 10)
            )
          } else {
            route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: CONSTANTS[maxRoute.blockchain].USD,
              amountIn: readableMaxAmount,
              fromAddress: account,
              toAddress: account
            }).then((routes)=>{
              console.log(routes)
            })
          }
        })
    } else {
      setMaxAmount(100)
    }
  }, [account, maxRoute])

  return(
    <DonationRoutingContext.Provider value={{
      amount,
      setAmount,
      maxAmount
    }}>
      <PaymentRoutingProvider accept={ acceptWithAmount } blacklist={ blacklist } setMaxRoute={ setMaxRoute }>
        <PaymentProvider container={ props.container } document={ props.document } >
          <PaymentValueProvider>
            { props.children }
          </PaymentValueProvider>
        </PaymentProvider>
      </PaymentRoutingProvider>
    </DonationRoutingContext.Provider>
  )
}
