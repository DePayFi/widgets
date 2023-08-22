import ClosableContext from '../contexts/ClosableContext'
import Dialog from '../components/Dialog'
import QuestionsGraphic from '../graphics/questions'
import React, { useContext } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default ()=> {

  const { navigate } = useContext(NavigateStackContext)
  const { close } = useContext(ClosableContext)

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
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">No Payment Option Found</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
            <strong className="FontSizeM">
              Please check if you have connected the correct wallet and top up if necessary.
            </strong>
          </div>
          <div className="PaddingBottomM">
            <button onClick={()=>navigate('PaymentOptions')} className="Link FontSizeM" title="Check which payment options are available">
              Check available payment options
            </button>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={ close }>
            Ok
          </button>
        </div>
      }
    />
  )
}
