import ConnectStack from '../stacks/ConnectStack'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import WalletRequestPendingDialog from '../dialogs/WalletRequestPendingDialog'
import { getWallet } from 'depay-web3-wallets'
import { ReactDialog } from 'depay-react-dialog'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()
  const [walletState, setWalletState] = useState()
  const connected = ({ wallet })=> {
    setWallet(wallet)
  }
  const connect = ()=>{
    setWalletState('connecting')
    wallet.connect().then((accounts)=>{
      wallet.on('disconnect', ()=>{
        setWallet(undefined)
        setAccount(undefined)
        setWalletState('unavailable')
      })
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

  useEffect(async ()=>{
    if(wallet) { 
      let accounts = await wallet.accounts()
      if(accounts == undefined || accounts.length == 0) {
        connect()
      } else {
        setWalletState('connected')
        if(props.connected) { props.connected(accounts[0]) }
        setAccount(accounts[0])
      }
    }
  }, [wallet])

  if(walletState == 'unavailable') {
    return(<ConnectStack document={ props.document } container={ props.container } connected={ connected } />)
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
