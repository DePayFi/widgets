import ConfigurationContext from '../contexts/ConfigurationContext'
import PaymentProvider from '../providers/PaymentProvider'
import PaymentRoutingProvider from '../providers/PaymentRoutingProvider'
import PaymentValueProvider from '../providers/PaymentValueProvider'
import React, { useState, useContext, useEffect } from 'react'
import SaleRoutingContext from '../contexts/SaleRoutingContext'
import WalletContext from '../contexts/WalletContext'
import { Token } from 'depay-web3-tokens'

export default (props)=>{

  let { amount, token, blockchains, blacklist } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)
  const [purchasedAmount, setPurchaseAmount] = useState(amount.start)
  const [purchasedToken, setPurchasedToken] = useState()
  const [accept, setAccept] = useState()

  if(blacklist == undefined) { blacklist = {} }
  blockchains.forEach((blockchain)=>{
    if(blacklist[blockchain] == undefined) {
      blacklist[blockchain] = [token]
    } else if (blacklist[blockchain] instanceof Array) {
      blacklist[blockchain].push(token)
    }
  })

  useEffect(()=>{
    if(account) {
      setAccept(
        blockchains.map((blockchain)=>{
          return(
            {
              blockchain,
              amount: purchasedAmount,
              token: token,
              receiver: account
            }
          )
        })
      )
    }
  }, [account, purchasedAmount])

  useEffect(()=>{
    let tokenInstance = new Token({ blockchain: blockchains[0], address: token })
    Promise.all([
      tokenInstance.name(),
      tokenInstance.symbol(),
      tokenInstance.decimals()
    ]).then(([name, symbol, decimals])=>{
      setPurchasedToken({ address: token, name, symbol, decimals })
    })
  }, [])


  return(
    <SaleRoutingContext.Provider value={{
      setPurchaseAmount,
      purchasedAmount,
      purchasedToken
    }}>
      <PaymentRoutingProvider accept={ accept } blacklist={ blacklist }>
        <PaymentProvider container={ props.container } document={ props.document } >
          <PaymentValueProvider>
            { props.children }
          </PaymentValueProvider>
        </PaymentProvider>
      </PaymentRoutingProvider>
    </SaleRoutingContext.Provider>
  )
}
