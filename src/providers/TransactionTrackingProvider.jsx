import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import TransactionTrackingContext from '../contexts/TransactionTrackingContext'

export default (props)=>{

  const [ givenTransaction, setGivenTransaction ] = useState()
  const [ foundTransaction, setFoundTransaction ] = useState()
  const [ polling, setPolling ] = useState(false)
  const { errorCallback } = useContext(ErrorContext)
  const { recover } = useContext(ConfigurationContext)

  useEffect(()=>{
    if(polling) {
      let poll = ()=> {
        fetch(`https://public.depay.com/transactions/${givenTransaction.blockchain}/${givenTransaction.from.toLowerCase()}/${givenTransaction.nonce}`)
          .then((response)=>{
            if(response.status == 200) {
              response.json().then((data)=>{
                if(data.status != 'pending') {
                  setFoundTransaction({
                    id: data.external_id,
                    status: data.status
                  })
                  setPolling(false)
                }
              })
            }
          })
      }
      let pollingInterval = setInterval(poll, 5000)
      poll()
      return ()=>{ clearInterval(pollingInterval) }
    }
  }, [polling])

  const createTracking = (transaction, afterBlock, attempt)=> {
    if(attempt > 3) {
      console.log('TRANSACTION TRACKING FAILED AFTER 3 ATTEMPTS!')
      return
    }
    fetch('https://public.depay.com/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: transaction.id,
        after_block: afterBlock,
        blockchain: transaction.blockchain,
        sender: transaction.from.toLowerCase(),
        nonce: transaction.nonce
      })
    })
    .then((response)=>{
      if(response.status == 200 || response.status == 201) {
        console.log('TRANSACTION TRACKING INITIALIZED')
      } else {
        console.log('TRANSACTION TRACKING FAILED', response)
        setTimeout(()=>{ createTracking(transaction, afterBlock, attempt+1) }, 3000)
      }
    })
    .catch((error)=>{
      console.log('TRANSACTION TRACKING FAILED', error)
      setTimeout(()=>{ createTracking(transaction, afterBlock, attempt+1) }, 3000)
    })
  }

  const openSocket = (transaction)=>{
    let socket = new WebSocket('wss://integrate.depay.com/cable')
    socket.onopen = function(event) {
      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          blockchain: transaction.blockchain,
          sender: transaction.from.toLowerCase(),
          nonce: transaction.nonce,
          channel: 'TransactionChannel'
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
      if(item.type === "ping") { return }
      if(item.message && item.message.status && item.message.status != 'pending') {
        setFoundTransaction(item.message)
        socket.close(1000)
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ' + error)
    }
  }

  const initializeTracking = (transaction, afterBlock)=>{
    setGivenTransaction(transaction)
    if(recover == undefined) { createTracking(transaction, afterBlock, 1) }
    openSocket(transaction)
    setPolling(true)
  }

  useEffect(()=>{
    if(recover){
      initializeTracking({
        blockchain: recover.blockchain,
        id: recover.transaction,
        from: recover.sender,
        nonce: recover.nonce
      }, recover.afterBlock)
    }
  }, [recover])

  return(
    <TransactionTrackingContext.Provider value={{
      initializeTracking,
      foundTransaction
    }}>
      { props.children }
    </TransactionTrackingContext.Provider>
  )
}
