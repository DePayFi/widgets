import ClosableProvider from '../providers/ClosableProvider'
import ConfigurationProvider from '../providers/ConfigurationProvider'
import LoadingProvider from '../providers/LoadingProvider'
import PaymentOverviewDialog from '../dialogs/Payment/PaymentOverviewDialog'
import React, { useState } from 'react'
import RoutingProvider from '../providers/RoutingProvider'
import WalletProvider from '../providers/WalletProvider'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{

  const [open, setOpen] = useState(true)

  let close = ()=>{
    setOpen(false)
    setTimeout(props.unmount, 300)
  }

  return(
    <LoadingProvider>
      <ClosableProvider>
        <ConfigurationProvider configuration={ props.configuration }>
          <WalletProvider>
            <RoutingProvider>
              <ReactDialogStack
                open={ open }
                close={ close }
                start='PaymentOverview'
                container={ props.container }
                document={ props.document }
                dialogs={{
                  PaymentOverview: <PaymentOverviewDialog/>
                }}
              />
            </RoutingProvider>
          </WalletProvider>
        </ConfigurationProvider>
      </ClosableProvider>
    </LoadingProvider>
  )
}

