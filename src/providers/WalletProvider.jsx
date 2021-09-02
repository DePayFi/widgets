import React, { useState, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'
import { getWallet } from 'depay-web3-wallets'

export default (props)=>{

  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()

  useEffect(()=>{
    let _wallet = getWallet()
    if(_wallet) {
      console.log('WALLET')
      setWallet(_wallet)
    } else {
      console.log('NO WALLET connected')
    }
  }, [])

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
