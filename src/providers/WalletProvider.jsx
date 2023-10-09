import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConnectStack from '../stacks/ConnectStack'
import ErrorContext from '../contexts/ErrorContext'
import PaymentBlockchainsDialog from '../dialogs/PaymentBlockchainsDialog'
import React, { useState, useEffect, useContext, useCallback } from 'react'
import SolanaPayContext from '../contexts/SolanaPayContext'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import WalletMissesBlockchainSupportDialog from '../dialogs/WalletMissesBlockchainSupportDialog'
import { debounce } from 'lodash'
import { ReactDialog } from '@depay/react-dialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { accept, recover, wallet: passedWallet } = useContext(ConfigurationContext)
  const solanaPayContext = useContext(SolanaPayContext)
  const { setUpdatable } = useContext(UpdatableContext)
  const { setError } = useContext(ErrorContext)
  const [wallet, setWallet] = useState(passedWallet)
  const [navigator, setNavigator] = useState()
  const [ walletMissesBlockchainSupport, setWalletMissesBlockchainSupport ] = useState(false)
  let [account, setAccount] = useState()
  let [navigationReturnsToConnect, setNavigationReturnsToConnect] = useState(false)
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

  const continueWithSolanaPay = (!accept || !accept.some((configuration)=>configuration.blockchain === 'solana')) ? undefined : ()=>{
    solanaPayContext.start()
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
        connect()
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

  if(walletMissesBlockchainSupport) {
    return(
      <ReactDialogStack
        open={ open }
        close={ close }
        start='WalletMissesBlockchainSupport'
        container={ props.container }
        document={ props.document }
        stacked={ true }
        dialogs={{
          WalletMissesBlockchainSupport: <WalletMissesBlockchainSupportDialog disconnect={disconnect}/>,
          PaymentBlockchains: <PaymentBlockchainsDialog/>,
        }}
      />
    )

  } else if(walletState == 'connected' || recover != undefined) {

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

    return(
      <ConnectStack
        setNavigator={ setNavigator }
        document={ props.document }
        container={ props.container }
        resolve={ connected }
        accept={ accept }
        continueWithSolanaPay={ continueWithSolanaPay }
        stacked={ navigationReturnsToConnect ? 'backward' : undefined }
      />
    )
  }
}
