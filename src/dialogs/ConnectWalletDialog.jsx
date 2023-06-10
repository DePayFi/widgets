/*#if _EVM

import { route } from '@depay/web3-payments-evm'
import { wallets } from '@depay/web3-wallets-evm'

/*#elif _SOLANA

import { route } from '@depay/web3-payments-solana'
import { wallets } from '@depay/web3-wallets-solana'

//#else */

import { route } from '@depay/web3-payments'
import { wallets } from '@depay/web3-wallets'

//#endif

import copy from '@uiw/copy-to-clipboard'
import Dialog from '../components/Dialog'
import ExtensionImage from '../graphics/extension'
import isMobile from '../helpers/isMobile'
import LinkImage from '../graphics/link'
import QRCodeImage from '../graphics/qrcode'
import QRCodeStyling from "qr-code-styling"
import React, { useState, useContext, useEffect, useRef, useCallback } from 'react'
import SolanaPay from '../helpers/SolanaPay'
import { debounce } from 'lodash'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { set as setPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'

export default (props)=> {

  const QRCodeElement = React.useRef()
  
  const [ extensionIsAvailable, setExtensionIsAvailable ] = useState()
  const [ connectAppIsAvailable, setConnectAppIsAvailable ] = useState()
  const [ openInAppIsAvailable, setOpenInAppIsAvailable ] = useState()
  const [ scanQrAvailable, setScanQrAvailable ] = useState()
  const [ appIsConnected, setAppIsConnected ] = useState()
  const [ linkURI, setLinkURI ] = useState()
  const [ showQRCode, setShowQRCode ] = useState(false)
  const [ showLinkCopied, setShowLinkCopied ] = useState(false)
  const [ QRCode, setQRCode ] = useState()
  const { navigate } = useContext(NavigateStackContext)
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

  const connectViaCopyLink = ()=>{
    let wallet = new wallets[props.platform.connect]()
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
      props.resolve(account, wallet)
    })
  }

  const connect = ()=>{
    if(appIsConnected) {
      if(props.platform?.connect == 'WalletConnectV1') {
        wallets[props.platform?.connect].getConnectedInstance().then((wallet)=>{
          if(extensionIsAvailable && wallet.name == wallets[props.wallet.extension].info.name) {
            return // extension found and link with same wallet name found (e.g. MetaMask extension + mobile) let user decide!
          } 
          if(props.wallet.name == wallet.name) {
            return wallet.account().then((account)=>{
              props.resolve(account, wallet)
            })
          }
        })  
      } else if(props.platform?.qr == 'WalletLink') {
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
    if(typeof props.platform.qr === 'function') {
      let newQRCode = getNewQRCode()
      newQRCode.update({ data: props.platform.qr() })
      setQRCode(newQRCode)
      return
    }
    switch (props.platform?.qr) {
      case 'SolanaPay':
        if(QRCode == undefined) {
          const solanaPayInstance = new SolanaPay({
            name: props.wallet.name,
            logo: props.wallet.logo,
          })
          solanaPayInstance.connect({ 
            qr: (uri)=>{
              let newQRCode = getNewQRCode()
              newQRCode.update({ data: uri })
              setQRCode(newQRCode)
            },
            route: async (account, wallet)=>{
              props.resolve(account, wallet)
            }
          })
        }
      break;
      case 'WalletConnectV1':
        if(QRCode == undefined) {
          let wallet = new wallets[props.platform.qr]()
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
            props.resolve(account, wallet)
          })
        }
      break;
      case 'WalletLink':
        let wallet = new wallets[props.platform.qr]()
        wallet.connect().then((account)=>{
          props.resolve(account, wallet)
        })
      break
    }
  }, 100), [])

  useEffect(()=>{
    (async ()=>{
      setExtensionIsAvailable(
        props.wallet?.extension ? (await wallets[props.wallet.extension].isAvailable() || false) : false
      )
      setAppIsConnected(
        props.platform?.connect ? (await wallets[props.platform.connect].isAvailable() || false) : false
      )
      setConnectAppIsAvailable(!!props.platform && props.platform.connect)
      setOpenInAppIsAvailable(!!props.platform && props.platform.open)
      setScanQrAvailable(
        props.platform?.qr && (!showQRCode || props.platform.qr === 'WalletLink') && 
        ( props.platform.qr !== 'SolanaPay' || ( props.accept && props.accept.every((accept)=>accept.amount)) )
      )
    })()
  }, [])

  useEffect(()=> {
    if(appIsConnected !== undefined) {
      
      setShowQRCode(
        !extensionIsAvailable && !isMobile() && !props.wallet?.desktop?.native && props.platform?.qr && 
        ( props.platform.qr !== 'SolanaPay' || ( props.accept && props.accept.every((accept)=>accept.amount)) )
      )

    }
  }, [extensionIsAvailable, appIsConnected])

  useEffect(()=> {
    if(showQRCode && props.platform?.qr) {
      connectViaQRCode()
    }
  }, [showQRCode])

  useEffect(()=>{
    if(showQRCode && QRCode && QRCodeElement && QRCodeElement.current) {
      QRCodeElement.current.innerHTML = ""
      QRCode.append(QRCodeElement.current)
    }
  }, [QRCode])

  return(
    <Dialog
      stacked={ true }
      header={ header }
      body={
        <div className="TextCenter">

          <div className="PaddingLeftL PaddingRightL">
            <h1 className="LineHeightL Text FontSizeL FontWeightBold">Connect { props.wallet.name }</h1>
          </div>

          { !window.location.protocol.match('https') &&
            <div className="PaddingTopS PaddingLeftL PaddingRightL">
              <div className="Alert FontSizeS">
                <strong>Most wallets do not connect to http!</strong>
              </div>
            </div>
          }

          { !extensionIsAvailable && !connectAppIsAvailable && !openInAppIsAvailable && ! props.platform?.copyLink && !scanQrAvailable &&
            <div className="PaddingTopS PaddingLeftL PaddingRightL">
              <div className="Alert FontSizeS">
                <strong>No option found to connect to this wallet!</strong>
              </div>
            </div>
          }

          <div className="PaddingTopS">
            <div ref={ QRCodeElement } className="QRCode"/>
            { showQRCode && props.platform?.qr !== 'WalletLink' &&
              <div className="Opacity05 PaddingBottomXS PaddingTopS">
                <small>Scan QR code with your wallet</small>
              </div>
            }
          </div>

          <div className="PaddingLeftL PaddingRightL PaddingTopS">
            { extensionIsAvailable &&
              <div className="PaddingBottomXS">
                { props.showConnectExtensionWarning &&
                  <div className="PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
                    <div className="Alert">
                      <span className="FontWeightBold PaddingBottomXS">
                        You wallet extension window is already asking to connect. It might be hidden.
                      </span>
                    </div>
                  </div>
                }
                <button onClick={ ()=>props.connectExtension(props.wallet) } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS">
                  <span className="PaddingTopXS PaddingRightXS PaddingLeftS">
                    <img className="transparent " title="Connect your wallet" style={{ height: '26px' }} src={ ExtensionImage }/>
                  </span>
                  <div className="PaddingLeftS LineHeightXS">
                    <div className="CardText FontWeightMedium">
                      Connect extension
                    </div>
                  </div>
                </button>
              </div>
            }
            { connectAppIsAvailable &&
              <div className="PaddingBottomXS">
                <button onClick={ ()=>props.connectViaRedirect(props.wallet) } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS">
                  <span className="PaddingTopXS PaddingRightXS PaddingLeftS">
                    <img className="transparent " title="Click to connect app" style={{ height: '26px', width: '26px', borderRadius: '8px' }} src={ props.wallet.logo }/>
                  </span>
                  <div className="PaddingLeftS LineHeightXS">
                    <div className="CardText FontWeightMedium">
                      Connect app
                    </div>
                  </div>
                </button>
              </div>
            }
            { openInAppIsAvailable &&
              <div className="PaddingBottomXS">
                <button onClick={ ()=>props.openInApp(props.wallet) } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS">
                  <span className="PaddingTopXS PaddingRightXS PaddingLeftS">
                    <img className="transparent " title="Click to open in app" style={{ height: '26px', width: '26px', borderRadius: '8px' }} src={ props.wallet.logo }/>
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
                  if(props.platform.qr) { connectViaQRCode() }
                }} className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS">
                  <span className="PaddingTopXS PaddingRightXS PaddingLeftS">
                    <img className="transparent " title="Scan QR code to connect a mobile wallet" style={{ height: '26px' }} src={ QRCodeImage }/>
                  </span>
                  <div className="PaddingLeftS LineHeightXS">
                    <div className="CardText FontWeightMedium">
                      Scan QR code
                    </div>
                  </div>
                </button>
              </div>
            }
            { props.platform?.connect && props.platform.connect === 'WalletConnectV1' && props.platform.copyLink &&
              <div className="PaddingBottomXS TooltipWrapper">
                <button onClick={ connectViaCopyLink } className="Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS">
                  <span className="PaddingTopXS PaddingRightXS PaddingLeftS">
                    <img className="transparent " title="Copy connection link" style={{ height: '26px' }} src={ LinkImage }/>
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

        </div>
      }
    />
  )
}
