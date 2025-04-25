import allWalletsOriginal from '../helpers/allWallets'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Fuse from 'fuse.js'
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export default (props)=>{

  const { wallets: walletsConfiguration } = useContext(ConfigurationContext)
  let allWallets
  if(walletsConfiguration?.sort || walletsConfiguration?.whitelist) {
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

      if(walletsConfiguration?.whitelist) {
        adjustedWallets = adjustedWallets.filter((wallet)=>walletsConfiguration.whitelist.indexOf(wallet.name) > -1)
      }

      return adjustedWallets
    }, [walletsConfiguration])
  } else {
    allWallets = allWalletsOriginal
  }

  const [ listScrolled, setListScrolled ] = useState(false)
  const handleOnScroll = (event)=>{
    if(!listScrolled) {
      setListScrolled(true)
    }
    if(event.target.scrollTop <= 0 && allWallets.length > 9) {
      setListScrolled(false)
    }
  }

  const parentElement = React.useRef()
  const fuse = new Fuse(allWallets, { keys: ['name'], threshold: 0.3, ignoreFieldNorm: true })
  const [ resultList, setResultList ] = useState(allWallets)
  
  const rowVirtualizer = useVirtualizer({
    count: resultList.length,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 61,
  })

  useEffect(()=>{
    const results = fuse.search(props.searchTerm).map((result)=>result.item)
    if(parentElement.current) {
      parentElement.current.scrollTo(0,0)
    }
    if(props.searchTerm.length) {
      setResultList(results)
    } else {
      setResultList(allWallets)
    }
  }, [props.searchTerm])

  useEffect(() => {

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && resultList.length == 1) {
        props.onClickWallet(resultList[0])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [resultList])

  return(
    <div ref={ parentElement } onScroll={ handleOnScroll } className={`DialogBody ScrollHeightAnimation ${listScrolled ? 'ScrollHeightMax' : 'ScrollHeightM'} PaddingBottomS PaddingLeftS PaddingRightS`}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >

        { rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="PaddingBottomXS">
              <button
                type="button"
                className="Card small"
                title={`Connect ${resultList[virtualItem.key].name}`}
                onClick={()=>{ props.onClickWallet({...resultList[virtualItem.key] }) }}
              >
                <div className="CardImage">
                  <img className="transparent" src={resultList[virtualItem.key].logo} className="WalletLogoS"/>
                </div>
                <div className="CardBody">
                  <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
                    <div className="CardText">
                      { resultList[virtualItem.key].name }
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
