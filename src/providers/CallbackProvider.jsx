import CallbackContext from '../contexts/CallbackContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import React, { useContext, useRef } from 'react'

export default (props)=>{
  const { before, sent, succeeded, failed, validated } = useContext(ConfigurationContext)

  const sentCallbackCalled = useRef()
  const succeededCallbackCalled = useRef()
  const failedCallbackCalled = useRef()
  const validatedCallbackCalled = useRef()

  const callBeforeCallback = (transaction, paymentRoute)=>{
    if(typeof before === 'function') {
      before(transaction, paymentRoute)
    } else {
      return false
    }
  }

  const callSentCallback = (transaction, paymentRoute)=>{
    if(typeof sent === 'function' && sentCallbackCalled.current !== true) {
      sentCallbackCalled.current = true
      setTimeout(()=>sent(transaction, paymentRoute), 200)
    }
  }

  const callSucceededCallback = (transaction, paymentRoute)=>{
    if(typeof succeeded === 'function' && succeededCallbackCalled.current !== true) {
      succeededCallbackCalled.current = true
      setTimeout(()=>succeeded(transaction, paymentRoute), 200)
    }
  }

  const callFailedCallback = (transaction, paymentRoute)=>{
    if(typeof failed === 'function' && failedCallbackCalled.current !== true) {
      failedCallbackCalled.current = true
      setTimeout(()=>failed(transaction, paymentRoute), 200)
    }
  }

  const callValidatedCallback = (transaction, paymentRoute)=>{
    if(validated && validatedCallbackCalled.current !== true) {
      validatedCallbackCalled.current = true
      setTimeout(()=>validated(transaction, paymentRoute), 200)
    }
  }

  return(
    <CallbackContext.Provider value={{
      callBeforeCallback,
      callSentCallback,
      callSucceededCallback,
      callFailedCallback,
      callValidatedCallback,
    }}>
      { props.children }
    </CallbackContext.Provider>
  )
}
