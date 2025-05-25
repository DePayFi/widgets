import Blockchains from '@depay/web3-blockchains'
import Dialog from '../components/Dialog'
import QuestionsGraphic from '../graphics/wallets/questions'
import React, { useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)
  const { accept } = useContext(ConfigurationContext)
  const { wallet } = useContext(WalletContext)
  const blockchains = [...new Set(accept.map((configuration)=>configuration.blockchain))].map((blockchainName)=>Blockchains[blockchainName])

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <a 
            href={`https://support.depay.com?wallet=${encodeURIComponent(wallet?.name)}&blockchains=${blockchains.map((blockchain)=>blockchain.name).join(',')}&query=${encodeURIComponent(`Wallet Misses Blockchain Support`)}`}
            target="_blank"
            className="Card secondary small inlineBlock"
          >
            Contact support
          </a>
        </div>
      }
      body={
        <div className="TextCenter">
          <div className="GraphicWrapper">
            <QuestionsGraphic/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Missing Blockchain Support</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
            <div>
              <strong className="FontSizeM">
                The connected wallet doesn’t support the blockchains needed for this payment.
              </strong>
            </div>
            <div className="PaddingTopS">
              <strong className="FontSizeM">
                Please connect a different wallet that supports one of the available blockchains:
              </strong>
            </div>
          </div>
          <div className="PaddingBottomM">
            { blockchains.map((blockchain)=>{return(
              <div key={blockchain.name} className="Card tiny disabled inlineBlock MarginRightXS MarginBottomXS">
                <img className={"BlockchainLogo small bottomRight " + blockchain.name} style={{ backgroundColor: blockchain.logoBackgroundColor }} src={ blockchain.logo } alt={ blockchain.label } title={ blockchain.label }/>
                <span className="PaddingLeftXS ResponsiveText FontWeightLight">{blockchain.label}</span>
              </div>
            )}) }
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className="ButtonPrimary" onClick={ ()=>props.disconnect() }>
            Connect another wallet
          </button>
        </div>
      }
    />
  )
}
