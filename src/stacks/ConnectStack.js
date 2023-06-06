/*#if _EVM

import { getWallets, wallets } from '@depay/web3-wallets-evm'

/*#elif _SOLANA

import { getWallets, wallets } from '@depay/web3-wallets-solana'

//#else */

import { getWallets, wallets } from '@depay/web3-wallets'

//#endif

import allWallets from '../helpers/allWallets'
import ClosableContext from '../contexts/ClosableContext'
import ConnectWalletDialog from '../dialogs/ConnectWalletDialog'
import isAndroid from '../helpers/isAndroid'
import isWebView from '../helpers/isWebView'
import platformForWallet from '../helpers/platformForWallet'
import PoweredBy from '../components/PoweredBy'
import React, { useState, useContext, useEffect } from 'react'
import safeAppUrl from '../helpers/safeAppUrl'
import safeUniversalUrl from '../helpers/safeUniversalUrl'
import SelectBlockchainDialog from '../dialogs/SelectBlockchainDialog'
import SelectWalletDialog from '../dialogs/SelectWalletDialog'
import WhatIsAWalletDialog from '../dialogs/WhatIsAWalletDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'
import { set as setPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const [ wallet, setWallet ] = useState()
  const [ selection, setSelection ] = useState({ blockchain: undefined })
  const [ showConnectExtensionWarning, setShowConnectExtensionWarning ] = useState(false)
  const resolve = (account, wallet)=> {
    if(account && wallet) {
      let walletMeta = allWallets.find((walletMeta)=>walletMeta.extension == wallet.name) || allWallets.find((walletMeta)=>walletMeta.name == wallet.name)
      setPreviouslyConnectedWallet(walletMeta.name)
      if(props.autoClose) close()
      if(props.resolve) props.resolve({ account, wallet })
    }
  }

  const connectExtension = (wallet)=>{
    setShowConnectExtensionWarning(false)

    wallet = new wallets[wallet.extension]()
    wallet.connect()
      .then((account)=>{ 
        resolve(account, wallet)
      })
      .catch((error)=>{
        if(error?.code == -32002) { // Request of type 'wallet_requestPermissions' already pending...
          setShowConnectExtensionWarning(true)
        }
      })
  }

  const openUniversalLink = (platform, uri, name)=>{
    if(!platform.universal){ return }
    let href = safeUniversalUrl(platform.universal)
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({ href, name }))
    href = `${href}/wc?uri=${encodeURIComponent(uri)}`
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

  const connectViaRedirect = (walletMetaData, reconnect = true)=> {
    const platform = platformForWallet(walletMetaData)
    if(!platform) { return }
    if(walletMetaData.link == 'WalletConnectV1') {
      let wallet = new wallets[walletMetaData.link]()
      wallet.connect({
        name: walletMetaData.name,
        logo: walletMetaData.logo,
        reconnect,
        connect: ({ uri })=>{
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
      }).then((account)=>{
        resolve(account, wallet)
      })
    } else if (walletMetaData.link == 'WalletLink') {
      setPreviouslyConnectedWallet(walletMetaData.name)
      if(isAndroid() || isWebView()) { // Universal Link
        window.open(`${platform.universal}?cb_url=${encodeURIComponent(window.location.toString())}`, '_self', 'noreferrer noopener')
      } else { // iOS standalone browser -> native deeplink
        window.open(`${platform.native}?url=${encodeURIComponent(window.location.toString())}`, '_self', 'noreferrer noopener')
      }
    }
  }

  const openInApp = (walletMetaData)=>{
    const platform = platformForWallet(walletMetaData)
    if(!platform || !platform.open) { return }
    window.open(platform.open(), '_self', 'noreferrer noopener')
  }

  return(
    <div>
      <ReactDialogStack
        open={ open }
        close={ close }
        start='SelectWallet'
        container={ props.container }
        document={ props.document }
        dialogs={{
          SelectWallet: <SelectWalletDialog setWallet={setWallet} resolve={resolve} openInApp={openInApp} connectViaRedirect={connectViaRedirect} connectExtension={connectExtension}/>,
          WhatIsAWallet: <WhatIsAWalletDialog/>,
          ConnectWallet: <ConnectWalletDialog selection={selection} wallet={wallet} resolve={resolve} openInApp={openInApp} connectViaRedirect={connectViaRedirect} connectExtension={connectExtension} showConnectExtensionWarning={showConnectExtensionWarning}/>
        }}
      />
      <PoweredBy/>
    </div>
  )
}
