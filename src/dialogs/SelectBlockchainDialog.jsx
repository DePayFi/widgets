import Blockchains from '@depay/web3-blockchains'
import Dialog from '../components/Dialog'
import Fuse from 'fuse.js'
import isMobile from '../helpers/isMobile'
import React, { useState, useContext, useRef } from 'react'
import SelectionContext from '../contexts/SelectionContext'
import { debounce } from 'lodash'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { supported } from '../blockchains'

export default (props)=> {

  const { setSelection } = useContext(SelectionContext)
  const [ searchTerm, setSearchTerm ] = useState('')
  const { navigate } = useContext(NavigateStackContext)
  const stacked = props.stacked || Object.keys(props.selection).length > 1
  const allBlockchains = supported.map((blockchainName)=>Blockchains[blockchainName])
  const [ blockchains, setBlockchains ] = useState(allBlockchains)
  const searchElement = useRef()
  const fuse = new Fuse(allBlockchains, { keys: ['label', 'name'], threshold: 0.3, ignoreFieldNorm: true })

  const selectBlockchain = (blockchain)=>{
    window._depay_token_selection_selected_blockchain = blockchain.name
    setSelection(Object.assign(props.selection, { blockchain }))
    if(stacked && props.navigateBack !== false) {
      navigate('back')
    } else {
      props.resolve(blockchain)
    }
  }

  const onChangeSearch = (event)=>{
    setSearchTerm(event.target.value)
    if(event.target.value.length > 1) {
      setBlockchains(fuse.search(event.target.value).map((result)=>result.item))
    } else {
      setBlockchains(allBlockchains)
    }
  }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS">
          <div>
            <h1 className="LineHeightL FontSizeL">Select Blockchain</h1>
            <div className="PaddingTopS TextLeft">
              <input value={ searchTerm } autoFocus={ !isMobile() } onChange={ onChangeSearch } className="Search" placeholder="Search by name" ref={searchElement}/>
            </div>
          </div>
        </div>
      }
      stacked={stacked}
      bodyClassName="ScrollHeight"
      body={
        <div>
          {
            blockchains.map((blockchain, index)=>{
              return(
                <div key={ index } className="Card Row" onClick={ ()=>selectBlockchain(blockchain) }>
                  <div className="CardImage">
                    <img className="transparent BlockchainLogo" src={ blockchain.logo } style={{ backgroundColor: blockchain.logoBackgroundColor }}/>
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
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS">
        </div>
      }
    />
  )
}
