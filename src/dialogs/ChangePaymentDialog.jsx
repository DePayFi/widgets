/*#if _EVM

import { TokenImage } from '@depay/react-token-image-evm'

/*#elif _SVM

import { TokenImage } from '@depay/react-token-image-svm'

//#else */

import { TokenImage } from '@depay/react-token-image'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangePaymentSkeleton from '../skeletons/ChangePaymentSkeleton'
import debounce from '../helpers/debounce'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import format from '../helpers/format'
import Fuse from 'fuse.js'
import isMobile from '../helpers/isMobile'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import PaymentValueContext from '../contexts/PaymentValueContext'
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import round from '../helpers/round'
import throttle from '../helpers/throttle'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const { setError } = useContext(ErrorContext)
  const { allRoutes, allRoutesLoaded, setSelectedRoute } = useContext(PaymentRoutingContext)
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
  const [ listScrolled, setListScrolled ] = useState(false)
  const [ listScrollable, setListScrollable ] = useState(true)
  const throttledSetListScrolled = useCallback(throttle((value)=>setListScrolled(value), 1000), [])
  const handleOnScroll = (event)=>{
    if(!listScrolled) {
      throttledSetListScrolled(true)
    }
    if(event.target.scrollTop <= 0 && selectedPaymentOptions.length > 9) {
      throttledSetListScrolled(false)
    }
  }
  const searchPaymentOption = useCallback(debounce((term, fuse, allPaymentOptions)=>{
    if(term.length == 0) {
      setSelectedPaymentOptions(allPaymentOptions)
    } else {
      const results = fuse.search(term)
      setSelectedPaymentOptions(results.map((result)=>result.item))
    }
    listElement.current.scrollTop = 0
  }, 300), [])
  const onChangeSearch = (event, fuse, allPaymentOptions)=>{
    setSearchTerm(event.target.value)
    searchPaymentOption(event.target.value, fuse, allPaymentOptions)
  }
  const listElement = useRef()

  const searchElement = useRef()

  useEffect(()=>{
    setTimeout(()=>{
      if(!isMobile()) {
        if(searchElement.current){
          searchElement.current.click()
          searchElement.current.focus()
        }
      }
    }, 200)
  }, [])

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

      const allPaymentOptions = allPaymentRoutesWithDisplayData
      setAllPaymentOptions(allPaymentOptions)
      setSelectedTab('all')
      setSelectedPaymentOptions(allPaymentOptions)
      
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
          <div className="PaddingTopS PaddingBottomXS">
            <div className="TextLeft">
              <div className='TabBar'>
                <button
                  type="button"
                  title="Search for a payment option"
                  style={{ width: "100px", position: 'relative'}}
                  onClick={()=>{
                    if(!(searchTerm && searchTerm.length)) {
                      setSelectedTab('all')
                      setSelectedPaymentOptions(allPaymentOptions)
                      listElement.current.scrollTop = 0
                    }
                  }}
                >
                  <input
                    type="text"
                    ref={ searchElement }
                    className="Search"
                    placeholder="Search"
                    value={ searchTerm }
                    onChange={ (event)=>onChangeSearch(event, fuse, allPaymentOptions) }
                    onFocus={()=>{
                      if(!(searchTerm && searchTerm.length)) {
                        setSelectedTab('all')
                        setSelectedPaymentOptions(allPaymentOptions)
                        listElement.current.scrollTop = 0
                      }
                    }}
                  />
                </button>

                {
                  allPaymentOptions.length > 4 &&
                  <button
                    type="button"
                    className={`Tab ${selectedTab === 'all' && (!searchTerm || searchTerm.length == 0) ? 'active' : ''}`}
                    title="All available payment options"
                    onClick={()=>{
                      setSelectedTab('all')
                      setSearchTerm('')
                      setSelectedPaymentOptions(allPaymentOptions)
                      listElement.current.scrollTop = 0
                    }}
                  >All</button>
                }

                { allPaymentOptions.length > 4 && allBestPaymentOptions.length > 0 &&
                  <button 
                    type="button"
                    className={`Tab ${selectedTab === 'best' ? 'active' : ''}`}
                    title="Payment options not requiring conversion"
                    onClick={()=>{
                      setSelectedTab('best')
                      setSearchTerm('')
                      setSelectedPaymentOptions(allBestPaymentOptions)
                      listElement.current.scrollTop = 0
                    }}
                  >Best</button>
                }
                { allPaymentOptions.length > 4 && allStablePaymentOptions.length > 0 &&
                  <button
                    type="button"
                    className={`Tab ${selectedTab === 'stable' ? 'active' : ''}`}
                    title="Stablecoins available to use"
                    onClick={()=>{
                      setSelectedTab('stable')
                      setSearchTerm('')
                      setSelectedPaymentOptions(allStablePaymentOptions)
                      listElement.current.scrollTop = 0
                    }}
                  >Stable</button>
                }
                { allPaymentOptions.length > 4 && allMajorPaymentOptions.length > 0 &&
                  <button
                    type="button"
                    className={`Tab ${selectedTab === 'major' ? 'active' : ''}`}
                    title="Major tokens available to use"
                    onClick={()=>{
                      setSelectedTab('major')
                      setSearchTerm('')
                      setSelectedPaymentOptions(allMajorPaymentOptions)
                      listElement.current.scrollTop = 0
                    }}
                  >Major</button>
                }
                { allPaymentOptions.length > 4 && allNativePaymentOptions.length > 0 &&
                  <button
                    type="button"
                    className={`Tab ${selectedTab === 'native' ? 'active' : ''}`}
                    title="Native blockchain currencies available to use"
                    onClick={()=>{
                      setSelectedTab('native')
                      setSearchTerm('')
                      setSelectedPaymentOptions(allNativePaymentOptions)
                      listElement.current.scrollTop = 0
                    }}
                  >Native</button>
                }
              </div>

            </div>
          </div>
        </div>
      }
      bodyRef={ listElement }
      body={
        <div onScroll={ handleOnScroll } className={`DialogBody ScrollHeightAnimation ${listScrolled ? 'ScrollHeightMax' : 'ScrollHeightL'} PaddingTopXS PaddingBottomS`}>
          <div className="PaddingLeftM PaddingRightM">
            { displayedPaymentOptions }
            { displayedPaymentOptions.length === 0 &&
              <>
                <div className="TextCenter Opacity05 PaddingTopS PaddingBottomS">
                  <strong>Nothing found for the given search term.</strong>
                  <br/>
                </div>
                <div className="TextCenter">
                  <button className="Link" onClick={()=>{
                    setSelectedPaymentOptions(allPaymentOptions)
                    setSearchTerm('')
                    searchElement.current.focus()
                  }}>Reset search</button>
                </div>
              </>
            }
          </div>
        </div>
      }
      footer={false}
    />
  )
}
