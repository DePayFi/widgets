/*#if _EVM

import { getWallets, wallets } from '@depay/web3-wallets-evm'

/*#elif _SVM

import { getWallets, wallets } from '@depay/web3-wallets-svm'

//#else */

import { getWallets, wallets } from '@depay/web3-wallets'

//#endif

import allWalletsOriginal from '../helpers/allWallets'
import capitalizeFirstChar from '../helpers/capitalizeFirstChar'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import DropDown from '../components/DropDown'
import isMobile from '../helpers/isMobile'
import MenuIcon from '../icons/MenuIcon'
import platformForWallet from '../helpers/platformForWallet'
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
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
  const { wallets: walletsConfiguration } = useContext(ConfigurationContext)
  const searchElement = useRef()
  const listElement = useRef()
  const { navigate } = useContext(NavigateStackContext)

  let allowList = walletsConfiguration?.allow || walletsConfiguration?.whitelist
  let allWallets
  if(walletsConfiguration?.sort || allowList) {
    allWallets = useMemo(()=>{
      let adjustedWallets = [...allWalletsOriginal]

      if(walletsConfiguration?.sort) {
        walletsConfiguration.sort.forEach((sortedWallet, newIndex)=>{
          let currentListIndex = adjustedWallets.findIndex((unsortedWallet)=>unsortedWallet.name === sortedWallet)
          if(currentListIndex > -1) {
            adjustedWallets.splice(newIndex, 0, adjustedWallets.splice(currentListIndex, 1)[0])
          }
        })
      }

      if(allowList) {
        adjustedWallets = adjustedWallets.filter((wallet)=>allowList.indexOf(wallet.name) > -1)
      }

      return adjustedWallets
    }, [walletsConfiguration])
  } else {
    allWallets = allWalletsOriginal
  }

  const onClickWallet = async(walletMetaData, wallet)=>{
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
      let extensionIsAvailable
      if(walletMetaData.extension) {
        extensionIsAvailable = await wallets[walletMetaData.extension].isAvailable()
      } else if (walletMetaData.extensions) {
        extensionIsAvailable = (await Promise.all(walletMetaData.extensions.map((extension)=>wallets[extension].isAvailable()))).filter(Boolean).length > 0
      }
      if(platform && platform.open) {
        if(!extensionIsAvailable) {
          props.openInApp(walletMetaData)
        }
        props.setWallet(walletMetaData)
        navigate('ConnectWallet')
      } else {
        if(!extensionIsAvailable) {
          props.connectViaRedirect(walletMetaData)
        }
        props.setWallet(walletMetaData)
        navigate('ConnectWallet')
      }
    } else {
      props.setWallet(walletMetaData)
      navigate('ConnectWallet')
    }
  }

  useEffect(() => {

    const focusNextElement = (event)=> {
      const focusable = Array.from(listElement.current.querySelectorAll(
        'button.Card'
      ));

      const index = focusable.indexOf(listElement.current.querySelector(':focus'));
      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus()
      } else if(index < focusable.length - 1) {
        focusable[0].focus()
        event.preventDefault()
        return false
      }
    }

    const focusPrevElement = (event)=> {
      const focusable = Array.from(listElement.current.querySelectorAll(
        'button.Card'
      ));

      const index = focusable.indexOf(listElement.current.querySelector(':focus'));
      if (index == 0) {
        searchElement.current.focus()
      } else if (index > 0 && index <= focusable.length - 1) {
        focusable[index - 1].focus()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        focusPrevElement(event)
      } else if (event.key === 'ArrowDown') {
        focusNextElement(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(()=>{
    if(allWallets.length === 1) {
      onClickWallet(allWallets[0])
    }
  }, [allWallets])

  useEffect(()=>{
    if(detectedWallets.length == 1) {
      const wallet = allWallets.find((wallet)=>wallet.name === detectedWallets[0].info.name)
      if(wallet.autoSelect) {
        onClickWallet(wallet)
      }
    }
  }, [detectedWallets])

  useEffect(()=>{
    let wallets = []
    getWallets({
      drip: (wallet)=>{
        wallets = wallets.concat(wallet)
        
        if(walletsConfiguration?.sort || allowList) {
          let adjustedWallets = [...wallets]

          if(walletsConfiguration?.sort) {
            walletsConfiguration.sort.forEach((sortedWallet, newIndex)=>{
              let currentListIndex = adjustedWallets.findIndex((unsortedWallet)=>unsortedWallet?.info?.name === sortedWallet)
              if(currentListIndex > -1) {
                adjustedWallets.splice(newIndex, 0, adjustedWallets.splice(currentListIndex, 1)[0])
              }
            })
          }

          if(allowList) {
            adjustedWallets = adjustedWallets.filter((wallet)=>allowList.indexOf(wallet?.info?.name) > -1)
          }

          setDetectedWallets(adjustedWallets)
        } else {
          setDetectedWallets(wallets)
        }
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
            <h1 className="LineHeightL FontSizeL">Select a wallet</h1>
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
                            <div className="TextColorSuccess"><span className="TextColorSuccess" style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Detected</div>
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
              { allWallets.length > 4 &&
                <input className="Search" value={ searchTerm } onChange={ (event)=>{ setSearchTerm(event.target.value) } } placeholder="Search by name" ref={ searchElement }/>
              }
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
              { label: "Wallet missing?", action: ()=>{ window.open(`https://support.depay.com?query=${encodeURIComponent(`Can you add support for the following wallet`)}`, '_blank') } },
              { label: "Problems connecting?", action: ()=>{ window.open(`https://support.depay.com?query=${encodeURIComponent(`I have problems connecting my wallet`)}`, '_blank') } },
            ]}
          /> }
        </span>
      }
      bodyClassName={ "PaddingBottomXS" }
      body={
        <div className="PaddingTopXS" ref={ listElement }>
          { dialogAnimationFinished &&
            <SelectWalletList setWallet={ props.setWallet } searchTerm={ searchTerm } onClickWallet={ onClickWallet }/>
          }
          { !dialogAnimationFinished && // placeholder
            <div className="ScrollHeightM DialogBody PaddingBottomS PaddingLeftS PaddingRightS">
              <div style={{ height: "60px" }}><div className="Skeleton Card small" style={{ height: "57px" }}><div className="SkeletonBackground"/></div></div>
              <div style={{ height: "60px" }}><div className="Skeleton Card small" style={{ height: "57px" }}><div className="SkeletonBackground"/></div></div>
              <div style={{ height: "60px" }}><div className="Skeleton Card small" style={{ height: "57px" }}><div className="SkeletonBackground"/></div></div>
              <div style={{ height: "60px" }}><div className="Skeleton Card small" style={{ height: "57px" }}><div className="SkeletonBackground"/></div></div>
            </div>
          }
        </div>
      }
      footer={ false }
    />
  )
}
