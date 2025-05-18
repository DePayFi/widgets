import addressEllipsis from '../helpers/addressEllipsis'

import Blockchains from '@depay/web3-blockchains'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import QuestionsGraphic from '../graphics/wallets/questions'
import React, { useContext, useEffect, useState } from 'react'
import WalletContext from '../contexts/WalletContext'

export default ()=> {

  const { accept } = useContext(ConfigurationContext)
  const { close } = useContext(ClosableContext)
  const { wallet } = useContext(WalletContext)
  const [ walletAddress, setWalletAddress ] = useState()

  useEffect(()=>{
    wallet.account().then(setWalletAddress)
  }, [wallet])

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <button onClick={()=>{ window.open(`mailto:support@depay.com?subject=Not Enough Funds Error (${walletAddress}})`, '_blank') }} type="button" className="Card secondary small inlineBlock">
            Contact support
          </button>
        </div>
      }
      body={
        <div className="TextCenter">
          
          <div className="GraphicWrapper">
            <QuestionsGraphic/>
          </div>

          <div className="PaddingTopXS PaddingBottomXS">

            <h1 className="LineHeightL Text FontSizeL PaddingTopXS FontWeightBold">Not Enough Funds</h1>
            
            <div className="Text PaddingTopS PaddingBottomXS PaddingLeftM PaddingRightM">
              <strong className="FontSizeM">
                Please check that you have sufficient funds on one of these blockchains:
              </strong>
            </div>

            <div className="Text PaddingTopXS PaddingBottomS PaddingLeftM PaddingRightM">
              { [...new Set(accept.map((accept)=>accept.blockchain))].map((blockchain)=>{return(
                <div key={blockchain} className="Card tiny disabled inlineBlock MarginRightXS MarginBottomXS">
                  <img className={"BlockchainLogo small bottomRight " + Blockchains[blockchain].name} style={{ backgroundColor: Blockchains[blockchain].logoBackgroundColor }} src={ Blockchains[blockchain].logo } alt={ Blockchains[blockchain].label } title={ Blockchains[blockchain].label }/>
                  <span className="PaddingLeftXS ResponsiveText FontWeightLight">{Blockchains[blockchain].label}</span>
                </div>
              )}) }
            </div>

            <div className="Text PaddingBottomXS PaddingLeftM PaddingRightM">
              <div className="Card tiny disabled transparent center Opacity03">
                <div className="ResponsiveText FontWeightLight TextCenter">{walletAddress}</div>
              </div>
            </div>

          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={ close }>
            Ok
          </button>
        </div>
      }
    />
  )
}
