import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import NavigateContext from '../contexts/NavigateContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useEffect, useContext, useState } from 'react'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'
import { request } from '@depay/web3-client'

export default (props)=>{
  const { errorCallback } = useContext(ErrorContext)
  const { track, validated, failed, integration, link, type } = useContext(ConfigurationContext)
  const { account, wallet } = useContext(WalletContext)
  const [ transaction, setTransaction ] = useState()
  const [ confirmationsRequired, setConfirmationsRequired ] = useState()
  const [ confirmationsPassed, setConfirmationsPassed ] = useState()
  const [ afterBlock, setAfterBlock ] = useState()
  const [ socket, setSocket ] = useState()
  const [ paymentRoute, setPaymentRoute ] = useState()
  const [ trackingInitialized, setTrackingInitialized ] = useState(false)
  const [ synchronousTracking ] = useState( !!(track && (track.endpoint || typeof track.method == 'function') && track.async != true) )
  const [ asynchronousTracking ] = useState( !!(track && track.async == true) )
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
          sender: transaction.from,
          nonce: transaction?.nonce?.toString(),
          channel: 'PaymentChannel'
        }),
      }
      socket.send(JSON.stringify(msg))
    }
    
    socket.onclose = function(event) {
      if(!event || event.code != 1000) {
        openSocket(transaction)
      }
    }

    socket.onmessage = function(event) {
      const item = JSON.parse(event.data)
      if(item.type === "ping" || !item.message) { return }
      const success = (item.message.status == 'success')
      if(validated) { validated(success) }
      if(item.message.release) {
        socket.close(1000)
        if(success) {
          setRelease(true)
          setClosable(true)
          setForwardTo(item.message.forward_to)
          if(!!item.message.forward_to) {
            setTimeout(()=>{ props.document.location.href = item.message.forward_to }, 200)
          }
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
    console.log('START TRACKING!', transaction)
    callTracking({
      blockchain: transaction.blockchain,
      transaction: transaction.id,
      sender: transaction.from,
      nonce: transaction?.nonce?.toString(),
      after_block: afterBlock.toString(),
      from_token: paymentRoute.fromToken.address,
      from_amount: paymentRoute.fromAmount.toString(),
      from_decimals: paymentRoute.fromDecimals,
      to_token: paymentRoute.toToken.address,
      to_amount: paymentRoute.toAmount.toString(),
      to_decimals: paymentRoute.toDecimals,
      fee_amount: paymentRoute?.feeAmount?.toString()
    })
      .then((response)=>{
        setTrackingInitialized(true)
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
      transaction: transaction.id,
      sender: transaction.from,
      nonce: transaction?.nonce?.toString(),
      after_block: afterBlock.toString(),
      to_token: paymentRoute.toToken.address
    }

    const handlePollingResponse = (data)=>{
      if(data) {
        if(data && data.forward_to) {
          setClosable(true)
          setForwardTo(data.forward_to)
          setTimeout(()=>{ props.document.location.href = data.forward_to }, 200)
        } else {
          setClosable(true)
        }
        clearInterval(pollingInterval)
        if(validated) { validated(true) }
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
    if(!synchronousTracking){ return }
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
        sender: transaction.from,
        nonce: transaction?.nonce?.toString(),
        receiver: paymentRoute.toAddress,
        token: paymentRoute.toToken.address,
        amount: paymentRoute.fee ? ethers.utils.formatUnits(paymentRoute.transaction.params.amounts[1], paymentRoute.toDecimals) : ethers.utils.formatUnits(paymentRoute.toAmount, paymentRoute.toDecimals),
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
    console.log('initializeTracking')
    storePayment(transaction, afterBlock, paymentRoute, 1)
    if(synchronousTracking || (track && track.async == true)) {
      startTracking(transaction, afterBlock, paymentRoute)
    }
    if(synchronousTracking == false) { return }
    setTransaction(transaction)
    setAfterBlock(afterBlock)
    setPaymentRoute(paymentRoute)
    openSocket(transaction)
  }

  const preTrack = (afterBlock, paymentRoute)=>{
    if(!synchronousTracking && !asynchronousTracking) { return Promise.resolve() }
    return new Promise(async(resolve, reject)=>{
      let payment = {
        blockchain: paymentRoute.blockchain,
        sender: account,
        nonce: (await wallet.transactionCount({ blockchain: paymentRoute.blockchain, address: account })).toString(),
        after_block: afterBlock.toString(),
        from_token: paymentRoute.fromToken.address,
        from_amount: paymentRoute.fromAmount.toString(),
        from_decimals: paymentRoute.fromDecimals,
        to_token: paymentRoute.toToken.address,
        to_amount: paymentRoute.toAmount.toString(),
        to_decimals: paymentRoute.toDecimals,
        fee_amount: paymentRoute?.feeAmount?.toString()
      }
      if(track.endpoint){
        return fetch(track.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payment)
        }).then((response)=>{
          if(response.status == 200 || response.status == 201) {
            return resolve()
          } else {
            return reject('PRETRACKING REQUEST FAILED')
          }
        })
      } else if (track.method) {
        track.method(payment).then(resolve).catch(reject)
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
      preTrack,
      trackingInitialized,
      continueTryTracking,
      release,
      forwardTo,
      confirmationsRequired,
      confirmationsPassed,
    }}>
      { props.children }
    </PaymentTrackingContext.Provider>
  )
}
