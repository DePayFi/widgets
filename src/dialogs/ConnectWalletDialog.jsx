import Dialog from '../components/Dialog'
import isMobile from '../helpers/isMobile'
import QRCode from '../graphics/qrcode'
import QRCodeStyling from "qr-code-styling"
import React, { useState, useContext, useEffect, useRef } from 'react'
import safeAppUrl from '../helpers/safeAppUrl'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { wallets } from '@depay/web3-wallets'

export default (props)=> {

  const QRCodeElement = React.useRef()
  const [ showConnectExtensionButton, setShowConnectExtensionButton ] = useState(false)
  const [ extensionIsAvailable, setExtensionIsAvailable ] = useState(false)
  const [ showConnectExtensionWarning, setShowConnectExtensionWarning ] = useState(false)
  const [ linkURI, setLinkURI ] = useState()
  const [ showQRCode, setShowQRCode ] = useState(false)
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

  const connectExtension = ()=>{
    let extensionIsAvailable = false
    setShowConnectExtensionWarning(false)

    if(props.wallet.extension) {
      const wallet = wallets[props.wallet.extension]
      if(wallet.isAvailable()) {
        extensionIsAvailable = true
        ;(new wallet().connect()).then((account)=>{
          console.log('CONNECTED', account)
        }).catch((error)=>{
          if(error?.code == -32002) { // Request of type 'wallet_requestPermissions' already pending...
            setShowConnectExtensionWarning(true)
          }
        })
      }
    }
    setExtensionIsAvailable(extensionIsAvailable)
  }

  const connectMobileApp = async()=>{
    console.log('connectMobileApp')
    if(!props.wallet?.mobile) { return }
    let wallet = new wallets[props.wallet.link]();
    wallet().connect()
    debugger
    // ({ connect: ({ uri })=>{
    //   let href = safeAppUrl(props.wallet?.mobile?.native)
    //   href = `${href}wc?uri=${encodeURIComponent(uri)}`
    //   console.log('OPEN HREF 3', href)
    //   window.open(href, '_self', 'noreferrer noopener')
    // }})
    console.log('CONNECTED', account)
  }

  const connectDesktopApp = ()=>{
    if(!props.wallet?.desktop) { return }
  }

  const connect = ()=>{
    console.log('CONNECT!')
    connectExtension()
    if(isMobile()) {
      connectMobileApp()
    } else {
      connectDesktopApp()
    }
  }

  useEffect(()=>{ connect() }, [])

  useEffect(()=> {
    let timeout = setTimeout(()=>{
      if(extensionIsAvailable) {
        setShowConnectExtensionButton(true)
      }
    }, 8000)
    return ()=>clearTimeout(timeout)
  }, [extensionIsAvailable])

  useEffect(()=> {
    setShowQRCode(!extensionIsAvailable && !isMobile())
  }, [extensionIsAvailable])

  useEffect(()=> {
    if(showQRCode && props.wallet.link) {
      const wallet = wallets[props.wallet.link]
      switch (props.wallet.link) {
        case 'WalletConnectV1':
          if(QRCode == undefined) {
            console.log('CONNECT WALLETCONNECTV1')
            ;(new wallet()).connect({ connect: ({ uri })=>{
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
            }}).then((account)=>{
              console.log('CONNECTED ACCOUNT', account)
            })
          }
        break;
        case 'WalletLink':
          ;(new wallet()).connect().then(props.resolve)
        break
        case 'WalletConnectV2':
          navigate('SelectBlockchain')
        break
      }
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
            
            { showConnectExtensionWarning &&
              <div className="PaddingBottomS PaddingLeftS PaddingRightS">
                <div className="Alert">
                  <span className="FontWeightBold PaddingBottomXS">
                    You wallet extension window is already asking to connect. It might be hidden.
                  </span>
                </div>
              </div>
            }
          </div>

          <div ref={ QRCodeElement } className="QRCode"/>

          <div className="PaddingLeftL PaddingRightL">
            { props.wallet.link && !showQRCode &&
              <div className="PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
                <button onClick={ ()=>setShowQRCode(true) } className="Card small center PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS TextCenter">
                  <span className="PaddingTopXS PaddingRightXS">
                    <img className="transparent " title="Scan QR code to connect a mobile wallet" style={{ height: '26px' }} src={ QRCode }/>
                  </span>
                  <div className="PaddingLeftS LineHeightXS">
                    <div className="CardText FontWeightMedium">
                      Scan QR Code
                    </div>
                  </div>
                </button>
              </div>
            }
          </div>

        </div>
      }
      footer={
        showConnectExtensionButton &&
          <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
            <button className='ButtonPrimary' onClick={ connect }>
              Connect
            </button>
          </div>
      }
    />
  )
}
