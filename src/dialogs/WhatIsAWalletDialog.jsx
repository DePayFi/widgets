import React from 'react'
import Dialog from '../components/Dialog'
import QuestionsGraphic from '../graphics/questions'

export default (props)=> {

  return(
    <Dialog
      stacked={ true }
      header={
        <div>
          <div className="PaddingTopS PaddingLeftM PaddingRightM TextCenter">
            <h1 className="LineHeightL FontSizeL">What is a wallet?</h1>
          </div>
        </div>
      }
      body={
        <div className="TextCenter PaddingLeftL PaddingRightL PaddingTopS">

          <div className="GraphicWrapper">
            <img className="Graphic" src={ QuestionsGraphic }/>
          </div>
          
          <p className="FontSizeM PaddingTopS PaddingLeftM PaddingRightM">
            Wallets are used to send, receive, and store digital assets.
            Wallets come in many forms.
            They are either built into your browser, an extension added to your browser, an app on your phone, your computer or even a piece of hardware.
          </p>

          <div className="PaddingTopS">
            <a className="Link FontSizeM" href="https://ethereum.org/wallets/" target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          </div>
        </div>
      }
    />
  )
}
