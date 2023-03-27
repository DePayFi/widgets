import ConfigurationContext from '../contexts/ConfigurationContext'
import ConnectStack from '../stacks/ConnectStack'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { ReactDialog } from '@depay/react-dialog'

export default (props)=>{

  const { recover, wallet: passedWallet } = useContext(ConfigurationContext)
  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState(passedWallet)
  let [account, setAccount] = useState()
  const [walletState, setWalletState] = useState(passedWallet ? 'connected' : undefined)
  
  const connected = ({ account, wallet })=> {
    setAccount(account)
    setWallet(wallet)
    setTimeout(()=>{
      setWalletState('connected')
      if(props.connected) { props.connected(account) }
    }, 200)
  }

  const disconnect = ()=>{
    setAccount()
    setWallet()
    setWalletState()
  }

  useEffect(()=>{
    (async ()=>{
      if(passedWallet) {
        let account = await passedWallet.account()
        if(account) {
          setAccount(account)
        } else {
          setWallet()
          setWalletState()
        }
      }
    })()
  }, [])

  if(walletState == 'connected' || recover != undefined) {
    return(
      <WalletContext.Provider value={{
        account,
        wallet,
        disconnect,
      }}>
        { props.children }
      </WalletContext.Provider>
    )
  } else {
    return(<ConnectStack document={ props.document } container={ props.container } resolve={ connected } />)
  }
}
