import Dialog from '../components/Dialog'
import QuestionsGraphic from '../graphics/questions'
import React, { useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
        </div>
      }
      body={
        <div className="TextCenter">
          <div className="GraphicWrapper">
            <img className="Graphic" src={ QuestionsGraphic }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Wallet Misses Blockchain Support</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
            <strong className="FontSizeM">
              The connected wallet does not support the blockchains required by this payment. Try to connect another wallet that does support one of the available blockchains.
            </strong>
          </div>
          <div className="PaddingBottomM">
            <button onClick={()=>navigate('PaymentBlockchains')} className="Link FontSizeM" title="Check which blockchains are available">
              Check available blockchains
            </button>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={ ()=>props.disconnect() }>
            Connect another wallet
          </button>
        </div>
      }
    />
  )
}
