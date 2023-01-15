import ConnectGraphic from '../graphics/connect'
import Dialog from '../components/Dialog'
import PaymentContext from '../contexts/PaymentContext'
import React, { useContext } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { Blockchain } from '@depay/web3-blockchains'

export default (props)=>{

  const { payment } = useContext(PaymentContext)
  const { navigate } = useContext(NavigateStackContext)
  const blockchain = Blockchain.findByName(payment.route.blockchain)

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
            <img className="Graphic" src={ ConnectGraphic }/>
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
          <button className="ButtonPrimary" onClick={()=>navigate('back')}>
            Try again
          </button>
        </div>
      }
    />
  )
}
