/*#if _EVM

import { request } from '@depay/web3-client-evm'

/*#elif _SOLANA

import { request } from '@depay/web3-client-solana'

//#else */

import { request } from '@depay/web3-client'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ConfigurationContext from '../contexts/ConfigurationContext'
import findMaxRoute from '../helpers/findMaxRoute'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useState, useContext, useEffect } from 'react'
import round from '../helpers/round'
import routePayments from '../helpers/routePayments'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'

export default (props)=>{
  const [ allRoutes, setAllRoutes ] = useState()
  const [ updatedRoutes, setUpdatedRoutes ] = useState()
  const [ updatedRouteWithNewPrice, setUpdatedRouteWithNewPrice ] = useState()
  const [ selectedRoute, setSelectedRoute ] = useState()
  const [ slowRouting, setSlowRouting ] = useState(false)
  const [ reloadCount, setReloadCount ] = useState(0)
  const [ allRoutesLoadedInternal, setAllRoutesLoadedInternal ] = useState(false)
  const [ allRoutesLoaded, setAllRoutesLoaded ] = useState(false)
  const { account, wallet } = useContext(WalletContext)
  const { updatable } = useContext(UpdatableContext)
  const { recover } = useContext(ConfigurationContext)
  
  const getPaymentRoutes = async ({ allRoutes, selectedRoute, updatable })=>{
    if(updatable == false || !props.accept || !account) { return }
    let slowRoutingTimeout = setTimeout(() => { setSlowRouting(true) }, 4000)
    let selectedRouteFromDrip
    let firstRouteDisplayed
    return await routePayments(Object.assign({}, props, { account, drip: (route)=>{
      if(
        route.fromToken.address !== route.toToken.address &&
        !Blockchains[route.blockchain].tokens.find((token)=>token.address.toLowerCase() === route.fromToken.address.toLowerCase())
      ) { return }
      if(firstRouteDisplayed) { return }
      firstRouteDisplayed = true
      if(allRoutesLoaded) { return }
      if(route.approvalRequired) { return }
      clearInterval(slowRoutingTimeout)
      selectedRouteFromDrip  = route
      setUpdatedRoutes([route])
    }}))
    .then((routes)=>{
      setUpdatedRoutes(routes)
      setAllRoutesLoadedInternal(true)
      clearInterval(slowRoutingTimeout)
    })
  }

  const updateRouteAmount = (route, amountBN)=> {
    route.fromAmount = amountBN.toString()
  }

  const roundAmount = async (route, amountBN)=> {
    if(route.directTransfer){ return route }
    let readableAmount = await route.fromToken.readable(amountBN || route.fromAmount)
    let roundedAmountBN = await route.fromToken.BigNumber(round(readableAmount))
    updateRouteAmount(route, roundedAmountBN)
    return route
  }

  const roundAmounts = async (routes)=> {
    return Promise.all(routes.map((route)=>roundAmount(route)))
  }

  const updateRouteWithNewPrice = async ()=> {
    setSelectedRoute({...updatedRouteWithNewPrice})
    setUpdatedRouteWithNewPrice(null)
  }

  const refreshPaymentRoutes = ()=>{
    return getPaymentRoutes({ allRoutes, selectedRoute: undefined, updatable })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReloadCount(reloadCount + 1)
      getPaymentRoutes({ allRoutes, selectedRoute, updatable })
    }, 15000);

    return () => clearTimeout(timeout)
  }, [reloadCount, allRoutes, selectedRoute, updatable])

  useEffect(() => {
    if(account && props.accept && recover == undefined) {
      refreshPaymentRoutes()
    }
  }, [account, props.accept])

  useEffect(()=>{
    if(updatedRoutes === undefined){ return }
    if(updatedRoutes.length == 0) {
      setAllRoutes(updatedRoutes)
      if(props.setMaxRoute) { props.setMaxRoute(null) }
    } else {
      roundAmounts(updatedRoutes).then((roundedRoutes)=>{
        if(typeof selectedRoute == 'undefined') {
          let selectRoute = roundedRoutes[0]
          setSelectedRoute(selectRoute)
        } else {
          const updatedSelectedRoute = roundedRoutes[
            roundedRoutes.findIndex(
              (route)=>(
                route.fromToken.address == selectedRoute.fromToken.address && 
                route.blockchain == selectedRoute.blockchain
              )
            )
          ]
          if(updatedSelectedRoute) {
            if(selectedRoute.fromAmount != updatedSelectedRoute.fromAmount) {
              setUpdatedRouteWithNewPrice(updatedSelectedRoute)
            } else if ( // other reasons but price to update selected route
              selectedRoute.approvalRequired != updatedSelectedRoute.approvalRequired
            ) {
              setSelectedRoute(updatedSelectedRoute)
            }
          } else {
            setSelectedRoute(roundedRoutes[0])
          }
        }
        roundedRoutes.assets = updatedRoutes.assets
        setAllRoutes(roundedRoutes)
        setAllRoutesLoaded(allRoutesLoadedInternal)
        if(props.setMaxRoute) { props.setMaxRoute(findMaxRoute(roundedRoutes)) }
      })
    }
  }, [selectedRoute, updatedRoutes])

  return(
    <PaymentRoutingContext.Provider value={{
      selectedRoute,
      setSelectedRoute,
      refreshPaymentRoutes,
      allRoutes,
      allRoutesLoaded,
      slowRouting,
      updatedRouteWithNewPrice,
      updateRouteWithNewPrice
    }}>
      { props.children }
    </PaymentRoutingContext.Provider>
  )
}
