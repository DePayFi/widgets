import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import React, { useEffect, useContext, useState } from 'react'
import TrackingContext from '../contexts/TrackingContext'

export default (props)=>{
  const { track } = useContext(ConfigurationContext)
  const [ tracking, setTracking ] = useState(track && !!track.endpoint)
  const [ forward, setForward ] = useState(false)
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
        setTimeout(()=>{
          props.document.location.href = item.message.forward_to
        },500)
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error)
    }
  }

  const startTracking = (transaction, afterBlock)=> {
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
      .then(()=>{
        console.log('TRACKING INITIALIZED')
      })
      .catch((error)=>{
        console.log('TRACKING FAILED', error)
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
    }}>
      { props.children }
    </TrackingContext.Provider>
  )
}
