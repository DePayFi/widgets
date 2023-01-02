import Dialog from '../components/Dialog'
import React, { useState, useContext } from 'react'
import SelectionContext from '../contexts/SelectionContext'
import { Blockchain } from '@depay/web3-blockchains'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { setSelection } = useContext(SelectionContext)
  const { navigate } = useContext(NavigateStackContext)
  const stacked = Object.keys(props.selection).length > 1

  const blockchains = [
    Blockchain.findByName('ethereum'),
    Blockchain.findByName('bsc'),
    Blockchain.findByName('polygon'),
  ]

  const selectBlockchain = (blockchain)=>{
    window._depay_token_selection_selected_blockchain = blockchain.name
    setSelection(Object.assign(props.selection, { blockchain }))
    if(stacked) {
      navigate('back')
    } else {
      props.resolve(blockchain)
    }
  }

  const elements = blockchains.map((blockchain, index)=>{
    return(
      <div key={ index } className="Card Row" onClick={ ()=>selectBlockchain(blockchain) }>
        <div className="CardImage">
          <img className="transparent" src={blockchain.logo}/>
        </div>
        <div className="CardBody">
          <span className="CardText">
            {blockchain.label}
          </span>
        </div>
      </div>
    )
  })

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <div>
            <h1 className="LineHeightL FontSizeL">Select Blockchain</h1>
          </div>
        </div>
      }
      stacked={stacked}
      bodyClassName="ScrollHeight"
      body={
        <div className="PaddingTopS">
          { elements }
        </div>
      }
      footer={
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS">
        </div>
      }
    />
  )
}
