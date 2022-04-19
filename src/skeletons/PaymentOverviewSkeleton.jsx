import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import Dialog from '../components/Dialog'
import React, { useContext } from 'react'

export default (props)=>{
  const { amountsMissing } = useContext(ChangableAmountContext)
  const { slowRouting, selectedRoute } = useContext(PaymentRoutingContext)

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <h1 className="LineHeightL FontSizeL">Payment</h1>
        </div>
      }
      body={
        <div className="PaddingLeftM PaddingRightM PaddingBottomXS">
          { amountsMissing &&
            <div className="Card Skeleton">
              <div className="SkeletonBackground"/>
            </div>
          }
          <div className="Card Skeleton">
            <div className="SkeletonBackground"/>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <div className="SkeletonWrapper">
            <div className="ButtonPrimary Skeleton">
              <div className="SkeletonBackground"/>
            </div>
          </div>
          { selectedRoute == undefined && slowRouting &&
            <div className="TextCenter Opacity05 PaddingTopS">
              <strong>Still loading your wallet balances...</strong>
            </div>
          }
        </div>
      }
    />
  )
}
