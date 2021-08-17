import Checkmark from '../../components/Checkmark'
import ChevronRight from '../../components/ChevronRight'
import ClosableContext from '../../contexts/ClosableContext'
import ConfigurationContext from '../../contexts/ConfigurationContext'
import Dialog from '../../components/Dialog'
import LoadingText from '../../components/LoadingText'
import PaymentContext from '../../contexts/PaymentContext'
import PaymentOverviewSkeleton from '../../skeletons/PaymentOverviewSkeleton'
import React, { useContext, useState, useEffect } from 'react'
import ToTokenContext from '../../contexts/ToTokenContext'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{

  const { blockchain, sent, confirmed, safe } = useContext(ConfigurationContext)
  const { payment } = useContext(PaymentContext)
  const { localValue } = useContext(ToTokenContext)
  const navigate = useContext(NavigateStackContext)
  const { close, setClosable } = useContext(ClosableContext)
  const [state, setState] = useState('overview')
  const [transaction, setTransaction] = useState()
  const pay = ()=> {
    setClosable(false)
    setState('paying')
    payment.route.transaction.submit({
      sent: ()=>{
        if(sent) { sent(transaction) }
      },
      confirmed: ()=>{
        setClosable(true)
        setState('confirmed')
        if(confirmed) { confirmed(transaction) }
      },
      safe: ()=>{
        if(safe) { safe(transaction) }
      },
    })
      .then((sentTransaction)=>{
        setTransaction(sentTransaction)
      })
      .catch((error)=>{
        console.log('error', error)
        setState('overview')
        setClosable(true)
      })
  }
  const mainAction = ()=> {
    if(state == 'overview') {
      return(
        <button className="ButtonPrimary" onClick={ pay }>
          Pay { localValue.toString() }
        </button>
      )
    } else if (state == 'paying') {
      return(
        <a className="ButtonPrimary" title="Performing the payment - please wait" href={ transaction?.url } target="_blank" rel="noopener noreferrer">
          <LoadingText>Paying</LoadingText>
        </a>
      )
    } else if (state == 'confirmed') {
      return(
        <button className="ButtonPrimary round" title="Done" onClick={ close }>
          <Checkmark/>
        </button>
      )
    }
  }

  if(payment == undefined || localValue == undefined) { return(<PaymentOverviewSkeleton/>) }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="FontSizeL TextLeft">Payment</h1>
        </div>
      }
      body={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS">
          <div 
            className={["Card", (state == 'overview' ? '' : 'disabled')].join(' ')}
            title={state == 'overview' ? "Change payment" : undefined}
            onClick={ ()=>{
              if(state != 'overview') { return }
              navigate('ChangePayment')
            } }
          >
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
                      { payment.amount }
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
          { mainAction() }
        </div>
      }
    />
  )
}
