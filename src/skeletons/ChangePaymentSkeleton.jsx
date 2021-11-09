import Dialog from '../components/Dialog'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext } from 'react'

export default (props)=>{

  const { paymentValue } = useContext(PaymentValueContext)

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="LineHeightL FontSizeL TextCenter">Change Payment</h1>
          { paymentValue != undefined &&
            <div className="FontSizeL TextCenter FontWeightBold"><strong>{ paymentValue.toString() }</strong></div>
          }
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS">
          <div className="PaddingLeftM PaddingRightM">
            <div className="Card Skeleton">
              <div className="SkeletonBackground"/>
            </div>
            <div className="Card Skeleton">
              <div className="SkeletonBackground"/>
            </div>
            <div className="Card Skeleton">
              <div className="SkeletonBackground"/>
            </div>
          </div>
        </div>
      }
    />
  )
}
