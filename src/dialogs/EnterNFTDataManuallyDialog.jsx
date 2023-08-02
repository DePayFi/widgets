/*#if _EVM

import { getWallets } from '@depay/web3-wallets-evm'
import { request } from '@depay/web3-client-evm'
import { Token } from '@depay/web3-tokens-evm'

/*#elif _SOLANA

import { getWallets } from '@depay/web3-wallets-solana'
import { request } from '@depay/web3-client-solana'
import { Token } from '@depay/web3-tokens-solana'

//#else */

import { getWallets } from '@depay/web3-wallets'
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
import { supported } from '../blockchains'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)
  const [ blockchain, setBlockchain ] = useState()
  const { selection, setSelection } = useContext(SelectionContext)
  const [ addresses, setAddresses ] = useState('')
  const [ address, setAddress ] = useState('')
  const [ id, setId ] = useState('')
  const [ image, setImage ] = useState('')
  const [ link, setLink ] = useState('')
  const [ name, setName ] = useState('')
  const [ idRequired, setIdRequired ] = useState(false)

  const confirm = ()=>{
    let blockchain = selection?.blockchain?.name || selection?.blockchain || selection?.collection?.blockchain
    setSelection(Object.assign(props.selection, { nft: {
      blockchain,
      address: address.length ? address : undefined,
      addresses: addresses.length ? addresses.split("\n").map((address)=>address.replace(/\s*/, '')) : undefined,
      id: id.length ? id : undefined,
      image,
      name,
      link,
      type: supported.solana.includes(blockchain) ? 'metaplex' : (idRequired ? '1155' : '721')
    }}))
    navigate('ConfirmNFTSelection')
  }

  const startWithBlockchain = (name)=> {
    let blockchain = Blockchains.findByName(name)
    setBlockchain(blockchain)
    setSelection(Object.assign(props.selection, { blockchain, token: undefined }))
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
    setAddress('')
    setAddresses('')
    setId('')
    setImage('')
    setLink('')
    setName('')
    setIdRequired(false)
    setBlockchain(selection.blockchain)
  }, [selection.blockchain])

  useEffect(()=>{
    let blockchain = selection?.blockchain?.name || selection?.blockchain || selection?.collection?.blockchain
    let checkForIdRequired = async()=>{
      if(blockchain && !supported.solana.includes(blockchain)) {
        let balanceWithId
        try { balanceWithId = await request({ blockchain, address, method: 'balanceOf', api: Token[blockchain][1155], params: [address, '1'] }) } catch {}
        setIdRequired(!!balanceWithId)
      }
    }
    checkForIdRequired()
  }, [address])

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <div>
            <h1 className="LineHeightL FontSizeL">Enter NFT information</h1>
          </div>
          <div className="PaddingTopS PaddingBottomS">
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
      }
      bodyClassName="ScrollHeight"
      body={
        <div className="PaddingLeftM PaddingRightM">
          <div>
            {
              supported.solana.includes(selection?.blockchain?.name) &&
              <div>
                <div className="PaddingTopXS TextLeft">
                  <label htmlFor="DePayWidgetsEnterNFTTokenAddresses">
                    <div className="FontSizeS Opacity05">Token Mint Addresses</div>
                  </label>
                </div>
                <div className="PaddingTopXS PaddingBottomS TextLeft">
                  <textarea id="DePayWidgetsEnterNFTTokenAddresses" name="DePayWidgetsEnterNFTTokenAddress" value={ addresses } onChange={ (event)=>setAddresses(event.target.value) } placeholder={ "4LWoVdJWNFQCvDZsf2EP6xD8xAF6S7RhQKkA5gjxJEnn\n979vHrvJ5d4CoCv2Hx5PHN837dsJe9ijhNAQwmY7hpcx" } className="InputField small" rows={4} style={{ resize: "vertical", minHeight: "78px", width: "100%" }} />
                  <div className="FontSizeXS PaddingLeftXS PaddingRightXS Opacity03 LineHeightXS">
                    Separate each one with a new line break.
                  </div>
                </div>
              </div>
            }
            {
              !supported.solana.includes(selection?.blockchain?.name) &&
              <div>
                <div className="PaddingTopXS TextLeft">
                  <label htmlFor="DePayWidgetsEnterNFTTokenAddress">
                    <div className="FontSizeS Opacity05">Token Contract Address</div>
                  </label>
                </div>
                <div className="PaddingTopXS PaddingBottomS TextLeft">
                  <input id="DePayWidgetsEnterNFTTokenAddress" name="DePayWidgetsEnterNFTTokenAddress" value={ address } onChange={ (event)=>setAddress(event.target.value) } placeholder={ "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb" } className="InputField small" style={{ width: "100%" }} />
                </div>
              </div>
            }
          </div>
          { idRequired &&
            <div>
              <div className="PaddingTopXS TextLeft">
                <label htmlFor="DePayWidgetsEnterNFTTokenId">
                  <span className="FontSizeS Opacity05">Token ID</span>
                </label>
              </div>
              <div className="PaddingTopXS PaddingBottomS TextLeft">
                <input id="DePayWidgetsEnterNFTTokenId" name="DePayWidgetsEnterNFTTokenId" value={ id } onChange={ (event)=>setId(event.target.value) } placeholder="35347623114821255323888368639026081793120226253597860997754787919489216283624" className="InputField small" />
              </div>
            </div>
          }
          <div>
            <div className="PaddingTopXS TextLeft">
              <label htmlFor="DePayWidgetsEnterNFTName">
                <span className="FontSizeS Opacity05">NFT Name</span>
              </label>
            </div>
            <div className="PaddingTopXS PaddingBottomS TextLeft">
              <input id="DePayWidgetsEnterNFTName" name="DePayWidgetsEnterNFTName" value={ name } onChange={ (event)=>setName(event.target.value) } placeholder={ supported.solana.includes(selection?.blockchain?.name) ? 'SMB' : 'CryptoPunks' } className="InputField small" />
            </div>
          </div>
          <div>
            <div className="PaddingTopXS TextLeft">
              <label htmlFor="DePayWidgetsEnterNFTImage">
                <span className="FontSizeS Opacity05">Image URL</span>
              </label>
            </div>
            <div className="PaddingTopXS PaddingBottomS TextLeft">
              <input id="DePayWidgetsEnterNFTImage" name="DePayWidgetsEnterNFTImage" value={ image } onChange={ (event)=>setImage(event.target.value) } placeholder={ supported.solana.includes(selection?.blockchain?.name) ? 'https://img-cdn.magiceden.dev/rs:fill:128:128:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/smb_gen3_pfp_1688353503184.png' : 'https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&w=128' } className="InputField small" />
            </div>
          </div>
          <div>
            <div className="PaddingTopXS TextLeft">
              <label htmlFor="DePayWidgetsEnterNFTLink">
                <span className="FontSizeS Opacity05">Link URL</span>
              </label>
            </div>
            <div className="PaddingTopXS PaddingBottomS TextLeft">
              <input id="DePayWidgetsEnterNFTLink" name="DePayWidgetsEnterNFTLink" value={ link } onChange={ (event)=>setLink(event.target.value) } placeholder={ supported.solana.includes(selection?.blockchain?.name) ? "https://magiceden.io/marketplace/smb_gen3" : "https://opensea.io/collection/cryptopunks" } className="InputField small" />
            </div>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className={['ButtonPrimary', (!image.length || (!address.length && !addresses.length) || !link.length || !name.length || (idRequired && !id.length) ? 'disabled' : '')].join(' ')} onClick={ ()=>{
            if(!image.length || (!address.length && !addresses.length) || !link.length || !name.length || (idRequired && !id.length)) { return }
            confirm()
          }}>
            Continue
          </button>
        </div>
      }
    />
  )
}

