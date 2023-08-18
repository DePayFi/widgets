/*#if _EVM

import { TokenImage } from '@depay/react-token-image-evm'

/*#elif _SOLANA

import { TokenImage } from '@depay/react-token-image-solana'

//#else */

import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangePaymentSkeleton from '../skeletons/ChangePaymentSkeleton'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import format from '../helpers/format'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useEffect, useState } from 'react'
import round from '../helpers/round'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const { allRoutes, setSelectedRoute } = useContext(PaymentRoutingContext)
  const { displayedPaymentValue } = useContext(PaymentValueContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ allPaymentRoutesWithData, setAllPaymentRoutesWithData ] = useState([])
  const [ cards, setCards ] = useState([])

  useEffect(()=>{
    if(allRoutes == undefined) { return }
    Promise.all(
      allRoutes.map((route)=>{
        let exchangeRoute = route.exchangeRoutes[0]
        let fromToken = route.fromToken
        return Promise.all([
          route.fromToken.name(),
          route.fromToken.symbol(),
          route.fromToken.decimals(),
          route.fromToken.readable(route.fromAmount)
        ])
      })
    ).then((allPaymentRoutesWithData)=>{
      setAllPaymentRoutesWithData(allRoutes.map((route, index)=>{
        return {
          name: allPaymentRoutesWithData[index][0],
          symbol: allPaymentRoutesWithData[index][1].toUpperCase(),
          decimals: allPaymentRoutesWithData[index][2],
          amount: allPaymentRoutesWithData[index][3],
          route
        }
      }))
    }).catch(setError)
  }, [allRoutes])

  useEffect(()=>{
    setCards(
      allPaymentRoutesWithData.map((payment, index)=>{
        let blockchain = Blockchains.findByName(payment.route.blockchain)
        return(
          <div key={ index } className="Card" title={ `Select ${payment.symbol} as payment` } onClick={()=>{
            setSelectedRoute(payment.route)
            navigate('back')
          }}>
            <div className="CardImage">
              <TokenImage
                blockchain={ payment.route.blockchain }
                address={ payment.route.fromToken.address }
              />
              <img className={"BlockchainLogo small bottomRight " + blockchain.name} style={{ backgroundColor: blockchain.logoBackgroundColor }} src={blockchain.logo} alt={blockchain.label} title={blockchain.label}/>
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
                <h3 className="CardText small">
                  <small>{ format(round(parseFloat(payment.route.fromBalance.toString())/10**payment.decimals, 'down')) }</small>
                </h3>
              </div>
            </div>
          </div>
        )
      })
    )
  }, [allPaymentRoutesWithData])

  if(allPaymentRoutesWithData.length == 0 || cards.length == 0) { return(<ChangePaymentSkeleton/>) }

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <h1 className="LineHeightL FontSizeL TextCenter">Change Payment</h1>
          { displayedPaymentValue != undefined &&
            <div className="FontSizeL TextCenter FontWeightBold"><strong>{ displayedPaymentValue.toString() }</strong></div>
          }
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS">
          <div className="PaddingLeftM PaddingRightM">
            { cards }
          </div>
        </div>
      }
      footer={<div></div>}
    />
  )
}
