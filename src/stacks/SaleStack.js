import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import NoPaymentMethodFoundDialog from '../dialogs/NoPaymentMethodFoundDialog'
import PaymentErrorDialog from '../dialogs/PaymentErrorDialog'
import SaleOverviewDialog from '../dialogs/SaleOverviewDialog'
import React, { useContext } from 'react'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='SaleOverview'
      container={ props.container }
      document={ props.document }
      dialogs={{
        SaleOverview: <SaleOverviewDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        NoPaymentMethodFound: <NoPaymentMethodFoundDialog/>,
        PaymentError: <PaymentErrorDialog/>,
      }}
    />
  )
}

