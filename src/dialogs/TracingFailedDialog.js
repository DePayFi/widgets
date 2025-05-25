import Dialog from '../components/Dialog'
import ErrorGraphic from '../graphics/wallets/error'
import React, { useContext } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)

  const tryAgain = ()=>{
    if(props.tryAgain){
      props.tryAgain()
    } else {
      navigate('back')
    }
  }

  return(
    <Dialog
      stacked={ false }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div className="PaddingRightM">
            <button onClick={()=>{ window.open(`mailto:support@depay.com?subject=Tracing Failed Error`, '_blank') }} type="button" className="Card secondary small inlineBlock">
              Contact support
            </button>
          </div>
        </div>
      }
      body={
        <div className="TextCenter">
          <div className="GraphicWrapper">
            <ErrorGraphic/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Tracking payment failed</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <strong className="FontSizeM">
              Please ensure you are connected to the internet, then click "Try again".
            </strong>
            <div className="PaddingTopS">
              <span>If this keeps happening, please report it.</span>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className='ButtonPrimary' onClick={tryAgain}>
            Try again
          </button>
        </div>
      }
    />
  )
}
