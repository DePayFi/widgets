import Dialog from '../components/Dialog'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import SelectionContext from '../contexts/SelectionContext'
import { debounce } from 'lodash'
import { ethers } from 'ethers'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { OpenSea } from '../helpers/logos'

const BLOCKCHAIN_NAMES = {
  'ethereum': 'ethereum',
  'matic': 'polygon,'
}

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ searchResults, setSearchResults ] = useState([])
  const { setSelection } = useContext(SelectionContext)

  const select = (nft)=>{
    setSelection(Object.assign(props.selection, { nft }))
    navigate('ConfirmNFTSelection')
  }

  const dataForCollectionViaAsset = (address)=> {
    return new Promise((resolve, reject)=>{
      fetch(`https://api.opensea.io/api/v1/assets?asset_contract_address=${address}`)
      .then((response)=>{
        if(response.status != 200) { return resolve() }
        response.json()
          .then((data)=>resolve(data.assets ? data.assets[0] : undefined))
          .catch(()=>resolve())
      }).catch(()=>resolve())
    })
  }

  const searchContract = useCallback(debounce((address)=>{
      fetch(`https://api.opensea.io/api/v1/asset_contract/${address}`)
      .then((response)=>{
        if(response.status != 200) {
          setLoading(false)
          return 
        }
        response.json().then(async(data)=>{
          let result
          if(data.asset_contract_type == 'non-fungible') {
            let blockchain, holders
            let additionalData = await dataForCollectionViaAsset(address)
            if(additionalData) {
              blockchain = additionalData?.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//) ? BLOCKCHAIN_NAMES[additionalData.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//)[1]] : undefined
              holders = additionalData?.collection?.stats?.num_owners
            }
            result = {
              blockchain,
              holders,
              createdAt: data.created_date,
              image: data.image_url,
              name: data.collection ? data.collection.name : undefined,
              link: data.collection ? `https://opensea.io/collection/${data.collection.slug}` : undefined,
              address: ethers.utils.getAddress(data.address),
              type: '721'
            }
          } else if(data.asset_contract_type == 'semi-fungible') {
            if(data.symbol == 'OPENSTORE' && data.name == 'OpenSea Collection') {
              result = {
                id: null,
                address: ethers.utils.getAddress(data.address),
                type: '1155'
              }
            } else {
              let additionalData = await dataForCollectionViaAsset(address)
              let blockchain = additionalData?.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//) ? BLOCKCHAIN_NAMES[additionalData.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//)[1]] : undefined
              let holders = additionalData?.collection?.stats?.num_owners
              result = {
                blockchain,
                id: null,
                createdAt: data.created_date,
                image: data.image_url,
                name: data.collection ? data.collection.name : undefined,
                link: data.collection ? `https://opensea.io/collection/${data.collection.slug}` : undefined,
                address: ethers.utils.getAddress(data.address),
                type: '1155'
              }
            }
          } else { // like matic/polygon (which is not yet supported by opensea apis)
            if(data.address) {
              result = {
                address: ethers.utils.getAddress(data.address)
              }
            }
          }

          if(result) {
            if(result.type == undefined) {
              setSelection(Object.assign(props.selection, { nft: result, blockchain: (result.blockchain || 'polygon') }))
              navigate('EnterNFTDataForOpenSea')
              setSearchTerm('')
            } else if(result.id !== null) {
              select(result)
              setSearchResults([result])
              navigate('ConfirmNFTSelection')
            } else {
              setSelection(Object.assign(props.selection, { nft: result }))
              navigate('SelectNFTIdOnOpenSea')
              setSearchTerm('')
            }
          }

          setLoading(false)
        }).catch(()=>{ setLoading(false) })
      }).catch(()=>{ setLoading(false) })
  }, 500), [])

  const onChangeTermSearch = (event)=>{
    setLoading(true)
    setSearchResults([])
    let term = event.target.value
    setSearchTerm(term)
    if(term && term.length) {
      searchContract(term)
    } else {
      setLoading(false)
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
    elements = searchResults.map((result, index)=>{
      return(
        <div key={ index } className="Card Row" onClick={ ()=>select(result) }>
          <div className="CardImage">
            <img src={ result.image }/>
          </div>
          <div className="CardBody">
            <div className="CardTokenFullName" title={ result.name }>
              <span className="CardText">
                { result.name }
              </span>
            </div>
          </div>
        </div>
      )
    })
  }

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
          <div className="PaddingTopS PaddingBottomXS TextLeft">
            <label htmlFor="DePayWidgetsEnterContractAddress">
              <span className="FontSizeM Opacity05">Enter contract address</span>
            </label>
          </div>
          <div className="PaddingTopXS PaddingBottomS TextLeft">
            <input id="DePayWidgetsEnterContractAddress" name="DePayWidgetsEnterContractAddress" value={ searchTerm } onChange={ onChangeTermSearch } className="Search" autoFocus placeholder="0x495f947276749ce646f68ac8c248420045cb7b5e"/>
          </div>
        </div>
      }
      bodyClassName="ScrollHeight"
      body={
        <div>
          { elements }
        </div>
      }
    />
  )
}
