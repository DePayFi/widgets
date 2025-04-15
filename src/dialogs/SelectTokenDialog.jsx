/*#if _EVM

import { getWallets } from '@depay/web3-wallets-evm'
import Token from '@depay/web3-tokens-evm'
import { TokenImage } from '@depay/react-token-image-evm'

/*#elif _SVM

import { getWallets } from '@depay/web3-wallets-solana'
import Token from '@depay/web3-tokens-solana'
import { TokenImage } from '@depay/react-token-image-solana'

//#else */

import { getWallets } from '@depay/web3-wallets'
import Token from '@depay/web3-tokens'
import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChevronRight from '../components/ChevronRight'
import ClosableContext from '../contexts/ClosableContext'
import Dialog from '../components/Dialog'
import isMobile from '../helpers/isMobile'
import React, { useCallback, useState, useEffect, useContext, useRef } from 'react'
import SelectionContext from '../contexts/SelectionContext'
import { debounce } from 'lodash'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)
  const { setOpen } = useContext(ClosableContext)
  const { setSelection } = useContext(SelectionContext)
  const [ loading, setLoading ] = useState(false)
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ blockchain, setBlockchain ] = useState()
  const [ showAddToken, setShowAddToken ] = useState(false)
  const [ tokens, setTokens ] = useState([])
  const [ mainResolve, setMainResolve ] = useState()
  const searchElement = useRef()
  
  const startWithBlockchain = (name)=> {
    let blockchain = Blockchains.findByName(name)
    setBlockchain(blockchain)
    setSelection(Object.assign(props.selection, { blockchain, token: undefined }))
    setTokens(blockchain.tokens)
  }

  useEffect(()=>{
    (async ()=>{
      let blockchain
      setTimeout(()=>{
        if(blockchain){ return }
        if(window._depay_token_selection_selected_blockchain) {
          startWithBlockchain(window._depay_token_selection_selected_blockchain)
        } else {
          startWithBlockchain('ethereum')
        }
      }, 400)
      getWallets({ drip: (wallet)=>{
        if(wallet && !blockchain) {
          new wallet().connectedTo().then((name)=>{
            blockchain = Blockchains.findByName(name)
            if(window._depay_token_selection_selected_blockchain) {
              startWithBlockchain(window._depay_token_selection_selected_blockchain)
            } else if(name && name.length && blockchain && blockchain.tokens && blockchain.tokens.length) {
              startWithBlockchain(name)
            } else {
              startWithBlockchain('ethereum')
            }
          }).catch(()=>startWithBlockchain('ethereum'))
        } else {
          startWithBlockchain('ethereum')
        }
      }})
    })()
  }, [])

  useEffect(()=>{
    if(props.selection.blockchain) {
      setBlockchain(props.selection.blockchain)
      setTokens(props.selection.blockchain.tokens)
      if (searchElement.current) { 
        searchElement.current.value = ''
        if(!isMobile()){ searchElement.current.focus() }
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
    }
  }

  const searchTokens = useCallback(debounce((term, blockchainName)=>{
    fetch(`https://public.depay.com/tokens/search?blockchain=${blockchainName}&term=${term}`).then((response)=>{
      if(response.status == 200) {
        response.json().then((tokens)=>{
          setTokens(tokens)
          setLoading(false)
        }).catch(()=>reject)
      } else { reject() }
    }).catch(()=>reject)
  }, 500), [])

  const onChangeSearch = (event)=>{
    setShowAddToken(false)
    setLoading(true)
    let term = event.target.value
    setSearchTerm(term)
    if(term.match(/^0x/)) {
      setTokens([])
      let token
      try { token = new Token({ blockchain: blockchain.name, address: term }) } catch {}
      if(token == undefined){ 
        setLoading(false)
        return
      }
      Promise.all([
        token.name(),
        token.symbol(),
        token.decimals(),
        fetch(`https://public.depay.com/tokens/routable/${blockchain.name}/${term}`).then((response)=>{ if(response.status == 200) { return response.json() } }),
      ]).then(([name, symbol, decimals, routable])=>{
        setTokens([{
          name,
          symbol,
          decimals,
          address: term,
          blockchain: blockchain.name,
          routable: !!routable,
        }])
        setLoading(false)
      })
    } else if(term.length > 32 && term.length <= 44 && !(/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/).test(term)) {
      setTokens([])
      let token
      try { token = new Token({ blockchain: blockchain.name, address: term }) } catch {}
      if(token == undefined){ 
        setLoading(false)
        return
      }
      Promise.all([
        token.name(),
        token.symbol(),
        token.decimals(),
        fetch(`https://public.depay.com/tokens/routable/${blockchain.name}/${term}`).then((response)=>{ if(response.status == 200) { return response.json() } }),
      ]).then(([name, symbol, decimals, routable])=>{
        setTokens([{
          name,
          symbol,
          decimals,
          address: term,
          blockchain: blockchain.name,
          routable: !!routable,
        }])
        setLoading(false)
      })
    } else if(term && term.length) {
      setTokens([])
      searchTokens(term, blockchain.name)
    } else {
      setTokens(blockchain.tokens)
      setLoading(false)
    }
  }

  const select = (token)=> {
    if(token.address) { 
      if(token.address.match('0x')) {
        token.address = ethers.utils.getAddress(token.address)
      }
    }
    if(token.external_id) {
      if(token.external_id.match('0x')) {
        token.external_id = ethers.utils.getAddress(token.external_id)
      }
    }
    if(blockchain.tokens.find((majorToken)=>{ return majorToken.address == (token.address || token.external_id) })) {
      setOpen(false)
      props.resolve({
        blockchain: blockchain.name,
        address: token.address || token.external_id,
        logo: token.logo || token.image,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        routable: true,
      })
      setTimeout(props.unmount, 300)
    } else {
      setSelection(Object.assign(props.selection, { token }))
      navigate('ConfirmTokenSelection')
    }
  }

  let elements

  if(loading) {
    elements = [
      <div className="SkeletonWrapper" key={ 'loading' }>
        <div className="Skeleton" style={{ height: '69px', width: '100%' }}>
          <div className="SkeletonBackground">
          </div>
        </div>
      </div>
    ]
  } else {
    elements = tokens.map((token, index)=>{
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
  }

  if(!blockchain) {
    return(
      <Dialog
        header={
          <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
            <div>
              <h1 className="LineHeightL FontSizeL">Select Token</h1>
            </div>
            <div className="PaddingTopS PaddingBottomXS">
              <div className="SkeletonWrapper" key={ 'loading' }>
                <div className="Skeleton" style={{ height: '46px', borderRadius: '8px', width: '100%' }}>
                  <div className="SkeletonBackground">
                  </div>
                </div>
              </div>
            </div>
            <div className="PaddingTopXS PaddingBottomS">
              <div className="SkeletonWrapper" key={ 'loading' }>
                <div className="Skeleton" style={{ height: '50px', borderRadius: '8px', width: '100%' }}>
                  <div className="SkeletonBackground">
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        bodyClassName="ScrollHeight"
        body={
          <div className="">
            { [1,2,3,4,5,6].map((index)=>{
              return(
                <div className="SkeletonWrapper" key={ index } style={{ marginBottom: '1px' }}>
                  <div className="Skeleton" style={{ height: '69px', width: '100%' }}>
                    <div className="SkeletonBackground">
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        }
        footer={
          <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS">
            <div className="PaddingTopXS PaddingBottomXS" style={{ height: "32px" }}>
            </div>
          </div>
        }
      />
    )
  }

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
                <img className="transparent BlockchainLogo" src={ blockchain.logo } style={{ backgroundColor: blockchain.logoBackgroundColor }}/>
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
            <input value={ searchTerm } autoFocus={ !isMobile() } onBlur={ ()=>setShowAddToken(false) } onChange={ onChangeSearch } className="Search" placeholder="Search name or paste address" ref={searchElement}/>
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
