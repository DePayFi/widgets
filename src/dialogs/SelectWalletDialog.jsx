import allWallets from '../helpers/allWallets'
import Dialog from '../components/Dialog'
import QRCode from '../graphics/qrcode'
import React, { useState, useEffect, useContext, useRef } from 'react'
import SelectWalletList from '../components/SelectWalletList'
import { getWallets, getConnectedWallets } from '@depay/web3-wallets'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const [ showExplanation, setShowExplanation ] = useState(false)
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ dialogAnimationFinished, setDialogAnimationFinished ] = useState(false)
  const searchElement = useRef()
  const { navigate } = useContext(NavigateStackContext)

  let prioritizedWallets = getWallets().map((wallet, index)=>{
    if(wallet.name == 'Phantom') { return }
    return(
      <div key={index} className="PaddingBottomXS">
        <button
          className="Card small"
          title={`Connect ${wallet.name}`}
          onClick={()=>{
            props.selected(allWallets.find((availableWallet)=>availableWallet.extension == wallet.constructor.name))
            navigate('ConnectWallet')
          }}
        >
          <div className="CardImage">
            <img className="transparent" src={wallet.logo} className="WalletLogoS"/>
          </div>
          <div className="CardBody">
            <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
              <div className="CardText FontWeightBold">
                { wallet.name }
              </div>
              <div className="Opacity05">
                <span style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Detected
              </div>
            </div>
          </div>
        </button>
      </div>
    )
  }).filter((wallet)=>!!wallet)

  useEffect(()=>{
    setTimeout(()=>{
      setDialogAnimationFinished(true)
      searchElement.current.click()
      searchElement.current.focus()
    }, 200)
  }, [])

  return(
    <Dialog
      header={
        <div>
          <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
            <h1 className="LineHeightL FontSizeL">Connect a wallet</h1>
          </div>
          { prioritizedWallets &&
            <div className="PaddingBottomXS PaddingLeftS PaddingRightS PaddingTopS">
              { prioritizedWallets }
            </div>
          }
          <div className="PaddingBottomXS PaddingLeftS PaddingRightS PaddingTopXS">
            <div className="PaddingBottomXS Row">
              <div className="Column Column10">
                <input className="Search" value={ searchTerm } onChange={ (event)=>{ setSearchTerm(event.target.value) } } placeholder="Search by name" ref={ searchElement }/>
              </div>
              <div className="Column Column2 TextCenter PaddingLeftXS">
                <button onClick={()=>{
                  props.selected({ name: "Mobile Wallet", "via": [ "WalletConnectV2" ], "logo": QRCode })
                  navigate('ConnectWallet')
                }} className="Card small center PaddingTopXS PaddingRightXS PaddingBottomXS PaddingLeftXS">
                  <img className="transparent" title="Scan QR code to connect mobile wallet" style={{ height: '34px' }} src={ QRCode }/>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      body={
        <div className="ScrollHeightM PaddingTopXS">
          { dialogAnimationFinished &&
            <SelectWalletList selected={ props.selected } searchTerm={ searchTerm }/>
          }
        </div>
      }
      footer={
        <div className="PaddingBottomS PaddingTopS">
          <button className="FontSizeS FontWeightBold TextButton" onClick={()=>setShowExplanation(!showExplanation)}>
            <strong className="Opacity05">What is a wallet?</strong>
          </button>
          {showExplanation &&
            <p className="PaddingLeftM PaddingRightM">
              Wallets are used to send, receive, and store digital assets. Wallets come in many forms. They are either built into your browser, an extension added to your browser, a piece of hardware plugged into your computer or even an app on your phone.
            </p>
          }
        </div>
      }
    />
  )
}
