import Blockchains from '@depay/web3-blockchains'
import ConnectGraphic from '../graphics/connect'
import Dialog from '../components/Dialog'
import PaymentContext from '../contexts/PaymentContext'
import React, { useState, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const { payment } = useContext(PaymentContext)
  const { wallet } = useContext(WalletContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ attemptedNetworkSwitch, setAttemptedNetworkSwitch ] = useState(false)
  const blockchain = Blockchains.findByName(payment.route.blockchain)

  const switchNetwork = ()=> {
    wallet.switchTo(payment.blockchain)
    navigate('back')
  }

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="LineHeightL FontSizeL">Wrong Network</h1>
        </div>
      }
      body={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS TextCenter">
          <div className="GraphicWrapper">
            <img className="Graphic" src={ blockchain.logo }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Connect to { blockchain.label }</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <strong className="FontSizeM">
              Please make sure you connect your wallet to the correct network before you try again!
            </strong>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button type="button" className="ButtonPrimary" onClick={ switchNetwork }>
            Switch Network
          </button>
        </div>
      }
    />
  )
}
