import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import React, { useContext, useState } from 'react'
import Slider from 'react-rangeslider'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{

  const { amount } = useContext(ConfigurationContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ inputAmount, setInputAmount ] = useState(props.amount)
  let max = 100

  console.log('inputAmount', inputAmount)
  
  const changeAmountAndGoBack = ()=>{
  }

  const changeAmount = (value)=>{
  }

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="FontSizeL TextCenter">Change Amount</h1>
          <div className="FontSizeL TextCenter FontWeightBold"><strong>{ props.token.symbol }</strong></div>
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS">
          <div className="PaddingLeftM PaddingRightM">
            <div className='PaddingTopS TextCenter'>
              <div className='FontSizeL'>
                <input
                  max={100}
                  min={1}
                  step={1}
                  className='Input FontSizeXL TextAlignCenter'
                  type="number"
                  name="amount"
                  value={ inputAmount }
                  onChange={(event)=>{ changeAmount(parseFloat(event.target.value)) }}
                />
              </div>
            </div>
            <div className="PaddingBottomL">
              <Slider/>
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
