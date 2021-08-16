import PaymentContext from '../contexts/PaymentContext'
import React, { useContext, useEffect, useState } from 'react'
import RoutingContext from '../contexts/RoutingContext'

export default (props)=>{

  const { selectedRoute } = useContext(RoutingContext)
  const [ payment, setPayment ] = useState()

  useEffect(()=>{
    if(selectedRoute) {
      let fromToken = selectedRoute.fromToken
      let fromAmount = selectedRoute.transaction.params.amounts[0]
      Promise.all([
        fromToken.name(),
        fromToken.symbol(),
        fromToken.readable(fromAmount)
      ]).then(([name, symbol, amount])=>{
        setPayment({ 
          route: selectedRoute,
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
