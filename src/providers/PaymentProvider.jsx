import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import NavigateContext from '../contexts/NavigateContext'
import NoPaymentMethodFoundDialog from '../dialogs/NoPaymentMethodFoundDialog'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useContext, useEffect, useState } from 'react'
import TransactionTrackingContext from '../contexts/TransactionTrackingContext'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { Blockchain } from '@depay/web3-blockchains'
import { ReactDialogStack } from '@depay/react-dialog-stack'
import { request } from '@depay/web3-client'
import { Token } from '@depay/web3-tokens'

export default (props)=>{
  const { setError } = useContext(ErrorContext)
  const { sent, confirmed, failed, recover } = useContext(ConfigurationContext)
  const { selectedRoute, getPaymentRoutes } = useContext(PaymentRoutingContext)
  const { open, close, setClosable } = useContext(ClosableContext)
  const { allRoutes } = useContext(PaymentRoutingContext)
  const { setUpdatable } = useContext(UpdatableContext)
  const { navigate } = useContext(NavigateContext)
  const { wallet } = useContext(WalletContext)
  const { release, tracking, initializeTracking } = useContext(PaymentTrackingContext)
  const { foundTransaction, initializeTracking: initializeTransactionTracking } = useContext(TransactionTrackingContext)
  const [ payment, setPayment ] = useState()
  const [ transaction, setTransaction ] = useState()
  const [ approvalTransaction, setApprovalTransaction ] = useState()
  const [ paymentState, setPaymentState ] = useState('initialized')

  const paymentConfirmed = (transaction)=>{
    if(tracking != true) { setClosable(true) }
    setPaymentState('confirmed')
    if(confirmed) { confirmed(transaction) }
  }

  const paymentFailed = (transaction, error)=> {
    if(failed) { failed(transaction, error) }
    setPaymentState('initialized')
    setPayment(null)
    setClosable(true)
    setUpdatable(true)
    getPaymentRoutes({})
    navigate('PaymentError')
  }

  const pay = async ()=> {
    setClosable(false)
    setPaymentState('paying')
    setUpdatable(false)
    let currentBlock = await request({ blockchain: payment.route.transaction.blockchain, method: 'latestBlockNumber' })
    wallet.sendTransaction(Object.assign({}, payment.route.transaction, {
      sent: (transaction)=>{
        initializeTransactionTracking(transaction, currentBlock)
        if(sent) { sent(transaction) }
      },
      confirmed: paymentConfirmed,
      failed: paymentFailed
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
    if(release){
      setPaymentState('confirmed')
    }
  }, [release])

  useEffect(()=>{
    if(recover){
      setClosable(false)
      setUpdatable(false)
      setPaymentState('paying')
      setTransaction({
        blockchain: recover.blockchain,
        id: recover.transaction,
        url: Blockchain.findByName(recover.blockchain).explorerUrlFor({ transaction: {id: recover.transaction } })
      })
      let paymentToken = new Token({ blockchain: recover.blockchain, address: recover.token })
      Promise.all([
        paymentToken.name(),
        paymentToken.symbol()
      ]).then(([name, symbol])=>{
        setPayment({
          blockchain: recover.blockchain,
          token: recover.token,
          name,
          symbol: symbol.toUpperCase(),
          amount: recover.amount
        })
      }).catch(setError)
    }
  }, [recover])

  useEffect(()=>{
    if(foundTransaction && foundTransaction.id && foundTransaction.status) {
      let newTransaction
      if(foundTransaction.id.toLowerCase() != transaction.id.toLowerCase()) {
        newTransaction = Object.assign({}, transaction, { 
          id: foundTransaction.id,
          url: Blockchain.findByName(transaction.blockchain).explorerUrlFor({ transaction: foundTransaction })
        })
        setTransaction(newTransaction)
      }
      if(foundTransaction.status == 'success') {
        paymentConfirmed(newTransaction || transaction)
      } else if(foundTransaction.status == 'failed'){
        paymentFailed(newTransaction || transaction)
      }
    }
  }, [foundTransaction, transaction])

  useEffect(()=>{
    if(selectedRoute) {
      let fromToken = selectedRoute.fromToken
      Promise.all([
        fromToken.name(),
        fromToken.symbol(),
        fromToken.readable(selectedRoute.fromAmount)
      ]).then(([name, symbol, amount])=>{
        setPayment({
          blockchain: selectedRoute.blockchain,
          route: selectedRoute,
          token: fromToken.address,
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
