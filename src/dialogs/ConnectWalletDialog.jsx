import Dialog from '../components/Dialog'
import isMobile from '../helpers/isMobile'
import QRCode from '../graphics/qrcode'
import React, { useState, useContext, useEffect } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { wallets } from '@depay/web3-wallets'

export default (props)=> {

  const [ showConnectExtensionButton, setShowConnectExtensionButton ] = useState(false)
  const [ walletIsAvailable, setWalletIsAvailable ] = useState(false)
  const [ showConnectExtensionWarning, setShowConnectExtensionWarning ] = useState(false)
  const [ linkURI, setLinkURI ] = useState()
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

  const connect = async()=>{

    if(props.wallet.extension) {
      const wallet = wallets[props.wallet.extension]
      setWalletIsAvailable(false)
      console.log()
      if(wallet.isAvailable()) {
        setWalletIsAvailable(true)
        setShowConnectExtensionWarning(false)
        ;(new wallet().connect()).catch((error)=>{
          if(error?.code == -32002) { // Request of type 'wallet_requestPermissions' already pending...
            setShowConnectExtensionWarning(true)
          }
        })
      }
    }

    if(isMobile()) {
      console.log('MOBILE')
    } else {

      if(props.wallet.link) {
        console.log('props.wallet.link', props.wallet.link)
        const wallet = wallets[props.wallet.link]
        console.log('wallet', wallet)
      }

      if(props.wallet.desktop) {

      } else {
        
      }
    }
  }

  useEffect(()=> {
    let timeout = setTimeout(()=>{
      if(walletIsAvailable) {
        setShowConnectExtensionButton(true)
      }
    }, 8000)
    return ()=>clearTimeout(timeout)
  }, [walletIsAvailable])

  useEffect(()=>{ connect() }, [])
  
  return(
    <Dialog
      stacked={ true }
      header={ header }
      body={
        <div className="TextCenter PaddingLeftL PaddingRightL">
          <h1 className="LineHeightL Text FontSizeL FontWeightBold">Connect { props.wallet.name }</h1>
          
          <div className="Text PaddingTopXS PaddingBottomS PaddingLeftS PaddingRightS">
            <p className="FontSizeM">
              Access to your wallet is required. Please connect your account.
            </p>
          </div>

          { showConnectExtensionWarning &&
            
          }

          { props.wallet.link &&
            <div className="PaddingTopXS PaddingLeftS PaddingRightS">
              <button onClick={()=>{}} className="Card small center PaddingTopXS PaddingRightXS PaddingBottomXS PaddingLeftXS TextCenter">
                <img className="transparent " title="Scan QR code to connect mobile wallet" style={{ height: '26px' }} src={ QRCode }/>
                <div className="PaddingLeftS LineHeightXS">
                  <div className="CardText FontWeightBold">
                    Scan QR Code
                  </div>
                </div>
              </button>
            </div>
          }

          <div className="PaddingTopS PaddingBottomS">
            <button onClick={()=>navigate('back')} className="TextButton">Connect with another wallet</button>
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
