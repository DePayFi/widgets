import PaymentContext from '../contexts/PaymentContext'
import React, { useContext, useEffect, useState } from 'react'
import RoutingContext from '../contexts/RoutingContext'

export default (props)=>{

  const { selectedRoute } = useContext(RoutingContext)
  const [ payment, setPayment ] = useState()

  useEffect(()=>{
    if(selectedRoute) {
      let exchangeRoute = selectedRoute.exchangeRoutes[0]
      let fromToken = selectedRoute.fromToken
      let fromAmount = exchangeRoute ? selectedRoute.exchangeRoutes[0].amountIn : selectedRoute.toAmount
      Promise.all([
        fromToken.name(),
        fromToken.symbol(),
        fromToken.readable(fromAmount)
      ]).then(([name, symbol, amount])=>{
        setPayment({ 
          token: selectedRoute.fromToken.address,
          name,
          symbol,
          amount
        })
      })
    }
  }, [selectedRoute])

  return(
    <PaymentContext.Provider value={{
      payment
    }}>
      { props.children }
    </PaymentContext.Provider>
  )
}
