import ChangableAmountContext from '../contexts/ChangableAmountContext'
import Checkmark from '../components/Checkmark'
import ChevronRight from '../components/ChevronRight'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import format from '../helpers/format'
import LoadingText from '../components/LoadingText'
import PaymentContext from '../contexts/PaymentContext'
import PaymentOverviewSkeleton from '../skeletons/PaymentOverviewSkeleton'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useState, useEffect } from 'react'
import UpdateContext from '../contexts/UpdateContext'
import WalletContext from '../contexts/WalletContext'
import { Currency } from 'depay-local-currency'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{
  const { currencyCode } = useContext(ConfigurationContext)
  const { amountsMissing } = useContext(ChangableAmountContext)
  const { amount } = useContext(ChangableAmountContext)
  const { payment, paymentState, pay, transaction, approve, approvalTransaction } = useContext(PaymentContext)
  const { paymentValue } = useContext(PaymentValueContext)
  const { navigate } = useContext(NavigateStackContext)
  const { close } = useContext(ClosableContext)

  const mainAction = ()=> {
    if(paymentState == 'initialized' || paymentState == 'approving') {
      return(
        <button 
          className={["ButtonPrimary", (payment.route.approvalRequired && !payment.route.directTransfer ? 'disabled': '')].join(' ')}
          onClick={()=>{
            if(payment.route.approvalRequired && !payment.route.directTransfer) { return }
            pay({ navigate })
          }}
        >
          Pay { (paymentValue.toString().length) ? paymentValue.toString() : `${payment.amount}` }
        </button>
      )
    } else if (paymentState == 'paying') {
      return(
        <a className="ButtonPrimary" title="Performing the payment - please wait" href={ transaction?.url } target="_blank" rel="noopener noreferrer">
          <LoadingText>Paying</LoadingText>
        </a>
      )
    } else if (paymentState == 'confirmed') {
      return(
        <button className="ButtonPrimary round" title="Done" onClick={ close }>
          <Checkmark/>
        </button>
      )
    }
  }
  const approvalAction = ()=> {
    if(paymentState == 'initialized') {
      return(
        <div className="PaddingBottomS">
          <button className="ButtonPrimary wide" onClick={ approve } title={`Allow ${payment.symbol} to be used as payment`}>
            Allow { payment.symbol } to be used as payment
          </button>
        </div>
      )
    } else if (paymentState == 'approving') {
      return(
        <div className="PaddingBottomS">
          <a className="ButtonPrimary wide" title="Approving payment token - please wait" href={ approvalTransaction?.url } target="_blank" rel="noopener noreferrer">
            <LoadingText>Approving</LoadingText>
          </a>
        </div>
      )
    }
  }
  const actions = ()=> {
    return(
      <div>
        { payment.route.approvalRequired && !payment.route.directTransfer && approvalAction() }
        { mainAction() }
      </div>
    )
  }

  if(payment == undefined || paymentValue == undefined) { return(<PaymentOverviewSkeleton/>) }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="LineHeightL FontSizeL TextLeft">Payment</h1>
        </div>
      }
      body={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS">
          { amountsMissing &&
            <div 
              className={["Card", (paymentState == 'initialized' ? '' : 'disabled')].join(' ')}
              title={paymentState == 'initialized' ? "Change amount" : undefined}
              onClick={ ()=>{
                if(paymentState != 'initialized') { return }
                navigate('ChangeAmount')
              } }
            >
              <div className="CardBody">
                <div className="CardBodyWrapper">
                  <h4 className="CardTitle">
                    Amount
                  </h4>
                  <h2 className="CardText">
                    <div className="TokenAmountRow">
                      { new Currency({ amount: amount.toFixed(2), code: currencyCode }).toString() }
                    </div>
                  </h2>
                </div>
              </div>
              <div className="CardAction">
                <ChevronRight/>
              </div>
            </div>
          }
          <div 
            className={["Card", (paymentState == 'initialized' ? '' : 'disabled')].join(' ')}
            title={paymentState == 'initialized' ? "Change payment" : undefined}
            onClick={ ()=>{
              if(paymentState != 'initialized') { return }
              navigate('ChangePayment')
            } }
          >
            <div className="CardImage" title={ payment.name }>
              <TokenImage
                blockchain={ payment.route.blockchain }
                address={ payment.token }
              />
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <h2 className="CardText">
                  <div className="TokenAmountRow">
                    <span className="TokenSymbolCell">
                      { payment.symbol }
                    </span>
                    <span>&nbsp;</span>
                    <span className="TokenAmountCell">
                      { format(payment.amount) }
                    </span>
                  </div>
                </h2>
                { paymentValue.toString().length &&
                  <h3 className="CardText">
                    <small>{ paymentValue.toString() }</small>
                  </h3>
                }
              </div>
            </div>
            <div className="CardAction">
              <ChevronRight/>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM">
          { actions() }
        </div>
      }
    />
  )
}
