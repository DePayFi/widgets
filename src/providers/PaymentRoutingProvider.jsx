/*#if _EVM

import Exchanges from '@depay/web3-exchanges-evm'
import { request } from '@depay/web3-client-evm'

/*#elif _SVM

import Exchanges from '@depay/web3-exchanges-svm'
import { request } from '@depay/web3-client-svm'

//#else */

import Exchanges from '@depay/web3-exchanges'
import { request } from '@depay/web3-client'

//#endif

import Blockchains from '@depay/web3-blockchains'
import ChangableAmountContext from '../contexts/ChangableAmountContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import findMaxRoute from '../helpers/findMaxRoute'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useState, useContext, useEffect, useCallback } from 'react'
import round from '../helpers/round'
import routePayments from '../helpers/routePayments'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { debounce } from 'lodash'
import { ethers } from 'ethers'

const RELOAD_PERIOD = 15_000;

export default (props)=>{
  const [ allRoutes, setAllRoutes ] = useState()
  const [ updatedRoutes, setUpdatedRoutes ] = useState()
  const [ updatedRouteWithNewPrice, setUpdatedRouteWithNewPrice ] = useState()
  const [ selectedRoute, setSelectedRoute ] = useState()
  const [ slowRouting, setSlowRouting ] = useState(false)
  const [ reloadCount, setReloadCount ] = useState(0)
  const [ allRoutesLoaded, setAllRoutesLoaded ] = useState(false)
  const { account, wallet } = useContext(WalletContext)
  const { updatable } = useContext(UpdatableContext)
  const { recover } = useContext(ConfigurationContext)
  const configuration = useContext(ConfigurationContext)
  const { amountsMissing } = useContext(ChangableAmountContext)

  const getPaymentRoutes = async ({ allRoutes, selectedRoute, updatable })=>{
    if(updatable == false || !props.accept || !account) { return }
    let slowRoutingTimeout = setTimeout(() => { setSlowRouting(true) }, 3000)
    let allRoutesLoadedStart = Date.now()
    return new Promise((resolve, reject)=>{
      routePayments(Object.assign({}, configuration, {
        accept: props.accept,
        account,
        best: (route)=>{
          if(route) {
            roundAmounts([route]).then((routes)=>{
              setSelectedRoute(routes[0])
              clearInterval(slowRoutingTimeout)
            })
          }
        }
      }))
      .then((routes)=>{
        setUpdatedRoutes(routes)
        clearInterval(slowRoutingTimeout)
        resolve()
      }).catch(reject)
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
      if(allRoutesLoaded) { // do not reload if first routes have not been loaded yet
        setReloadCount(reloadCount + 1)
        getPaymentRoutes({ allRoutes, selectedRoute, updatable })
      }
    }, RELOAD_PERIOD);

    return () => clearTimeout(timeout)
  }, [reloadCount, allRoutes, allRoutesLoaded, selectedRoute, updatable])

  useEffect(() => {
    if(recover) { return }
    if(account && props.accept) {
      refreshPaymentRoutes()
    } else if (props.accept === undefined) {
      setSelectedRoute()
      setAllRoutesLoaded(false)
      setUpdatedRoutes()
      setAllRoutes()
    }
  }, [account, props.accept])

  const updateAllRoutes = useCallback(debounce((selectedRoute, updatedRoutes)=>{
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
            }
          } else {
            setSelectedRoute(roundedRoutes[0])
          }
        }
        roundedRoutes.assets = updatedRoutes.assets
        if(amountsMissing && props.setMaxRoute) {
          Promise.all(roundedRoutes.map((route)=>{
            return new Promise((resolve, reject)=>{
              if(Blockchains[route.blockchain].tokens.findIndex((token)=>token.address.toLowerCase()===route.fromToken.address.toLowerCase()) === -1) {
                // Major tokens only
                return resolve()
              }
              Exchanges.route({
                blockchain: route.blockchain,
                tokenIn: route.fromToken.address,
                amountIn: route.fromBalance,
                tokenOut: Blockchains[route.blockchain].stables.usd[0].toLowerCase() !== route.fromToken.address.toLowerCase() ? Blockchains[route.blockchain].stables.usd[0] : Blockchains[route.blockchain].stables.usd[1],
                fromAddress: route.fromAddress,
                toAddress: route.toAddress
              }).then((usdRoute)=>resolve({ route, usdRoute })).catch(reject)
            })
          })).then((routes)=>{
            props.setMaxRoute(findMaxRoute(routes.filter(Boolean))?.route)
            setAllRoutes(roundedRoutes)
            setAllRoutesLoaded(true)
          }).catch((e)=>{
            console.log('ERROR', e)
            props.setMaxRoute(null)
          })
        } else {
          setAllRoutes(roundedRoutes)
          setAllRoutesLoaded(true)
        }
      })
    }
  }, 500), [])

  useEffect(()=>{
    updateAllRoutes(selectedRoute, updatedRoutes)
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
