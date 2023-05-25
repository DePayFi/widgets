/*#if _EVM

import { request } from '@depay/web3-client-evm'
import { Token } from '@depay/web3-tokens-evm'

/*#elif _SOLANA

import { request } from '@depay/web3-client-solana'
import { Token } from '@depay/web3-tokens-solana'

//#else */

import { request } from '@depay/web3-client'
import { Token } from '@depay/web3-tokens'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChevronRight from '../components/ChevronRight'
import Dialog from '../components/Dialog'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import SelectionContext from '../contexts/SelectionContext'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { OpenSea } from '../helpers/logos'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)
  const { selection, setSelection } = useContext(SelectionContext)
  const [ id, setId ] = useState('')
  const [ image, setImage ] = useState('')
  const [ link, setLink ] = useState('')
  const [ name, setName ] = useState('')
  const [ idRequired, setIdRequired ] = useState(false)

  const confirm = ()=>{
    let blockchain = selection?.blockchain?.name || selection?.blockchain || selection?.collection?.blockchain
    setSelection(Object.assign(props.selection, { nft: {
      blockchain,
      id,
      image,
      name,
      link,
      address: selection.nft.address,
      type: idRequired ? '1155' : '721'
    }}))
    navigate('ConfirmNFTSelection')
  }

  useEffect(()=>{
    let blockchain = selection?.blockchain?.name || selection?.blockchain || selection?.collection?.blockchain
    let checkForIdRequired = async()=>{
      if(blockchain) {
        let balanceWithId
        try { balanceWithId = await request({ blockchain, address: selection.nft.address, method: 'balanceOf', api: Token[blockchain][1155], params: ['0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02', '1'] }) } catch {}
        if( balanceWithId ) { setIdRequired(true) }
      }
    }
    checkForIdRequired()
  }, [selection.blockchain])

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div>
            <div className="LineHeightL FontSizeL PaddingTopXS">
              <span className="CardImage small">
                <img className="transparent" src={ OpenSea }/>
              </span>
            </div>
          </div>
        </div>
      }
      body={
        <div className="PaddingLeftM PaddingRightM">
          <div>
            <div className="PaddingTopXS TextLeft">
              <label htmlFor="DePayWidgetsEnterNFTBlockchain">
                <span className="FontSizeM Opacity05">Select Blockchain</span>
              </label>
            </div>
            <div className="PaddingTopXS PaddingBottomS">
              <div className="Card small" onClick={ ()=>navigate('SelectBlockchain') }>
                <div className="CardImage small">
                  <img className="transparent" src={ Blockchains.findByName(selection?.blockchain?.name || selection?.blockchain || selection?.collection?.blockchain )?.logo }/>
                </div>
                <div className="CardBody FontSizeM">
                  { Blockchains.findByName(selection?.blockchain?.name|| selection?.blockchain || selection?.collection?.blockchain )?.label }
                </div>
                <div className="CardAction">
                  <ChevronRight/>
                </div>
              </div>
            </div>
          </div>
          { idRequired &&
            <div>
              <div className="PaddingTopXS TextLeft">
                <label htmlFor="DePayWidgetsEnterNFTTokenId">
                  <span className="FontSizeM Opacity05">Enter Token ID</span>
                </label>
              </div>
              <div className="PaddingTopXS PaddingBottomS TextLeft">
                <input id="DePayWidgetsEnterNFTTokenId" name="DePayWidgetsEnterNFTTokenId" value={ id } onChange={ (event)=>setId(event.target.value) } className="Search" />
              </div>
            </div>
          }
          <div>
            <div className="PaddingTopXS TextLeft">
              <label htmlFor="DePayWidgetsEnterNFTName">
                <span className="FontSizeM Opacity05">Enter NFT Name</span>
              </label>
            </div>
            <div className="PaddingTopXS PaddingBottomS TextLeft">
              <input id="DePayWidgetsEnterNFTName" name="DePayWidgetsEnterNFTName" value={ name } onChange={ (event)=>setName(event.target.value) } placeholder="CryptoPunks" className="Search" />
            </div>
          </div>
          <div>
            <div className="PaddingTopXS TextLeft">
              <label htmlFor="DePayWidgetsEnterNFTImage">
                <span className="FontSizeM Opacity05">Enter Image URL</span>
              </label>
            </div>
            <div className="PaddingTopXS PaddingBottomS TextLeft">
              <input id="DePayWidgetsEnterNFTImage" name="DePayWidgetsEnterNFTImage" value={ image } onChange={ (event)=>setImage(event.target.value) } placeholder="https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&w=128" className="Search" />
            </div>
          </div>
          <div>
            <div className="PaddingTopXS TextLeft">
              <label htmlFor="DePayWidgetsEnterNFTLink">
                <span className="FontSizeM Opacity05">Enter Link URL</span>
              </label>
            </div>
            <div className="PaddingTopXS PaddingBottomS TextLeft">
              <input id="DePayWidgetsEnterNFTLink" name="DePayWidgetsEnterNFTLink" value={ link } onChange={ (event)=>setLink(event.target.value) } placeholder="https://opensea.io/collection/cryptopunks" className="Search" />
            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className={['ButtonPrimary', (!image.length || !link.length || !name.length || (idRequired && !id.length) ? 'disabled' : '')].join(' ')} onClick={ ()=>{
            if(!image.length || !link.length || !name.length || (idRequired && !id.length)) { return }
            confirm()
          }}>
            Continue
          </button>
        </div>
      }
    />
  )
}

