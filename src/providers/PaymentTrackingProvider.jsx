/*#if _EVM

import { request } from '@depay/web3-client-evm'

/*#elif _SVM

import { request } from '@depay/web3-client-svm'

//#else */

import { request } from '@depay/web3-client'

//#endif

import CallbackContext from '../contexts/CallbackContext'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import NavigateContext from '../contexts/NavigateContext'
import openManagedSocket from '../helpers/openManagedSocket'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useEffect, useContext, useState, useRef } from 'react'
import useEvent from '../hooks/useEvent'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'

export default (props)=>{
  const { errorCallback } = useContext(ErrorContext)
  const { id: configurationId, track: trackConfiguration, integration, link, type } = useContext(ConfigurationContext)
  const { callValidatedCallback, callSucceededCallback, callFailedCallback } = useContext(CallbackContext)
  const { account, wallet, solanaPayWallet } = useContext(WalletContext)
  const [ deadline, setDeadline ] = useState()
  const [ transaction, setTransaction ] = useState()
  const [ confirmationsRequired, setConfirmationsRequired ] = useState()
  const [ confirmationsPassed, setConfirmationsPassed ] = useState()
  const [ afterBlock, setAfterBlock ] = useState()
  const [ socket, setSocket ] = useState()
  const [ paymentRoute, setPaymentRoute ] = useState()
  const [ attemptId, setAttemptId ] = useState()
  const attemptIdRef = useRef(attemptId)
  attemptIdRef.current = attemptId
  const [ trackingInitialized, setTrackingInitialized ] = useState(false)
  const [ synchronousTracking ] = useState(
    !!configurationId ||
    !!(trackConfiguration && (trackConfiguration.endpoint || typeof trackConfiguration.method == 'function') && trackConfiguration.async != true)
  )
  const [ asynchronousTracking ] = useState(
    !configurationId &&
    !!(trackConfiguration && trackConfiguration.async == true)
  )
  const [ polling ] = useState(
    !!configurationId ||
    !!(trackConfiguration && trackConfiguration.poll && (trackConfiguration.poll.endpoint || typeof trackConfiguration.poll.method == 'function') && trackConfiguration.async != true)
  )
  const [ release, setRelease ] = useState(false)
  const [ validationState, setValidationState ] = useState()
  const [ forwardTo, setForwardTo ] = useState()
  
  const { setClosable } = useContext(ClosableContext)
  const { navigate, set } = useContext(NavigateContext)

  const validationSocket = useRef()

  const processValidationSocketMessage = useEvent((eventData, socket)=>{
    if(eventData?.message) {
      if(eventData.message.confirmations) {
        setConfirmationsRequired(eventData.message.confirmations.required)
        setConfirmationsPassed(eventData.message.confirmations.passed)
      }
      if(eventData.message.status) {
        const success = eventData.message.status == 'success'
        if(eventData.message.release) {
          socket.close(1000)
          if(success) {
            callSucceededCallback(transaction, paymentRoute)
            callValidatedCallback(transaction, paymentRoute)
            setRelease(true)
            setClosable(true)
            setForwardTo(eventData.message.forward_to)
          } else if(success == false) {
            if(
              eventData.message.failed_reason === undefined ||
              eventData.message.failed_reason === 'FAILED'
            ) {
              setClosable(true)
              callFailedCallback(transaction, paymentRoute)
              set(['PaymentFailed'])
            } else {
              setClosable(false)
              set(['ValidationFailed'])
            }
          }
        }
      }
    }
  })

  const openValidationSocket = (paymentRoute, deadline)=>{

    if(validationSocket.current) { return }

    const identifier = JSON.stringify({
      blockchain: paymentRoute.blockchain,
      sender: paymentRoute.fromAddress,
      receiver: paymentRoute.toAddress,
      deadline,
      channel: 'PaymentChannel'
    })

    validationSocket.current = openManagedSocket({
      identifier,
      onopen: ()=>{
        return({ command: 'subscribe', identifier })
      },
      onmessage: processValidationSocketMessage,
      keepAlive: {
        interval: 3000, 
        callback: ()=> {
          return {
            type: "ping",
            message: Math.floor(Date.now() / 1000)
          }
        }
      }
    })
  }

  const retryStartTracking = (transaction, afterBlock, paymentRoute, deadline, attempt)=> {
    attempt = parseInt(attempt || 1, 10)
    if(attempt < 10) {
      setTimeout(()=>{
        startTracking(transaction, afterBlock, paymentRoute, deadline, attempt+1)
      }, 2000)
    } else {
      navigate('TrackingFailed')
    }
  }

  const continueTryTracking = ()=>{
    retryStartTracking(transaction, afterBlock, paymentRoute, deadline, 1)
  }

  const callTracking = (payment)=>{
    if(configurationId){
      return fetch(`https://public.depay.com/configurations/${configurationId}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }).then((response)=>{
        if(response.status == 200 || response.status == 201) {
          response.json().then((attempt)=>setAttemptId(attempt.id))
          return response
        } else {
          return reject('TRACKING REQUEST FAILED')
        }
      })
    } else if(trackConfiguration.endpoint){
      return fetch(trackConfiguration.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }).then((response)=>{
        if(response.status == 200 || response.status == 201) {
          return response
        } else {
          throw('TRACKING REQUEST FAILED', response)
        }
      })
    } else if (trackConfiguration.method) {
      return trackConfiguration.method(payment)
    } else {
      throw('No tracking defined!')
    }
  }

  const startTracking = async(transaction, afterBlock, paymentRoute, deadline, attempt)=> {
    callTracking({
      blockchain: transaction.blockchain,
      transaction: transaction.id,
      sender: paymentRoute.fromAddress,
      after_block: afterBlock.toString(),
      from_token: paymentRoute.fromToken.address,
      from_amount: paymentRoute.fromAmount.toString(),
      from_decimals: paymentRoute.fromDecimals,
      to_token: paymentRoute.toToken.address,
      to_amount: paymentRoute.toAmount.toString(),
      to_decimals: paymentRoute.toDecimals,
      protocol_fee_amount: paymentRoute?.protocolFeeAmount?.toString(),
      fee_amount: paymentRoute?.feeAmount?.toString(),
      fee_receiver: paymentRoute?.fee?.receiver,
      fee2_amount: paymentRoute?.feeAmount2?.toString(),
      fee2_receiver: paymentRoute?.fee2?.receiver,
      trace_attempt_id: attemptIdRef.current,
      deadline,
      selected_wallet: wallet?.name || solanaPayWallet?.name
    })
      .then((response)=>{
        setTrackingInitialized(true)
      })
      .catch((error)=>{
        retryStartTracking(transaction, afterBlock, paymentRoute, deadline, attempt)
      })
  }

  const handlePollingResponse = useEvent((data, pollingInterval)=>{
    if(data && data.forward_to) {
      setClosable(true)
      setForwardTo(data.forward_to)
    } else {
      setClosable(true)
    }
    clearInterval(pollingInterval)
    if(data && data.failed_reason && data.failed_reason != 'FAILED') {
      setClosable(false)
      set(['ValidationFailed'])
    } else {
      if(data?.status == 'failed') {
        setClosable(true)
        callFailedCallback(transaction, paymentRoute)
        set(['PaymentFailed'])
      } else if(data === undefined || data?.status == 'success') {
        callSucceededCallback(transaction, paymentRoute)
        callValidatedCallback(transaction, paymentRoute)
        setClosable(true)
        setRelease(true)
      }
    }
  })

  const pollStatus = async(polling, transaction, afterBlock, paymentRoute, pollingInterval, attemptId, deadline)=>{
    if(
      !polling ||
      transaction == undefined ||
      afterBlock == undefined ||
      paymentRoute == undefined
    ) { return }

    const performedPayment = {
      blockchain: transaction.blockchain,
      transaction: transaction.id,
      sender: transaction.from,
      receiver: paymentRoute.toAddress,
      deadline,
      after_block: afterBlock.toString(),
      to_token: paymentRoute.toToken.address
    }

    if(configurationId) {
      if(attemptId) {
        fetch(`https://public.depay.com/attempts/${attemptId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).then((response)=>{
          if(response.status == 200 || response.status == 201) {
            response.json().then((data)=>handlePollingResponse(data, pollingInterval))
          } else {
            return undefined
          }
        })
      }
    } else if(trackConfiguration.poll.endpoint) {
      fetch(trackConfiguration.poll.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performedPayment)
      }).then((response)=>{
        if(response.status == 200 || response.status == 201) {
          response.json()
            .then((data)=>handlePollingResponse(data, pollingInterval))
            .catch(()=>{ setClosable(true) })
        } else {
          return undefined
        }
      })
    } else if(trackConfiguration.poll.method) {
      trackConfiguration.poll.method(performedPayment).then((data)=>handlePollingResponse(data, pollingInterval))
    }
  }

  useEffect(()=>{
    if(forwardTo){ 
      props.document.location.href = forwardTo
    }
  }, [forwardTo])

  useEffect(()=>{
    if(!polling) { return }
    if(!synchronousTracking){ return }
    let pollingInterval = setInterval(()=>pollStatus(polling, transaction, afterBlock, paymentRoute, pollingInterval, attemptId, deadline), 5000)
    return ()=>{ clearInterval(pollingInterval) }
  }, [polling, transaction, afterBlock, attemptId, paymentRoute])

  const track = async(transaction, afterBlock, paymentRoute, deadline)=>{
    if(synchronousTracking || (trackConfiguration && trackConfiguration.async == true)) {
      startTracking(transaction, afterBlock, paymentRoute, deadline)
    }
    if(synchronousTracking == false) { return }
    setDeadline(deadline)
    setTransaction(transaction)
    setAfterBlock(afterBlock)
    setPaymentRoute(paymentRoute)
    openValidationSocket(paymentRoute, deadline)
  }

  const trace = (afterBlock, paymentRoute, deadline)=>{
    setAttemptId() // reset attemptId in case payment is retried
    if(!synchronousTracking && !asynchronousTracking) { return Promise.resolve() }
    setDeadline(deadline)
    setAfterBlock(afterBlock)
    setPaymentRoute(paymentRoute)
    openValidationSocket(paymentRoute, deadline)
    return new Promise(async(resolve, reject)=>{
      let performedPayment = {
        blockchain: paymentRoute.blockchain,
        sender: paymentRoute.fromAddress,
        after_block: afterBlock.toString(),
        from_token: paymentRoute.fromToken.address,
        from_amount: paymentRoute.fromAmount.toString(),
        from_decimals: paymentRoute.fromDecimals,
        to_token: paymentRoute.toToken.address,
        to_amount: paymentRoute.toAmount.toString(),
        to_decimals: paymentRoute.toDecimals,
        protocol_fee_amount: paymentRoute?.protocolFeeAmount?.toString(),
        fee_amount: paymentRoute?.feeAmount?.toString(),
        fee_receiver: paymentRoute?.fee?.receiver,
        fee2_amount: paymentRoute?.feeAmount2?.toString(),
        fee2_receiver: paymentRoute?.fee2?.receiver,
        deadline,
        selected_wallet: wallet?.name || solanaPayWallet?.name
      }
      if(configurationId){
        return fetch(`https://public.depay.com/configurations/${configurationId}/attempts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(performedPayment)
        }).then((response)=>{
          if(response.status == 200 || response.status == 201) {
            response.json().then((attempt)=>setAttemptId(attempt.id))
            return resolve()
          } else {
            return reject('TRACING REQUEST FAILED')
          }
        })
      } else if(trackConfiguration.endpoint){
        return fetch(trackConfiguration.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(performedPayment)
        }).then((response)=>{
          if(response.status == 200 || response.status == 201) {
            return resolve()
          } else {
            return reject('TRACING REQUEST FAILED')
          }
        })
      } else if (trackConfiguration.method) {
        trackConfiguration.method(performedPayment).then(resolve).catch(reject)
      } else {
        reject('No tracking defined!')
      }
    })
  }

  return(
    <PaymentTrackingContext.Provider value={{
      synchronousTracking,
      asynchronousTracking,
      transaction,
      setTransaction,
      track,
      trace,
      trackingInitialized,
      continueTryTracking,
      release,
      validationState,
      forwardTo,
      confirmationsRequired,
      confirmationsPassed,
    }}>
      { props.children }
    </PaymentTrackingContext.Provider>
  )
}
