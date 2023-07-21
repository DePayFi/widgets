import Dialog from '../components/Dialog'
import isMobile from '../helpers/isMobile'
import React, { useState, useEffect, useContext } from 'react'

export default (props)=>{

  const [autoFocusFix, setAutoFocusFix] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const onChangeSearch = (event)=>{
    setSearchTerm(event.target.value)
  }

  useEffect(()=>{
    setTimeout(()=>setAutoFocusFix(true), 50)
  }, [])

  if(!autoFocusFix) { return null }

  return(
    <Dialog
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
          <div>
            <h1 className="LineHeightL FontSizeL">Select NFT</h1>
          </div>
          <div className="PaddingTopS PaddingBottomS">
            <input value={ searchTerm } onChange={ onChangeSearch } className="Search" autoFocus={!isMobile()} placeholder="Search name or paste address"/>
          </div>
        </div>
      }
      bodyClassName="ScrollHeight"
      body={
        <div>
        </div>
      }
      footer={
        <div className="PaddingTopS PaddingRightM PaddingLeftM PaddingBottomM">
          <div className="PaddingTopXS PaddingBottomXS">
            <div className="Link FontSizeS" onClick={ ()=>props.navigator.navigate('EnterDataManually') }>
              Can't find your NFT? Add it manually.
            </div>
          </div>
        </div>
      }
    />
  )
}
