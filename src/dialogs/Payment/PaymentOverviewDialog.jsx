import ChevronRight from '../../components/ChevronRight'
import ConfigurationContext from '../../contexts/ConfigurationContext'
import Dialog from '../../components/Dialog'
import LoadingContext from '../../contexts/LoadingContext'
import PaymentContext from '../../contexts/PaymentContext'
import PaymentOverviewSkeleton from '../../skeletons/PaymentOverviewSkeleton'
import React, { useContext, useState, useEffect } from 'react'
import round from '../../helpers/round'
import ToTokenContext from '../../contexts/ToTokenContext'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{

  const { loading } = useContext(LoadingContext)
  const { blockchain } = useContext(ConfigurationContext)
  const { payment } = useContext(PaymentContext)
  const { localValue } = useContext(ToTokenContext)
  const navigate = useContext(NavigateStackContext)

  if(loading || payment == undefined || localValue == undefined) { return(<PaymentOverviewSkeleton/>) }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="FontSizeL TextLeft">Payment</h1>
        </div>
      }
      body={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS">
          <div className="Card" title="Change payment" onClick={ ()=>navigate('ChangePayment') }>
            <div className="CardImage" title={ payment.name }>
              <TokenImage
                blockchain={ blockchain }
                address={ payment.token }
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
                  <small>{ localValue.toString() }</small>
                </h3>
              </div>
            </div>
            <div className="CardAction">
              <ChevronRight/>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM">
          <button className="ButtonPrimary">
            Pay { localValue.toString() }
          </button>
        </div>
      }
    />
  )
}
