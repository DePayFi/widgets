import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorGraphic from '../graphics/error'
import PaymentContext from '../contexts/PaymentContext'
import React, { useContext } from 'react'
import WalletContext from '../contexts/WalletContext'

export default ()=> {

  const { close } = useContext(ClosableContext)
  const { transaction } = useContext(PaymentContext)
  const { wallet } = useContext(WalletContext)

  return(
    <Dialog
      stacked={ false }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
        </div>
      }
      body={
        <div className="TextCenter">
          <div className="GraphicWrapper">
            <img className="Graphic" src={ ErrorGraphic }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Payment Failed</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <strong className="FontSizeM">
              Unfortunately executing your payment failed, but you can try again.
            </strong>
            { transaction && 
              <div className="PaddingTopS">
                <a className="Link" title="Check your transaction on a block explorer" href={ link({ url: transaction?.url, target: '_blank', wallet }) } target="_blank" rel="noopener noreferrer">
                  View details
                </a>
              </div>
            }
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className='ButtonPrimary' onClick={()=>close()}>
            Try again
          </button>
        </div>
      }
    />
  )
}
