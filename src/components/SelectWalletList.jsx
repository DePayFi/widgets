import allWalletsOriginal from '../helpers/allWallets'
import ConfigurationContext from '../contexts/ConfigurationContext'
import Fuse from 'fuse.js'
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export default (props)=>{

  const { wallets } = useContext(ConfigurationContext)
  let allWallets
  if(wallets?.sort || wallets?.whitelist) {
    allWallets = useMemo(()=>{
      let adjustedWallets = [...allWalletsOriginal]

      if(wallets?.sort) {
        wallets.sort.forEach((sortedWallet, newIndex)=>{
          let currentListIndex = adjustedWallets.findIndex((unsortedWallet)=>unsortedWallet.name === sortedWallet)
          if(currentListIndex > -1) {
            adjustedWallets.splice(newIndex, 0, adjustedWallets.splice(currentListIndex, 1)[0])
          }
        })
      }

      if(wallets?.whitelist) {
        adjustedWallets = adjustedWallets.filter((wallet)=>wallets.whitelist.indexOf(wallet.name) > -1)
      }

      return adjustedWallets
    }, [wallets])
  } else {
    allWallets = allWalletsOriginal
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

  return(
    <div ref={ parentElement } className="DialogBody ScrollHeightM PaddingBottomS PaddingLeftS PaddingRightS">
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
