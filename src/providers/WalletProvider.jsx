import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'
import { getWallet } from 'depay-web3-wallets'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()
  const [walletState, setWalletState] = useState()
  const connect = ()=>{
    setWalletState('connecting')
    wallet.connect().then((accounts)=>{
      setWalletState('connected')
      setAccount(accounts[0])        
    }).catch(setError)
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
