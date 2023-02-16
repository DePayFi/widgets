import allWallets from '../helpers/allWallets'
import QuestionMarkIcon from '../components/QuestionMarkIcon'
import Dialog from '../components/Dialog'
import React, { useState, useEffect, useContext, useRef } from 'react'
import SelectWalletList from '../components/SelectWalletList'
import { getWallets } from '@depay/web3-wallets'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const [ searchTerm, setSearchTerm ] = useState('')
  const [ dialogAnimationFinished, setDialogAnimationFinished ] = useState(false)
  const searchElement = useRef()
  const { navigate } = useContext(NavigateStackContext)

  let prioritizedWallets = getWallets().map((wallet, index)=>{
    if(wallet.name == 'Phantom') { return }
    return(
      <div key={index} className="PaddingBottomXS">
        <button
          className="Card small"
          title={`Connect ${wallet.name}`}
          onClick={()=>{
            props.setWallet(allWallets.find((aWallet)=>aWallet.extension == wallet.constructor.info.name))
            navigate('ConnectWallet')
          }}
        >
          <div className="CardImage">
            <img className="transparent" src={wallet.logo} className="WalletLogoS"/>
          </div>
          <div className="CardBody">
            <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
              <div className="CardText FontWeightMedium">
                { wallet.name }
              </div>
              <div className="LightGreen">
                <span className="LightGreen" style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Installed
              </div>
            </div>
          </div>
        </button>
      </div>
    )
  }).filter((wallet)=>!!wallet)

  useEffect(()=>{
    setTimeout(()=>{
      setDialogAnimationFinished(true)
      searchElement.current.click()
      searchElement.current.focus()
    }, 200)
  }, [])

  return(
    <Dialog
      alternativeHeaderAction={
        <button onClick={ ()=>navigate('WhatIsAWallet') } className="ButtonCircular" title="What is a wallet?">
          <QuestionMarkIcon/>
        </button>
      }
      header={
        <div>
          <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft">
            <h1 className="LineHeightL FontSizeL">Connect a wallet</h1>
          </div>
          { prioritizedWallets &&
            <div className="PaddingBottomXS PaddingLeftS PaddingRightS PaddingTopS">
              { prioritizedWallets }
            </div>
          }
          <div className="PaddingBottomXS PaddingLeftS PaddingRightS PaddingTopXS">
            <div className="Row">
              <input className="Search" value={ searchTerm } onChange={ (event)=>{ setSearchTerm(event.target.value) } } placeholder="Search by name" ref={ searchElement }/>
            </div>
          </div>
        </div>
      }
      bodyClassName={ "PaddingBottomXS" }
      body={
        <div className="ScrollHeightM PaddingTopXS">
          { dialogAnimationFinished &&
            <SelectWalletList setWallet={ props.setWallet } searchTerm={ searchTerm }/>
          }
        </div>
      }
      hideFooter={ true }
    />
  )
}
