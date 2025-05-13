import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import PaymentProvider from '../providers/PaymentProvider'
import PaymentRoutingProvider from '../providers/PaymentRoutingProvider'
import PaymentValueProvider from '../providers/PaymentValueProvider'
import React, { useContext, useState, useEffect } from 'react'
import SaleRoutingContext from '../contexts/SaleRoutingContext'
import ToTokenProvider from '../providers/ToTokenProvider'
import WalletContext from '../contexts/WalletContext'

export default (props)=>{
  const { acceptWithAmount } = useContext(ChangableAmountContext)
  const { sell } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)
  const [ acceptWithAmountAndReceiver, setAcceptWithAmountAndReceiver ] = useState(acceptWithAmount ? acceptWithAmount.map((accept)=>({ ...accept, receiver: account })) : undefined)

  useEffect(()=>{
    if(acceptWithAmount) {
      setAcceptWithAmountAndReceiver(acceptWithAmount.map((accept)=>({ ...accept, receiver: account })))
    } else {
      setAcceptWithAmountAndReceiver()
    }
  }, [acceptWithAmount])

  return(
    <SaleRoutingContext.Provider value={{}}>
      <PaymentRoutingProvider accept={ acceptWithAmountAndReceiver } >
        <PaymentProvider container={ props.container } document={ props.document } >
          <PaymentValueProvider>
            <ToTokenProvider>
              { props.children }
            </ToTokenProvider>
          </PaymentValueProvider>
        </PaymentProvider>
      </PaymentRoutingProvider>
    </SaleRoutingContext.Provider>
  )
}
