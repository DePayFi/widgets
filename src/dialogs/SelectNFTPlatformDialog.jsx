import ChevronRight from '../components/ChevronRight'
import Dialog from '../components/Dialog'
import { OpenSea } from '../helpers/logos'
import React, { useContext } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { navigate } = useContext(NavigateStackContext)
  
  const select = (marketplace)=>{
    navigate(marketplace.navigate)
  }

  const elements = [
    { name: 'OpenSea', navigate: 'SelectNFTContractOnOpenSea', logo: OpenSea },
  ].map((marketplace, index)=>{
    return(
      <div key={ index } className="Card Row" onClick={ ()=>select(marketplace) }>
        <div className="CardImage">
          <img src={ marketplace.logo }/>
        </div>
        <div className="CardBody">
          <div className="CardTokenSymbol" title={ marketplace.name }>
            <span className="CardText">
              { marketplace.name }
            </span>
          </div>
          <div className="CardTokenName PaddingTopXS">
            <ChevronRight/>
          </div>
        </div>
      </div>
    )
  })

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <div>
            <h1 className="LineHeightL FontSizeL">Select NFT</h1>
          </div>
          <div className="PaddingTopXS PaddingBottomS">
            <span className="FontSizeM Opacity05">Choose which marketplace</span>
          </div>
        </div>
      }
      bodyClassName="ScrollHeight"
      body={
        <div className="">
          { elements }
        </div>
      }
    />
  )
}
