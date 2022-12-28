import ConfigurationContext from '../contexts/ConfigurationContext'
import ConnectStack from '../stacks/ConnectStack'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { ReactDialog } from '@depay/react-dialog'
import { getConnectedWallets } from '@depay/web3-wallets'

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
    if(props.connected) { props.connected(account) }
  }

  useEffect(()=>{
    let selectConnectedWallet = async()=>{
      let connectedWallets = await getConnectedWallets()
      if(connectedWallets && connectedWallets.length == 1){
        let wallet = connectedWallets[0]
        let account = await wallet.account()
        connected({ account, wallet })
      }
    }
    selectConnectedWallet()
  }, [])

  if(walletState == 'connected' || (recover != undefined && typeof recover != 'function')) {
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
