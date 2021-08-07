import Dialog from '../components/Dialog'
import React from 'react'

export default (props)=>{

  return(
    <Dialog
      header={
        <h1 className="HeaderTitle">Payment</h1>
      }
      body={
        <div className="Card Skeleton">
          <div className="SkeletonBackground"/>
        </div>
      }
      footer={
        <div className="SkeletonWrapper">
          <div className="ButtonPrimary Skeleton">
            <div className="SkeletonBackground"/>
          </div>
        </div>
      }
    />
  )
}
