/*#if _EVM

import { TokenImage } from '@depay/react-token-image-evm'

/*#elif _SVM

import { TokenImage } from '@depay/react-token-image-svm'

//#else */

import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ChevronRightIcon from '../icons/ChevronRightIcon'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import DropDown from '../components/DropDown'
import Footer from '../components/Footer'
import format from '../helpers/format'
import MenuIcon from '../icons/MenuIcon'
import PaymentContext from '../contexts/PaymentContext'
import PaymentOverviewSkeleton from '../skeletons/PaymentOverviewSkeleton'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useState, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'
import { Currency } from '@depay/local-currency'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{
  const { currencyCode, amount: amountConfiguration, currency, title } = useContext(ConfigurationContext)
  const { payment, paymentState } = useContext(PaymentContext)
  const { amount, amountsMissing, fixedAmount, fixedCurrency } = useContext(ChangableAmountContext)
  const { disconnect } = useContext(WalletContext)
  const { paymentValue, displayedPaymentValue } = useContext(PaymentValueContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ showDropDown, setShowDropDown ] = useState(false)
  const displayedCurrencyCode = (amountConfiguration != undefined && amountConfiguration.token) ? null : currencyCode
  const alternativeHeaderActionElement = (
    <span className="DropDownWrapper">
      <button type="button" onClick={ ()=>setShowDropDown(!showDropDown) } className="ButtonCircular" title="Disconnect connected wallet">
        <MenuIcon/>
      </button>
      { showDropDown && <DropDown hide={()=>setShowDropDown(false)}
        items={[
          { label: "Contact support", action: ()=>{ window.open(`mailto:support@depay.com?subject=Need help with payment`, '_blank') } },
          paymentState == 'initialized' ? { label: "Disconnect wallet", action: disconnect } : undefined,
        ].filter(Boolean)}
      /> }
    </span>
  )

  if(payment == undefined) { return(<PaymentOverviewSkeleton alternativeHeaderAction={ alternativeHeaderActionElement }/>) }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <h1 className="LineHeightL FontSizeL">{ title || "Payment" }</h1>
        </div>
      }
      alternativeHeaderAction={ alternativeHeaderActionElement }
      body={
        <div className="PaddingLeftM PaddingRightM">
          { amountsMissing && !fixedAmount &&
            <button
              type="button" 
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
                    {
                      displayedCurrencyCode &&
                      <div className="TokenAmountRow">
                        { new Currency({ amount: amount.toFixed(2), code: currencyCode }).toString() }
                      </div>
                    }
                    {
                      !displayedCurrencyCode &&
                      <div className="TokenAmountRow">
                        { amount }
                      </div>
                    }
                  </h2>
                </div>
              </div>
              <div className="CardAction">
                <ChevronRightIcon/>
              </div>
            </button>
          }
          <button
            type="button" 
            className={["Card", (paymentState == 'initialized' ? '' : 'disabled')].join(' ')}
            title={paymentState == 'initialized' ? "Change payment" : undefined}
            onClick={ ()=>{
              if(paymentState != 'initialized') { return }
              navigate('ChangePayment')
            } }
          >
            <div className="CardImage" title={ payment.name }>
              <TokenImage
                blockchain={ payment.blockchain.name }
                address={ payment.token }
              />
              <img className={"BlockchainLogo small bottomRight " + payment.blockchain.name} style={{ backgroundColor: payment.blockchain.logoBackgroundColor }} src={ payment.blockchain.logo } alt={ payment.blockchain.label } title={ payment.blockchain.label }/>
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                { amountsMissing && !fixedCurrency &&
                  <h4 className="CardTitle">
                    Payment
                  </h4>
                }
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
                  {
                    !(amountsMissing && !fixedCurrency) &&
                    (currency !== false) &&
                    <>
                      {
                        paymentValue &&
                        displayedPaymentValue != `${payment.symbol} ${format(payment.amount)}` &&
                        <div className="TokenAmountRow small Opacity05">
                          <span className="TokenAmountCell">
                            { displayedPaymentValue }
                          </span>
                        </div>
                      }
                      {
                        !paymentValue &&
                        <div className="TokenAmountRow small">
                          <span className="TokenAmountCell">
                            <div className="Skeleton" style={{ position: 'relative', marginTop: '2px', borderRadius: '10px', width: '82px', height: '15px' }}>
                              <div className="SkeletonBackground"/>
                            </div>
                          </span>
                        </div>
                      }
                    </>
                  }
                </h2>
              </div>
            </div>
            <div className="CardAction">
              <ChevronRightIcon/>
            </div>
          </button>
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
