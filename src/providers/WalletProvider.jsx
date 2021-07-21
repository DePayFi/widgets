import React, { useState, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'
import { getWallet } from 'depay-crypto-wallets'

export default (props)=>{

  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()

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
