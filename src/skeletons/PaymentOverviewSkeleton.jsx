import Dialog from '../components/Dialog'
import React from 'react'

export default (props)=>{

  return(
    <Dialog
      header={
        <h1 className="HeaderTitle">Payment</h1>
      }
      body={
        <div>
          <div className="Card Skeleton">
            <div className="SkeletonBackground"/>
          </div>
        </div>
      }
      footer={
        <div>
          <div className="ButtonPrimary Skeleton">
            <div className="SkeletonBackground"/>
          </div>
        </div>
      }
    />
  )
}
