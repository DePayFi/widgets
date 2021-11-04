import apiKey from '../helpers/apiKey'
import ConfigurationContext from '../contexts/ConfigurationContext'
import DonationRoutingContext from '../contexts/DonationRoutingContext'
import PaymentProvider from '../providers/PaymentProvider'
import PaymentRoutingProvider from '../providers/PaymentRoutingProvider'
import PaymentValueProvider from '../providers/PaymentValueProvider'
import React, { useState, useContext, useEffect } from 'react'
import round from '../helpers/round'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from 'depay-web3-constants'
import { route } from 'depay-web3-exchanges'
import { Token } from 'depay-web3-tokens'

export default (props)=>{

  let { accept, blacklist } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)
  const [donatedAmount, setDonatedAmount] = useState()
  const [donatedToken, setDonatedToken] = useState()
  const [acceptWithAmount, setAcceptWithAmount] = useState()

  useEffect(()=>{
    if(account && donatedAmount) {
      setAcceptWithAmount(
        accept.map((configuration)=>{
          return(
            {
              blockchain: configuration.blockchain,
              amount: donatedAmount,
              token: configuration.token,
              receiver: configuration.receiver
            }
          )
        })
      )
    }
  }, [account, donatedAmount])

  useEffect(()=>{
    if(account) {
      Promise.all(accept.map((configuration)=>{
        return route({
          blockchain: configuration.blockchain,
          tokenIn: CONSTANTS[configuration.blockchain].USD,
          tokenOut: configuration.token,
          amountIn: 1,
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
  }, [account])

  return(
    <DonationRoutingContext.Provider value={{
      setDonatedAmount,
      donatedAmount
    }}>
      <PaymentRoutingProvider accept={ acceptWithAmount } blacklist={ blacklist }>
        <PaymentProvider container={ props.container } document={ props.document } >
          <PaymentValueProvider>
            { props.children }
          </PaymentValueProvider>
        </PaymentProvider>
      </PaymentRoutingProvider>
    </DonationRoutingContext.Provider>
  )
}
