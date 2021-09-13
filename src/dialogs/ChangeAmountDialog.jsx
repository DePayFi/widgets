import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import format from '../helpers/format'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useContext, useState, useEffect } from 'react'
import round from '../helpers/round'
import Slider from 'react-rangeslider'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { route } from 'depay-web3-exchanges'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{
  const { amount } = useContext(ConfigurationContext)
  const { navigate } = useContext(NavigateStackContext)
  const { account } = useContext(WalletContext)
  const [ inputAmount, setInputAmount ] = useState(props.amount)
  const { allRoutes } = useContext(PaymentRoutingContext)
  const [ maxRoute, setMaxRoute ] = useState()
  const [ max, setMax ] = useState(parseFloat(amount.start)*10)
  const [ maxRouteData, setMaxRouteData ] = useState()

  useEffect(()=>{
    let sortedLowToHigh = [...allRoutes].sort((a,b)=>{
      let aAmountsAvailable = a.fromBalance.div(a.fromAmount);
      let bAmountsAvailable = b.fromBalance.div(b.fromAmount);

      if (aAmountsAvailable.lt(bAmountsAvailable)) {
        return -1;
      }
      if (bAmountsAvailable.lt(aAmountsAvailable)) {
        return 1;
      }
      return 0; // equal
    })

    setMaxRoute(sortedLowToHigh[sortedLowToHigh.length-1]);
  }, [])

  useEffect(()=>{
    if(maxRoute) {
      return Promise.all([
        maxRoute.fromToken.name(),
        maxRoute.fromToken.symbol(),
        maxRoute.fromToken.decimals(),
        maxRoute.fromToken.readable(maxRoute.fromBalance),
        route({
          blockchain: maxRoute.blockchain,
          tokenIn: maxRoute.fromToken.address,
          tokenOut: maxRoute.toToken.address,
          amountIn: maxRoute.fromBalance,
          fromAddress: account,
          toAddress: account
        })
      ]).then(([name, symbol, decimals, balance, routes])=>{
        let SLIPPAGE = 1.01
        let max = round(parseFloat(ethers.utils.formatUnits(routes[0].amountOutMin, decimals))/SLIPPAGE, 'down')
        setMax(max)
        setMaxRouteData({
          name,
          symbol,
          balance,
          blockchain: maxRoute.blockchain,
          address: maxRoute.fromToken.address
        })
      })
    }
  }, [maxRoute])

  const changeAmountAndGoBack = ()=>{
    props.setAmount(inputAmount)
    navigate('back')
  }

  const changeAmount = (value)=>{
    if(Number.isNaN(value)) { return }
    setInputAmount(Math.min(value, max))
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
            <div className='PaddingTopS TextCenter PaddingBottomL'>
              
              <div className='FontSizeL'>
                <input
                  max={ parseFloat(max) }
                  min={ parseFloat(amount.min) }
                  step={ parseFloat(amount.step) }
                  className='Input FontSizeXL TextAlignCenter'
                  type="number"
                  name="amount"
                  value={ parseFloat(inputAmount) }
                  onChange={(event)=>{ changeAmount(parseFloat(event.target.value)) }}
                />
              </div>

              <Slider
                min={ parseFloat(amount.min) }
                max={ parseFloat(max) }
                step={ parseFloat(amount.step) }
                value={ parseFloat(inputAmount) }
                onChange={(value)=>{ changeAmount(parseFloat(value)) }}
              />
              
              { maxRouteData &&
                <div className="PaddingBottomS">
                  <div>
                    <div className="MaxAmountImage">
                      <TokenImage
                        blockchain={ maxRouteData.blockchain }
                        address={ maxRouteData.address }
                      />
                    </div>
                    {maxRouteData.symbol} {format(round(maxRouteData.balance, 'down'))}
                    <button 
                      className="TextButton"
                      onClick={()=>{ changeAmount(max) }}
                    >
                      (Max)
                    </button>
                  </div>
                </div>
              }
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
