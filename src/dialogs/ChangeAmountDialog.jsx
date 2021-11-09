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
  const { currencyCode } = useContext(ConfigurationContext)
  const { allRoutes } = useContext(PaymentRoutingContext)

  const changeAmountAndGoBack = ()=>{
    setAmount(parseInt(inputAmount, 10))
    navigate('back')
  }

  const changeAmount = (value)=>{
    if(Number.isNaN(value)) { return }
    setInputAmount(Math.min(value, maxAmount))
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
                  min={ 1 }
                  step={ 1 }
                  className='Input FontSizeXL TextAlignCenter'
                  type="number"
                  name="amount"
                  value={ parseFloat(inputAmount) }
                  onChange={(event)=>{ changeAmount(parseInt(event.target.value, 10)) }}
                />
              </div>

              <Slider
                min={ 1 }
                max={ parseFloat(maxAmount) }
                step={ 1 }
                value={ parseFloat(inputAmount) }
                onChange={(value)=>{ changeAmount(parseInt(value, 10)) }}
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
