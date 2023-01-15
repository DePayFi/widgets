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
  const { selection, setSelection } = useContext(SelectionContext)

  const select = (nft)=>{
    setSelection(Object.assign(props.selection, { nft }))
    navigate('ConfirmNFTSelection')
  }

  const searchForCollectionById = useCallback(debounce((id)=>{
    fetch(`https://api.opensea.io/api/v1/asset/${selection.nft.address}/${id}`)
    .then((response)=>{
      if(response.status != 200) { return resolve() }
      response.json().then(async(data)=>{
        let blockchain = data?.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//) ? BLOCKCHAIN_NAMES[data.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//)[1]] : undefined
        let result = {...selection.nft,
          blockchain,
          id: data.token_id,
          image: data.image_url,
          name: data.name,
          link: data.permalink,
        }
        setSearchResults([result])
        select(result)
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
      searchForCollectionById(term)
    } else {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetch(`https://api.opensea.io/api/v1/assets?asset_contract_address=${selection.nft.address}`)
    .then((response)=>{
      if(response.status != 200) { return resolve() }
      response.json()
        .then((data)=>{
          if(data.assets.length <= 6) {
            let results = data.assets.map((data)=>{
              let blockchain = data?.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//) ? BLOCKCHAIN_NAMES[data.permalink.match(/https:\/\/opensea\.io\/assets\/(\w*)\//)[1]] : undefined
              return({...selection.nft,
                blockchain,
                id: data.token_id,
                image: data.image_url,
                name: data.name,
                link: data.permalink,
              })
            })
            setSearchResults(results)
            if(results.length == 1){
              select(results[0])
            }
          }
        })
    })
  }, [])

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
            <label htmlFor="DePayWidgetsEnterCollectionId">
              <span className="FontSizeM Opacity05">Enter Token ID</span>
            </label>
          </div>
          <div className="PaddingTopXS PaddingBottomS TextLeft">
            <input id="DePayWidgetsEnterCollectionId" name="DePayWidgetsEnterCollectionId" value={ searchTerm } onChange={ onChangeTermSearch } className="Search" placeholder="35347623114821255323888368639026081793120226253597860997754787918389704654849"/>
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
