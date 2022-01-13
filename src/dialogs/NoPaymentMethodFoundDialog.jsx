import ClosableContext from '../contexts/ClosableContext'
import Dialog from '../components/Dialog'
import QuestionsGraphic from '../graphics/questions'
import React, { useContext } from 'react'

export default ()=> {

  const { close } = useContext(ClosableContext)

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
        </div>
      }
      body={
        <div>
          <div className="GraphicWrapper">
            <img className="Graphic" src={ QuestionsGraphic }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Insufficient Balance</h1>
          <div className="Text PaddingTopS PaddingBottomM PaddingLeftM PaddingRightM">
            <strong className="FontSizeM">
              We were not able to find any asset with enough value in your wallet. Please top up your account in order to proceed with this payment.
            </strong>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={close}>
            Ok
          </button>
        </div>
      }
    />
  )
}
