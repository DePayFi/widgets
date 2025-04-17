import ChangeAmountDialog from '../dialogs/ChangeAmountDialog'
import ChangeApprovalDialog from '../dialogs/ChangeApprovalDialog'
import ChangePaymentDialog from '../dialogs/ChangePaymentDialog'
import ClosableContext from '../contexts/ClosableContext'
import NavigateContext from '../contexts/NavigateContext'
import PaymentFailedDialog from '../dialogs/PaymentFailedDialog'
import PaymentOverviewDialog from '../dialogs/PaymentOverviewDialog'
import React, { useContext, useEffect, useState } from 'react'
import TracingFailedDialog from '../dialogs/TracingFailedDialog'
import TrackingFailedDialog from '../dialogs/TrackingFailedDialog'
import WalletContext from '../contexts/WalletContext'
import WrongNetworkDialog from '../dialogs/WrongNetworkDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { setNavigator } = useContext(NavigateContext)
  const { account } = useContext(WalletContext)
  const [ navigator, setLocalNavigator ] = useState()

  useEffect(() => {
    if(navigator) {
      navigator.set(['PaymentOverview'])
    }
  }, [account])

  return(
    <ReactDialogStack
      setNavigator={(navigator)=>{
        setLocalNavigator(navigator)
        setNavigator(navigator)
      }}
      open={ open }
      close={ close }
      start='PaymentOverview'
      container={ props.container }
      document={ props.document }
      stacked={true}
      dialogs={{
        PaymentOverview: <PaymentOverviewDialog/>,
        ChangeAmount: <ChangeAmountDialog/>,
        ChangeApproval: <ChangeApprovalDialog/>,
        ChangePayment: <ChangePaymentDialog/>,
        PaymentFailed: <PaymentFailedDialog/>,
        WrongNetwork: <WrongNetworkDialog/>,
        TrackingFailed: <TrackingFailedDialog/>,
        TracingFailed: <TracingFailedDialog/>,
      }}
    />
  )
}

