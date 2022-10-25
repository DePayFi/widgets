import ChangeAmountDialog from '../dialogs/ChangeAmountDialog'
import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import NavigateContext from '../contexts/NavigateContext'
import DonationOverviewDialog from '../dialogs/DonationOverviewDialog'
import PaymentFailedDialog from '../dialogs/PaymentFailedDialog'
import React, { useContext } from 'react'
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
      start='DonationOverview'
      container={ props.container }
      document={ props.document }
      dialogs={{
        DonationOverview: <DonationOverviewDialog/>,
        ChangeAmount: <ChangeAmountDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        PaymentFailed: <PaymentFailedDialog/>,
        WrongNetwork: <WrongNetworkDialog/>,
      }}
    />
  )
}

