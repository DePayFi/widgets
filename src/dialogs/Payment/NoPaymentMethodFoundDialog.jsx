import Dialog from '../../components/Dialog'
import QuestionsGraphic from '../../graphics/questions'
import React from 'react'

export default ()=> {


  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="FontSizeL TextLeft">Insufficient Balance</h1>
        </div>
      }
      body={
        <div>
          <div className="GraphicWrapper">
            <img className="Graphic" src={ QuestionsGraphic }/>
          </div>
          <div className="PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
            <strong>
              We were unable to find a convertable asset in order to perform this payment.

              Please top up your account in order to proceed.
            </strong>
          </div>
        </div>
      }
    />
  )
}
