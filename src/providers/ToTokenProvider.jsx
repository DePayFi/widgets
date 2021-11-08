import PaymentContext from '../contexts/PaymentContext'
import React, { useState, useEffect, useContext } from 'react'
import ToTokenContext from '../contexts/ToTokenContext'

export default (props)=>{
  const { payment } = useContext(PaymentContext)
  let [ toToken, setToToken ] = useState()
  let [ toTokenReadableAmount, setToTokenReadableAmount ] = useState()

  useEffect(()=>{
    if(payment) {
      Promise.all([
        payment.route.toToken.symbol(),
        payment.route.toToken.readable(payment.route.toAmount)
      ]).then(([symbol, readableAmount])=>{
        setToToken({
          address: payment.route.toToken.address,
          symbol: symbol
        })
        setToTokenReadableAmount(readableAmount)
      })
    }
  }, [payment])

  return(
    <ToTokenContext.Provider value={{
      toToken,
      toTokenReadableAmount
    }}>
      { props.children }
    </ToTokenContext.Provider>
  )
}
