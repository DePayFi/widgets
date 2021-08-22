import Dialog from '../../components/Dialog'
import QuestionsGraphic from '../../graphics/questions'
import React from 'react'

export default ()=> {


  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="FontSizeL TextLeft">Payment</h1>
        </div>
      }
      body={
        <div>
          <div className="GraphicWrapper">
            <img className="Graphic" src={ QuestionsGraphic }/>
          </div>
          <div>
            <strong className="FontSizeL">No Payment Method Found</strong>
          </div>
        </div>
      }
    />
  )
}
