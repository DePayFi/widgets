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
import CallbackContext from '../contexts/CallbackContext'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import debounce from '../helpers/debounce'
import ErrorContext from '../contexts/ErrorContext'
import isMobile from '../helpers/isMobile'
import NavigateContext from '../contexts/NavigateContext'
import NoPaymentOptionFoundDialog from '../dialogs/NoPaymentOptionFoundDialog'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'
import useEvent from '../hooks/useEvent'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{
  const { setError } = useContext(ErrorContext)
  const { callSentCallback, callSucceededCallback, callFailedCallback } = useContext(CallbackContext)
  const { transaction, setTransaction } = useContext(PaymentTrackingContext)
  const { accept, before } = useContext(ConfigurationContext)
  const { allRoutes, allAssets, selectedRoute, refreshPaymentRoutes } = useContext(PaymentRoutingContext)
  const { open, close, setClosable } = useContext(ClosableContext)
  const { setUpdatable } = useContext(UpdatableContext)
  const { navigate, set } = useContext(NavigateContext)
  const { wallet, account } = useContext(WalletContext)
  const { release, synchronousTracking, asynchronousTracking, trackingInitialized, track, trace } = useContext(PaymentTrackingContext)
  const [ payment, setPayment ] = useState()
  const [ approvalTransaction, setApprovalTransaction ] = useState()
  const [ approvalSignature, setApprovalSignature ] = useState()
  const [ approvalSignatureData, setApprovalSignatureData ] = useState()
  const [ resetApprovalTransaction, setResetApprovalTransaction ] = useState()
  const [ paymentState, setPaymentState ] = useState('initialized')
  const [ approvalType, setApprovalType ] = useState('transaction')
  const [ approvalAmount, setApprovalAmount ] = useState('max')

  const allowancePolling = useRef()
  const approvalConfirmed = useRef()

  const confirmApproval = useEvent(()=>{
    if(allowancePolling.current) { clearInterval(allowancePolling.current) }
    if(approvalConfirmed.current) { return }
    approvalConfirmed.current = true
    setUpdatable(true)
    setClosable(true)
    if(approvalType == 'signature') {
      selectedRoute.currentPermit2Allowance = ethers.BigNumber.from(Blockchains[selectedRoute.blockchain].maxInt)
      setPaymentState('approve') // signature still requires signature approval
      if(!isMobile()) {
        approve(true)
      }
    } else {
      selectedRoute.currentRouterAllowance = ethers.BigNumber.from(Blockchains[selectedRoute.blockchain].maxInt)
      setPaymentState('approved') // transaction made it fully approved
      if(!isMobile()) {
        pay()
      }
    }
  })

  const startAllowancePolling = (transaction, requiredAmount)=>{
    if(allowancePolling.current) { clearInterval(allowancePolling.current) }
    allowancePolling.current = setInterval(async()=>{
      let token = new Token({ blockchain: transaction.blockchain, address: transaction.to })
      let allowance = await token.allowance(account, transaction.params[0])
      if(requiredAmount && allowance.gte(requiredAmount)) {
        confirmApproval()
      }
    }, 2000)
  }

  const paymentSucceeded = useEvent((transaction, payment)=>{
    if(synchronousTracking == false) {
      setClosable(true)
      setPaymentState('success')
    } else if(release != true && paymentState != 'success') {
      setPaymentState('validating')
    }
    callSucceededCallback(transaction, selectedRoute)
  })

  const paymentFailed = useEvent((transaction, error)=> {
    if(asynchronousTracking == false || trackingInitialized == true) {
      setClosable(true)
    }
    set(['PaymentFailed'])
    setPaymentState('failed')
    callFailedCallback(transaction, selectedRoute)
  })

  const pay = useEvent(async(passedSignatureData, passedSignature)=> {
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
      let stop = await before(transaction, selectedRoute)
      if(stop === false){
        setPaymentState('initialized')
        return
      }
    }
    let currentBlock = await request({ blockchain: transaction.blockchain, method: 'latestBlockNumber' })
    const deadline = transaction.deadline || transaction?.params?.payment?.deadline
    await trace(currentBlock, payment.route, deadline).then(async()=>{
      setClosable(false)
      if(window._depayWidgetError) { return } // do not perform any transaction if there was an error in the widget!
      await wallet.sendTransaction(Object.assign({}, transaction, {
        accepted: ()=>{ 
          setPaymentState('sending')
          setTransaction(transaction) // to hide sign CTA and verify link
        },
        sent: (sentTransaction)=>{
          setPaymentState('sending')
          setTransaction(sentTransaction)
          callSentCallback(sentTransaction, selectedRoute)
        },
        succeeded: (transaction)=>paymentSucceeded(transaction, payment),
        failed: (transaction, error)=>paymentFailed(transaction, error, payment)
      }))
        .then((sentTransaction)=>{
          setTransaction(sentTransaction)
          track(sentTransaction, currentBlock, payment.route, deadline)
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
  })

  const resetApproval = useEvent(async()=> {
    setPaymentState('resetting')
    setClosable(false)
    setUpdatable(false)
    const resetApprovalTransaction = JSON.parse(JSON.stringify(await payment.route.getRouterApprovalTransaction()))
    resetApprovalTransaction.params[1] = '0' // reset first
    if(window._depayWidgetError) { return } // do not perform any transaction if there was an error in the widget!
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
      },
      failed: (transaction, error)=>{
        setPaymentState('initialized')
        setClosable(true)
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
  })

  const approve = useEvent(async(performSignature)=> {
    setPaymentState('approve')
    setClosable(false)
    setUpdatable(false)
    let _approvalTransaction
    let _approvalSignatureData
    if(approvalType == 'signature') {
      if(performSignature || (payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gte(payment.route.fromAmount))) {
        _approvalSignatureData = await payment.route.getPermit2ApprovalSignature()
        setApprovalSignatureData(_approvalSignatureData)
      } else {
        _approvalTransaction = await payment.route.getPermit2ApprovalTransaction()
      }
    } else { // transaction
      _approvalTransaction = await payment.route.getRouterApprovalTransaction(approvalAmount == 'min' ? {amount: payment.route.fromAmount} : undefined)
    }
    if(_approvalSignatureData) {
      wallet.sign(_approvalSignatureData).then((signature)=>{
        setApprovalSignature(signature)
        setPaymentState('approved')
        setClosable(true)
        if(!isMobile()) {
          pay(_approvalSignatureData, signature)
        }
      }).catch((e)=>{
        console.log('ERROR', e)
        if(approvalTransaction?.url) {
          setPaymentState('approve')
        } else {
          setPaymentState('initialized')
        }
        setClosable(true)
      })
    } else if(_approvalTransaction) {
      if(window._depayWidgetError) { return } // do not perform any transaction if there was an error in the widget!
      approvalConfirmed.current = false
      startAllowancePolling(_approvalTransaction, payment.route.fromAmount)
      wallet.sendTransaction(Object.assign({}, _approvalTransaction, {
        accepted: ()=>{
          setPaymentState('approving')
        },
        sent: (sentTransaction)=>{
          setPaymentState('approving')
          setApprovalTransaction(sentTransaction)
        },
        succeeded: ()=>{
          confirmApproval()
        },
        failed: ()=>{
          if(allowancePolling.current) { clearInterval(allowancePolling.current) }
          setPaymentState('initialized')
          setClosable(true)
        }
      }))
        .catch((error)=>{
          if(allowancePolling.current) { clearInterval(allowancePolling.current) }
          if(error?.code == 'WRONG_NETWORK' || error?.code == 'NOT_SUPPORTED') {
            navigate('WrongNetwork')
          }
          setPaymentState('initialized')
          setClosable(true)
        })
    }
  })

  useEffect(()=>{
    if(payment && payment.route && payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gt(ethers.BigNumber.from('0')) && !payment.route.currentRouterAllowance.gte(ethers.BigNumber.from('0'))) {
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

  const debouncedSetPayment = useCallback(debounce((selectedRoute)=>{
    if(selectedRoute) {
      // reset approval status if selectedRoute has been changed
      setApprovalTransaction()
      setApprovalSignature()
      setApprovalSignatureData()
      let fromToken = new Token({ blockchain: selectedRoute.blockchain, address: selectedRoute.fromToken.address })
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
