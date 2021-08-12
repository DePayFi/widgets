import ChevronRight from '../../components/ChevronRight'
import ConfigurationContext from '../../contexts/ConfigurationContext'
import Dialog from '../../components/Dialog'
import LoadingContext from '../../contexts/LoadingContext'
import PaymentContext from '../../contexts/PaymentContext'
import PaymentOverviewSkeleton from '../../skeletons/PaymentOverviewSkeleton'
import React, { useContext, useState, useEffect } from 'react'
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
        <h1 className="HeaderTitle">Payment</h1>
      }
      body={
        <div>
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
                    <span className="TokenAmountCell" title={ payment.amount }>
                      { payment.amount }
                    </span>
                    <span>&nbsp;</span>
                    <span className="TokenSymbolCell">
                      { payment.symbol }
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
        <div>
          <button className="ButtonPrimary">
            Pay { localValue.toString() }
          </button>
        </div>
      }
    />
  )
}
