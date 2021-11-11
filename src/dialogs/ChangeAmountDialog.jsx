import apiKey from '../helpers/apiKey'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import format from '../helpers/format'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useContext, useState, useEffect } from 'react'
import round from '../helpers/round'
import Slider from 'react-rangeslider'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from 'depay-web3-constants'
import { Currency } from 'depay-local-currency'
import { ethers } from 'ethers'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { route } from 'depay-web3-exchanges'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{
  const { navigate } = useContext(NavigateStackContext)
  const { setError } = useContext(ErrorContext)
  const { account } = useContext(WalletContext)
  const { amount, setAmount, maxAmount } = useContext(ChangableAmountContext)
  const [ inputAmount, setInputAmount ] = useState(amount)
  const { currencyCode, amount: configuredAmount } = useContext(ConfigurationContext)
  const { allRoutes } = useContext(PaymentRoutingContext)
  const min = typeof configuredAmount == "object" && configuredAmount.min ? configuredAmount.min : 1
  const step = typeof configuredAmount == "object" && configuredAmount.step ? configuredAmount.step : 1

  const changeAmountAndGoBack = ()=>{
    setAmount(toValidValue(parseFloat(inputAmount)))
    navigate('back')
  }

  const changeAmount = (value)=>{
    if(Number.isNaN(value)) { return }
    setInputAmount(value)
  }

  const toValidValue = (value)=> {
    if(step) {
      value = Math.round(value/step)*step
    }
    value = Math.max(
      min,
      Math.min(value, maxAmount)
    )
    return value
  }

  const ensureValidity = (value)=> {
    setInputAmount(toValidValue(value))
  }

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="LineHeightL FontSizeL TextCenter">Change Amount</h1>
          <div className="FontSizeL TextCenter FontWeightBold"><strong>{ currencyCode }</strong></div>
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS">
          <div className="PaddingLeftM PaddingRightM">
            <div className='PaddingTopS TextCenter PaddingBottomL'>
              
              <div className='FontSizeL'>
                <input
                  max={ parseFloat(maxAmount) }
                  min={ min }
                  step={ step }
                  className='Input FontSizeXL TextAlignCenter'
                  type="number"
                  name="amount"
                  value={ parseFloat(inputAmount) }
                  onChange={(event)=>{ changeAmount(event.target.value) }}
                  onBlur={(event)=>{ ensureValidity(event.target.value) }}
                />
              </div>

              <Slider
                max={ parseFloat(maxAmount) }
                min={ min }
                step={ step }
                value={ parseFloat(inputAmount) }
                onChange={(value)=>{ changeAmount(value) }}
                onChangeComplete={()=>{ ensureValidity(inputAmount) }}
              />
              
              <div style={{ height: '40px' }}>
                <div>
                  { format(maxAmount) }
                  <button 
                    className="TextButton"
                    onClick={()=>{ changeAmount(maxAmount) }}
                  >
                    (Max)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      footer={
        <div>
          <button className="ButtonPrimary" onClick={changeAmountAndGoBack}>
            Done
          </button>
        </div>
      }
    />
  )
}
