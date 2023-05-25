import copy from '@uiw/copy-to-clipboard'
import Dialog from '../components/Dialog'
import ExtensionImage from '../graphics/extension'
import isMobile from '../helpers/isMobile'
import LinkImage from '../graphics/link'
import platformForWallet from '../helpers/platformForWallet'
import QRCodeImage from '../graphics/qrcode'
import QRCodeStyling from "qr-code-styling"
import React, { useState, useContext, useEffect, useRef } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { set as setPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'
import { wallets } from '@depay/web3-wallets'

export default (props)=> {

  const QRCodeElement = React.useRef()
  
  const [ extensionIsAvailable, setExtensionIsAvailable ] = useState()
  const [ appIsAvailable, setAppIsAvailable ] = useState()
  const [ linkIsConnected, setLinkIsConnected ] = useState()
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
    let wallet = new wallets[props.wallet.link]()
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
    if(linkIsConnected) {
      if(props.wallet.link == 'WalletConnectV1') {
        wallets[props.wallet.link].getConnectedInstance().then((wallet)=>{
          if(extensionIsAvailable && wallet.name == wallets[props.wallet.extension].info.name) {
            return // extension found and link with same wallet name found (e.g. MetaMask extension + mobile) let user decide!
          } 
          if(props.wallet.name == wallet.name) {
            return wallet.account().then((account)=>{
              props.resolve(account, wallet)
            })
          }
        })  
      } else if(props.wallet.link == 'WalletLink') {
        connectViaQRCode()
      }
    }
  }

  const connectViaQRCode = ()=> {
    switch (props.wallet.link) {
      case 'WalletConnectV1':
        if(QRCode == undefined) {
          let wallet = new wallets[props.wallet.link]()
          wallet.connect({
            name: props.wallet.name,
            logo: props.wallet.logo,
            reconnect: true,
            connect: ({ uri })=>{
              let newQRCode = new QRCodeStyling({
                width: 340,
                height: 340,
                type: "svg",
                dotsOptions: { type: "extra-rounded" },
                cornersSquareOptions: { type: 'rounded' },
                backgroundOptions: {
                  color: "transparent",
                },
              })
              newQRCode.update({ data: uri })
              setQRCode(newQRCode)
            }
          }).then((account)=>{
            props.resolve(account, wallet)
          })
        }
      break;
      case 'WalletLink':
        let wallet = new wallets[props.wallet.link]()
        wallet.connect().then((account)=>{
          props.resolve(account, wallet)
        })
      break
    }
  }

  useEffect(()=>{
    (async ()=>{
      setExtensionIsAvailable(
        props.wallet?.extension ? (await wallets[props.wallet.extension].isAvailable() || false) : false
      )
      setLinkIsConnected(
        props.wallet?.link ? (await wallets[props.wallet.link].isAvailable() || false) : false
      )
      setAppIsAvailable(!!platformForWallet(props.wallet))
    })()
  }, [])

  useEffect(()=> {
    if(linkIsConnected !== undefined) {
      
      setShowQRCode(!extensionIsAvailable && !isMobile() && !props.wallet?.desktop?.native && props.wallet.link)

    }
  }, [extensionIsAvailable, linkIsConnected])

  useEffect(()=> {
    if(showQRCode && props.wallet.link) {
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

          <div className="PaddingTopS">
            <div ref={ QRCodeElement } className="QRCode"/>
            { showQRCode && 
              <div className="Opacity05 PaddingBottomXS">
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
            { appIsAvailable &&
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
            { props.wallet.link && (!showQRCode || props.wallet.link == 'WalletLink') &&
              <div className="PaddingBottomXS">
                <button onClick={ ()=>{
                  setShowQRCode(true)
                  if(props.wallet.link) { connectViaQRCode() }
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
            { props.wallet.link && props.wallet.link == 'WalletConnectV1' && props.wallet.connectionLink &&
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
