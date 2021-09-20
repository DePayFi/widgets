import ChangeAmountDialog from '../dialogs/ChangeAmountDialog'
import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import DonationOverviewDialog from '../dialogs/DonationOverviewDialog'
import DonationRoutingContext from '../contexts/DonationRoutingContext'
import NoPaymentMethodFoundDialog from '../dialogs/NoPaymentMethodFoundDialog'
import PaymentErrorDialog from '../dialogs/PaymentErrorDialog'
import React, { useContext } from 'react'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { donatedToken, donatedAmount, setDonatedAmount } = useContext(DonationRoutingContext)

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
          token={ donatedToken }
          amount={ donatedAmount }
          setAmount= { setDonatedAmount }
        />,
        ChangePayment: <ChangePaymentDialog/>,
        NoPaymentMethodFound: <NoPaymentMethodFoundDialog/>,
        PaymentError: <PaymentErrorDialog/>,
      }}
    />
  )
}

