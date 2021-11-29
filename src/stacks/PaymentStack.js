import ChangeAmountDialog from '../dialogs/ChangeAmountDialog'
import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import PaymentErrorDialog from '../dialogs/PaymentErrorDialog'
import PaymentOverviewDialog from '../dialogs/PaymentOverviewDialog'
import React, { useContext } from 'react'
import WrongNetworkDialog from '../dialogs/WrongNetworkDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

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
        ChangeAmount: <ChangeAmountDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        PaymentError: <PaymentErrorDialog/>,
        WrongNetwork: <WrongNetworkDialog/>,
      }}
    />
  )
}

