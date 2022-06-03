import ClosableContext from '../contexts/ClosableContext'
import ConnectingWalletDialog from '../dialogs/ConnectingWalletDialog'
import React, { useState, useContext, useEffect } from 'react'
import SelectWalletDialog from '../dialogs/SelectWalletDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'
import { getWallet } from '@depay/web3-wallets'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const [ pending, setPending ] = useState()
  const [ wallet, setWallet ] = useState()

  const connect = (wallet)=> {
    console.log('CONNECT')
    wallet.connect().then(async ()=>{
      let accounts = await wallet.accounts()
      if(accounts instanceof Array && accounts.length > 0) {
        if(props.autoClose) close()
        if(props.resolve) props.resolve({ wallet, account: accounts[0], accounts })
      } else {
      }
    }).catch((error)=>{
      setPending(false)
      if(error?.code == 4001) { 
        // User rejected the request.
        return 
      } else if(error?.code == -32002) { 
        // Request of type 'wallet_requestPermissions' already pending...
        setPending(true)
        return 
      } else {
        if(props.reject) props.reject(error)
      }
    })
  }

  useEffect(()=> {
    let wallet = getWallet()
    if(wallet) { setWallet(wallet) }
  }, [])

  useEffect(()=>{
    (
      async ()=>{
        if(wallet) {
          let accounts = await wallet.accounts()
          if(accounts instanceof Array && accounts.length > 0) {
            if(props.resolve) props.resolve({ wallet, account: accounts[0], accounts })
          }
        }
      }
    )()
  }, [wallet])

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='SelectWallet'
      container={ props.container }
      document={ props.document }
      dialogs={{
        SelectWallet: <SelectWalletDialog setWallet={ setWallet } connect={ connect } />,
        ConnectingWallet: <ConnectingWalletDialog wallet={ wallet } pending={ pending } connect={ connect } />
      }}
    />
  )
}
