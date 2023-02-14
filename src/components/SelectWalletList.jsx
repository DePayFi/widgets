import allWallets from '../helpers/allWallets'
import Fuse from 'fuse.js'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'
import { useVirtualizer } from '@tanstack/react-virtual'

export default (props)=>{

  const { navigate } = useContext(NavigateStackContext)
  const parentElement = React.useRef()
  const fuse = new Fuse(allWallets, { keys: ['name'], threshold: 0.3 })
  const [ resultList, setResultList ] = useState(allWallets)
  const rowVirtualizer = useVirtualizer({
    count: resultList.length,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 61,
  })

  useEffect(()=>{
    const results = fuse.search(props.searchTerm).map((result)=>result.item)
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
                className="Card small"
                title={`Connect ${resultList[virtualItem.key].name}`}
                onClick={()=>{
                  props.selected(resultList[virtualItem.key])
                  navigate('ConnectWallet')
                }}
              >
                <div className="CardImage">
                  <img className="transparent" src={resultList[virtualItem.key].logo} className="WalletLogoS"/>
                </div>
                <div className="CardBody">
                  <div className="CardBodyWrapper PaddingLeftXS LineHeightXS">
                    <div className="CardText FontWeightBold">
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
