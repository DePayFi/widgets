import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import format from '../helpers/format'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useState, useEffect } from 'react'
import round from '../helpers/round'
import WalletContext from '../contexts/WalletContext'
import { Currency } from '@depay/local-currency'
import { Decimal } from 'decimal.js'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{
  const { navigate } = useContext(NavigateStackContext)
  const { setError } = useContext(ErrorContext)
  const { account } = useContext(WalletContext)
  const { amount, setAmount } = useContext(ChangableAmountContext)
  const { displayedPaymentValue } = useContext(PaymentValueContext)
  const [ inputAmount, setInputAmount ] = useState(amount)
  const { currencyCode, amount: amountConfiguration } = useContext(ConfigurationContext)
  const { allRoutes, setSelectedRoute } = useContext(PaymentRoutingContext)
  const min = typeof amountConfiguration == "object" && amountConfiguration.min ? amountConfiguration.min : 1
  const step = typeof amountConfiguration == "object" && amountConfiguration.step ? amountConfiguration.step : 1
  const displayedCurrencyCode = (amountConfiguration != undefined && amountConfiguration.token) ? null : currencyCode

  const changeAmountAndGoBack = ()=>{
    let newAmount = toValidValue(parseFloat(inputAmount))
    if(newAmount != amount) {
      setSelectedRoute(undefined)
      setAmount(newAmount)
    }
    navigate('back')
  }

  const changeAmount = (value)=>{
    if(Number.isNaN(value)) { return }
    setInputAmount(value)
  }

  const toValidStep = (value)=> {
    if(step) {
      value = parseFloat(
        new Decimal(
          Math.floor(
            new Decimal(value).div(step)
          )
        ).mul(step).toString()
      )
    }
    return value
  }

  const toValidValue = (value)=> {
    value = toValidStep(value)
    value = Math.max(
      min,
      value
    )
    value = toValidStep(value)
    return value
  }

  const setValidValue = (value)=> {
    setInputAmount(
      toValidValue(value)
    )
  }

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="LineHeightL FontSizeL TextCenter">Change Amount</h1>
          <div className="FontSizeL TextCenter FontWeightBold"><strong>{ displayedCurrencyCode }</strong></div>
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS">
          <div className="PaddingLeftM PaddingRightM">
            <div className='PaddingTopS TextCenter PaddingBottomL'>
              
              <div className="PaddingBottomM">
                <input
                  min={ min }
                  step={ step }
                  className='Input FontSizeXXL TextAlignCenter'
                  type="number"
                  name="amount"
                  value={ parseFloat(inputAmount) }
                  onChange={(event)=>{ changeAmount(event.target.value) }}
                  onBlur={(event)=>{ setValidValue(event.target.value) }}
                />
              </div>

            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={changeAmountAndGoBack}>
            Done
          </button>
        </div>
      }
    />
  )
}
