import AlertIcon from '../components/AlertIcon'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import Checkmark from '../components/Checkmark'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import DigitalWalletIcon from '../components/DigitalWalletIcon'
import LoadingText from '../components/LoadingText'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext } from 'react'
import { Currency } from '@depay/local-currency'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default ()=>{
  const { currencyCode, amount: configuredAmount } = useContext(ConfigurationContext)
  const { amount, amountsMissing } = useContext(ChangableAmountContext)
  const { tracking, release, forwardTo, trackingFailed } = useContext(PaymentTrackingContext)
  const { payment, paymentState, pay, transaction, approve, approvalTransaction } = useContext(PaymentContext)
  const { paymentValue, paymentValueLoss } = useContext(PaymentValueContext)
  const { updatedRouteWithNewPrice, updateRouteWithNewPrice } = useContext(PaymentRoutingContext)
  const { navigate } = useContext(NavigateStackContext)
  const { close } = useContext(ClosableContext)

  const trackingInfo = ()=> {
    if(tracking != true) { return null }
    if(release) {
      return(
        <div>
          <div className="Card transparent small disabled">
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
          </div>
        </div>
      )
    } else {
      if(trackingFailed) {
        return(
          <div>
            <div className="Card transparent small">
              <div className="CardImage">
                <div className="TextCenter">
                  <AlertIcon className="small"/>
                </div>
              </div>
              <div className="CardBody">
                <div className="CardBodyWrapper">
                  <div>
                    Tracking payment failed!
                  </div>
                </div>
              </div>
            </div>
          </div> 
        )
      } else {
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
                    Validating payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
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
                  Confirm transaction in your wallet
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (paymentState == 'confirmed') {
      return(
        <div className="PaddingBottomS">
          <div>
            <a className="Card transparent small" title="Payment has been confirmed by the network" href={ transaction?.url } target="_blank" rel="noopener noreferrer">
              <div className="CardImage">
                <div className="TextCenter Opacity05">
                  <Checkmark className="small"/>
                </div>
              </div>
              <div className="CardBody">
                <div className="CardBodyWrapper">
                  <div className="Opacity05">
                    Payment confirmed
                  </div>
                </div>
              </div>
            </a>
          </div>
          { trackingInfo() }
        </div>
      )
    }
  }

  const approvalButton = ()=> {
    if(payment.route == undefined || (!payment.route.approvalRequired || payment.route.directTransfer)) {
      return(null)
    } else if(paymentState == 'initialized') {
      return(
        <div className="PaddingBottomS">
          <button className="ButtonPrimary" onClick={ approve } title={`Allow ${payment.symbol} to be used as payment`}>
            Allow { payment.symbol } to be used as payment
          </button>
        </div>
      )
    } else if (paymentState == 'approving') {
      return(
        <div className="PaddingBottomS">
          <a className="ButtonPrimary" title="Approving payment token - please wait" href={ approvalTransaction?.url } target="_blank" rel="noopener noreferrer">
            <LoadingText>Approving</LoadingText>
          </a>
        </div>
      )
    }
  }

  const mainAction = ()=> {
    let displayedAmount
    if(amount && configuredAmount && configuredAmount.currency && configuredAmount.fix) {
      displayedAmount = paymentValue.toString()
    } else if(amount && (configuredAmount == undefined || configuredAmount?.token != true)) {
      displayedAmount = new Currency({ amount: amount.toFixed(2), code: currencyCode }).toString()
    } else if(paymentValue && paymentValue.toString().length && configuredAmount?.token != true) {
      displayedAmount = paymentValue.toString()
    } else {
      displayedAmount = `${payment.symbol} ${payment.amount}`
    }

    if(updatedRouteWithNewPrice) {
      return(
        <div>
          <div className="PaddingBottomXS">
            <div className="Alert">
              <strong>Price updated!</strong>
            </div>
          </div>
          <button className={"ButtonPrimary"} onClick={()=>{ updateRouteWithNewPrice() }}>
            Reload
          </button>
        </div>
      )
    } else if(paymentValueLoss){
      return(
        <div>
          <div className="PaddingBottomXS">
            <div className="Alert">
              <strong>Payment token would lose {paymentValueLoss}% of it's value!</strong>
            </div>
          </div>
          <button className={"ButtonPrimary disabled"} onClick={()=>{}}>
            Pay { displayedAmount }
          </button>
        </div>
      )
    } else if((paymentState == 'initialized' || paymentState == 'approving') && payment.route) {
      return(
        <button 
          className={["ButtonPrimary", (payment.route.approvalRequired && !payment.route.directTransfer ? 'disabled': '')].join(' ')}
          onClick={()=>{
            if(payment.route.approvalRequired && !payment.route.directTransfer) { return }
            pay()
          }}
        >
          Pay { displayedAmount }
        </button>
      )
    } else if (paymentState == 'paying') {
      return(
        <a className="ButtonPrimary" title="Performing the payment - please wait" href={ transaction?.url } target="_blank" rel="noopener noreferrer">
          <LoadingText>Paying</LoadingText>
        </a>
      )
    } else if (paymentState == 'confirmed') {
      if(tracking == true) {
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
      { approvalButton() }
      { additionalPaymentInformation() }
      { mainAction() }
    </div>
  )
}
