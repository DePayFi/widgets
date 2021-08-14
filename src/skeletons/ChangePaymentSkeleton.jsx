import Dialog from '../components/Dialog'
import React, { useContext } from 'react'
import ToTokenContext from '../contexts/ToTokenContext'

export default (props)=>{

  const { localValue } = useContext(ToTokenContext)

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="FontSizeL TextCenter">Change Payment</h1>
          <div className="FontSizeL TextCenter FontWeightBold"><strong>{ localValue.toString() }</strong></div>
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
            <div className="Card Skeleton">
              <div className="SkeletonBackground"/>
            </div>
          </div>
        </div>
      }
    />
  )
}
