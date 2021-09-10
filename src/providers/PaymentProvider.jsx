import ErrorContext from '../contexts/ErrorContext'
import PaymentContext from '../contexts/PaymentContext'
import React, { useContext, useEffect, useState } from 'react'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const { selectedRoute } = useContext(PaymentRoutingContext)
  const [ payment, setPayment ] = useState()
  const [ transaction, setTransaction ] = useState()

  useEffect(()=>{
    if(selectedRoute) {
      let fromToken = selectedRoute.fromToken
      let transactionParams = selectedRoute.transaction.params
      Promise.all([
        fromToken.name(),
        fromToken.symbol(),
        fromToken.readable(selectedRoute.fromAmount)
      ]).then(([name, symbol, amount])=>{
        setPayment({
          route: selectedRoute,
          token: selectedRoute.fromToken.address,
          name,
          symbol: symbol.toUpperCase(),
          amount
        })
      }).catch(setError)
    } else {
      setPayment(undefined)
    }
  }, [selectedRoute])

  return(
    <PaymentContext.Provider value={{
      setPayment,
      payment,
      setTransaction,
      transaction,
    }}>
      { props.children }
    </PaymentContext.Provider>
  )
}
