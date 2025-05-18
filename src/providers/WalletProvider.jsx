import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConnectStack from '../stacks/ConnectStack'
import debounce from '../helpers/debounce'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import WalletMissesBlockchainSupportDialog from '../dialogs/WalletMissesBlockchainSupportDialog'
import { ReactDialog } from '@depay/react-dialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { accept, wallet: passedWallet } = useContext(ConfigurationContext)
  const { setUpdatable } = useContext(UpdatableContext)
  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState(passedWallet)
  const [solanaPayWallet, setSolanaPayWallet] = useState(false)
  const [navigator, setNavigator] = useState()
  const [ walletMissesBlockchainSupport, setWalletMissesBlockchainSupport ] = useState(false)
  const [account, setAccount] = useState()
  const [navigationReturnsToConnect, setNavigationReturnsToConnect] = useState(false)
  const [walletState, setWalletState] = useState(passedWallet ? 'connected' : undefined)

  const connect = useCallback(debounce(()=>{
    wallet.connect().then(setAccount)
  }))

  const debounceSetWalletMissesBlockchainSupport = useCallback(debounce((value)=>{
    setWalletMissesBlockchainSupport(value)
  }))
  
  const connected = ({ account, wallet })=> {
    navigator?.hide()
    setTimeout(()=>{
      setAccount(account)
      setWallet(wallet)
      setNavigationReturnsToConnect(true)
      setWalletState('connected')
      if(props.connected) { props.connected(account) }
    }, 80)
  }

  const disconnect = ()=>{
    setAccount()
    setWallet()
    setWalletState()
    setWalletMissesBlockchainSupport(false)
  }

  useEffect(()=>{
    if(!wallet) { return }

    if(accept && !accept.some((configuration)=>wallet.blockchains.includes(configuration.blockchain))) {

      setUpdatable(false)
      setTimeout(()=>debounceSetWalletMissesBlockchainSupport(true), 200)
      return
    }

    const onAccountChanged = (account)=>{
      if(account) {
        setAccount(account)
      } else {
        setAccount()
        setWalletState()
      }
    }

    wallet.on('account', onAccountChanged)
    return ()=>{ wallet.off('account', onAccountChanged) }
  }, [wallet])

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

  useEffect(()=>{
    if(solanaPayWallet) {
      setWalletState('connected')
    }
  }, [solanaPayWallet])

  if(walletMissesBlockchainSupport) {
    return(
      <WalletContext.Provider value={{
        account,
        wallet,
        disconnect,
      }}>
        <ReactDialogStack
          open={ open }
          close={ close }
          start='WalletMissesBlockchainSupport'
          container={ props.container }
          document={ props.document }
          stacked={ true }
          dialogs={{
            WalletMissesBlockchainSupport: <WalletMissesBlockchainSupportDialog disconnect={disconnect}/>,
          }}
        />
      </WalletContext.Provider>
    )

  } else if(walletState == 'connected') {

    return(
      <WalletContext.Provider value={{
        account,
        wallet,
        disconnect,
        solanaPayWallet,
      }}>
        { props.children }
      </WalletContext.Provider>
    )

  } else {

    return(
      <ConnectStack
        setNavigator={ setNavigator }
        document={ props.document }
        container={ props.container }
        resolve={ connected }
        accept={ accept }
        setSolanaPayWallet = { (value)=>setSolanaPayWallet(value) }
        stacked={ navigationReturnsToConnect ? 'backward' : undefined }
      />
    )
  }
}
