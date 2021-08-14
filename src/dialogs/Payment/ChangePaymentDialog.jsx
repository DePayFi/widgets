import ChangePaymentSkeleton from '../../skeletons/ChangePaymentSkeleton'
import ConfigurationContext from '../../contexts/ConfigurationContext'
import Dialog from '../../components/Dialog'
import React, { useContext, useEffect, useState } from 'react'
import round from '../../helpers/round'
import RoutingContext from '../../contexts/RoutingContext'
import ToTokenContext from '../../contexts/ToTokenContext'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{

  const { blockchain } = useContext(ConfigurationContext)
  const { allRoutes, setSelectedRoute } = useContext(RoutingContext)
  const { localValue } = useContext(ToTokenContext)
  const navigate = useContext(NavigateStackContext)
  const [ allPaymentRoutesWithData, setAllPaymentRoutesWithData ] = useState([])
  const [ cards, setCards ] = useState([])

  useEffect(()=>{
    if(allRoutes == undefined) { return }
    Promise.all(
      allRoutes.map((route)=>{
        let exchangeRoute = route.exchangeRoutes[0]
        let fromToken = route.fromToken
        let fromAmount = exchangeRoute ? route.exchangeRoutes[0].amountIn : route.toAmount
        return Promise.all([
          route.fromToken.name(),
          route.fromToken.symbol(),
          route.fromToken.decimals(),
          route.fromToken.readable(fromAmount)
        ])
      })
    ).then((allPaymentRoutesWithData)=>{
      setAllPaymentRoutesWithData(allRoutes.map((route, index)=>{
        return {
          name: allPaymentRoutesWithData[index][0],
          symbol: allPaymentRoutesWithData[index][1],
          decimals: allPaymentRoutesWithData[index][2],
          amount: allPaymentRoutesWithData[index][3],
          route
        }
      }))
    })
  }, [allRoutes])

  useEffect(()=>{
    setCards(
      allPaymentRoutesWithData.map((payment, index)=>{
        return(
          <div key={ index } className="Card" title="Select as payment" onClick={()=>{
            setSelectedRoute(payment.route)
            navigate('back')
          }}>
            <div className="CardImage" title={ payment.name }>
              <TokenImage
                blockchain={ blockchain }
                address={ payment.route.fromToken.address }
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
                      { round(payment.amount) }
                    </span>
                  </div>
                </h2>
                <h3 className="CardText">
                  <small>{ round(parseFloat(payment.route.fromBalance.toString())/10**payment.decimals, 'down') }</small>
                </h3>
              </div>
            </div>
            <div className="CardInfo">
              { payment.route.directTransfer && <span className="Label">Lowest Network Fee</span> }
              { payment.route.approvalRequired && <span className="Label">Requires Approval</span> }
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
          <h1 className="FontSizeL TextCenter">Change Payment</h1>
          <div className="FontSizeL TextCenter FontWeightBold"><strong>{ localValue.toString() }</strong></div>
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopXS">
          <div className="PaddingLeftM PaddingRightM">
            { cards }
          </div>
        </div>
      }
      footer={
        <div></div>
      }
    />
  )
}
