import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import getNonce from '../helpers/getNonce'
import React, { useState, useEffect, useContext } from 'react'
import TransactionTrackingContext from '../contexts/TransactionTrackingContext'
import WalletContext from '../contexts/WalletContext'
import { supported } from '../blockchains'

export default (props)=>{

  const [ givenTransaction, setGivenTransaction ] = useState()
  const [ foundTransaction, setFoundTransaction ] = useState()
  const [ polling, setPolling ] = useState(false)
  const { errorCallback } = useContext(ErrorContext)
  const { recover } = useContext(ConfigurationContext)
  const { account, wallet } = useContext(WalletContext)

  useEffect(()=>{
    if(polling) {
      let poll = ()=> {
        fetch(`https://public.depay.com/transactions/${givenTransaction.blockchain}/${givenTransaction.from}/${givenTransaction.nonce}`)
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

  const createTracking = async (transaction, afterBlock, deadline, attempt)=> {
    if(attempt > 3) {
      return
    }
    fetch('https://public.depay.com/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: transaction.id,
        after_block: afterBlock.toString(),
        blockchain: transaction.blockchain,
        sender: transaction.from,
        nonce: await getNonce({ transaction, wallet, account }),
        deadline
      })
    })
    .then((response)=>{
      if(response.status == 200 || response.status == 201) {
      } else {
        setTimeout(()=>{ createTracking(transaction, afterBlock, deadline, attempt+1) }, 3000)
      }
    })
    .catch((error)=>{
      setTimeout(()=>{ createTracking(transaction, afterBlock, deadline, attempt+1) }, 3000)
    })
  }

  const openSocket = (transaction)=>{
    let socket = new WebSocket('wss://integrate.depay.com/cable')
    socket.onopen = async function(event) {
      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          blockchain: transaction.blockchain,
          sender: transaction.from,
          nonce: await getNonce({ transaction, wallet, account }),
          channel: 'TransactionChannel'
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
      if(item.type === "ping") { return }
      if(item.message && item.message.status && item.message.status != 'pending') {
        setFoundTransaction(item.message)
        socket.close(1000)
      }
    }
    
    socket.onerror = function(error) {
      console.log('WebSocket Error: ', error)
    }
  }

  const initializeTracking = (transaction, afterBlock, deadline)=>{
    if(!supported.evm.includes(transaction.blockchain)){ return }
    setGivenTransaction(transaction)
    if(recover == undefined) { createTracking(transaction, afterBlock, deadline, 1) }
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
