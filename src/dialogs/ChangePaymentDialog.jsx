/*#if _EVM

import { TokenImage } from '@depay/react-token-image-evm'

/*#elif _SOLANA

import { TokenImage } from '@depay/react-token-image-solana'

//#else */

import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangePaymentSkeleton from '../skeletons/ChangePaymentSkeleton'
import ChevronLeft from '../components/ChevronLeft'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import format from '../helpers/format'
import Fuse from 'fuse.js'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import round from '../helpers/round'
import { debounce } from 'lodash'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const { allRoutes, allRoutesLoaded, setSelectedRoute } = useContext(PaymentRoutingContext)
  const { displayedPaymentValue } = useContext(PaymentValueContext)
  const { navigate } = useContext(NavigateStackContext)
  const [ allBestPaymentOptions, setBestPaymentOptions ] = useState()
  const [ allMajorPaymentOptions, setMajorPaymentOptions ] = useState()
  const [ allNativePaymentOptions, setNativePaymentOptions ] = useState()
  const [ allStablePaymentOptions, setStablePaymentOptions ] = useState()
  const [ allPaymentOptions, setAllPaymentOptions ] = useState()
  const [ selectedPaymentOptions, setSelectedPaymentOptions ] = useState()
  const [ selectedTab, setSelectedTab ] = useState()
  const [ searching, setSearching ] = useState(false)
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ fuse, setFuse ] = useState()
  const searchPaymentOption = useCallback(debounce((term, fuse)=>{
    const results = fuse.search(term)
    setSelectedPaymentOptions(results.map((result)=>result.item))
    listElement.current.scrollTop = 0
  }, 300), [])
  const onChangeSearch = (event, fuse, allPaymentOptions)=>{
    setSearchTerm(event.target.value)
    searchPaymentOption(event.target.value, fuse, allPaymentOptions)
  }
  const listElement = useRef()

  useEffect(()=>{
    if(allRoutes == undefined) { return }
    if(allRoutesLoaded !== true) { return }
    Promise.all(
      allRoutes.map((route)=>{
        let exchangeRoute = route.exchangeRoutes[0]
        let fromToken = route.fromToken
        return Promise.all([
          route.fromToken.name(),
          route.fromToken.symbol(),
          route.fromToken.decimals(),
          route.fromToken.readable(route.fromAmount)
        ])
      })
    ).then((allPaymentRoutes)=>{
      const allPaymentRoutesWithDisplayData = allRoutes.map((route, index)=>{
        return {
          name: allPaymentRoutes[index][0],
          symbol: allPaymentRoutes[index][1].toUpperCase(),
          decimals: allPaymentRoutes[index][2],
          amount: allPaymentRoutes[index][3],
          blockchainName: route.blockchain,
          route
        }
      })
      setFuse(new Fuse(allPaymentRoutesWithDisplayData, { keys: ['name', 'symbol', 'blockchainName'], threshold: 0.3, ignoreFieldNorm: true }))
      const bestPaymentOptions = allPaymentRoutesWithDisplayData.filter((paymentRoute)=>
        paymentRoute.route.fromToken.address.toLowerCase() === paymentRoute.route.toToken.address.toLowerCase()
      )
      setBestPaymentOptions(bestPaymentOptions)
      const majorPaymentOptions = allPaymentRoutesWithDisplayData.filter((paymentRoute)=>
        Blockchains[paymentRoute.route.blockchain].tokens.find((token)=>
          token.address.toLowerCase() === paymentRoute.route.fromToken.address.toLowerCase()
        )
      )
      setMajorPaymentOptions(majorPaymentOptions)
      setNativePaymentOptions(
        allPaymentRoutesWithDisplayData.filter((paymentRoute)=>
          Blockchains[paymentRoute.route.blockchain].currency.address.toLowerCase() === paymentRoute.route.fromToken.address.toLowerCase()
        )
      )
      setStablePaymentOptions(
        allPaymentRoutesWithDisplayData.filter((paymentRoute)=>
          Blockchains[paymentRoute.route.blockchain].stables.usd.find((stable)=>
            stable.toLowerCase() === paymentRoute.route.fromToken.address.toLowerCase()
          )
        )
      )
      setAllPaymentOptions(allPaymentRoutesWithDisplayData)
      if(selectedPaymentOptions === undefined) {
        if(bestPaymentOptions.length) {
          setSelectedTab('best')
          setSelectedPaymentOptions(bestPaymentOptions)
        } else {
          setSelectedTab('major')
          setSelectedPaymentOptions(majorPaymentOptions)
        }
      }
    }).catch(setError)
  }, [allRoutes, allRoutesLoaded])

  let displayedPaymentOptions = selectedPaymentOptions?.map((payment, index)=>{
    let blockchain = Blockchains.findByName(payment.route.blockchain)
    return(
      <button type="button" key={ index } className="Card" title={ `Select ${payment.symbol} as payment` } onClick={()=>{
        setSelectedRoute(payment.route)
        navigate('back')
      }}>
        <div className="CardImage">
          <TokenImage
            blockchain={ payment.route.blockchain }
            address={ payment.route.fromToken.address }
          />
          <img className={"BlockchainLogo small bottomRight " + blockchain.name} style={{ backgroundColor: blockchain.logoBackgroundColor }} src={blockchain.logo} alt={blockchain.label} title={blockchain.label}/>
        </div>
        <div className="CardBody">
          <div className="CardBodyWrapper">
            <h2 className="CardText">
              <div className="TokenAmountRow">
                <span className="TokenSymbolCell">
                  { payment.symbol }
                </span>
                <span>&nbsp;</span>
                <span className="TokenAmountCell">
                  { format(payment.amount) }
                </span>
              </div>
            </h2>
            <h3 className="CardText small">
              <small>{ format(round(parseFloat(payment.route.fromBalance.toString())/10**payment.decimals, 'down')) }</small>
            </h3>
          </div>
        </div>
      </button>
    )
  })

  if(!allRoutesLoaded || displayedPaymentOptions === undefined) { return(<ChangePaymentSkeleton/>) }

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS">
          <h1 className="LineHeightL FontSizeL TextCenter">Payment options</h1>
          { displayedPaymentValue != undefined &&
            <div className="FontSizeL TextCenter FontWeightBold"><strong>{ displayedPaymentValue.toString() }</strong></div>
          }
          <div className="PaddingTopXS">
            <div className="PaddingTopXS PaddingBottomXS TextLeft" style={{ height: "32px" }}>
              { !searching &&
                <div>
                  { allBestPaymentOptions.length &&
                    <button 
                      type="button"
                      className={`Tab ${selectedTab === 'best' ? 'active' : ''}`}
                      title="Payment options not requiring conversion"
                      onClick={()=>{
                        setSelectedTab('best')
                        setSelectedPaymentOptions(allBestPaymentOptions)
                        listElement.current.scrollTop = 0
                      }}
                    >Best</button>
                  }
                  <button
                    type="button"
                    className={`Tab ${selectedTab === 'major' ? 'active' : ''}`}
                    title="Major tokens available to use"
                    onClick={()=>{
                      setSelectedTab('major')
                      setSelectedPaymentOptions(allMajorPaymentOptions)
                      listElement.current.scrollTop = 0
                    }}
                  >Major</button>
                  { allNativePaymentOptions.length &&
                    <button
                      type="button"
                      className={`Tab ${selectedTab === 'native' ? 'active' : ''}`}
                      title="Native blockchain currencies available to use"
                      onClick={()=>{
                        setSelectedTab('native')
                        setSelectedPaymentOptions(allNativePaymentOptions)
                        listElement.current.scrollTop = 0
                      }}
                    >Native</button>
                  }
                  { allStablePaymentOptions.length &&
                    <button
                      type="button"
                      className={`Tab ${selectedTab === 'stable' ? 'active' : ''}`}
                      title="Stablecoins available to use"
                      onClick={()=>{
                        setSelectedTab('stable')
                        setSelectedPaymentOptions(allStablePaymentOptions)
                        listElement.current.scrollTop = 0
                      }}
                    >Stable</button>
                  }
                  <button
                    type="button"
                    className={`Tab ${selectedTab === 'all' ? 'active' : ''}`}
                    title="All available payment options"
                    onClick={()=>{
                      setSelectedTab('all')
                      setSelectedPaymentOptions(allPaymentOptions)
                      listElement.current.scrollTop = 0
                    }}
                  >All</button>
                  <button
                    type="button"
                    className="Tab"
                    title="Search for a payment option"
                    style={{fontSize: '12px', position: 'relative', top: '-2px'}}
                    onClick={()=>{
                      setSelectedTab('all')
                      setSelectedPaymentOptions(allPaymentOptions)
                      setSearching(true)
                      listElement.current.scrollTop = 0
                    }}
                  >🔍</button>
                </div>
              }

              { searching &&
                <div style={{ display: 'flex' }}>
                  <button
                    type="button"
                    className="Tab"
                    title="Go back to all payment options"
                    onClick={()=>{
                      setSelectedTab('all')
                      setSelectedPaymentOptions(allPaymentOptions)
                      setSearching(false)
                      setSearchTerm('')
                      listElement.current.scrollTop = 0
                    }}
                  ><ChevronLeft className="small"/></button>
                  <input
                    type="text"
                    className="Search small"
                    placeholder="Search by name, symbol or blockchain"
                    autoFocus={true}
                    value={ searchTerm }
                    onChange={ (event)=>onChangeSearch(event, fuse, allPaymentOptions) }
                  />
                </div>
              }
            </div>
          </div>
        </div>
      }
      bodyClassName="ScrollHeight"
      bodyRef={ listElement }
      body={
        <div className="PaddingTopXS PaddingBottomS">
          <div className="PaddingLeftM PaddingRightM">
            { displayedPaymentOptions }
            { displayedPaymentOptions.length === 0 &&
              <div className="TextCenter Opacity05 PaddingTopS PaddingBottomS">
                <strong>Nothing found for the given search term.</strong>
                <br/>
                <strong>Please search for something else.</strong>
              </div>
            }
          </div>
        </div>
      }
      footer={false}
    />
  )
}
