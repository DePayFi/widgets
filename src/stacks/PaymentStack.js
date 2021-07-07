import PaymentOverviewDialog from '../dialogs/Payment/PaymentOverviewDialog'
import React from 'react'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{
  console.log('PaymentStack props.document', props.document)
  return(
    <ReactDialogStack
      open={ true }
      close={()=>{}}
      start='PaymentOverview'
      document={ props.document }
      dialogs={{
        PaymentOverview: <PaymentOverviewDialog/>
      }}
    />
  )
}
