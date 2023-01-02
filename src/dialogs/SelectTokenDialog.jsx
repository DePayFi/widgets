import ChevronRight from '../components/ChevronRight'
import ClosableContext from '../contexts/ClosableContext'
import Dialog from '../components/Dialog'
import React, { useCallback, useState, useEffect, useContext, useRef } from 'react'
import SelectionContext from '../contexts/SelectionContext'
import { Blockchain } from '@depay/web3-blockchains'
import { debounce } from 'lodash'
import { getWallets } from '@depay/web3-wallets'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { Token } from '@depay/web3-tokens'
import { TokenImage } from '@depay/react-token-image'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)
  const { setOpen } = useContext(ClosableContext)
  const { setSelection } = useContext(SelectionContext)
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ blockchain, setBlockchain ] = useState()
  const [ showAddToken, setShowAddToken ] = useState(false)
  const [ tokens, setTokens ] = useState([])
  const [ mainResolve, setMainResolve ] = useState()
  const searchElement = useRef()
  const wallet = getWallets()[0]

  const startWithBlockchain = (name)=> {
    let blockchain = Blockchain.findByName(name)
    setBlockchain(blockchain)
    setSelection(Object.assign(props.selection, { blockchain, token: undefined }))
    setTokens(blockchain.tokens)
  }

  useEffect(()=>{
    if(wallet) {
      wallet.connectedTo().then((name)=>{
        let blockchain = Blockchain.findByName(name)
        if(window._depay_token_selection_selected_blockchain) {
          startWithBlockchain(window._depay_token_selection_selected_blockchain)
        } else if(name && name.length && blockchain && blockchain.tokens && blockchain.tokens.length) {
          startWithBlockchain(name)
        } else {
          startWithBlockchain('ethereum')
        }
      })
    } else {
      startWithBlockchain('ethereum')
    }
  }, [])

  useEffect(()=>{
    if(props.selection.blockchain) {
      setBlockchain(props.selection.blockchain)
      setTokens(props.selection.blockchain.tokens)
      if (searchElement.current) { 
        searchElement.current.value = ''
        searchElement.current.focus() 
      }
    }
  }, [props.selection, props.selection.blockchain])

  const onClickChangeBlockchain = ()=> {
    navigate('SelectBlockchain')
  }

  const onClickAddToken = ()=> {
    setShowAddToken(true)
    if (searchElement.current) { 
      searchElement.current.value = ''
      searchElement.current.focus() 
    }
  }

  const searchTokens = useCallback(debounce((term, blockchainName)=>{
    fetch(`https://public.depay.com/tokens/search?blockchain=${blockchainName}&term=${term}`).then((response)=>{
      if(response.status == 200) {
        response.json().then((tokens)=>{
          setTokens(tokens)
        }).catch(()=>reject)
      } else { reject() }
    }).catch(()=>reject)
  }, 300), [])

  const onChangeSearch = (event)=>{
    let term = event.target.value
    setSearchTerm(term)
    if(term.match(/^0x/)) {
      setTokens([])
      let token
      try { token = new Token({ blockchain: blockchain.name, address: term }) } catch {}
      if(token == undefined){ return }
      Promise.all([
        token.name(),
        token.symbol(),
        token.decimals()
      ]).then(([name, symbol, decimals])=>{
        setTokens([{
          name,
          symbol,
          decimals,
          address: term,
          blockchain: blockchain.name
        }])
      })
    } else if(term && term.length) {
      setTokens([])
      searchTokens(term, blockchain.name)
    } else {
      setTokens(blockchain.tokens)
    }
  }

  const select = (token)=> {
    if(blockchain.tokens.find((majorToken)=>{ return majorToken.address == (token.address || token.external_id) })) {
      setOpen(false)
      props.resolve({
        blockchain: blockchain.name,
        address: token.address || token.external_id,
        logo: token.logo || token.image,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals
      })
      setTimeout(props.unmount, 300)
    } else {
      setSelection(Object.assign(props.selection, { token }))
      navigate('ConfirmTokenSelection')
    }
  }

  const elements = tokens.map((token, index)=>{
    return(
      <div key={ `${index}-${token.address}` } className="Card Row" onClick={ ()=>select(token) }>
        <div className="CardImage">
          { token.logo && <img src={token.logo}/> }
          { token.image && <img src={token.image}/> }
          { !(token.logo || token.image) && <TokenImage blockchain={ token.blockchain } address={ token.external_id || token.address }/>}
        </div>
        <div className="CardBody">
          <div className="CardTokenSymbol" title={ token.symbol }>
            <span className="CardText">
              {token.symbol}
            </span>
          </div>
          <div className="CardTokenName" title={ token.name }>
            <span className="CardText">
              {token.name}
            </span>
          </div>
        </div>
      </div>
    )
  })

  if(blockchain == undefined) { return null }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <div>
            <h1 className="LineHeightL FontSizeL">Select Token</h1>
          </div>
          <div className="PaddingTopS PaddingBottomXS">
            <div className="Card small" onClick={ onClickChangeBlockchain }>
              <div className="CardImage small">
                <img className="transparent" src={ blockchain.logo }/>
              </div>
              <div className="CardBody FontSizeM">
                { blockchain.label }
              </div>
              <div className="CardAction">
                <ChevronRight/>
              </div>
            </div>
          </div>
          <div className="PaddingTopXS PaddingBottomS">
            <input value={ searchTerm } onChange={ onChangeSearch } className="Search" autoFocus placeholder="Search name or paste address" ref={searchElement}/>
            { showAddToken &&
              <div className="PaddingTopXS PaddingRightXS PaddingLeftXS">
                <div className="Tooltip"> 
                  <span className="TooltipArrowUp"/>
                  Enter token address here
                </div> 
              </div> 
            }
          </div>
        </div>
      }
      bodyClassName="ScrollHeight"
      body={
        <div className="">
          { elements }
        </div>
      }
      footer={
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS">
          <div className="PaddingTopXS PaddingBottomXS">
            <div className="Link FontSizeS" onClick={ onClickAddToken }>
              Token missing? Add it.
            </div>
          </div>
        </div>
      }
    />
  )
}
