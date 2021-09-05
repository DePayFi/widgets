import WalletContext from '../contexts/WalletContext'
import Dialog from '../components/Dialog'
import React, { useContext } from 'react'

export default ()=> {

  const { wallet, connect } = useContext(WalletContext)

  let walletName = wallet?.name ? wallet.name : 'wallet'
  let walletLogo = wallet?.logo ? wallet.logo : undefined

  return(
    <Dialog
      body={
        <div>
          { walletLogo &&
            <div className="GraphicWrapper">
              <img className="Graphic" src={walletLogo}/>
            </div>
          }
          <h1 className="FontSizeL PaddingTopS FontWeightBold">Connect Wallet</h1>
          <div className="PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <strong className="FontSizeM">
              This payment requires access to your wallet, please login and authorize access to your { walletName } account to continue.
            </strong>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM">
          <button className='ButtonPrimary wide' onClick={connect}>
            Connect
          </button>
        </div>
      }
    />
  )
}
