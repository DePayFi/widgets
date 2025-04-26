/*#if _EVM

import { wallets } from '@depay/web3-wallets-evm'

/*#elif _SOLANA

import { wallets } from '@depay/web3-wallets-svm'

//#else */

import { wallets } from '@depay/web3-wallets'

//#endif

import Blockchains from '@depay/web3-blockchains'
import Dialog from '../components/Dialog'
import React, {} from 'react'

export default (props)=>{

  let blockchains = props.wallet.extensions.map((extension)=>wallets[extension].info.blockchains).flat()

  if(props.accept) {
    blockchains = blockchains.filter((blockchain)=>{
      return props.accept.some((configuration)=>configuration.blockchain === blockchain)
    })
  }

  const selectBlockchain = (blockchain)=>{
    props.onSelect(props.wallet.extensions.find((extension)=>wallets[extension].info.blockchains.includes(blockchain)))
  }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM">
          { props.wallet?.logo &&
            <div className="PaddingTopXS">
              <div className="LineHeightL FontSizeL PaddingTopS">
                <span className="CardImage rounded large">
                  <img className="transparent" src={ props.wallet.logo }/>
                </span>
              </div>
            </div>
          }
          <div>
            <h1 className="LineHeightL Text FontSizeL FontWeightBold">Select Blockchain</h1>
          </div>
        </div>
      }
      stacked={true}
      bodyClassName="ScrollHeight"
      body={
        <div>

          {
            blockchains.map((blockchain)=>{
              return(
                <div key={ blockchain } className="Card Row TextLeft" onClick={ ()=>selectBlockchain(blockchain) }>
                  <div className="CardImage">
                    <img className="transparent BlockchainLogo" src={ Blockchains[blockchain].logo } style={{ backgroundColor: Blockchains[blockchain].logoBackgroundColor }}/>
                  </div>
                  <div className="CardBody">
                    <span className="CardText">
                      { Blockchains[blockchain].label }
                    </span>
                  </div>
                </div>
              )
            })
          }

        </div>
      }
      footer={ null }
    />
  )
}
