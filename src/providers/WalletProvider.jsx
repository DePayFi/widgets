import ConnectStack from '../stacks/ConnectStack'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { ReactDialog } from 'depay-react-dialog'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()
  const [walletState, setWalletState] = useState()
  const connected = ({ account, wallet })=> {
    setAccount(account)
    setWallet(wallet)
    setWalletState('connected')
    if(props.connected) { props.connected(accounts[0]) }
  }

  if(walletState == 'connected') { 
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
