import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorGraphic from '../graphics/wallets/error'
import link from '../helpers/link'
import PaymentTrackingContext from '../contexts/PaymentTrackingContext'
import React, { useContext } from 'react'
import WalletContext from '../contexts/WalletContext'

export default ()=> {

  const { close } = useContext(ClosableContext)
  const { transaction } = useContext(PaymentTrackingContext)
  const { account, wallet } = useContext(WalletContext)

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
            <ErrorGraphic/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Validation failed</h1>
          <div className="Text PaddingBottomS PaddingLeftS PaddingRightS">
            <div className="PaddingTopS">
              <strong className="FontSizeM">Confirming the payment failed.</strong>
            </div>
            <div className="PaddingTopXS PaddingBottomS">
              <strong className="FontSizeM">Please contact support.</strong>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <a 
            href={`https://support.depay.com?wallet=${encodeURIComponent(wallet?.name)}&account=${account}&transaction=${transaction?.id}&query=${encodeURIComponent(`Payment validation failed`)}`}
            target="_blank"
            className="Card secondary small inlineBlock"
          >
            Contact support
          </a>
        </div>
      }
    />
  )
}
