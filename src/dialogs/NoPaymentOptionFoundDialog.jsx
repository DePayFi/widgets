import addressEllipsis from '../helpers/addressEllipsis'
import initDebug from '../helpers/initDebug'
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
          <div className="GraphicWrapper" onClick={initDebug}>
            <img className="Graphic" src={ QuestionsGraphic }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">No Payment Option Found</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
            <strong className="FontSizeM">
              Correct wallet connected {addressEllipsis(walletAddress)}?
            </strong>
          </div>
          <div className="Text PaddingTopXS PaddingBottomXS PaddingLeftM PaddingRightM">
            <strong className="FontSizeM">
              Please make sure you have cryptocurrencies on one of the following blockchains:
            </strong>
          </div>
          <div className="Text PaddingTopXS PaddingBottomS PaddingLeftM PaddingRightM">
            <span className="FontSizeS">
              { [...new Set(accept.map((accept)=>accept.blockchain))].map((blockchain)=>Blockchains[blockchain].label).join(', ') }.
            </span>
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
