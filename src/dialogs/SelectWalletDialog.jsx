import allWallets from '../helpers/allWallets'
import Dialog from '../components/Dialog'
import DropDown from '../components/DropDown'
import isMobile from '../helpers/isMobile'
import MenuIcon from '../components/MenuIcon'
import React, { useState, useEffect, useContext, useRef } from 'react'
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

  const connectViaRedirect = (walletMetaData)=> {
    const provider = isMobile() ? walletMetaData.mobile : walletMetaData.desktop
    if(!provider) { return }
    if(walletMetaData.link == 'WalletConnectV1') {
      let wallet = new wallets[walletMetaData.link]()
      wallet.connect({
        name: walletMetaData.name,
        logo: walletMetaData.logo,
        reconnect: true,
        connect: ({ uri })=>{
          let href
          if(provider.universal) {
            href = safeUniversalUrl(provider.universal)
          } else {
            href = isAndroid() ? uri : safeAppUrl(provider.native)
          }
          localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({ href, name: isAndroid() ? 'Android' : walletMetaData.name }))
          if(provider.universal) {
            if(provider.encoded !== false) {
              href = `${href}/wc?uri=${encodeURIComponent(uri)}`
            } else {
              href = `${href}/wc?uri=${uri}`
            }
          } else if(provider.native) {
            if(!isAndroid()) {
              if(provider.encoded !== false) {
                href = `${href}wc?uri=${encodeURIComponent(uri)}`
              } else {
                href = `${href}wc?uri=${uri}`
              }
            }
          }
          let target = provider.native && !provider.universal ? '_self' : '_blank'
          console.log(href, target, 'noreferrer noopener')
          window.open(href, target, 'noreferrer noopener')
        }
      }).then((account)=>{
        props.resolve(account, wallet)
      })
    } else if (walletMetaData.link == 'WalletLink') {
      setPreviouslyConnectedWallet(walletMetaData.name)
      if(isAndroid()) {
        window.open(`https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.toString())}`, '_self', 'noreferrer noopener')
      } else { // IOS
        window.open(`cbwallet://dapp?url=${encodeURIComponent(window.location.toString())}`, '_self', 'noreferrer noopener')
      }
    }
  }

  const onClickWallet = (wallet)=>{
    connectViaRedirect(wallet)
    props.setWallet(wallet)
    navigate('ConnectWallet')
  }

  useEffect(()=>{
    getWallets().then((availableWallets)=>{
      let renderedWallets = {} // prevents rendering same wallet twice (e.g. extension + via walletconnect)
      const renderWalletElement = (wallet, index, type)=>{
        if(renderedWallets[wallet.name]) { return(null) }
        renderedWallets[wallet.name] = true
        return(
          <div key={index} className="PaddingBottomXS">
            <button
              type="button"
              className="Card small"
              title={`Connect ${wallet.name}`}
              onClick={ ()=>onClickWallet({ ...wallet, via: type }) }
            >
              <div className="CardImage">
                <img className="transparent" src={wallet.logo} className="WalletLogoS"/>
              </div>
              <div className="CardBody">
                <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
                  <div className="CardText FontWeightMedium">
                    { wallet.name }
                  </div>
                  { type != 'previouslyConnected' && <div className="LightGreen"><span className="LightGreen" style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Detected</div> }
                  { type == 'previouslyConnected' && <div className="Opacity05"><span style={{ fontSize: '70%', top: '-1px', position: 'relative' }}>●</span> Previously connected</div> }
                </div>
              </div>
            </button>
          </div>
        )
      }

      let prioritizedWallets = availableWallets.map((availableWallet, index)=>{
        if(availableWallet.name == 'Phantom') { return }
        let wallet = allWallets.find((wallet)=>wallet.name == availableWallet.name) || allWallets.find((wallet)=>wallet.name == availableWallet.name)
        if(wallet) { return(renderWalletElement(wallet, index, 'detected')) }
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
            <SelectWalletList setWallet={ props.setWallet } searchTerm={ searchTerm }/>
          }
        </div>
      }
      hideFooter={ true }
    />
  )
}
