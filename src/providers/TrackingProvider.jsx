import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import React, { useEffect, useContext, useState } from 'react'
import TrackingContext from '../contexts/TrackingContext'

export default (props)=>{
  const { errorCallback } = useContext(ErrorContext)
  const { track } = useContext(ConfigurationContext)
  const [ tracking, setTracking ] = useState(track && !!track.endpoint)
  const [ forward, setForward ] = useState(false)
  const [ trackingFailed, setTrackingFailed ] = useState(false)
  const [ forwardTo, setForwardTo ] = useState()
  const { setClosable } = useContext(ClosableContext)

  useEffect(()=>{
    setTracking(track && !!track.endpoint)
  }, [track])

  const openSocket = (transaction)=>{
    let socket = new WebSocket('wss://integrate.depay.fi/cable')
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
      if(item.type === "ping") { return }
      if(item.message && item.message.forward) {
        setClosable(!item.message.forward_to)
        setForwardTo(item.message.forward_to)
        setForward(item.message.forward)
        socket.close()
        if(!!item.message.forward_to) {
          setTimeout(()=>{ props.document.location.href = item.message.forward_to }, 500)
        }
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error)
    }
  }

  const retryStartTracking = (transaction, afterBlock, attempt)=> {
    attempt = parseInt(attempt || 1, 10)
    console.log('RETRY TRACKING ATTEMPT ', attempt)
    if(attempt < 3) {
      setTimeout(()=>{
        startTracking(transaction, afterBlock, attempt+1)
      }, 3000)
    } else {
      console.log('TRACKING FAILED AFTER 3 ATTEMPTS!')
      setTrackingFailed(true)
      if(typeof errorCallback == 'function') {
        errorCallback({ code: 'TRACKING_FAILED' })
      }
    }
  }

  const startTracking = (transaction, afterBlock, attempt)=> {
    fetch(track.endpoint, {
      method: 'POST',
      body: JSON.stringify({
        blockchain: transaction.blockchain,
        transaction: transaction.id.toLowerCase(),
        sender: transaction.from.toLowerCase(),
        nonce: transaction.nonce,
        after_block: afterBlock
      })
    })
      .then((response)=>{
        if(response.status == 200) {
          console.log('TRACKING INITIALIZED')
        } else {
          retryStartTracking(transaction, afterBlock, attempt)
        }
      })
      .catch((error)=>{
        console.log('TRACKING FAILED', error)
        retryStartTracking(transaction, afterBlock, attempt)
      })
  }

  const initializeTracking = (transaction, afterBlock)=>{
    openSocket(transaction)
    startTracking(transaction, afterBlock)
  }

  return(
    <TrackingContext.Provider value={{
      tracking,
      initializeTracking,
      forward,
      forwardTo,
      trackingFailed
    }}>
      { props.children }
    </TrackingContext.Provider>
  )
}
