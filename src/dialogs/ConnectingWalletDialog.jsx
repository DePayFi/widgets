import { ReactDialog } from 'depay-react-dialog'
import React, { useState } from 'react'

export default (props)=> {

  let wallet = props.wallet
  let walletName = wallet?.name ? wallet.name : 'wallet'
  let walletLogo = wallet?.logo ? wallet.logo : undefined
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
            <div className="GraphicWrapper">
              <img className="Graphic" src={walletLogo}/>
            </div>
          }

          <h1 className="Text FontSizeL PaddingTopS FontWeightBold">Connect Wallet</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <strong className="FontSizeM">
              This payment requires access to your wallet, please login and authorize access to your { walletName } account to continue.
            </strong>
          </div>
        </div>

        <div className="DialogFooter">
          <div className="PaddingTopXS PaddingRightM PaddingLeftM">
            <button className='ButtonPrimary wide' onClick={props.connect}>
              Connect
            </button>
          </div>
          <a href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=WidgetV2'} rel="noopener noreferrer" target="_blank" className="FooterLink">by DePay</a>
        </div>
      </div>
    </ReactDialog>
  )
}
