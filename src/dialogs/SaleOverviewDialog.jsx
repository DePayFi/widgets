import Checkmark from '../components/Checkmark'
import ChevronRight from '../components/ChevronRight'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConnectingWalletDialog from './ConnectingWalletDialog'
import Dialog from '../components/Dialog'
import format from '../helpers/format'
import LoadingText from '../components/LoadingText'
import PaymentContext from '../contexts/PaymentContext'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useState, useEffect } from 'react'
import SaleOverviewSkeleton from '../skeletons/SaleOverviewSkeleton'
import SaleRoutingContext from '../contexts/SaleRoutingContext'
import UpdateContext from '../contexts/UpdateContext'
import WalletContext from '../contexts/WalletContext'
import { Currency } from 'depay-local-currency'
import { NavigateStackContext } from 'depay-react-dialog-stack'
import { TokenImage } from 'depay-react-token-image'

export default (props)=>{

  const { purchasedToken, purchasedAmount } = useContext(SaleRoutingContext)
  const { sent, confirmed, ensured, failed } = useContext(ConfigurationContext)
  const { payment, setPayment, transaction, setTransaction } = useContext(PaymentContext)
  const { allRoutes } = useContext(PaymentRoutingContext)
  const { wallet, walletState } = useContext(WalletContext)
  const { paymentValue } = useContext(PaymentValueContext)
  const { navigate, set } = useContext(NavigateStackContext)
  const { close, setClosable } = useContext(ClosableContext)
  const { update, setUpdate } = useContext(UpdateContext)
  const [state, setState] = useState('overview')
  const [salePerTokenValue, setSalePerTokenValue] = useState()
  const [approvalTransaction, setApprovalTransaction] = useState()
  const approve = ()=> {
    setClosable(false)
    setState('approving')
    wallet.sendTransaction(Object.assign({}, payment.route.approvalTransaction, {
      confirmed: ()=>{
        payment.route.approvalRequired = false
        setPayment(payment)
        setClosable(true)
        setState('overview')
      }
    }))
      .then((sentTransaction)=>{
        setApprovalTransaction(sentTransaction)
      })
      .catch((error)=>{
        console.log('error', error)
        setState('overview')
        setClosable(true)
      })
  }
  const pay = ()=> {
    setClosable(false)
    setState('paying')
    setUpdate(false)
    wallet.sendTransaction(Object.assign({}, payment.route.transaction, {
      sent: (transaction)=>{
        if(sent) { sent(transaction) }
      },
      confirmed: (transaction)=>{
        setClosable(true)
        setState('confirmed')
        if(confirmed) { confirmed(transaction) }
      },
      ensured: (transaction)=>{
        if(ensured) { ensured(transaction) }
      },
      failed: (transaction, error)=> {
        if(failed) { failed(transaction, error) }
        console.log('error', error)
        setState('overview')
        setClosable(true)
        setUpdate(true)
        navigate('PaymentError')
      }
    }))
      .then((sentTransaction)=>{
        setTransaction(sentTransaction)
      })
      .catch((error)=>{
        console.log('error', error)
        setState('overview')
        setClosable(true)
        setUpdate(true)
      })
  }
  const mainAction = ()=> {
    if(state == 'overview' || state == 'approving') {
      return(
        <button 
          className={["ButtonPrimary", (payment.route.approvalRequired && !payment.route.directTransfer ? 'disabled': '')].join(' ')}
          onClick={()=>{
            if(payment.route.approvalRequired && !payment.route.directTransfer) { return }
            pay()
          }}
        >
          Pay { paymentValue.toString().length ? paymentValue.toString() : `${payment.amount}` }
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
  const approvalAction = ()=> {
    if(state == 'overview') {
      return(
        <div className="PaddingBottomS">
          <button className="ButtonPrimary wide" onClick={ approve }>
            Allow { payment.symbol } to be used as payment
          </button>
        </div>
      )
    } else if (state == 'approving') {
      return(
        <div className="PaddingBottomS">
          <a className="ButtonPrimary wide" title="Approving payment token - please wait" href={ approvalTransaction?.url } target="_blank" rel="noopener noreferrer">
            <LoadingText>Approving</LoadingText>
          </a>
        </div>
      )
    }
  }
  const actions = ()=> {
    return(
      <div>
        { payment.route.approvalRequired && !payment.route.directTransfer && approvalAction() }
        { mainAction() }
      </div>
    )
  }
  useEffect(()=>{
    if(allRoutes && allRoutes.length == 0) {
      set(['NoPaymentMethodFound'])
      setUpdate(false)
    }
  }, [allRoutes])
  useEffect(()=>{
    if(paymentValue) {
      setSalePerTokenValue((new Currency({ amount: (paymentValue.amount / parseFloat(purchasedAmount)).toFixed(2), code: paymentValue.code })).toString())
    }
  }, [paymentValue])

  if(walletState == 'connecting') { return(<ConnectingWalletDialog/>) }
  if(
    purchasedToken == undefined ||
    purchasedAmount == undefined ||
    payment == undefined ||
    paymentValue == undefined
  ) { return(<SaleOverviewSkeleton/>) }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="FontSizeL TextLeft">Purchase</h1>
        </div>
      }
      body={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS">
          <div 
            className={["Card", (state == 'overview' ? '' : 'disabled')].join(' ')}
            title={state == 'overview' ? "Change amount" : undefined}
            onClick={ ()=>{
              if(state != 'overview') { return }
              navigate('ChangeAmount')
            } }
          >
            <div className="CardImage" title={ payment.name }>
              <TokenImage
                blockchain={ payment.route.blockchain }
                address={ purchasedToken.address }
              />
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <h2 className="CardText">
                  <div className="TokenAmountRow">
                    <span className="TokenSymbolCell">
                      { purchasedToken.symbol }
                    </span>
                    <span>&nbsp;</span>
                    <span className="TokenAmountCell">
                    { format(purchasedAmount) }
                    </span>
                  </div>
                </h2>
                { salePerTokenValue &&
                  <h3 className="CardText">
                    <small>{ salePerTokenValue } per token</small>
                  </h3>
                }
              </div>
            </div>
            <div className="CardAction">
              <ChevronRight/>
            </div>
          </div>
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
                blockchain={ payment.route.blockchain }
                address={ payment.token }
              />
            </div>
            <div className="CardBody">
              <div className="CardBodyWrapper">
                <h4 className="CardTitle">
                  Payment
                </h4>
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
                { paymentValue.toString().length &&
                  <h3 className="CardText">
                    <small>{ paymentValue.toString() }</small>
                  </h3>
                }
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
          { actions() }
        </div>
      }
    />
  )
}
