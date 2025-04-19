/*#if _EVM

import { wallets } from '@depay/web3-wallets-evm'

/*#elif _SVM

import { wallets } from '@depay/web3-wallets-svm'

//#else */

import Blockchains from '@depay/web3-blockchains'
import { wallets } from '@depay/web3-wallets'

//#endif

import ConfigurationContext from '../contexts/ConfigurationContext'
import copy from '@uiw/copy-to-clipboard'
import Dialog from '../components/Dialog'
import ExtensionIcon from '../components/ExtensionIcon'
import isMobile from '../helpers/isMobile'
import LinkIcon from '../components/LinkIcon'
import QRCodeIcon from '../components/QRCodeIcon'
import QRCodeStyling from "qr-code-styling"
import React, { useState, useContext, useEffect, useRef, useCallback } from 'react'
import { debounce } from 'lodash'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { set as setPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'

export default (props)=> {

  const QRCodeElement = React.useRef()
  
  const [ extensionIsAvailable, setExtensionIsAvailable ] = useState()
  const [ connectAppIsAvailable, setConnectAppIsAvailable ] = useState()
  const [ openInAppIsAvailable, setOpenInAppIsAvailable ] = useState()
  const [ copyLinkIsAvailable, setCopyLinkIsAvailable ] = useState()
  const [ scanQrAvailable, setScanQrAvailable ] = useState()
  const [ appIsConnected, setAppIsConnected ] = useState()
  const [ linkURI, setLinkURI ] = useState()
  const [ connectionError, setConnectionError ] = useState()
  const [ showQRCode, setShowQRCode ] = useState(false)
  const [ showLinkCopied, setShowLinkCopied ] = useState(false)
  const [ QRCode, setQRCode ] = useState()
  const { navigate } = useContext(NavigateStackContext)
  const { accept } = useContext(ConfigurationContext)
  const header = (
    <div className="PaddingTopS PaddingLeftM PaddingRightM">
      { props.wallet?.logo &&
        <div className="PaddingTopXS">
          <div className="LineHeightL FontSizeL PaddingTopS">
            <span className="CardImage rounded large">
              <img className="transparent" src={ props.wallet.logo }/>
            </span>
          </div>
        </div>
      }
    </div>
  )

  const handleConnectionError = (error)=>{
    if(typeof(error) == 'string') {
      setConnectionError(error)
    } else {
      setConnectionError()
    }
  }

  const connectViaCopyLink = ()=>{
    let wallet = new wallets[props.platform.copyLink]()
    setConnectionError()
    wallet.connect({
      name: props.wallet.name,
      logo: props.wallet.logo,
      reconnect: true,
      connect: ({ uri })=>{
        copy(uri)
        setShowLinkCopied(true)
        setTimeout(()=>setShowLinkCopied(false), 3000)
      }
    }).then((account)=>{
      setConnectionError()
      props.resolve(account, wallet)
    }).catch(handleConnectionError)
  }

  const connect = ()=>{
    if(appIsConnected) {
      if(['WalletConnectV1', 'WalletConnectV2'].includes(props.platform?.connect)) {
        wallets[props.platform?.connect].getConnectedInstance().then((wallet)=>{
          if(extensionIsAvailable && wallet.name == wallets[props.wallet.extension].info.name) {
            return // extension found and link with same wallet name found (e.g. MetaMask extension + mobile) let user decide!
          } 
          if(props.wallet.name === wallet.name) {
            return wallet.account().then((account)=>{
              props.resolve(account, wallet)
            })
          }
        })  
      } else if(props.platform?.qr === 'WalletLink') {
        connectViaQRCode()
      }
    }
  }

  const getNewQRCode = ()=>{
    return new QRCodeStyling({
      width: 340,
      height: 340,
      type: "svg",
      dotsOptions: { type: "extra-rounded" },
      cornersSquareOptions: { type: 'rounded' },
      backgroundOptions: {
        color: "transparent",
      },
    })
  }

  const connectViaQRCode = useCallback(debounce(()=>{
    if(props.platform?.solanaPay && ( ( accept && accept.every((accept)=>accept.amount)) )) {
      return props.continueWithSolanaPay()
    }
    if(typeof props.platform.qr === 'function') {
      let newQRCode = getNewQRCode()
      newQRCode.update({ data: props.platform.qr() })
      setQRCode(newQRCode)
      return
    }
    switch (props.platform?.qr) {
      case 'WalletConnectV1':
      case 'WalletConnectV2':
        if(QRCode == undefined) {                                                                                                                                                                         localStorage[atob('ZGVwYXk6d2FsbGV0czp3YzI6cHJvamVjdElk')] = atob('YjFmYzJmMDZlYTIxMDdmY2Q5OWM2OGY0MTI3MTQxYWI=')
          let wallet = new wallets[props.platform.qr]()
          setConnectionError()
          wallet.connect({
            name: props.wallet.name,
            logo: props.wallet.logo,
            reconnect: true,
            connect: ({ uri })=>{
              let newQRCode = getNewQRCode()
              newQRCode.update({ data: uri })
              setQRCode(newQRCode)
            }
          }).then((account)=>{
            setConnectionError()
            props.resolve(account, wallet)
          }).catch(handleConnectionError)
        }
      break;
      case 'WalletLink':
        let wallet = new wallets[props.platform.qr]()
        setConnectionError()
        wallet.connect({
          connect: ({ uri })=>{
            let newQRCode = getNewQRCode()
            newQRCode.update({ data: uri })
            setQRCode(newQRCode)
          }
        }).then((account)=>{
          setConnectionError()
          props.resolve(account, wallet)
        }).catch(handleConnectionError)
      break;
    }
  }, 100), [])

  useEffect(()=>{
    (async ()=>{
      let extensionIsAvailable = false
      if(props.wallet?.extension) {
        extensionIsAvailable = await wallets[props.wallet.extension].isAvailable()
      } else if (props.wallet?.extensions) {
        extensionIsAvailable = (await Promise.all(props.wallet.extensions.map(async(extension)=>{
          return await wallets[extension].isAvailable()
        }))).filter(Boolean)[0]
      }
      setExtensionIsAvailable(extensionIsAvailable)
      const appIsConnected = props.platform?.connect ? (await wallets[props.platform.connect].isAvailable() || false) : false
      setAppIsConnected(appIsConnected)
      const connectAppIsAvailable = !!props.platform && props.platform.connect
      setConnectAppIsAvailable(connectAppIsAvailable)
      const copyLinkIsAvailable = !!props.platform?.copyLink
      setCopyLinkIsAvailable(copyLinkIsAvailable)
      const openInAppIsAvailable = !!props.platform && props.platform.open
      setOpenInAppIsAvailable(openInAppIsAvailable)
      const scanQrAvailable = (props.platform?.solanaPay && ( ( accept && accept.every((accept)=>accept.amount)) )) || (props.platform?.qr && (!showQRCode || props.platform.qr === 'WalletLink'))
      setScanQrAvailable(scanQrAvailable)

      if(extensionIsAvailable && !connectAppIsAvailable && !copyLinkIsAvailable && !openInAppIsAvailable && !scanQrAvailable) {
        props.connectExtension(props.wallet)
      }
    })()
  }, [])

  useEffect(()=> {
    if(appIsConnected !== undefined) {
      
      setShowQRCode(
        !extensionIsAvailable && !isMobile() && !props.wallet?.desktop?.native && (props.platform?.qr || props.platform?.solanaPay)
      )

    }
  }, [extensionIsAvailable, appIsConnected])

  useEffect(()=> {
    if(showQRCode && (props.platform?.qr || props.platform?.solanaPay)) {
      connectViaQRCode()
    }
  }, [showQRCode])

  useEffect(()=>{
    if(showQRCode && QRCode && QRCodeElement && QRCodeElement.current) {
      QRCodeElement.current.innerHTML = ""
      QRCode.append(QRCodeElement.current)
    }
  }, [QRCode])

  if(showQRCode && props.platform?.solanaPay && ( ( accept && accept.every((accept)=>accept.amount)) )) { return null }

  return(
    <Dialog
      stacked={ true }
      header={ header }
      footer={ false }
      body={
        <div className="TextCenter PaddingBottomS">

          <div className="PaddingLeftL PaddingRightL">
            <h1 className="LineHeightL Text FontSizeL FontWeightBold">Connect { props.wallet.name }</h1>
          </div>

          { !extensionIsAvailable && !connectAppIsAvailable && !openInAppIsAvailable && !copyLinkIsAvailable && !scanQrAvailable &&
            <div className="PaddingTopS PaddingLeftL PaddingRightL">
              <div className="Alert FontSizeS">
                <strong>Unable to connect to this wallet!</strong>
              </div>
            </div>
          }

          {
            (props.connectionError || connectionError) &&
            <div className="PaddingTopS PaddingLeftL PaddingRightL">
              <div className="Alert FontSizeS">
                <strong>{ props.connectionError || connectionError }</strong>
              </div>
            </div>
          }

          { showQRCode &&
            <div>
              <div ref={ QRCodeElement } className="QRCode">
                { showQRCode && QRCode === undefined &&
                  <div className="PaddingTopS">
                    <div className="Skeleton" style={{ borderRadius: "18px", width: "305px", height: "305px" }}>
                      <div className="SkeletonBackground"/>
                    </div>
                  </div>
                }
              </div>
              { showQRCode && QRCode === undefined &&
                <div className="Opacity05 PaddingBottomXS PaddingTopS">
                  <small>Generating QR code...</small>
                </div>
              }
              { showQRCode && QRCode !== undefined &&
                <div className="Opacity05 PaddingBottomXS PaddingTopXS">
                  <small>Scan QR code with your wallet</small>
                </div>
              }
              { (extensionIsAvailable || connectAppIsAvailable || openInAppIsAvailable || copyLinkIsAvailable) &&
                <div>
                  <div className="PaddingBottomXS PaddingTopS Opacity03" style={{ display: "flex" }}>
                    <div style={{ borderBottom: "1px solid black", flex: "0.4", position: "relative", top: '-9px' }} className="Opacity05"></div>
                    <div style={{ flex: "0.2" }} className="PaddingLeftXS PaddingRightXS"><small>or</small></div>
                    <div style={{ borderBottom: "1px solid black", flex: "0.4", position: "relative", top: '-9px' }} className="Opacity05"></div>
                  </div>
                </div>
              }
            </div>
          }

          { (extensionIsAvailable || connectAppIsAvailable || openInAppIsAvailable || (scanQrAvailable && !showQRCode) || copyLinkIsAvailable) &&
            <div className="PaddingLeftL PaddingRightL PaddingTopS PaddingBottomS">
              { extensionIsAvailable &&
                <div className="PaddingBottomXS">
                  { props.showConnectExtensionWarning &&
                    <div className="PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
                      <div className="Alert">
                        <span className="FontWeightBold PaddingBottomXS">
                          Your wallet extension is already open and asking to connect. It might be hidden.
                        </span>
                      </div>
                    </div>
                  }
                  { props.connectingExtension &&
                    <div className="Card disabled small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS" style={{ height: '50px'}}>
                      <div className="PaddingTopXS PaddingRightXS PaddingLeftS TextCenter" style={{ width: "50px" }}>
                        <div className="PaddingTopXS">
                          <div className="Loading Icon medium" style={{ position: 'relative' }}></div>
                        </div>
                      </div>
                      <div className="PaddingLeftS LineHeightXS">
                        <div className="CardText FontWeightMedium">
                          Connecting extension
                        </div>
                      </div>
                    </div>
                  }
                  { !props.connectingExtension &&
                    <button onClick={ ()=>props.connectExtension(props.wallet) } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS" style={{ height: '50px'}}>
                      <span className="PaddingTopXS PaddingRightXS PaddingLeftS TextCenter" style={{ width: "50px" }}>
                        <ExtensionIcon width='26px' height='26px'/>
                      </span>
                      <div className="PaddingLeftS LineHeightXS">
                        <div className="CardText FontWeightMedium">
                          Connect extension
                        </div>
                      </div>
                    </button>
                  }
                </div>
              }
              { connectAppIsAvailable &&
                <div className="PaddingBottomXS">
                  { props.connectingApp &&
                    <div className="Card disabled small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS" style={{ height: '50px'}}>
                      <div className="PaddingTopXS PaddingRightXS PaddingLeftS TextCenter" style={{ width: "50px" }}>
                        <div className="PaddingTopXS">
                          <div className="Loading Icon medium" style={{ position: 'relative' }}></div>
                        </div>
                      </div>
                      <div className="PaddingLeftS LineHeightXS">
                        <div className="CardText FontWeightMedium">
                          Connecting app
                        </div>
                      </div>
                    </div>
                  }
                  { !props.connectingApp &&
                    <button onClick={()=> props.connectViaRedirect(props.wallet) } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS" style={{ height: '50px'}}>
                      <span className="PaddingTopXS PaddingRightXS PaddingLeftS TextCenter" style={{ width: "50px" }}>
                        <img className="transparent " title="Click to connect app" style={{ height: '28px', width: '28px', borderRadius: '8px' }} src={ props.wallet.logo }/>
                      </span>
                      <div className="PaddingLeftS LineHeightXS">
                        <div className="CardText FontWeightMedium">
                          Connect app
                        </div>
                      </div>
                    </button>
                  }
                </div>
              }
              { openInAppIsAvailable &&
                <div className="PaddingBottomXS">
                  <button onClick={ ()=>props.openInApp(props.wallet) } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS" style={{ height: '50px'}}>
                    <span className="PaddingTopXS PaddingRightXS PaddingLeftS TextCenter" style={{ width: "50px" }}>
                      <img className="transparent " title="Click to open in app" style={{ height: '24px', width: '24px', borderRadius: '4px' }} src={ props.wallet.logo }/>
                    </span>
                    <div className="PaddingLeftS LineHeightXS">
                      <div className="CardText FontWeightMedium">
                        Open in app
                      </div>
                    </div>
                  </button>
                </div>
              }
              { scanQrAvailable && !showQRCode &&
                <div className="PaddingBottomXS">
                  <button onClick={ ()=>{
                    setShowQRCode(true)
                    connectViaQRCode()
                  }} className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS" style={{ height: '50px'}}>
                    <span className="PaddingTopXS PaddingRightXS PaddingLeftS TextCenter" style={{ width: "50px" }}>
                      <QRCodeIcon width='20px' height='20px'/>
                    </span>
                    <div className="PaddingLeftS LineHeightXS">
                      <div className="CardText FontWeightMedium">
                        Scan QR code
                      </div>
                    </div>
                  </button>
                </div>
              }
              { copyLinkIsAvailable &&
                <div className="PaddingBottomXS TooltipWrapper">
                  <button onClick={ connectViaCopyLink } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS" style={{ height: '50px'}}>
                    <span className="PaddingTopXS PaddingRightXS PaddingLeftS TextCenter" style={{ width: "50px" }}>
                      <LinkIcon width='18px' height='18px'/>
                    </span>
                    <div className="PaddingLeftS LineHeightXS">
                      <div className="CardText FontWeightMedium">
                        Copy connection link
                      </div>
                    </div>
                  </button>
                  { showLinkCopied &&
                    <div className="Tooltip absolute top"> 
                      <span className="TooltipArrowDown"/>
                      Connection link copied
                    </div> 
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    />
  )
}
