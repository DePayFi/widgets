import Dialog from '../components/Dialog'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import PaymentContext from '../contexts/PaymentContext'
import React, { useContext, useState } from 'react'

export default (props)=>{

  const { approvalType, setApprovalType, approvalAmount, setApprovalAmount } = useContext(PaymentContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ dialogType, setDialogType ] = useState(approvalType)
  const [ dialogAmount, setDialogAmount ] = useState(approvalAmount)

  const saveAndGoBack = ()=>{
    setApprovalType(dialogType)
    setApprovalAmount(dialogAmount)
    navigate('back')
  }

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="LineHeightL FontSizeL TextCenter">Change Approval</h1>
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS PaddingLeftM PaddingRightM">

          <div className="PaddingTopXS PaddingLeftS PaddingBottomS">

            <h3 className="fontSizeM PaddingBottomXS MarginBottomXS">Type</h3>
            
            <label className="Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS">
              <input type="radio" name="approvalType" value="transaction" checked={dialogType === 'transaction'} onChange={(event)=>setDialogType(event.target.value)}/>
              <span> Transaction</span>
            </label>

            <label className="Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS">
              <input type="radio" name="approvalType" value="signature" checked={dialogType === 'signature'} onChange={(event)=>setDialogType(event.target.value)}/>
              <span> Signature</span>
            </label>

          </div>

          { dialogType == 'transaction' &&
            <>
              <hr className="MarginBottomXS"/>

              <div className="PaddingTopS PaddingBottomS PaddingLeftS">

                <h3 className="fontSizeM PaddingBottomXS MarginBottomXS MarginTopXS">Amount</h3>

                <label className="Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS">
                  <input type="radio" name="approvalAmount" value="max" checked={dialogAmount === 'max'} onChange={(event)=>setDialogAmount(event.target.value)}/>
                  <span> Maximum</span>
                </label>

                <label className="Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS">
                  <input type="radio" name="approvalAmount" value="min" checked={dialogAmount === 'min'} onChange={(event)=>setDialogAmount(event.target.value)}/>
                  <span> Minimum</span>
                </label>

              </div>
            </>
          }

        </div>
      }
      footer={
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={saveAndGoBack}>
            Save and return
          </button>
        </div>
      }
    />
  )
}
