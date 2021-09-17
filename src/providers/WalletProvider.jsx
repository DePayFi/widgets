import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import WalletRequestPendingDialog from '../dialogs/WalletRequestPendingDialog'
import WalletUnavailableDialog from '../dialogs/WalletUnavailableDialog'
import { getWallet } from 'depay-web3-wallets'
import { ReactDialog } from 'depay-react-dialog'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()
  const [walletState, setWalletState] = useState()
  const connect = ()=>{
    setWalletState('connecting')
    wallet.connect().then((accounts)=>{
      setWalletState('connected')
      if(props.connected) { props.connected(accounts[0]) }
      setAccount(accounts[0])        
    }).catch((error)=>{
      if(error?.code == 4001) { 
        // User rejected the request.
        setWalletState('connecting')
        return 
      } 
      if(error?.code == -32002) { 
        // Request of type 'wallet_requestPermissions' already pending...
        setWalletState('requestPending')
        return 
      } 
      setError(error)
    })
  }

  useEffect(()=>{
    let _wallet = getWallet()
    if(_wallet) {
      setWalletState('found')
      setWallet(_wallet)
    } else {
      setWalletState('unavailable')
    }
  }, [])

  useEffect(()=>{
    if(wallet) { 
      connect()
    }
  }, [wallet])

  if(walletState == 'unavailable') {
    return(<WalletUnavailableDialog container={ props.container }/>)
  } else if(walletState == 'requestPending') {
    return(<WalletRequestPendingDialog wallet={ wallet } unmount={ props.unmount } container={ props.container }/>)
  } else {
    return(
      <WalletContext.Provider value={{
        account,
        wallet,
        walletState,
        connect
      }}>
        { props.children }
      </WalletContext.Provider>
    )
  }
}
