/*#if _EVM

import { request } from '@depay/web3-client-evm'
import Token from '@depay/web3-tokens-evm'

/*#elif _SVM

import { request } from '@depay/web3-client-solana'
import Token from '@depay/web3-tokens-solana'

//#else */

import { request } from '@depay/web3-client'
import Token from '@depay/web3-tokens'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import InsufficientAmountOfTokensDialog from '../dialogs/InsufficientAmountOfTokensDialog'
import NavigateContext from '../contexts/NavigateContext'
import NoPaymentOptionFoundDialog from '../dialogs/NoPaymentOptionFoundDialog'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import TransactionTrackingContext from '../contexts/TransactionTrackingContext'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { debounce } from 'lodash'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{
  const { setError } = useContext(ErrorContext)
  const { sent, succeeded, failed, recover, before, accept } = useContext(ConfigurationContext)
  const { allRoutes, allAssets, selectedRoute, refreshPaymentRoutes } = useContext(PaymentRoutingContext)
  const { open, close, setClosable } = useContext(ClosableContext)
  const { setUpdatable } = useContext(UpdatableContext)
  const { navigate, set } = useContext(NavigateContext)
  const { wallet, account } = useContext(WalletContext)
  const { setPayment: setTrackingPayment, release, synchronousTracking, asynchronousTracking, trackingInitialized, initializeTracking: initializePaymentTracking, trace } = useContext(PaymentTrackingContext)
  const { foundTransaction, initializeTracking: initializeTransactionTracking } = useContext(TransactionTrackingContext)
  const [ payment, setPayment ] = useState()
  const [ transaction, setTransaction ] = useState()
  const [ approvalTransaction, setApprovalTransaction ] = useState()
  const [ resetApprovalTransaction, setResetApprovalTransaction ] = useState()
  const [ paymentState, setPaymentState ] = useState('initialized')

  const paymentSucceeded = (transaction, payment)=>{
    if(synchronousTracking == false && (asynchronousTracking == false || trackingInitialized == true)) {
      setClosable(true)
    }
    setPaymentState('success')
    if(succeeded) { setTimeout(()=>succeeded(transaction, payment), 200) }
  }

  const paymentFailed = (transaction, error, payment)=> {
    console.log('error', error?.toString())
    if(asynchronousTracking == false || trackingInitialized == true) {
      setClosable(true)
    }
    set(['PaymentFailed'])
    setPaymentState('failed')
    if(failed) { failed(transaction, error, payment) }
  }

  const pay = async ()=> {
    setPaymentState('paying')
    setUpdatable(false)
    const account = await wallet.account()
    const transaction = await payment.route.getTransaction({ wallet })
    if(before) {
      let stop = await before(transaction, account)
      if(stop === false){ return }
    }
    let currentBlock = await request({ blockchain: transaction.blockchain, method: 'latestBlockNumber' })
    const deadline = transaction.deadline || transaction?.params?.payment?.deadline
    await trace(currentBlock, payment.route, transaction, deadline).then(async()=>{
      setClosable(false)
      await wallet.sendTransaction(Object.assign({}, transaction, {
        accepted: ()=>{ 
          setTransaction(transaction) // to hide sign CTA and verify link
        },
        sent: (sentTransaction)=>{
          initializeTransactionTracking(sentTransaction, currentBlock, deadline)
          if(sent) { sent(sentTransaction) }
        },
        succeeded: (transaction)=>paymentSucceeded(transaction, payment),
        failed: (transaction, error)=>paymentFailed(transaction, error, payment)
      }))
        .then((sentTransaction)=>{
          setTransaction(sentTransaction)
          initializePaymentTracking(sentTransaction, currentBlock, payment.route, deadline)
        })
        .catch((error)=>{
          console.log('error', error)
          setPaymentState('initialized')
          setClosable(true)
          setUpdatable(true)
          if(error?.code == 'WRONG_NETWORK' || error?.code == 'NOT_SUPPORTED') {
            navigate('WrongNetwork')
          }
        })
    }).catch((e)=>{
      console.log(e)
      setPaymentState('initialized')
      setClosable(true)
      setUpdatable(true)
      navigate('TracingFailed')
    })
  }

  const resetApproval = ()=> {
    setPaymentState('resetting')
    setClosable(false)
    setUpdatable(false)
    const resetApprovalTransaction = JSON.parse(JSON.stringify(payment.route.approvalTransaction))
    resetApprovalTransaction.params[1] = '0' // reset first
    wallet.sendTransaction(Object.assign({}, resetApprovalTransaction, {
      sent: (sentTransaction)=>{
        setResetApprovalTransaction(sentTransaction)
      },
      succeeded: ()=>{
        setUpdatable(true)
        setClosable(true)
        refreshPaymentRoutes().then(()=>{
          setTimeout(()=>{
            setPaymentState('initialized')
          }, 1000)
        })
      }
    }))
      .catch((error)=>{
        console.log('error', error)
        if(error?.code == 'WRONG_NETWORK' || error?.code == 'NOT_SUPPORTED') {
          navigate('WrongNetwork')
        }
        setPaymentState('initialized')
        setClosable(true)
      })
  }

  const approve = ()=> {
    setPaymentState('approving')
    setClosable(false)
    setUpdatable(false)
    wallet.sendTransaction(Object.assign({}, payment.route.approvalTransaction, {
      sent: (sentTransaction)=>{
        setApprovalTransaction(sentTransaction)
      },
      succeeded: ()=>{
        setUpdatable(true)
        setClosable(true)
        refreshPaymentRoutes().then(()=>{
          setTimeout(()=>{
            setPaymentState('initialized')
          }, 1000)
        })
      }
    }))
      .catch((error)=>{
        console.log('error', error)
        if(error?.code == 'WRONG_NETWORK' || error?.code == 'NOT_SUPPORTED') {
          navigate('WrongNetwork')
        }
        setPaymentState('initialized')
        setClosable(true)
      })
  }

  useEffect(()=>{
    setTrackingPayment(payment)
  }, [payment])

  useEffect(()=>{
    if(release){
      setPaymentState('success')
    }
  }, [release])

  useEffect(()=>{
    if(asynchronousTracking && trackingInitialized && (paymentState == 'success' || paymentState == 'failed')) {
      setClosable(true)
    }
  }, [trackingInitialized, paymentState])

  useEffect(()=>{
    if(recover){
      setClosable(false)
      setUpdatable(false)
      setPaymentState('paying')
      setTransaction({
        blockchain: recover.blockchain,
        id: recover.transaction,
        url: Blockchains.findByName(recover.blockchain).explorerUrlFor({ transaction: {id: recover.transaction } })
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
      if(foundTransaction.id != transaction.id) {
        newTransaction = Object.assign({}, transaction, { 
          id: foundTransaction.id,
          url: Blockchains.findByName(transaction.blockchain).explorerUrlFor({ transaction: foundTransaction })
        })
        setTransaction(newTransaction)
      }
      if(foundTransaction.status == 'success') {
        paymentSucceeded(newTransaction || transaction, payment)
      } else if(foundTransaction.status == 'failed'){
        paymentFailed(newTransaction || transaction, payment)
      }
    }
  }, [foundTransaction, transaction, payment])

  const debouncedSetPayment = useCallback(debounce((selectedRoute)=>{
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
    } else if(recover === undefined) {
      setPayment()
    }
  }, 100), [])

  useEffect(()=>{
    debouncedSetPayment(selectedRoute)
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
        start={ (allRoutes.assets === undefined || allRoutes.assets.length === 0) ? 'NoPaymentOptionFound' : 'InsufficientAmountOfTokens' }
        container={ props.container }
        document={ props.document }
        dialogs={{
          InsufficientAmountOfTokens: <InsufficientAmountOfTokensDialog assets={allRoutes.assets} accept={accept} account={account}/>,
          NoPaymentOptionFound: <NoPaymentOptionFoundDialog/>,
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
        resetApproval,
        approvalTransaction,
        resetApprovalTransaction,
      }}>
        { props.children }
      </PaymentContext.Provider>
    )
  }
}
