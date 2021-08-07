import ChevronRight from '../../components/ChevronRight'
import Dialog from '../../components/Dialog'
import LoadingContext from '../../contexts/LoadingContext'
import PaymentOverviewSkeleton from '../../skeletons/PaymentOverviewSkeleton'
import React, { useContext } from 'react'

export default (props)=>{

  const { loading } = useContext(LoadingContext)

  if(loading) { return(<PaymentOverviewSkeleton/>) }

  return(
    <Dialog
      header={
        <h1 className="HeaderTitle">Payment</h1>
      }
      body={
        <div>
          <div className="Card" title="Change payment">
            <div className="CardImage">
              <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png"/>
            </div>
            <div className="CardBody">
              <div>
                <h2 className="CardText">
                  <strong>1.0 DEPAY</strong>
                </h2>
                <h3 className="CardText">
                  <small>$12.21 USD</small>
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
            Pay $12.21 USD
          </button>
        </div>
      }
    />
  )
}
