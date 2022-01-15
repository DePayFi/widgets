import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import NoPaymentMethodFoundDialog from '../dialogs/NoPaymentMethodFoundDialog'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useContext, useEffect, useState } from 'react'
import TrackingContext from '../contexts/TrackingContext'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { ReactDialogStack } from '@depay/react-dialog-stack'
import { request } from '@depay/web3-client'

export default (props)=>{
  const { setError } = useContext(ErrorContext)
  const { sent, confirmed, failed } = useContext(ConfigurationContext)
  const { selectedRoute } = useContext(PaymentRoutingContext)
  const { open, close, setClosable } = useContext(ClosableContext)
  const { allRoutes } = useContext(PaymentRoutingContext)
  const { setUpdatable } = useContext(UpdatableContext)
  const { wallet } = useContext(WalletContext)
  const { forward, tracking, initializeTracking } = useContext(TrackingContext)
  const [ payment, setPayment ] = useState()
  const [ transaction, setTransaction ] = useState()
  const [ approvalTransaction, setApprovalTransaction ] = useState()
  const [ paymentState, setPaymentState ] = useState('initialized')

  const pay = async ({ navigate })=> {
    setClosable(false)
    setPaymentState('paying')
    setUpdatable(false)
    let currentBlock = await request({ blockchain: payment.route.transaction.blockchain, method: 'latestBlockNumber' })
    wallet.sendTransaction(Object.assign({}, payment.route.transaction, {
      sent: (transaction)=>{
        if(sent) { sent(transaction) }
      },
      confirmed: (transaction)=>{
        if(tracking != true) { setClosable(true) }
        setPaymentState('confirmed')
        if(confirmed) { confirmed(transaction) }
      },
      failed: (transaction, error)=> {
        if(failed) { failed(transaction, error) }
        setPaymentState('initialized')
        setClosable(true)
        setUpdatable(true)
        navigate('PaymentError')
      }
    }))
      .then((sentTransaction)=>{
        if(tracking){ initializeTracking(sentTransaction, currentBlock, payment.route) }
        setTransaction(sentTransaction)
      })
      .catch((error)=>{
        console.log('error', error)
        setPaymentState('initialized')
        setClosable(true)
        setUpdatable(true)
        if(error?.code == 'WRONG_NETWORK') {
          navigate('WrongNetwork')
        }
      })
  }

  const approve = ()=> {
    setClosable(false)
    setPaymentState('approving')
    wallet.sendTransaction(Object.assign({}, payment.route.approvalTransaction, {
      confirmed: ()=>{
        payment.route.approvalRequired = false
        setPayment(payment)
        setClosable(true)
        setPaymentState('initialized')
      }
    }))
      .then((sentTransaction)=>{
        setApprovalTransaction(sentTransaction)
      })
      .catch((error)=>{
        console.log('error', error)
        setPaymentState('initialized')
        setClosable(true)
      })
  }

  useEffect(()=>{
    if(forward){
      setPaymentState('confirmed')
    }
  }, [forward])

  useEffect(()=>{
    if(selectedRoute) {
      let fromToken = selectedRoute.fromToken
      let transactionParams = selectedRoute.transaction.params
      Promise.all([
        fromToken.name(),
        fromToken.symbol(),
        fromToken.readable(selectedRoute.fromAmount)
      ]).then(([name, symbol, amount])=>{
        setPayment({
          route: selectedRoute,
          token: selectedRoute.fromToken.address,
          name,
          symbol: symbol.toUpperCase(),
          amount
        })
      }).catch(setError)
    } else {
      setPayment(undefined)
    }
  }, [selectedRoute])

  useEffect(()=>{
    if(allRoutes && allRoutes.length == 0) {
      setUpdatable(false)
    } else if(allRoutes && allRoutes.length > 0) {
      setUpdatable(true)
    }
  }, [allRoutes])

  if(allRoutes instanceof Array && allRoutes.length == 0) {
    return(
      <ReactDialogStack
        open={ open }
        close={ close }
        start='NoPaymentMethodFound'
        container={ props.container }
        document={ props.document }
        dialogs={{
          NoPaymentMethodFound: <NoPaymentMethodFoundDialog/>,
        }}
      />
    )
  } else {
    return(
      <PaymentContext.Provider value={{
        payment,
        paymentState,
        pay,
        transaction,
        approve,
        approvalTransaction
      }}>
        { props.children }
      </PaymentContext.Provider>
    )
  }
}
