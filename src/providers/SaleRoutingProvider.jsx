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
  const { acceptWithAmount, setMaxRoute } = useContext(ChangableAmountContext)
  const { sell } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)
  let { blacklist } = useContext(ConfigurationContext)
  const [ acceptWithAmountAndReceiver, setAcceptWithAmountAndReceiver ] = useState(acceptWithAmount ? acceptWithAmount.map((accept)=>({ ...accept, receiver: account })) : undefined)

  if(blacklist == undefined) { blacklist = {} }
  for(let blockchain in sell) {
    let token = sell[blockchain]
    if(blacklist[blockchain] instanceof Array) {
      blacklist[blockchain].push(token)
    } else {
      blacklist[blockchain] = [token]
    }
  }

  useEffect(()=>{
    if(acceptWithAmount) {
      setAcceptWithAmountAndReceiver(acceptWithAmount.map((accept)=>({ ...accept, receiver: account })))
    } else {
      setAcceptWithAmountAndReceiver()
    }
  }, [acceptWithAmount])

  return(
    <SaleRoutingContext.Provider value={{}}>
      <PaymentRoutingProvider accept={ acceptWithAmountAndReceiver } setMaxRoute={ setMaxRoute }>
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
