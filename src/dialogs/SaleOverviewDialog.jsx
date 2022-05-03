import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ChevronRight from '../components/ChevronRight'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import Footer from '../components/Footer'
import format from '../helpers/format'
import PaymentContext from '../contexts/PaymentContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useState, useEffect } from 'react'
import SaleOverviewSkeleton from '../skeletons/SaleOverviewSkeleton'
import ToTokenContext from '../contexts/ToTokenContext'
import { Currency } from '@depay/local-currency'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { TokenImage } from '@depay/react-token-image'

export default (props)=>{
  const { amount } = useContext(ChangableAmountContext)
  const { tokenImage, amount: amountConfiguration } = useContext(ConfigurationContext)
  const { paymentValue } = useContext(PaymentValueContext)
  const { payment, paymentState } = useContext(PaymentContext)
  const { navigate } = useContext(NavigateStackContext)
  const { toToken, toTokenReadableAmount } = useContext(ToTokenContext)
  const [ salePerTokenValue, setSalePerTokenValue ] = useState()

  useEffect(()=>{
    if(paymentValue && (amountConfiguration == undefined || amountConfiguration.token != true) && toTokenReadableAmount) {
      let UsdAmountPerToken = paymentValue.amount / parseFloat(toTokenReadableAmount)
      let readableLocalizedAmountPerToken = (new Currency({ amount: UsdAmountPerToken, code: paymentValue.code })).toString()
      let zero = (new Currency({ amount: 0, code: paymentValue.code })).toString()
      if(readableLocalizedAmountPerToken != zero){
        setSalePerTokenValue(readableLocalizedAmountPerToken)
      }
    }
  }, [paymentValue, toTokenReadableAmount])

  if(
    toToken == undefined ||
    toTokenReadableAmount == undefined ||
    payment == undefined ||
    paymentValue == undefined
  ) { return(<SaleOverviewSkeleton/>) }

  let tokenImageElement
  if(tokenImage) {
    tokenImageElement = (
      <img src={ tokenImage }/>
    )
  } else {
    tokenImageElement = (
      <TokenImage
        blockchain={ payment.route.blockchain }
        address={ toToken.address }
      />
    )
  }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <h1 className="LineHeightL FontSizeL">Purchase</h1>
        </div>
      }
      body={
        <div className="PaddingLeftM PaddingRightM PaddingBottomXS">
          <div 
            className={["Card", (paymentState == 'initialized' ? '' : 'disabled')].join(' ')}
            title={paymentState == 'initialized' ? "Change amount" : undefined}
            onClick={ ()=>{
              if(paymentState != 'initialized') { return }
              navigate('ChangeAmount')
            } }
          >
            <div className="CardImage" title={ payment.name }>
              { tokenImageElement }
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <h4 className="CardTitle">
                  Amount
                </h4>
                <h2 className="CardText">
                  <div className="TokenAmountRow">
                    <span className="TokenSymbolCell">
                      { toToken.symbol }
                    </span>
                    <span>&nbsp;</span>
                    <span className="TokenAmountCell">
                    { format(toTokenReadableAmount) }
                    </span>
                  </div>
                </h2>
                { salePerTokenValue &&
                  <h3 className="CardText small">
                    <small>{ salePerTokenValue } per token</small>
                  </h3>
                }
              </div>
            </div>
            <div className="CardAction">
              <ChevronRight/>
            </div>
          </div>
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
                <h4 className="CardTitle">
                  Payment
                </h4>
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
              </div>
            </div>
            <div className="CardAction">
              <ChevronRight/>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <Footer/>
        </div>
      }
    />
  )
}
