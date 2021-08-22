import ChangePaymentDialog from '../dialogs/Payment/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import NoPaymentMethodFoundDialog from '../dialogs/Payment/NoPaymentMethodFoundDialog'
import PaymentOverviewDialog from '../dialogs/Payment/PaymentOverviewDialog'
import React, { useContext } from 'react'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='PaymentOverview'
      container={ props.container }
      document={ props.document }
      dialogs={{
        PaymentOverview: <PaymentOverviewDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        NoPaymentMethodFound: <NoPaymentMethodFoundDialog/>,
      }}
    />
  )
}

