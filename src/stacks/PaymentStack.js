import PaymentOverviewDialog from '../dialogs/Payment/PaymentOverviewDialog'
import React from 'react'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{
  return(
    <ReactDialogStack
      open={ true }
      close={()=>{}}
      start='PaymentOverview'
      container={ props.container }
      document={ props.document }
      dialogs={{
        PaymentOverview: <PaymentOverviewDialog/>
      }}
    />
  )
}
