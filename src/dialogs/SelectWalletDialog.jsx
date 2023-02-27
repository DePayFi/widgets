import allWallets from '../helpers/allWallets'
import Dialog from '../components/Dialog'
import DropDown from '../components/DropDown'
import isMobile from '../helpers/isMobile'
import MenuIcon from '../components/MenuIcon'
import React, { useState, useEffect, useContext, useRef } from 'react'
import safeUniversalUrl from '../helpers/safeUniversalUrl'
import SelectWalletList from '../components/SelectWalletList'
import { get as getPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'
import { getWallets, wallets } from '@depay/web3-wallets'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const [ searchTerm, setSearchTerm ] = useState('')
  const [ prioritizedWallets, setPrioritizedWallets ] = useState()
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
    } else {
      props.connectViaRedirect(walletMetaData)
      props.setWallet(walletMetaData)
      navigate('ConnectWallet')
    }
  }

  useEffect(()=>{
    getWallets().then((availableWallets)=>{
      let renderedWallets = {} // prevents rendering same wallet twice (e.g. extension + via walletconnect)
      const renderWalletElement = (walletMetaData, index, type, wallet)=>{
        if(renderedWallets[walletMetaData.name] && type == 'previouslyConnected') { return(null) }
        renderedWallets[walletMetaData.name] = true
        let connectionType = 'app'
        if(wallet && wallet.constructor && ![wallets.WalletConnectV1, wallets.WalletLink].includes(wallet.constructor)) {
          connectionType = 'extension'
        }
        return(
          <div key={index} className="PaddingBottomXS">
            <button
              type="button"
              className="Card small"
              title={`Connect ${walletMetaData.name}`}
              onClick={ ()=>onClickWallet({ ...walletMetaData, via: type, connectionType }, wallet) }
            >
              <div className="CardImage">
                <img className="transparent" src={walletMetaData.logo} className="WalletLogoS"/>
              </div>
              <div className="CardBody">
                <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
                  <div className="CardText FontWeightMedium">
                    { walletMetaData.name }
                  </div>
                  { type != 'previouslyConnected' && <div className="LightGreen"><span className="LightGreen" style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Connect detected { connectionType }</div> }
                  { type == 'previouslyConnected' && <div className="Opacity05"><span style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Previously connected</div> }
                </div>
              </div>
            </button>
          </div>
        )
      }

      let prioritizedWallets = availableWallets.map((availableWallet, index)=>{
        if(availableWallet.name == 'Phantom') { return }
        let walletMetaData = allWallets.find((wallet)=>wallet.name == availableWallet.name)
        if(walletMetaData) { return(renderWalletElement(walletMetaData, index, 'detected', availableWallet)) }
      }).filter((wallet)=>!!wallet)

      let previouslyConnectedWalletName = getPreviouslyConnectedWallet()
      let previouslyConnectedWallet = allWallets.find((wallet)=>wallet.name == previouslyConnectedWalletName) || allWallets.find((wallet)=>wallet.name == previouslyConnectedWalletName)
      if(previouslyConnectedWallet && previouslyConnectedWallet) {
        prioritizedWallets.push(renderWalletElement(previouslyConnectedWallet, prioritizedWallets.length+1, 'previouslyConnected'))
      }

      setPrioritizedWallets(prioritizedWallets)
    })
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
      alternativeHeaderAction={
        <span className="DropDownWrapper">
          <button type="button" onClick={ ()=>setShowDropDown(!showDropDown) } className="ButtonCircular" title="More options">
            <MenuIcon/>
          </button>
          { showDropDown && <DropDown hide={()=>setShowDropDown(false)}
            items={[
              { label: "What is a wallet?", action: ()=>{ navigate('WhatIsAWallet') } },
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
      hideFooter={ true }
    />
  )
}
