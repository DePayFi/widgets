import ChangeAmountDialog from '../dialogs/ChangeAmountDialog'
import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import DonationOverviewDialog from '../dialogs/DonationOverviewDialog'
import DonationRoutingContext from '../contexts/DonationRoutingContext'
import PaymentErrorDialog from '../dialogs/PaymentErrorDialog'
import React, { useContext } from 'react'
import WrongNetworkDialog from '../dialogs/WrongNetworkDialog'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { amount, setAmount, maxAmount } = useContext(DonationRoutingContext)

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='DonationOverview'
      container={ props.container }
      document={ props.document }
      dialogs={{
        DonationOverview: <DonationOverviewDialog/>,
        ChangeAmount: <ChangeAmountDialog
          amount={ amount }
          setAmount={ setAmount }
          maxAmount={ maxAmount }
        />,
        ChangePayment: <ChangePaymentDialog/>,
        PaymentError: <PaymentErrorDialog/>,
        WrongNetwork: <WrongNetworkDialog/>,
      }}
    />
  )
}

