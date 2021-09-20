import Dialog from '../components/Dialog'
import React from 'react'

export default (props)=>{

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="FontSizeL TextLeft">Donation</h1>
        </div>
      }
      body={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS">
          <div className="Card Skeleton">
            <div className="SkeletonBackground"/>
          </div>
          <div className="Card Skeleton" style={{ height: '100px' }}>
            <div className="SkeletonBackground"/>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM">
          <div className="SkeletonWrapper">
            <div className="ButtonPrimary Skeleton">
              <div className="SkeletonBackground"/>
            </div>
          </div>
        </div>
      }
    />
  )
}
