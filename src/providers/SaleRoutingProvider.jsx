import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import PaymentProvider from '../providers/PaymentProvider'
import PaymentRoutingProvider from '../providers/PaymentRoutingProvider'
import PaymentValueProvider from '../providers/PaymentValueProvider'
import React, { useContext } from 'react'
import SaleRoutingContext from '../contexts/SaleRoutingContext'
import ToTokenProvider from '../providers/ToTokenProvider'

export default (props)=>{
  const { acceptWithAmount, setMaxRoute } = useContext(ChangableAmountContext)
  const { blacklist } = useContext(ConfigurationContext)

  return(
    <SaleRoutingContext.Provider value={{}}>
      <PaymentRoutingProvider accept={ acceptWithAmount } blacklist={ blacklist } setMaxRoute={ setMaxRoute }>
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
