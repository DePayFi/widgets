import ConfigurationContext from '../contexts/ConfigurationContext'
import ConnectStack from '../stacks/ConnectStack'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { ReactDialog } from '@depay/react-dialog'

export default (props)=>{

  const { recover } = useContext(ConfigurationContext)
  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState()
  let [account, setAccount] = useState()
  const [walletState, setWalletState] = useState()
  const connected = ({ account, wallet })=> {
    setAccount(account)
    setWallet(wallet)
    setWalletState('connected')
    if(props.connected) { props.connected(accounts[0]) }
  }

  if(walletState == 'connected' || recover != undefined) {
    return(
      <WalletContext.Provider value={{
        account,
        wallet,
        walletState
      }}>
        { props.children }
      </WalletContext.Provider>
    )
  } else {
    return(<ConnectStack document={ props.document } container={ props.container } resolve={ connected } />)
  }
}
