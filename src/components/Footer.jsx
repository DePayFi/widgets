import AlertIcon from '../icons/AlertIcon'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import ChevronRightIcon from '../icons/ChevronRightIcon'
import ClosableContext from '../contexts/ClosableContext'
import DigitalWalletIcon from '../icons/DigitalWalletIcon'
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
  const { payment, paymentState, pay, transaction, approve, approvalTransaction, approvalSignature, approvalDone, resetApproval, resetApprovalTransaction } = useContext(PaymentContext)
  const { updatedRouteWithNewPrice, updateRouteWithNewPrice } = useContext(PaymentRoutingContext)
  const { navigate } = useContext(NavigateStackContext)
  const { close } = useContext(ClosableContext)
  const { wallet } = useContext(WalletContext)
  const [ secondsLeft, setSecondsLeft ] = useState()
  const [ approvalType, setApprovalType ] = useState('transaction')
  const [ secondsLeftCountdown, setSecondsLeftCountdown ] = useState(0)
  const [ requiresApprovalReset, setRequiresApprovalReset ] = useState(false)
  const throttledUpdateRouteWithNewPrice = throttle(updateRouteWithNewPrice, 2000)
  const throttledPay = throttle(()=>pay(), 2000)
  const throttledApprove = throttle(()=>approve(), 2000)
  const throttledResetApproval = throttle(()=>resetApproval(), 2000)

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
        etaForConfirmations(payment.route.blockchain, confirmationsRequired, confirmationsPassed)
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
      REQUIRES_APPROVAL_RESET[payment.route.blockchain] &&
      REQUIRES_APPROVAL_RESET[payment.route.blockchain].includes(payment.token) &&
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
                <CheckmarkIcon className="small"/>
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

  const actionIndicator = ()=>{
    
    if(!wallet) { return null }

    if(
      paymentState == 'approve' ||
      paymentState == 'paying'
    ) {
      return(
        <div className="PaddingBottomS PaddingTopXS">
          <div className="PaddingTopXS">
            <div className="ActionIndicator MarginBottomXS">
              <img src={wallet.logo} />
              <div className="ActionIndicatorSpinner"></div>
            </div>
            <div className="TextCenter PaddingTopXS">
              <span className="FontSizeL">
                Confirm in your wallet
              </span>
            </div>
          </div>
        </div>
      )
    }

    return(null)
  }

  const steps = ()=>{

    if(
      paymentState == 'approve' ||
      paymentState == 'approving' ||
      paymentState == 'approved' ||
      paymentState == 'paying' ||
      paymentState == 'sending' ||
      paymentState == 'success'
    ) {

      return(
        <div className="PaddingBottomS">

          { (paymentState == 'approve') &&
            <div className="Step active Card disabled small transparent">
              <div className="StepIcon">
                <div className="StepCircle"/>
                <div className="StepConnector"/>
              </div>
              <div className="StepText">
                Approve spending { payment.symbol }
              </div>
            </div>
          }

          { approvalTransaction &&
            <a href={ link({ url: approvalTransaction?.url, target: '_blank', wallet }) } target="_blank" className={`Step Card ${!approvalTransaction?.url ? 'disabled' : ''} ${ paymentState == 'approving' ? 'active' : 'done'} small transparent`}>
             <div className="StepIcon">
                { paymentState != 'approving' && <CheckmarkIcon className="small"/> }
                { paymentState == 'approving' &&
                  <>
                    <div className="StepCircle"/>
                    <div className="StepConnector"/>
                  </>
                }
              </div>
              <div className="StepText">
                { paymentState == 'approving' && <LoadingText>Approving</LoadingText> }
                { paymentState != 'approving' && <span>Approve spending { payment.symbol }</span> }
              </div>
            </a>
          }

          { approvalSignature &&
            <div className="Step done Card disabled small transparent">
              <div className="StepIcon">
                <CheckmarkIcon className="small"/>
              </div>
              <div className="StepText">
                Approve spending { payment.symbol }
              </div>
            </div>
          }

          { !transaction && paymentState != 'sending' &&
            <div className={`Step ${ (paymentState == 'approved' || !payment?.route?.approvalRequired || paymentState == 'paying') ? 'active' : '' } Card disabled small transparent`}>
              <div className="StepIcon">
                { paymentState == 'success' &&
                  <CheckmarkIcon className="small"/>
                }
                { paymentState != 'success' &&
                  <div className="StepCircle"/>
                }
              </div>
              <div className="StepText">
                Perform payment
              </div>
              <div className="StepStatus">
                { paymentState == 'success' &&
                  <CheckmarkIcon className="small"/>
                }
              </div>
            </div>
          }

          { (transaction || paymentState == 'sending') &&
            <a href={ link({ url: transaction?.url, target: '_blank', wallet }) } target="_blank" className={`Step ${ (paymentState == 'approved' || !payment?.route?.approvalRequired || paymentState == 'paying' || paymentState == 'sending') && paymentState != 'success' ? 'active' : '' } ${ paymentState == 'success' ? 'done' : '' } Card ${!transaction?.url ? 'disabled' : ''} small transparent`}>
              <div className="StepIcon">
                { paymentState == 'success' &&
                  <CheckmarkIcon className="small"/>
                }
                { paymentState != 'success' &&
                  <div className="StepCircle"/>
                }
              </div>
              <div className="StepText">
                { (paymentState == 'paying' || paymentState == 'sending') && <LoadingText>Performing payment</LoadingText> }
                { paymentState == 'success' && <span>Perform payment</span> }
              </div>
            </a>
          }

        </div>
      )

    }
  }

  const mainAction = ()=>{

    if(updatedRouteWithNewPrice) {
      return(
        <div>
          <div className="PaddingBottomXS">
            <div className="Info">
              <strong>Exchange rate updated!</strong>
            </div>
          </div>
          <button type="button" className={"ButtonPrimary"} onClick={()=>{ throttledUpdateRouteWithNewPrice() }}>
            Reload
          </button>
        </div>
      )
    } else if(requiresApprovalReset) {
      if(paymentState == 'initialized') {
        return(
          <div className="PaddingBottomXS">
            <button type="button" className="ButtonPrimary" onClick={ throttledResetApproval } title={`Reset approval for ${payment.symbol}`}>
              First, reset { payment.symbol } approval
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
    } else if((paymentState == 'initialized' || paymentState == 'approve' || paymentState == 'approving' || paymentState == 'approved' || paymentState == 'resetting') && payment.route) {
      const approvalRequired = paymentState != 'approved' && payment?.route?.approvalRequired && wallet?.name != 'World App'
      if(approvalRequired) {
        if(paymentState == 'initialized') {
          return(
            <div className="PaddingBottomXS">

              <div className="PaddingBottomXS MarginBottomXS MarginTopNegativeS PaddingTopXS">
                <div className="PaddingTopXS">
                  <button
                    type="button" 
                    className="Card small transparent"
                    title="Change approval"
                    onClick={ ()=>{
                      if(paymentState != 'initialized') { return }
                      navigate('ChangeApproval')
                    } }
                  >
                    <div className="CardBody">
                      <div className="CardBodyWrapper">
                        <h4 className="CardTitle">
                          Approval
                        </h4>
                      </div>
                    </div>
                    <div className="CardAction PaddingRightXS">
                      <ChevronRightIcon className="small"/>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <button type="button" className="ButtonPrimary" onClick={ throttledApprove }>
                  Approve and pay
                </button>
              </div>
            </div>
          )
        }
      } else {
        return(
          <button tabIndex={1} type="button" className="ButtonPrimary" onClick={throttledPay}>
            Pay
          </button>
        )
      }
    } else if (paymentState == 'paying') {
      return(null)
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
      { steps() }
      { actionIndicator() }
      { mainAction() }
    </div>
  )
}
