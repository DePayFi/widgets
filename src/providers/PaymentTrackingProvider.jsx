/*#if _EVM

import { request } from '@depay/web3-client-evm'

/*#elif _SOLANA

import { request } from '@depay/web3-client-solana'

//#else */

import { request } from '@depay/web3-client'

//#endif

import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import getNonce from '../helpers/getNonce'
import NavigateContext from '../contexts/NavigateContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useEffect, useContext, useState, useRef } from 'react'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'

export default (props)=>{
  const { errorCallback } = useContext(ErrorContext)
  const { id: configurationId, track, validated, failed, integration, link, type } = useContext(ConfigurationContext)
  const { account, wallet } = useContext(WalletContext)
  const [ deadline, setDeadline ] = useState()
  const [ transaction, setTransaction ] = useState()
  const [ confirmationsRequired, setConfirmationsRequired ] = useState()
  const [ confirmationsPassed, setConfirmationsPassed ] = useState()
  const [ afterBlock, setAfterBlock ] = useState()
  const [ socket, setSocket ] = useState()
  const [ payment, setPayment ] = useState()
  const [ paymentRoute, setPaymentRoute ] = useState()
  const [ attemptId, setAttemptId ] = useState()
  const attemptIdRef = useRef(attemptId)
  attemptIdRef.current = attemptId
  const [ trackingInitialized, setTrackingInitialized ] = useState(false)
  const [ synchronousTracking ] = useState(
    !!configurationId ||
    !!(track && (track.endpoint || typeof track.method == 'function') && track.async != true)
  )
  const [ asynchronousTracking ] = useState(
    !configurationId &&
    !!(track && track.async == true)
  )
  const [ polling ] = useState(
    !!configurationId ||
    !!(track && track.poll && (track.poll.endpoint || typeof track.poll.method == 'function') && track.async != true)
  )
  const [ release, setRelease ] = useState(false)
  const [ forwardTo, setForwardTo ] = useState()
  const { setClosable } = useContext(ClosableContext)
  const { navigate, set } = useContext(NavigateContext)

  const openSocket = (transaction)=>{
    let socket = new WebSocket('wss://integrate.depay.com/cable')
    socket.onopen = async function(event) {
      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          blockchain: transaction.blockchain,
          sender: transaction.from || account,
          nonce: await getNonce({ transaction, account, wallet }),
          channel: 'PaymentChannel'
        }),
      }
      socket.send(JSON.stringify(msg))
    }
    
    socket.onclose = function(event) {
      if(!event || event.code != 1000) {
        setTimeout(()=>openSocket(transaction), 1000)
      }
    }

    socket.onmessage = function(event) {
      const item = JSON.parse(event.data)
      if(item.type === "ping" || !item.message) { return }
      const success = (item.message.status == 'success')
      if(validated) { setTimeout(()=>validated(success, transaction, payment), 200) }
      if(item.message.release) {
        socket.close()
        if(success) {
          setRelease(true)
          setClosable(true)
          setForwardTo(item.message.forward_to)
        } else if(success == false) {
          setClosable(true)
          set(['PaymentFailed'])
        }
      } else if(item.message.confirmations) {
        setConfirmationsRequired(item.message.confirmations.required)
        setConfirmationsPassed(item.message.confirmations.passed)
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ', error)
    }
  }

  const retryStartTracking = (transaction, afterBlock, paymentRoute, deadline, attempt)=> {
    attempt = parseInt(attempt || 1, 10)
    if(attempt < (track?.attempts || 40)) {
      setTimeout(()=>{
        startTracking(transaction, afterBlock, paymentRoute, deadline, attempt+1)
      }, 3000)
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
    } else if(track.endpoint){
      return fetch(track.endpoint, {
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
    } else if (track.method) {
      return track.method(payment)
    } else {
      throw('No tracking defined!')
    }
  }

  const startTracking = async(transaction, afterBlock, paymentRoute, deadline, attempt)=> {
    callTracking({
      blockchain: transaction.blockchain,
      transaction: transaction.id,
      sender: transaction.from,
      nonce: await getNonce({ transaction, account, wallet }),
      after_block: afterBlock.toString(),
      from_token: paymentRoute.fromToken.address,
      from_amount: paymentRoute.fromAmount.toString(),
      from_decimals: paymentRoute.fromDecimals,
      to_token: paymentRoute.toToken.address,
      to_amount: paymentRoute.toAmount.toString(),
      to_decimals: paymentRoute.toDecimals,
      fee_amount: paymentRoute?.feeAmount?.toString(),
      trace_attempt_id: attemptIdRef.current,
      deadline,
      selected_wallet: wallet?.name
    })
      .then((response)=>{
        setTrackingInitialized(true)
      })
      .catch((error)=>{
        retryStartTracking(transaction, afterBlock, paymentRoute, deadline, attempt)
      })
  }

  const pollStatus = async(polling, transaction, afterBlock, paymentRoute, pollingInterval, attemptId)=>{
    if(
      !polling ||
      transaction == undefined ||
      afterBlock == undefined ||
      paymentRoute == undefined
    ) { return }

    const handlePollingResponse = (data)=>{
      if(data) {
        if(data && data.forward_to) {
          setClosable(true)
          setForwardTo(data.forward_to)
        } else {
          setClosable(true)
        }
        clearInterval(pollingInterval)
        if(validated) {
          validated(data.status ? data.status == 'success' : true, transaction, payment)
        }
        setRelease(true)
      }
    }

    const performedPayment = {
      blockchain: transaction.blockchain,
      transaction: transaction.id,
      sender: transaction.from,
      nonce: await getNonce({ transaction, account, wallet }),
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
            return response.json()
          } else {
            return undefined
          }
        }).then(handlePollingResponse)
      }
    } else if(track.poll.endpoint) {
      fetch(track.poll.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performedPayment)
      }).then((response)=>{
        if(response.status == 200 || response.status == 201) {
          return response.json().catch(()=>{ setClosable(true) })
        } else {
          return undefined
        }
      }).then(handlePollingResponse)
    } else if(track.poll.method) {
      track.poll.method(performedPayment).then(handlePollingResponse)
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
    let pollingInterval = setInterval(()=>pollStatus(polling, transaction, afterBlock, paymentRoute, pollingInterval, attemptId), 5000)
    return ()=>{ clearInterval(pollingInterval) }
  }, [polling, transaction, afterBlock, attemptId, paymentRoute])

  const storePayment = async(transaction, afterBlock, paymentRoute, deadline)=>{
    fetch('https://public.depay.com/payments', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        blockchain: transaction.blockchain,
        transaction: transaction.id,
        sender: transaction.from,
        nonce: await getNonce({ transaction, account, wallet }),
        receiver: paymentRoute.toAddress,
        token: paymentRoute.toToken.address,
        amount: ethers.utils.formatUnits(paymentRoute.toAmount, paymentRoute.toDecimals),
        confirmations: 1,
        after_block: afterBlock.toString(),
        uuid: transaction.id,
        payload: {
          sender_id: transaction.from,
          sender_token_id: paymentRoute.fromToken.address,
          sender_amount: ethers.utils.formatUnits(paymentRoute.fromAmount, paymentRoute.fromDecimals),
          integration,
          link,
          type
        },
        fee_amount: paymentRoute.fee ? ethers.utils.formatUnits(paymentRoute.feeAmount, paymentRoute.toDecimals) : null,
        fee_receiver: paymentRoute.fee ? paymentRoute.fee.receiver : null,
        deadline,
        selected_wallet: wallet?.name
      })
    })
    .then((response)=>{
      if(response.status == 200 || response.status == 201) {
      } else {
        setTimeout(()=>{ storePayment(transaction, afterBlock, paymentRoute, deadline) }, 3000)
      }
    })
    .catch((error)=>{
      setTimeout(()=>{ storePayment(transaction, afterBlock, paymentRoute, deadline) }, 3000)
    })
  }

  const initializeTracking = async(transaction, afterBlock, paymentRoute, deadline)=>{
    if(transaction.blockchain === 'solana') { // ensure solana transaction tracking uses only a single nonce for further processing
      transaction.nonce = await getNonce({ transaction, account, wallet })
    }
    storePayment(transaction, afterBlock, paymentRoute, deadline)
    if(synchronousTracking || (track && track.async == true)) {
      startTracking(transaction, afterBlock, paymentRoute, deadline)
    }
    if(synchronousTracking == false) { return }
    setDeadline(deadline)
    setTransaction(transaction)
    setAfterBlock(afterBlock)
    setPaymentRoute(paymentRoute)
    openSocket(transaction)
  }

  const trace = (afterBlock, paymentRoute, transaction, deadline)=>{
    setAttemptId() // reset attemptId in case payment is retried
    if(!synchronousTracking && !asynchronousTracking) { return Promise.resolve() }
    openSocket(transaction)
    return new Promise(async(resolve, reject)=>{
      let performedPayment = {
        blockchain: paymentRoute.blockchain,
        sender: account,
        nonce: await getNonce({ blockchain: paymentRoute.blockchain, transaction, account, wallet }),
        after_block: afterBlock.toString(),
        from_token: paymentRoute.fromToken.address,
        from_amount: paymentRoute.fromAmount.toString(),
        from_decimals: paymentRoute.fromDecimals,
        to_token: paymentRoute.toToken.address,
        to_amount: paymentRoute.toAmount.toString(),
        to_decimals: paymentRoute.toDecimals,
        fee_amount: paymentRoute?.feeAmount?.toString(),
        deadline,
        selected_wallet: wallet?.name
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
      } else if(track.endpoint){
        return fetch(track.endpoint, {
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
      } else if (track.method) {
        track.method(performedPayment).then(resolve).catch(reject)
      } else {
        reject('No tracking defined!')
      }
    })
  }

  return(
    <PaymentTrackingContext.Provider value={{
      synchronousTracking,
      asynchronousTracking,
      initializeTracking,
      trace,
      trackingInitialized,
      continueTryTracking,
      release,
      forwardTo,
      confirmationsRequired,
      confirmationsPassed,
      setPayment,
    }}>
      { props.children }
    </PaymentTrackingContext.Provider>
  )
}
