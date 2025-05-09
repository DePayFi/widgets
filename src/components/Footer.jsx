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
import throttle from '../helpers/throttle'
import WalletContext from '../contexts/WalletContext'
import { Currency } from '@depay/local-currency'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'

const REQUIRES_APPROVAL_RESET = {
  'ethereum': ['0xdAC17F958D2ee523a2206206994597C13D831ec7'] // USDT on Ethereum
}

export default ()=>{
  const { amount, amountsMissing } = useContext(ChangableAmountContext)
  const { synchronousTracking, asynchronousTracking, trackingInitialized, release, forwardTo, confirmationsRequired, confirmationsPassed } = useContext(PaymentTrackingContext)
  const { payment, paymentState, pay, transaction, approve, approvalTransaction, approvalSignature, approvalDone, approvalType, resetApproval, resetApprovalTransaction } = useContext(PaymentContext)
  const { updatedRouteWithNewPrice, updateRouteWithNewPrice } = useContext(PaymentRoutingContext)
  const { navigate } = useContext(NavigateStackContext)
  const { close } = useContext(ClosableContext)
  const { wallet } = useContext(WalletContext)
  const [ secondsLeft, setSecondsLeft ] = useState()
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
      paymentState == 'validating' ||
      paymentState == 'success'
    ) {

      // --- Permit2 signature approval block ---
      const needsPermit2Transaction = approvalType === 'signature' && payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.lt(payment.route.fromAmount)
      const permit2Done = Boolean(approvalTransaction?.url)
      const permit2Processing = approvalType === 'signature' && paymentState === 'approving' && !approvalSignature

      // --- Spending approval block ---
      const approvalRequired = Boolean(payment.route.approvalRequired)
      const needsToApproveSpending = approvalRequired
      const justNeedsPermit2Signature = approvalType === 'signature' && payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gte(payment.route.fromAmount)
      const spendingActive = paymentState === 'approve' && (approvalType == 'transaction' || (approvalType === 'signature' && (Boolean(approvalTransaction?.url || justNeedsPermit2Signature))))
      const spendingProcessing = paymentState === 'approving' && (approvalType == 'transaction' || justNeedsPermit2Signature)
      const spendingDone = (approvalType === 'signature' && Boolean(approvalSignature)) || (approvalTransaction?.url && !['approve', 'approving'].includes(paymentState))

      // --- Perform payment block ---
      const paymentReady = paymentState === 'approved' || !approvalRequired || paymentState === 'paying'
      const paymentProcessing = paymentState === 'sending'
      const paymentDone = paymentState === 'validating' || paymentState === 'success'

      // --- Validation block ---
      const showAsyncInit = asynchronousTracking && trackingInitialized === false
      const showSyncWaiting = synchronousTracking && !release
      const showSyncDone = synchronousTracking && release

      return (
        <div className="PaddingBottomS">
          {/* Enable signature approval (Permit2) */}
          {needsPermit2Transaction && (
            <a
              href={
                approvalTransaction
                  ? link({ url: approvalTransaction.url, target: '_blank', wallet })
                  : undefined
              }
              target="_blank"
              className={
                'Step Card small transparent' +
                (!permit2Done || permit2Processing ? ' active' : '') +
                (permit2Done ? ' done' : '') +
                (!approvalTransaction?.url ? ' disabled' : '')
              }
            >
              <div className="StepIcon">
                {!permit2Done && !permit2Processing && <div className="StepCircle" />}
                {permit2Processing && <div className="ActionIndicatorSpinner" />}
                {permit2Done && !permit2Processing && <CheckmarkIcon className="small" />}
              </div>
              <div className="StepText">
                {!permit2Done && !permit2Processing && (
                  <span>Enable signature approval for {payment.symbol}</span>
                )}
                {permit2Processing &&
                  <LoadingText>
                    Enabling signature approval for {payment.symbol}
                  </LoadingText>
                }
                {permit2Done && !permit2Processing && (
                  <span>Signature approval for {payment.symbol} enabled</span>
                )}
              </div>
              <div className="StepConnector" />
            </a>
          )}

          {/* Approve spending of TOKEN */}
          {needsToApproveSpending && !spendingDone && approvalType !== 'transaction' && (
            <div
              className={
                'Step Card disabled small transparent' +
                (spendingActive || spendingProcessing ? ' active' : '')
              }
            >
              <div className="StepIcon">
                <div className="StepCircle" />
              </div>
              <div className="StepText">Approve spending {payment.symbol}</div>
              <div className="StepConnector" />
            </div>
          )}
          {approvalType === 'transaction' && approvalRequired && (
            <a
              href={
                (approvalType === 'transaction' && approvalTransaction)
                  ? link({ url: approvalTransaction.url, target: '_blank', wallet })
                  : undefined
              }
              target="_blank"
              className={
                'Step Card small transparent' +
                (!approvalTransaction?.url ? ' disabled' : '') +
                (spendingActive || spendingProcessing  ? ' active' : '') +
                (spendingDone ? ' done' : '')
              }
            >
              <div className="StepIcon">
                {!spendingProcessing && !spendingDone && <div className="StepCircle" />}
                {spendingProcessing && !spendingDone && <div className="ActionIndicatorSpinner" />}
                {!spendingProcessing && spendingDone && <CheckmarkIcon className="small" />}
              </div>
              <div className="StepText">
                {!spendingProcessing && !spendingDone && <span>Approve {payment.symbol} for spending</span>}
                {!spendingProcessing && spendingDone && <span>Approved {payment.symbol} for spending</span>}
                {spendingProcessing && <LoadingText>Approving {payment.symbol} for spending</LoadingText>}
              </div>
              <div className="StepConnector" />
            </a>
          )}
          {approvalType === 'signature' && spendingDone && (
            <div className="Step done Card disabled small transparent">
              <div className="StepIcon">
                <CheckmarkIcon className="small" />
              </div>
              <div className="StepText">Spending {payment.symbol} approved</div>
              <div className="StepConnector" />
            </div>
          )}

          {/* Perform payment */}
          {(transaction || paymentProcessing) ? (
            <a
              href={
                transaction
                  ? link({ url: transaction.url, target: '_blank', wallet })
                  : undefined
              }
              target="_blank"
              rel="noopener noreferrer"
              className={
                'Step Card small transparent' +
                ((paymentReady && !paymentDone) || paymentProcessing ? ' active' : '') +
                (paymentDone ? ' done' : '') +
                (!transaction?.url ? ' disabled' : '')
              }
            >
              <div className="StepIcon">
                {paymentDone && <CheckmarkIcon className="small" />}
                {paymentProcessing && <div className="ActionIndicatorSpinner" />}
              </div>
              <div className="StepText">
                {paymentProcessing && <LoadingText>Performing payment</LoadingText>}
                {paymentDone && <span>Perform payment</span>}
              </div>
              <div className="StepConnector" />
            </a>
          ) : (
            <div
              className={
                'Step Card disabled small transparent' +
                (paymentReady ? ' active' : '')
              }
            >
              <div className="StepIcon">
                {paymentDone ? (
                  <CheckmarkIcon className="small" />
                ) : (
                  <div className="StepCircle" />
                )}
              </div>
              <div className="StepText">Perform payment</div>
              <div className="StepStatus">
                {paymentDone && <CheckmarkIcon className="small" />}
              </div>
              <div className="StepConnector" />
            </div>
          )}

          {/* Validation */}
          {showAsyncInit && (
            <div className="Step Card disabled small transparent active">
              <div className="StepIcon">
                <div className="ActionIndicatorSpinner" />
              </div>
              <div className="StepText">
                <LoadingText>Initializing tracking</LoadingText>
              </div>
              <div className="StepConnector" />
            </div>
          )}
          {showSyncWaiting && (
            <a
              href={
                transaction
                  ? link({
                      url: `https://status.depay.com/tx/${transaction.blockchain}/${transaction.id}`,
                      target: '_blank',
                      wallet,
                    })
                  : undefined
              }
              target="_blank"
              className={
                'Step Card small transparent' +
                (paymentState === 'validating' ? ' active' : '') +
                (!transaction?.url ? ' disabled' : '')
              }
            >
              <div className="StepIcon">
                {paymentState === 'validating' ? (
                  <div className="ActionIndicatorSpinner" />
                ) : (
                  <div className="StepCircle" />
                )}
              </div>
              <div className="StepText">
                {paymentState !== 'validating' && <span>Wait for payment confirmation</span>}
                {paymentState === 'validating' && <LoadingText>Confirming payment</LoadingText>}
                {transaction && confirmationsRequired > 0 && secondsLeft > 0 && (
                  <>
                    <span>Confirming payment</span>
                    <span title={`${confirmationsPassed}/${confirmationsRequired} required confirmations`}>
                      {secondsLeft}s
                    </span>
                  </>
                )}
              </div>
            </a>
          )}
          {showSyncDone && (
            <a
              href={
                transaction
                  ? link({
                      url: `https://status.depay.com/tx/${transaction.blockchain}/${transaction.id}`,
                      target: '_blank',
                      wallet,
                    })
                  : undefined
              }
              target="_blank"
              className={
                'Step Card small transparent done' +
                (!transaction ? ' disabled' : '')
              }
            >
              <div className="StepIcon">
                <CheckmarkIcon className="small" />
              </div>
              <div className="StepText">Payment confirmed</div>
            </a>
          )}
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
