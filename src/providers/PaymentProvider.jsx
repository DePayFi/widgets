/*#if _EVM

import { request } from '@depay/web3-client-evm'
import Token from '@depay/web3-tokens-evm'

/*#elif _SVM

import { request } from '@depay/web3-client-svm'
import Token from '@depay/web3-tokens-svm'

//#else */

import { request } from '@depay/web3-client'
import Token from '@depay/web3-tokens'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ErrorContext from '../contexts/ErrorContext'
import isMobile from '../helpers/isMobile'
import NavigateContext from '../contexts/NavigateContext'
import NoPaymentOptionFoundDialog from '../dialogs/NoPaymentOptionFoundDialog'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { debounce } from 'lodash'
import { ethers } from 'ethers'
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
  const [ payment, setPayment ] = useState()
  const [ transaction, setTransaction ] = useState()
  const [ approvalTransaction, setApprovalTransaction ] = useState()
  const [ approvalSignature, setApprovalSignature ] = useState()
  const [ approvalSignatureData, setApprovalSignatureData ] = useState()
  const [ resetApprovalTransaction, setResetApprovalTransaction ] = useState()
  const [ paymentState, setPaymentState ] = useState('initialized')
  const [ approvalType, setApprovalType ] = useState('transaction')
  const [ approvalAmount, setApprovalAmount ] = useState('max')

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

  const pay = async (passedSignatureData, passedSignature)=> {
    setPaymentState('paying')
    setUpdatable(false)
    const account = await wallet.account()
    const transaction = await payment.route.getTransaction(
      Object.assign(
        { wallet },
        (approvalSignatureData || passedSignatureData) ? {
          signature: (approvalSignature || passedSignature),
          signatureNonce: (approvalSignatureData || passedSignatureData).message.nonce,
          signatureDeadline: (approvalSignatureData || passedSignatureData).message.deadline
        } : {}
      )
    )
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
          setPaymentState('sending')
          setTransaction(transaction) // to hide sign CTA and verify link
        },
        sent: (sentTransaction)=>{
          setPaymentState('sending')
          setTransaction(sentTransaction)
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
          setClosable(true)
          setUpdatable(true)
          if(approvalTransaction || approvalSignature || passedSignature) {
            setPaymentState('approved')
          } else {
            setPaymentState('initialized')
          }
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

  const approve = async()=> {
    setPaymentState('approve')
    setClosable(false)
    setUpdatable(false)
    let approvalTransaction
    let approvalSignatureData
    if(approvalType == 'signature') {
      if(payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gte(payment.route.fromAmount)) {
        approvalSignatureData = await payment.route.getPermit2ApprovalSignature()
        setApprovalSignatureData(approvalSignatureData)
      } else {
        approvalTransaction = await payment.route.getPermit2ApprovalTransaction()
      }
    } else { // transaction
      approvalTransaction = await payment.route.getRouterApprovalTransaction(approvalAmount == 'min' ? {amount: payment.route.fromAmount} : undefined)
    }
    if(approvalSignatureData) {
      wallet.sign(approvalSignatureData).then((signature)=>{
        setApprovalSignature(signature)
        setPaymentState('approved')
        setClosable(true)
        if(!isMobile()) {
          pay(approvalSignatureData, signature)
        }
      }).catch((e)=>{
        console.log('ERROR', e)
        setPaymentState('initialized')
        setClosable(true)
      })
    } else if(approvalTransaction) {
      wallet.sendTransaction(Object.assign({}, approvalTransaction, {
        accepted: ()=>{
          setPaymentState('approving')
        },
        sent: (sentTransaction)=>{
          setPaymentState('approving')
          setApprovalTransaction(sentTransaction)
        },
        succeeded: ()=>{
          setUpdatable(true)
          setClosable(true)
          setPaymentState('approved')
          if(!isMobile()) {
            pay()
          }
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
  }

  useEffect(()=>{
    setTrackingPayment(payment)
    if(payment && payment.route && payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gt(ethers.BigNumber.from('0'))) {
      setApprovalType('signature')
    }
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
          blockchain: Blockchains[recover.blockchain],
          token: recover.token,
          name,
          symbol: symbol.toUpperCase(),
          amount: recover.amount
        })
      }).catch(setError)
    }
  }, [recover])

  const debouncedSetPayment = useCallback(debounce((selectedRoute)=>{
    if(selectedRoute) {
      // reset approval status if selectedRoute has been changed
      setApprovalTransaction()
      setApprovalSignature()
      setApprovalSignatureData()
      let fromToken = selectedRoute.fromToken
      Promise.all([
        fromToken.name(),
        fromToken.symbol(),
        fromToken.readable(selectedRoute.fromAmount)
      ]).then(([name, symbol, amount])=>{
        setPayment({
          blockchain: Blockchains[selectedRoute.blockchain],
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
        start={ 'NoPaymentOptionFound' }
        container={ props.container }
        document={ props.document }
        dialogs={{
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
        approvalType,
        setApprovalType,
        approvalAmount,
        setApprovalAmount,
        approve,
        resetApproval,
        approvalTransaction,
        approvalSignature,
        resetApprovalTransaction,
      }}>
        { props.children }
      </PaymentContext.Provider>
    )
  }
}
