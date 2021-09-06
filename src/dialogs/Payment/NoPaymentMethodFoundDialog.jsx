import Dialog from '../../components/Dialog'
import QuestionsGraphic from '../../graphics/questions'
import React from 'react'

export default ()=> {


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
          <h1 className="Text FontSizeL PaddingTopS FontWeightBold">Insufficient Balance</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <strong className="FontSizeM">
              We were not able to find any asset of value in your wallet. Please top up your account in order to proceed with this payment.
            </strong>
          </div>
        </div>
      }
    />
  )
}
