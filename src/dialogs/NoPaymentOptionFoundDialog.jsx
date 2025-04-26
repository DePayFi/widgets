import addressEllipsis from '../helpers/addressEllipsis'

import Blockchains from '@depay/web3-blockchains'
import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import QuestionsGraphic from '../graphics/questions'
import React, { useContext, useEffect, useState } from 'react'
import WalletContext from '../contexts/WalletContext'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default ()=> {

  const { navigate } = useContext(NavigateStackContext)
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
        </div>
      }
      body={
        <div className="TextCenter">
          <div className="GraphicWrapper">
            <img className="Graphic" src={ QuestionsGraphic }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">No enough funds!</h1>
          <div className="Text PaddingTopS PaddingBottomXS PaddingLeftM PaddingRightM">
            <div className="Card tiny disabled center">
              <div className="ResponsiveText FontWeightLight TextCenter">{walletAddress}</div>
            </div>
          </div>
          <div className="Text PaddingTopXS PaddingBottomXS PaddingLeftM PaddingRightM">
            <strong className="FontSizeM">
              Please make sure you have enough funds on one of the following blockchains:
            </strong>
          </div>
          <div className="Text PaddingTopXS PaddingBottomS PaddingLeftM PaddingRightM">
            { [...new Set(accept.map((accept)=>accept.blockchain))].map((blockchain)=>{return(
              <div className="Card tiny disabled inlineBlock MarginRightXS MarginBottomXS">
                <img className="MarginRightXS" src={Blockchains[blockchain].logoWhiteBackground}/>
                <span className="ResponsiveText FontWeightLight">{Blockchains[blockchain].label}</span>
              </div>
            )}) }
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
