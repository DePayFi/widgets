import AlertIcon from '../components/AlertIcon'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import Checkmark from '../components/Checkmark'
import ClosableContext from '../contexts/ClosableContext'
import DigitalWalletIcon from '../components/DigitalWalletIcon'
import etaForConfirmations from '../helpers/etaForConfirmations'
import link from '../helpers/link'
import LoadingText from '../components/LoadingText'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useState, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'
import { Currency } from '@depay/local-currency'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { throttle } from 'lodash'

const REQUIRES_APPROVAL_RESET = {
  'ethereum': ['0xdAC17F958D2ee523a2206206994597C13D831ec7'] // USDT on Ethereum
}

export default ()=>{
  const { amount, amountsMissing } = useContext(ChangableAmountContext)
  const { synchronousTracking, asynchronousTracking, trackingInitialized, release, forwardTo, confirmationsRequired, confirmationsPassed } = useContext(PaymentTrackingContext)
  const { payment, paymentState, pay, transaction, approve, approvalTransaction, resetApproval, resetApprovalTransaction } = useContext(PaymentContext)
  const { paymentValueLoss } = useContext(PaymentValueContext)
  const { updatedRouteWithNewPrice, updateRouteWithNewPrice } = useContext(PaymentRoutingContext)
  const { navigate } = useContext(NavigateStackContext)
  const { close } = useContext(ClosableContext)
  const { wallet } = useContext(WalletContext)
  const [ secondsLeft, setSecondsLeft ] = useState()
  const [ secondsLeftCountdown, setSecondsLeftCountdown ] = useState(0)
  const [ requiresApprovalReset, setRequiresApprovalReset ] = useState(false)
  const throttledUpdateRouteWithNewPrice = throttle(updateRouteWithNewPrice, 2000)
  const throttledPay = throttle(pay, 2000)
  const throttledApprove = throttle(approve, 2000)
  const throttledResetApproval = throttle(resetApproval, 2000)

  useEffect(()=>{
    if(confirmationsRequired) {
      let interval = setInterval(()=>{
        setSecondsLeftCountdown(secondsLeftCountdown+1)
      }, 1000)
      return ()=>{ clearInterval(interval) }
    }
  }, [confirmationsRequired, secondsLeftCountdown])


  useEffect(()=>{
    if(confirmationsPassed) {
      setSecondsLeft(
        etaForConfirmations(payment.blockchain, confirmationsRequired, confirmationsPassed)
        - secondsLeftCountdown
      )
    }
  }, [confirmationsPassed, secondsLeftCountdown])

  useEffect(()=>{
    if(confirmationsPassed) {
      setSecondsLeftCountdown(0)
    }
  }, [confirmationsPassed])

  useEffect(()=>{
    if(
      payment?.route?.approvalRequired &&
      REQUIRES_APPROVAL_RESET[payment.blockchain] &&
      REQUIRES_APPROVAL_RESET[payment.blockchain].includes(payment.token) &&
      payment?.route?.currentAllowance &&
      payment?.route?.currentAllowance.toString() != '0' &&
      payment?.route?.currentAllowance.lt(ethers.BigNumber.from(payment.route.fromAmount))
    ) {
      setRequiresApprovalReset(true)
    } else {
      setRequiresApprovalReset(false)
    }
  }, [payment])

  const trackingInfo = (transaction)=> {
    if (!transaction) {
      return null
    } else if((synchronousTracking == false && asynchronousTracking == false) || (asynchronousTracking && trackingInitialized)) {
      return null
    } else if (asynchronousTracking && trackingInitialized == false) {
      return(
        <div>
          <div className="Card transparent small disabled">
            <div className="CardImage">
              <div className="TextCenter">
                <div className="Loading Icon"></div>
              </div>
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <div className="Opacity05">
                  Initializing tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if(release) {
      return(
        <div>
          <a className="Card transparent small" title="DePay has validated the payment" href={ link({ url: `https://status.depay.com/tx/${transaction.blockchain}/${transaction.id}`, target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer">
            <div className="CardImage">
              <div className="TextCenter Opacity05">
                <Checkmark className="small"/>
              </div>
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <div className="Opacity05">
                  Payment validated
                </div>
              </div>
            </div>
          </a>
        </div>
      )
    } else {
      return(
        <div>
          <a className="Card transparent small" title="DePay is validating the payment" href={ link({ url: `https://status.depay.com/tx/${transaction.blockchain}/${transaction.id}`, target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer">
            <div className="CardImage">
              <div className="TextCenter">
                <div className="Loading Icon"></div>
              </div>
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <div className="Opacity05">
                  Validating payment
                  { confirmationsRequired && secondsLeft > 0 &&
                    <span title={`${confirmationsPassed}/${confirmationsRequired} required confirmations`}> { secondsLeft }s</span>
                  }
                </div>
              </div>
            </div>
          </a>
        </div>
      )
    }
  }

  const additionalPaymentInformation = ()=> {
    if (paymentState == 'paying' && transaction == undefined) {
      return(
        <div className="PaddingBottomS">
          <div className="Card transparent disabled small">
            <div className="CardImage">
              <div className="TextCenter Opacity05">
                <DigitalWalletIcon className="small"/>
              </div>
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <div className="Opacity05">
                  Confirm in your wallet (<a href={ link({ url: "https://depay.com/docs/payments/verify", target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>verify</a>)
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (paymentState == 'success') {
      return(
        <div className="PaddingBottomS">
          <div>
            <a className="Card transparent small" title="Transaction has been confirmed by the network" href={ link({ url: transaction?.url, target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer">
              <div className="CardImage">
                <div className="TextCenter Opacity05">
                  <Checkmark className="small"/>
                </div>
              </div>
              <div className="CardBody">
                <div className="CardBodyWrapper">
                  <div className="Opacity05">
                    Transaction confirmed
                  </div>
                </div>
              </div>
            </a>
          </div>
          { trackingInfo(transaction) }
        </div>
      )
    }
  }

  const approvalResetButton = ()=> {
    if(!requiresApprovalReset || payment.route == undefined || (!payment.route.approvalRequired || payment.route.directTransfer) || updatedRouteWithNewPrice) {
      return(null)
    } else if(paymentValueLoss) {
      return(
        <div className="PaddingBottomXS">
          <button type="button" className="ButtonPrimary disabled" onClick={ ()=>{} } title={`Reset approval for ${payment.symbol}`}>
            Reset { payment.symbol } approval
          </button>
        </div>
      )
    } else if(paymentState == 'initialized') {
      return(
        <div className="PaddingBottomXS">
          <button type="button" className="ButtonPrimary" onClick={ throttledResetApproval } title={`Reset approval for ${payment.symbol}`}>
            Reset { payment.symbol } approval
          </button>
        </div>
      )
    } else if (paymentState == 'resetting') {
      return(
        <div className="PaddingBottomXS">
          <a className="ButtonPrimary" title="Resetting current approval - please wait" href={ link({ url: resetApprovalTransaction?.url, target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer">
            <LoadingText>Resetting</LoadingText>
          </a>
        </div>
      )
    }
  }

  const approvalButton = ()=> {
    if(payment.route == undefined || (!payment.route.approvalRequired || payment.route.directTransfer) || updatedRouteWithNewPrice || wallet?.name === 'World App') {
      return(null)
    } else if(paymentValueLoss || requiresApprovalReset) {
      return(
        <div className="PaddingBottomXS">
          <button type="button" className="ButtonPrimary disabled" onClick={ ()=>{} } title={`Allow ${payment.symbol} to be used as payment`}>
            Approve use of { payment.symbol }
          </button>
        </div>
      )
    } else if(paymentState == 'initialized') {
      return(
        <div className="PaddingBottomXS">
          <button type="button" className="ButtonPrimary" onClick={ throttledApprove } title={`Allow ${payment.symbol} to be used as payment`}>
            Approve use of { payment.symbol }
          </button>
        </div>
      )
    } else if (paymentState == 'approving') {
      return(
        <div className="PaddingBottomXS">
          <a className="ButtonPrimary" title="Approving payment token - please wait" href={ link({ url: approvalTransaction?.url, target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer">
            <LoadingText>Approving</LoadingText>
          </a>
        </div>
      )
    }
  }

  const mainAction = ()=> {
    if(updatedRouteWithNewPrice) {
      return(
        <div>
          <div className="PaddingBottomXS">
            <div className="Alert">
              <strong>Exchange rate updated!</strong>
            </div>
          </div>
          <button type="button" className={"ButtonPrimary"} onClick={()=>{ throttledUpdateRouteWithNewPrice() }}>
            Reload
          </button>
        </div>
      )
    } else if(paymentValueLoss){
      return(
        <div>
          <button type="button" className={"ButtonPrimary disabled"} onClick={()=>{}}>
            Pay
          </button>
        </div>
      )
    } else if((paymentState == 'initialized' || paymentState == 'approving' || paymentState == 'resetting') && payment.route) {
      const approvalRequired = payment.route.approvalRequired && !payment.route.directTransfer && wallet?.name != 'World App'
      return(
        <button 
          tabIndex={1}
          type="button"
          className={["ButtonPrimary", (approvalRequired ? 'disabled': '')].join(' ')}
          onClick={()=>{
            if(approvalRequired) { return }
            throttledPay()
          }}
        >
          Pay
        </button>
      )
    } else if (paymentState == 'paying') {
      return(
        <a className="ButtonPrimary" title="Performing the payment - please wait" href={ link({ url: transaction?.url, target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer">
          <LoadingText>Paying</LoadingText>
        </a>
      )
    } else if (paymentState == 'success') {
      if(synchronousTracking == true) {
        if(release) {
          if(forwardTo) {
            return(
              <a className="ButtonPrimary" href={ forwardTo } rel="noopener noreferrer">
                Continue
              </a>
            )
          } else {
            return(
              <button className="ButtonPrimary" onClick={ close }>
                Continue
              </button>
            )
          }
        } else {
          return(
            <button className="ButtonPrimary disabled" onClick={ ()=>{} }>
              Continue
            </button>
          )
        }
      } else if (asynchronousTracking == true && trackingInitialized == false) {
        return(
          <button className="ButtonPrimary disabled" onClick={ ()=>{} }>
            Close
          </button>
        )
      } else {
        return(
          <button className="ButtonPrimary" onClick={ close }>
            Close
          </button>
        )
      }
    }
  }

  return(
    <div>
      { paymentValueLoss &&
        <div className="PaddingBottomXS">
          <div className="Alert">
            <strong>Payment would lose {paymentValueLoss}% of its value!</strong>
          </div>
        </div>
      }
      { approvalResetButton() }
      { approvalButton() }
      { additionalPaymentInformation() }
      { mainAction() }
    </div>
  )
}
