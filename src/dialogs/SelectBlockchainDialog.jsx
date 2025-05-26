import Blockchains from '@depay/web3-blockchains'
import debounce from '../helpers/debounce'
import Dialog from '../components/Dialog'
import Fuse from 'fuse.js'
import isMobile from '../helpers/isMobile'
import React, { useState, useContext, useRef, useEffect } from 'react'
import SelectionContext from '../contexts/SelectionContext'
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
  const listElement = useRef()
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

  useEffect(() => {

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && blockchains.length == 1) {
        selectBlockchain(blockchains[0])
        event.preventDefault()
        event.stopImmediatePropagation()
        return false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [blockchains])

  useEffect(() => {

    const focusNextElement = (event)=> {
      const focusable = Array.from(listElement.current.querySelectorAll(
        'button.Card'
      ));

      const index = focusable.indexOf(listElement.current.querySelector(':focus'));
      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus()
      } else if(index < focusable.length - 1) {
        focusable[0].focus()
        event.preventDefault()
        return false
      }
    }

    const focusPrevElement = (event)=> {
      const focusable = Array.from(listElement.current.querySelectorAll(
        'button.Card'
      ));

      const index = focusable.indexOf(listElement.current.querySelector(':focus'));
      if (index == 0) {
        searchElement.current.focus()
      } else if (index > 0 && index <= focusable.length - 1) {
        focusable[index - 1].focus()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        focusPrevElement(event)
      } else if (event.key === 'ArrowDown') {
        focusNextElement(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
        <div className="PaddingLeftS PaddingRightS PaddingBottomS" ref={ listElement }>
          {
            blockchains.map((blockchain, index)=>{
              return(
                <div key={ index } className="MarginBottomXS">
                  <button type="button" className="Card small" onClick={ ()=>selectBlockchain(blockchain) }>
                    <div className="CardImage small">
                      <img className="transparent BlockchainLogo" src={ blockchain.logo } style={{ backgroundColor: blockchain.logoBackgroundColor }}/>
                    </div>
                    <div className="CardBody">
                      <span className="CardText FontSizeM">
                        {blockchain.label}
                      </span>
                    </div>
                  </button>
                </div>
              )
            })
          }
        </div>
      }
      footer={ false }
    />
  )
}
