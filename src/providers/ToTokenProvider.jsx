import apiKey from '../apiKey'
import PaymentContext from '../contexts/PaymentContext'
import React, { useState, useEffect, useContext } from 'react'
import ToTokenContext from '../contexts/ToTokenContext'
import UpdateContext from '../contexts/UpdateContext'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from 'depay-web3-constants'
import { Currency } from 'depay-local-currency'
import { route } from 'depay-web3-exchanges'
import { Token } from 'depay-web3-tokens'

export default (props)=>{

  const { account } = useContext(WalletContext)
  const { update } = useContext(UpdateContext)
  const { payment } = useContext(PaymentContext)
  const [ localValue, setLocalValue ] = useState()
  const [ reloadCount, setReloadCount ] = useState(0)
  const getToTokenLocalValue = ({ update, payment })=>{
    if(update == false || payment?.route == undefined) { return }
    Promise.all([
      route({
        blockchain: payment.route.blockchain,
        tokenIn: payment.route.toToken.address,
        tokenOut: CONSTANTS[payment.route.blockchain].USD,
        amountIn: payment.route.toAmount,
        fromAddress: account,
        toAddress: account
      }),
      (new Token({ blockchain: payment.route.blockchain, address: CONSTANTS[payment.route.blockchain].USD })).decimals()
    ]).then(([USDExchangeRoutes, USDDecimals])=>{
      let USDRoute = USDExchangeRoutes[0]
      if (USDRoute == undefined) { return }
      let USDAmount = USDRoute.amountOut.toString()
      let USDValue = parseFloat(USDAmount) / 10**USDDecimals
      Currency.fromUSD({ amount: USDValue, apiKey }).then((localValue)=>{
        setLocalValue(localValue)
      })
    })
  }
  
  useEffect(()=>{
    if(account && payment) { getToTokenLocalValue({ update, payment }) }
  }, [payment, account])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReloadCount(reloadCount + 1)
      getToTokenLocalValue({ update })
    }, 15000);

    return () => clearTimeout(timeout)
  }, [reloadCount, update])
  
  return(
    <ToTokenContext.Provider value={{
      localValue
    }}>
      { props.children }
    </ToTokenContext.Provider>
  )
}
