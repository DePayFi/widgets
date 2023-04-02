import Blockchains from '@depay/web3-blockchains'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ChevronRight from '../components/ChevronRight'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import DropDown from '../components/DropDown'
import Footer from '../components/Footer'
import format from '../helpers/format'
import MenuIcon from '../components/MenuIcon'
import PaymentContext from '../contexts/PaymentContext'
import PaymentOverviewSkeleton from '../skeletons/PaymentOverviewSkeleton'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useState, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'
import { Currency } from '@depay/local-currency'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { TokenImage } from '@depay/react-token-image'

export default (props)=>{
  const { currencyCode, recover, amount: amountConfiguration, currency } = useContext(ConfigurationContext)
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
          { label: "Disconnect wallet", action: disconnect },
        ]}
      /> }
    </span>
  )

  if(payment == undefined || (recover == undefined && paymentValue == undefined)) { return(<PaymentOverviewSkeleton alternativeHeaderAction={ alternativeHeaderActionElement }/>) }

  const blockchain = Blockchains.findByName(payment.blockchain)
  
  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <h1 className="LineHeightL FontSizeL">Payment</h1>
        </div>
      }
      alternativeHeaderAction={ alternativeHeaderActionElement }
      body={
        <div className="PaddingLeftM PaddingRightM PaddingBottomXS">
          { amountsMissing && !fixedAmount &&
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
                blockchain={ payment.blockchain }
                address={ payment.token }
              />
              <img className="BlockchainLogo small" src={ blockchain.logo } alt={ blockchain.label } title={ blockchain.label }/>
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
                    (displayedPaymentValue != `${payment.symbol} ${format(payment.amount)}` && !(amountsMissing && !fixedCurrency)) &&
                    (currency !== false) &&
                      <div className="TokenAmountRow small grey">
                        <span className="TokenAmountCell">
                          { displayedPaymentValue }
                        </span>
                      </div>
                  }
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
