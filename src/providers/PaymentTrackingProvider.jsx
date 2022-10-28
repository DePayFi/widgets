import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import NavigateContext from '../contexts/NavigateContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useEffect, useContext, useState } from 'react'
import { ethers } from 'ethers'

export default (props)=>{
  const { errorCallback } = useContext(ErrorContext)
  const { track, validated, integration, link, type } = useContext(ConfigurationContext)
  const [ transaction, setTransaction ] = useState()
  const [ afterBlock, setAfterBlock ] = useState()
  const [ paymentRoute, setPaymentRoute ] = useState()
  const [ tracking ] = useState( !!(track && (track.endpoint || typeof track.method == 'function') && track.async != true) )
  const [ polling ] = useState( !!(track && track.poll && (track.poll.endpoint || typeof track.poll.method == 'function') && track.async != true) )
  const [ release, setRelease ] = useState(false)
  const [ forwardTo, setForwardTo ] = useState()
  const { setClosable } = useContext(ClosableContext)
  const { navigate, set } = useContext(NavigateContext)

  const openSocket = (transaction)=>{
    let socket = new WebSocket('wss://integrate.depay.com/cable')
    socket.onopen = function(event) {
      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          blockchain: transaction.blockchain,
          sender: transaction.from.toLowerCase(),
          nonce: transaction.nonce,
          channel: 'PaymentChannel'
        }),
      }
      socket.send(JSON.stringify(msg))
    }
    
    socket.onclose = function(event) {}

    socket.onmessage = function(event) {
      const item = JSON.parse(event.data)
      if(item.type === "ping" || !item.message) { return }
      if(validated) { validated(item.message.status == 'success') }
      if(item.message.release) {
        setRelease(true)
        setClosable(!item.message.forward_to)
        setForwardTo(item.message.forward_to)
        socket.close()
        if(!!item.message.forward_to) {
          setTimeout(()=>{ props.document.location.href = item.message.forward_to }, 200)
        }
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error)
    }
  }

  const retryStartTracking = (transaction, afterBlock, paymentRoute, attempt)=> {
    attempt = parseInt(attempt || 1, 10)
    if(attempt < (track?.attempts || 40)) {
      setTimeout(()=>{
        startTracking(transaction, afterBlock, paymentRoute, attempt+1)
      }, 3000)
    } else {
      navigate('TrackingFailed')
    }
  }

  const continueTryTracking = ()=>{
    retryStartTracking(transaction, afterBlock, paymentRoute, 1)
  }

  const callTracking = (payment)=>{
    if(track.endpoint){
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

  const startTracking = (transaction, afterBlock, paymentRoute, attempt)=> {
    callTracking({
      blockchain: transaction.blockchain,
      transaction: transaction.id.toLowerCase(),
      sender: transaction.from.toLowerCase(),
      nonce: transaction.nonce,
      after_block: afterBlock,
      from_token: paymentRoute.fromToken.address,
      from_amount: paymentRoute.fromAmount.toString(),
      from_decimals: paymentRoute.fromDecimals,
      to_token: paymentRoute.toToken.address,
      to_amount: paymentRoute.toAmount.toString(),
      to_decimals: paymentRoute.toDecimals,
      fee_amount: paymentRoute?.feeAmount?.toString()
    })
      .then((response)=>{
        console.log('PAYMENT TRACKING INITIALIZED')
      })
      .catch((error)=>{
        console.log('PAYMENT TRACKING FAILED', error)
        retryStartTracking(transaction, afterBlock, paymentRoute, attempt)
      })
  }

  const pollStatus = (polling, transaction, afterBlock, paymentRoute, pollingInterval)=>{
    if(
      !polling ||
      transaction == undefined ||
      afterBlock == undefined ||
      paymentRoute == undefined
    ) { return }

    const payment = {
      blockchain: transaction.blockchain,
      transaction: transaction.id.toLowerCase(),
      sender: transaction.from.toLowerCase(),
      nonce: transaction.nonce,
      after_block: afterBlock,
      to_token: paymentRoute.toToken.address
    }

    const handlePollingResponse = (data)=>{
      if(data) {
        if(data && data.forward_to) {
          setForwardTo(data.forward_to)
          setTimeout(()=>{ props.document.location.href = data.forward_to }, 100)
        } else {
          setClosable(true)
        }
        clearInterval(pollingInterval)
        setRelease(true)
      }
    }

    if(track.poll.endpoint) {
      fetch(track.poll.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }).then((response)=>{
        if(response.status == 200 || response.status == 201) {
          return response.json().catch(()=>{ setClosable(true) })
        } else {
          return undefined
        }
      }).then(handlePollingResponse)
    } else if(track.poll.method) {
      track.poll.method(payment).then(handlePollingResponse)
    }
  }

  useEffect(()=>{
    if(!polling) { return }
    if(!tracking){ return }
    let pollingInterval = setInterval(()=>pollStatus(polling, transaction, afterBlock, paymentRoute, pollingInterval), 5000)
    return ()=>{ clearInterval(pollingInterval) }
  }, [polling, transaction, afterBlock, paymentRoute])

  const storePayment = (transaction, afterBlock, paymentRoute, attempt)=>{
    fetch('https://public.depay.com/payments', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        blockchain: transaction.blockchain,
        transaction: transaction.id,
        sender: transaction.from.toLowerCase(),
        nonce: transaction.nonce,
        receiver: paymentRoute.toAddress,
        token: paymentRoute.toToken.address,
        amount: paymentRoute.fee ? ethers.utils.formatUnits(paymentRoute.transaction.params.amounts[1], paymentRoute.toDecimals) : ethers.utils.formatUnits(paymentRoute.toAmount, paymentRoute.toDecimals),
        confirmations: 1,
        after_block: afterBlock,
        uuid: transaction.id,
        payload: {
          sender_id: transaction.from.toLowerCase(),
          sender_token_id: paymentRoute.fromToken.address,
          sender_amount: ethers.utils.formatUnits(paymentRoute.fromAmount, paymentRoute.fromDecimals),
          integration,
          link,
          type
        },
        fee_amount: paymentRoute.fee ? ethers.utils.formatUnits(paymentRoute.transaction.params.amounts[4], paymentRoute.toDecimals) : null,
        fee_receiver: paymentRoute.fee ? paymentRoute.transaction.params.addresses[1] : null
      })
    })
    .then((response)=>{
      if(response.status == 200 || response.status == 201) {
      } else {
        setTimeout(()=>{ storePayment(transaction, afterBlock, paymentRoute, attempt+1) }, 3000)
      }
    })
    .catch((error)=>{
      setTimeout(()=>{ storePayment(transaction, afterBlock, paymentRoute, attempt+1) }, 3000)
    })
  }

  const initializeTracking = (transaction, afterBlock, paymentRoute)=>{
    storePayment(transaction, afterBlock, paymentRoute, 1)
    if(tracking || (track && track.async == true)) {
      startTracking(transaction, afterBlock, paymentRoute)
    }
    if(tracking == false) { return }
    setTransaction(transaction)
    setAfterBlock(afterBlock)
    setPaymentRoute(paymentRoute)
    openSocket(transaction)
  }

  return(
    <PaymentTrackingContext.Provider value={{
      tracking,
      initializeTracking,
      continueTryTracking,
      release,
      forwardTo
    }}>
      { props.children }
    </PaymentTrackingContext.Provider>
  )
}
