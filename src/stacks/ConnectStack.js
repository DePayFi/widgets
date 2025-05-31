/*#if _EVM

import { wallets } from '@depay/web3-wallets-evm'

/*#elif _SVM

import { wallets } from '@depay/web3-wallets-svm'

//#else */

import { wallets } from '@depay/web3-wallets'

//#endif

import allWallets from '../helpers/allWallets'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConnectWalletDialog from '../dialogs/ConnectWalletDialog'
import isAndroid from '../helpers/isAndroid'
import isWebView from '../helpers/isWebView'
import platformForWallet from '../helpers/platformForWallet'
import PoweredBy from '../components/PoweredBy'
import React, { useState, useContext, useEffect } from 'react'
import safeAppUrl from '../helpers/safeAppUrl'
import safeUniversalUrl from '../helpers/safeUniversalUrl'
import SelectPlatformDialog from '../dialogs/SelectPlatformDialog'
import SelectWalletDialog from '../dialogs/SelectWalletDialog'
import WhatIsAWalletDialog from '../dialogs/WhatIsAWalletDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'
import { set as setPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'
import { supported } from '../blockchains'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { loginWith } = useContext(ConfigurationContext)
  const [ wallet, setWallet ] = useState()
  const [ navigator, setNavigator ] = useState()
  const [ platform, setPlatform ] = useState()
  const [ connectingExtension, setConnectingExtension ] = useState(false)
  const [ connectingApp, setConnectingApp ] = useState(false)
  const [ redirectUri, setRedirectUri ] = useState()
  const [ connectionError, setConnectionError ] = useState()
  const [ selection, setSelection ] = useState({ blockchain: undefined })
  const [ showConnectExtensionWarning, setShowConnectExtensionWarning ] = useState(false)
  const resolve = (account, wallet)=> {
    let walletMeta = allWallets.find((walletMeta)=>walletMeta.name == wallet.name)
    setPreviouslyConnectedWallet(walletMeta.name)
    if(props.autoClose) close()
    if(props.resolve) props.resolve({ account, wallet })
  }

  const connectExtension = (wallet, extension)=>{
    setShowConnectExtensionWarning(false)

    if(extension === undefined) {

      if(wallet.extensions && props.accept) {
        let availableExtensions = wallet.extensions.filter((availableExtension)=>{
          return props.accept.some((configuration)=>wallets[availableExtension].info.blockchains.includes(configuration.blockchain))
        })
        if(availableExtensions.length === 1) {
          extension = availableExtensions[0]
        } else if (availableExtensions.length > 1) {
          setTimeout(()=>{ navigator.navigate('SelectPlatform') }, 50)
          return
        }
      } else if(wallet.extensions && props.accept === undefined) {
        return navigator.navigate('SelectPlatform')
      } else {
        extension = wallet.extension
      }
    }

    setConnectingExtension(true)

    wallet = new wallets[extension]()
    const resetConnectingTimeout = setTimeout(()=>{ setConnectingExtension(false) }, 5000)
    wallet.connect()
      .then((account)=>{ 
        resolve(account, wallet)
        setConnectingExtension(false)
        clearTimeout(resetConnectingTimeout)
      })
      .catch((error)=>{
        setConnectingExtension(false)
        clearTimeout(resetConnectingTimeout)
        if(error?.code == -32002) { // Request of type 'wallet_requestPermissions' already pending...
          setShowConnectExtensionWarning(true)
        } else if(typeof(error) === 'string') {
          setConnectionError(error)
        }
      })
  }

  const openUniversalLink = (platform, uri, name)=>{
    if(!platform.universal){ return }
    let href = safeUniversalUrl(platform.universal)
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({ href, name }))
    if(platform.encoded !== false) {
      href = `${href}/wc?uri=${encodeURIComponent(uri)}`
    } else {
      href = `${href}/wc?uri=${uri}`
    }
    return window.open(href, '_self', 'noreferrer noopener')
  }

  const openNativeLink = (platform, uri, name)=>{
    if(!platform.native){ return }
    let href = safeAppUrl(platform.native)
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({ href, name }))
    if(platform.encoded !== false) {
      href = `${href}wc?uri=${encodeURIComponent(uri)}`
    } else {
      href = `${href}wc?uri=${uri}`
    }
    return window.open(href, '_self', 'noreferrer noopener')
  }

  const openWcLink = (platform, uri, name)=>{
    let href = 'wc://'
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({ href, name }))
    if(platform.encoded !== false) {
      href = `${href}wc?uri=${encodeURIComponent(uri)}`
    } else {
      href = `${href}wc?uri=${uri}`
    }
    window.open(href, '_self', 'noreferrer noopener')
  }

  const redirect = ({ walletMetaData, platform, uri })=>{
    let name = isAndroid() ? 'Android' : walletMetaData.name
    if(isWebView()) {
      if(platform.universal) {
        openUniversalLink(platform, uri, name)
      } else if(isAndroid()) {
        openWcLink(platform, uri, name)
      }
    } else {
      if(platform.native) {
        openNativeLink(platform, uri, name)
      } else {
        openUniversalLink(platform, uri, name)
      }
    }
  }

  const connectViaRedirect = (walletMetaData, reconnect = true)=> {
    const platform = platformForWallet(walletMetaData)
    if(!platform) { return }
    setConnectingApp(true)
    const resetConnectingTimeout = setTimeout(()=>{ setConnectingApp(false) }, 15000)
    if(['WalletConnectV1', 'WalletConnectV2'].includes(platform.connect)) {                                                                                                                                                                                   localStorage[atob('ZGVwYXk6d2FsbGV0czp3YzI6cHJvamVjdElk')] = atob('YjFmYzJmMDZlYTIxMDdmY2Q5OWM2OGY0MTI3MTQxYWI=')
      let wallet = new wallets[platform.connect]()
      if(redirectUri) {
        return redirect({ walletMetaData, platform, uri: redirectUri })
      }
      setConnectionError()
      wallet.connect({
        name: walletMetaData.name,
        logo: walletMetaData.logo,
        reconnect,
        connect: ({ uri })=>{
          setRedirectUri(uri)
          redirect({ walletMetaData, platform, uri })
        }
      }).then((account)=>{
        setConnectingApp(false)
        resolve(account, wallet)
      }).catch((error)=>{
        setConnectingApp(false)
        if(typeof(error) === 'string') {
          setConnectionError(error)
        }
      })
    } else if (platform.connect === 'SolanaMobileWalletAdapter') {
      let wallet = new wallets[platform.connect]()
      setConnectionError()
      wallet.connect({
        name: walletMetaData.name,
        logo: walletMetaData.logo,
      }).then((account)=>{
        setConnectingApp(false)
        resolve(account, wallet)
      }).catch((error)=>{ 
        setConnectingApp(false)
        if(typeof(error) === 'string') {
          setConnectionError(error)
        }
      })
    }
  }

  const openInApp = (walletMetaData)=>{
    const platform = platformForWallet(walletMetaData)
    if(!platform || !platform.open) { return }
    setPreviouslyConnectedWallet(walletMetaData.name)
    window.open(platform.open(), '_self', 'noreferrer noopener')
  }

  useEffect(()=>{
    delete localStorage['WALLETCONNECT_DEEPLINK_CHOICE']
  }, [])

  useEffect(()=>{
    if(loginWith) {
      let foundWallet = allWallets.find((wallet)=>wallet.name==loginWith)
      if(foundWallet) { connectExtension(foundWallet) }
    }
  }, [])

  return(
    <div>
      <ReactDialogStack
        open={ open }
        close={ close }
        start='SelectWallet'
        container={ props.container }
        document={ props.document }
        setNavigator={ (navigator)=>{
          if(props.setNavigator && navigator) { setNavigator(navigator) }
          if(navigator) { setNavigator(navigator) }
        }}
        stacked={ props.stacked }
        dialogs={{
          SelectWallet: <SelectWalletDialog setWallet={(walletMetaData)=>{
            setPlatform(platformForWallet(walletMetaData))
            setWallet(walletMetaData)
          }} resolve={resolve} openInApp={openInApp} connectViaRedirect={connectViaRedirect} connectExtension={connectExtension}/>,
          WhatIsAWallet: <WhatIsAWalletDialog/>,
          SelectPlatform: <SelectPlatformDialog
            onSelect={(extension)=>{
              navigator.navigate('back')
              connectExtension(wallet, extension)
            }}
            wallet={wallet}
            accept={props.accept}
          />,
          ConnectWallet: <ConnectWalletDialog
            selection={selection}
            accept={props.accept}
            wallet={wallet}
            platform={platform}
            resolve={resolve}
            openInApp={openInApp}
            connectViaRedirect={connectViaRedirect}
            connectExtension={connectExtension}
            connectingExtension={connectingExtension}
            connectingApp={connectingApp}
            showConnectExtensionWarning={showConnectExtensionWarning}
            connectionError={connectionError}
            setSolanaPayWallet={props.setSolanaPayWallet}
          />
        }}
      />
      <PoweredBy/>
    </div>
  )
}
