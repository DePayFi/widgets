import Dialog from '../components/Dialog'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useContext, useEffect, useState } from 'react'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{

  const { navigate } = useContext(NavigateStackContext)

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="FontSizeL TextCenter">Change Purchase</h1>
          <div className="FontSizeL TextCenter FontWeightBold"><strong>TOKEN SYMBOL HERE</strong></div>
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS">
          <div className="PaddingLeftM PaddingRightM">
            SOMETHING?
          </div>
        </div>
      }
      footer={
        <div></div>
      }
    />
  )
}
