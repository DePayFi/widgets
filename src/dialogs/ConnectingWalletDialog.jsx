import Dialog from '../components/Dialog'
import React, { useState } from 'react'
import { getWallet } from 'depay-web3-wallets'

export default (props)=> {

  const wallet = getWallet()
  const walletName = wallet?.name ? wallet.name : 'wallet'
  const walletLogo = wallet?.logo ? wallet.logo : undefined
  
  if(props.pending) {
    return(
      <Dialog
        stacked={ true }
        body={
          <div>
            { walletLogo &&
              <div className="GraphicWrapper PaddingTopS PaddingBottomS">
                <img className="Graphic" src={walletLogo}/>
              </div>
            }
            <h1 className="Text FontSizeL FontWeightBold PaddingTopS">Connect Wallet</h1>
            <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
              <strong className="FontSizeM PaddingLeftM PaddingRightM">
                Your wallet is already open and asking for permission to connect.
                Please find your wallet dialog and confirm this connection.
              </strong>
            </div>
          </div>
        }
      />
    )
  } else {
    return(
      <Dialog
        stacked={ true }
        body={
          <div>
            { walletLogo &&
              <div className="GraphicWrapper PaddingTopS PaddingBottomS">
                <img className="Graphic" src={walletLogo}/>
              </div>
            }
            <h1 className="Text FontSizeL FontWeightBold PaddingTopS">Connect Wallet</h1>
            <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
              <p className="FontSizeM PaddingLeftM PaddingRightM">
                Access to your wallet is required. Please login and authorize access to your { walletName } account to continue.
              </p>
            </div>
          </div>
        }
        footer={
          <div className="PaddingTopXS PaddingRightM PaddingLeftM">
            <button className='ButtonPrimary wide' onClick={props.connect}>
              Connect
            </button>
          </div>
        }
      />
    )
  }
}
