import ChangableAmountContext from '../contexts/ChangableAmountContext'
import PaymentAmountRoutingContext from '../contexts/PaymentAmountRoutingContext'
import PaymentRoutingProvider from './PaymentRoutingProvider'
import React, { useState, useEffect, useContext } from 'react'

export default (props)=>{
  const { amountsMissing, acceptWithAmount, setMaxRoute } = useContext(ChangableAmountContext)
  const [ accept, setAccept ] = useState()

  useEffect(()=>{
    if(amountsMissing) {
      if(acceptWithAmount) {
        setAccept(acceptWithAmount)
      }
    } else {
      setAccept(props.accept)
    }
  }, [amountsMissing, acceptWithAmount])

  return(
    <PaymentAmountRoutingContext.Provider value={{}}>
      <PaymentRoutingProvider accept={ accept } whitelist={ props.whitelist } blacklist={ props.blacklist } event={ props.event } setMaxRoute={ setMaxRoute } fee={ props.fee } container={ props.container } document={ props.document }>
        { props.children }
      </PaymentRoutingProvider>
    </PaymentAmountRoutingContext.Provider>
  )
}
