import ChangeAmountDialog from '../dialogs/ChangeAmountDialog'
import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import NavigateContext from '../contexts/NavigateContext'
import NoPaymentMethodFoundDialog from '../dialogs/NoPaymentMethodFoundDialog'
import PaymentErrorDialog from '../dialogs/PaymentErrorDialog'
import React, { useContext } from 'react'
import SaleOverviewDialog from '../dialogs/SaleOverviewDialog'
import SaleRoutingContext from '../contexts/SaleRoutingContext'
import WrongNetworkDialog from '../dialogs/WrongNetworkDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { setNavigate } = useContext(NavigateContext)

  return(
    <ReactDialogStack
      setNavigate={ setNavigate }
      open={ open }
      close={ close }
      start='SaleOverview'
      container={ props.container }
      document={ props.document }
      dialogs={{
        SaleOverview: <SaleOverviewDialog/>,
        ChangeAmount: <ChangeAmountDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        NoPaymentMethodFound: <NoPaymentMethodFoundDialog/>,
        PaymentError: <PaymentErrorDialog/>,
        WrongNetwork: <WrongNetworkDialog/>,
      }}
    />
  )
}

