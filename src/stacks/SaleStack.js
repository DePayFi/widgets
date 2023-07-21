import ChangeAmountDialog from '../dialogs/ChangeAmountDialog'
import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import NavigateContext from '../contexts/NavigateContext'
import NoPaymentOptionFoundDialog from '../dialogs/NoPaymentOptionFoundDialog'
import PaymentFailedDialog from '../dialogs/PaymentFailedDialog'
import PaymentOptionsDialog from '../dialogs/PaymentOptionsDialog'
import React, { useContext } from 'react'
import SaleOverviewDialog from '../dialogs/SaleOverviewDialog'
import SaleRoutingContext from '../contexts/SaleRoutingContext'
import WrongNetworkDialog from '../dialogs/WrongNetworkDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { setNavigator } = useContext(NavigateContext)

  return(
    <ReactDialogStack
      setNavigator={ setNavigator }
      open={ open }
      close={ close }
      start='SaleOverview'
      container={ props.container }
      document={ props.document }
      stacked={true}
      dialogs={{
        SaleOverview: <SaleOverviewDialog/>,
        ChangeAmount: <ChangeAmountDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        NoPaymentOptionFound: <NoPaymentOptionFoundDialog/>,
        PaymentOptions: <PaymentOptionsDialog/>,
        PaymentFailed: <PaymentFailedDialog/>,
        WrongNetwork: <WrongNetworkDialog/>,
      }}
    />
  )
}

