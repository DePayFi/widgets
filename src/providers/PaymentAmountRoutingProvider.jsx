import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import PaymentAmountRoutingContext from '../contexts/PaymentAmountRoutingContext'
import PaymentRoutingProvider from './PaymentRoutingProvider'
import React, { useState, useEffect, useContext } from 'react'

export default (props)=>{
  const { amountsMissing, acceptWithAmount, setMaxRoute } = useContext(ChangableAmountContext)
  const { accept: configuredAccept } = useContext(ChangableAmountContext)
  const [ accept, setAccept ] = useState()

  useEffect(()=>{
    if(amountsMissing) {
      if(acceptWithAmount) {
        setAccept(acceptWithAmount)
      }
    } else {
      setAccept(configuredAccept)
    }
  }, [amountsMissing, acceptWithAmount])

  return(
    <PaymentAmountRoutingContext.Provider value={{}}>
      <PaymentRoutingProvider accept={ accept } setMaxRoute={ setMaxRoute } container={ props.container } document={ props.document }>
        { props.children }
      </PaymentRoutingProvider>
    </PaymentAmountRoutingContext.Provider>
  )
}
