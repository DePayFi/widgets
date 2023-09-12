import Blockchains from '@depay/web3-blockchains'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import format from '../helpers/format'
import React, { useContext, useEffect, useState } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default ()=> {

  const { accept } = useContext(ConfigurationContext)
  const { navigate } = useContext(NavigateStackContext)

  const blockchains = [...new Set(accept.map((configuration)=>configuration.blockchain))].map((blockchainName)=>Blockchains[blockchainName])

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div>
            <h1 className="LineHeightL FontSizeL">Available blockchains</h1>
          </div>
        </div>
      }
      body={
        <div className="MaxHeight PaddingTopM PaddingBottomM">
          {
            blockchains.map((blockchain, index)=>{
              return(
                <div key={ index } className="Card Row">
                  <div className="CardImage">
                    <img className="transparent BlockchainLogo small" src={blockchain.logo} style={{ backgroundColor: blockchain.logoBackgroundColor }} />
                  </div>
                  <div className="CardBody">
                    <span className="CardText">
                      {blockchain.label}
                    </span>
                  </div>
                </div>
              )
            })
          }
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button type="button" className="ButtonPrimary" onClick={()=>navigate('back')}>
            Go back
          </button>
        </div>
      }
    />
  )
}
