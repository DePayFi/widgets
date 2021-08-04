import React, { useState, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'
import { getWallet, setApiKey } from 'depay-crypto-wallets'

export default (props)=>{

  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()
  setApiKey('M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c')

  useEffect(()=>setWallet(getWallet()), [])
  useEffect(()=>{
    if(wallet) { 
      wallet.connect().then((accounts)=>{
        setAccount(accounts[0])        
      })
    }
  }, [wallet])

  return(
    <WalletContext.Provider value={{
      account: account,
      wallet: wallet,
    }}>
      { props.children }
    </WalletContext.Provider>
  )
}
