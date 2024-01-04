/*#if _EVM

import { getWallets, wallets } from '@depay/web3-wallets-evm'

/*#elif _SOLANA

import { getWallets, wallets } from '@depay/web3-wallets-solana'

//#else */

import { getWallets, wallets } from '@depay/web3-wallets'

//#endif

import allWallets from '../helpers/allWallets'
import Dialog from '../components/Dialog'
import DropDown from '../components/DropDown'
import isMobile from '../helpers/isMobile'
import MenuIcon from '../components/MenuIcon'
import platformForWallet from '../helpers/platformForWallet'
import React, { useState, useEffect, useContext, useRef } from 'react'
import safeUniversalUrl from '../helpers/safeUniversalUrl'
import SelectWalletList from '../components/SelectWalletList'
import { get as getPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const [ searchTerm, setSearchTerm ] = useState('')
  const [ detectedWallets, setDetectedWallets ] = useState([])
  const [ previouslyConnectedWallet, setPreviouslyConnectedWallet ] = useState()
  const [ showDropDown, setShowDropDown ] = useState(false)
  const [ dialogAnimationFinished, setDialogAnimationFinished ] = useState(false)
  const searchElement = useRef()
  const { navigate } = useContext(NavigateStackContext)

  const onClickWallet = (walletMetaData, wallet)=>{
    if(walletMetaData.via == 'detected') {
      if(walletMetaData.connectionType == 'app') {
        wallet.account().then((account)=>{
          if(account){
            props.resolve(account, wallet)
          }
        })
        props.setWallet(walletMetaData)
        navigate('ConnectWallet')
      } else if(walletMetaData.connectionType == 'extension') {
        props.setWallet(walletMetaData)
        props.connectExtension(walletMetaData)
        navigate('ConnectWallet')
      }
    } else if(isMobile()) {
      const platform = platformForWallet(walletMetaData)
      if(platform && platform.open) {
        props.openInApp(walletMetaData)
        props.setWallet(walletMetaData)
        navigate('ConnectWallet')
      } else {
        props.connectViaRedirect(walletMetaData)
        props.setWallet(walletMetaData)
        navigate('ConnectWallet')
      }
    } else {
      props.setWallet(walletMetaData)
      navigate('ConnectWallet')
    }
  }

  useEffect(()=>{
    let wallets = []
    getWallets({
      drip: (wallet)=>{
        wallets = wallets.concat(wallet)
        setDetectedWallets(wallets)
      }
    })

    let previouslyConnectedWalletName = getPreviouslyConnectedWallet()
    let previouslyConnectedWallet = allWallets.find((wallet)=>wallet.name == previouslyConnectedWalletName) || allWallets.find((wallet)=>wallet.name == previouslyConnectedWalletName)
    if(previouslyConnectedWallet) {
      setPreviouslyConnectedWallet(previouslyConnectedWallet)
    }
  }, [])

  useEffect(()=>{
    setTimeout(()=>{
      setDialogAnimationFinished(true)
      if(!isMobile()) {
        if(searchElement.current){
          searchElement.current.click()
          searchElement.current.focus()
        }
      }
    }, 200)
  }, [])

  return(
    <Dialog
      header={
        <div>
          <div className="PaddingTopS PaddingLeftM PaddingRightM TextLeft PaddingBottomS">
            <h1 className="LineHeightL FontSizeL">Connect a wallet</h1>
          </div>
          { ((detectedWallets && detectedWallets.length > 0) || previouslyConnectedWallet) &&
            <div className="PaddingBottomXS PaddingLeftS PaddingRightS">
              {
                detectedWallets.filter((wallet, index, array)=>{
                  return array.findIndex(target => (target?.info?.name === wallet?.info?.name)) === index
                }).map((wallet, index)=>{
                  const walletMetaData = allWallets.find((walletFromList)=>walletFromList.name === (wallet.info ? wallet.info.name : wallet.name))
                  if(!walletMetaData){ return null }
                  let connectionType = 'app'
                  if(wallet && wallet.constructor && ![wallets.WalletConnectV1, wallets.WalletConnectV2, wallets.WalletLink].includes(wallet.constructor)) {
                    connectionType = 'extension'
                  }
                  return(
                    <div key={index} className="PaddingBottomXS">
                      <button
                        type="button"
                        className="Card small"
                        title={`Connect ${walletMetaData.name}`}
                        onClick={ ()=>{
                          onClickWallet({ ...walletMetaData, via: 'detected', connectionType }, wallet)
                        }}
                      >
                        <div className="CardImage">
                          <img className="transparent" src={walletMetaData.logo} className="WalletLogoS"/>
                        </div>
                        <div className="CardBody">
                          <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
                            <div className="CardText FontWeightMedium">
                              { walletMetaData.name }
                            </div>
                            <div className="LightGreen"><span className="LightGreen" style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Connect detected { connectionType }</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })
              }
              {
                previouslyConnectedWallet && !detectedWallets.find((wallet)=>previouslyConnectedWallet.name === (wallet.info ? wallet.info.name : wallet.name)) &&
                <div className="PaddingBottomXS">
                  <button
                    type="button"
                    className="Card small"
                    title={`Connect ${previouslyConnectedWallet.name}`}
                    onClick={ ()=>{
                      onClickWallet({ ...previouslyConnectedWallet, via: 'previouslyConnected', connectionType: 'app' })
                    }}
                  >
                    <div className="CardImage">
                      <img className="transparent" src={previouslyConnectedWallet.logo} className="WalletLogoS"/>
                    </div>
                    <div className="CardBody">
                      <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
                        <div className="CardText FontWeightMedium">
                          { previouslyConnectedWallet.name }
                        </div>
                        <div className="Opacity05"><span style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Used previously</div>
                      </div>
                    </div>
                  </button>
                </div>
              }
            </div>
          }
          <div className="PaddingBottomXS PaddingLeftS PaddingRightS PaddingTopXS">
            <div className="Row">
              <input className="Search" value={ searchTerm } onChange={ (event)=>{ setSearchTerm(event.target.value) } } placeholder="Search by name" ref={ searchElement }/>
            </div>
          </div>
        </div>
      }
      alternativeHeaderAction={
        <span className="DropDownWrapper">
          <button type="button" onClick={ ()=>setShowDropDown(!showDropDown) } className="ButtonCircular" title="More options">
            <MenuIcon/>
          </button>
          { showDropDown && <DropDown hide={()=>setShowDropDown(false)}
            items={[
              { label: "What is a wallet?", action: ()=>{ navigate('WhatIsAWallet') } },
              { label: "Wallet missing?", action: ()=>{ window.open('mailto:support@depay.com?subject=Add wallet&body=Please enter the name of the wallet you want us to add:', '_blank') } },
            ]}
          /> }
        </span>
      }
      bodyClassName={ "PaddingBottomXS" }
      body={
        <div className="ScrollHeightM PaddingTopXS">
          { dialogAnimationFinished &&
            <SelectWalletList setWallet={ props.setWallet } searchTerm={ searchTerm } onClickWallet={ onClickWallet }/>
          }
        </div>
      }
      footer={ false }
    />
  )
}
