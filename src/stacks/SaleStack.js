import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ChangePurchaseDialog from '../dialogs/ChangePurchaseDialog'
import ClosableContext from '../contexts/ClosableContext'
import NoPaymentMethodFoundDialog from '../dialogs/NoPaymentMethodFoundDialog'
import PaymentErrorDialog from '../dialogs/PaymentErrorDialog'
import React, { useContext } from 'react'
import SaleOverviewDialog from '../dialogs/SaleOverviewDialog'
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
        ChangePurchase: <ChangePurchaseDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        NoPaymentMethodFound: <NoPaymentMethodFoundDialog/>,
        PaymentError: <PaymentErrorDialog/>,
      }}
    />
  )
}

