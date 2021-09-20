import { ReactDialog } from 'depay-react-dialog'
import React, { useState } from 'react'

export default (props)=> {

  let walletLogo = props.wallet?.logo ? props.wallet.logo : undefined
  const [open, setOpen] = useState(true)
  let close = ()=>{
    setOpen(false)
    setTimeout(props.unmount, 300)
  }

  return(
    <ReactDialog container={ props.container } close={ close } open={ open }>
      <div className="Dialog ReactDialogAnimation">
        
        <div className="DialogHeader">
          <div className="PaddingTopS PaddingLeftS PaddingRightS">
          </div>
        </div>

        <div className="DialogBody">
          { walletLogo &&
            <div className="GraphicWrapper PaddingTopM">
              <img className="Graphic" src={walletLogo}/>
            </div>
          }

          <h1 className="Text FontSizeL PaddingTopS FontWeightBold">Connect Wallet</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <strong className="FontSizeM">
              Your wallet is already open and asking for permission to connect to this website.
              Please find your wallet dialog and confirm connecting.
            </strong>
          </div>
        </div>

        <div className="DialogFooter">
          <a href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=WidgetV2'} rel="noopener noreferrer" target="_blank" className="FooterLink">by DePay</a>
        </div>
      </div>
    </ReactDialog>
  )
}
