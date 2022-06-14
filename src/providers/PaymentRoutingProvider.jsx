import ConfigurationContext from '../contexts/ConfigurationContext'
import findMaxRoute from '../helpers/findMaxRoute'
import PaymentRoutingContext from '../contexts/PaymentRoutingContext'
import React, { useState, useContext, useEffect } from 'react'
import round from '../helpers/round'
import routePayments from '../helpers/routePayments'
import UpdatableContext from '../contexts/UpdatableContext'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from '@depay/web3-constants'
import { ethers } from 'ethers'
import { getWallet } from '@depay/web3-wallets'
import { request } from '@depay/web3-client'

export default (props)=>{
  const [ allRoutes, setAllRoutes ] = useState()
  const [ updatedRouteWithNewPrice, setUpdatedRouteWithNewPrice ] = useState()
  const [ selectedRoute, setSelectedRoute ] = useState()
  const [ slowRouting, setSlowRouting ] = useState(false)
  const [ reloadCount, setReloadCount ] = useState(0)
  const { account } = useContext(WalletContext)
  const { updatable } = useContext(UpdatableContext)
  const { recover } = useContext(ConfigurationContext)
  
  const calculateAmountInWithSlippage = async (route)=>{
    if(route.directTransfer) { return }
    const currentBlock = await request({ blockchain: route.blockchain, method: 'latestBlockNumber' })
    let blocks = []
    for(var i = 0; i <= 2; i++){
      blocks.push(currentBlock-i)
    }
    let exchangeRoute = route.exchangeRoutes[0]
    if(typeof exchangeRoute == 'undefined' || typeof exchangeRoute.exchange == 'undefined') { return }
    const lastAmountsIn = await Promise.all(blocks.map(async (block)=>{
      let amountIn = await exchangeRoute.exchange.getAmountIn({
        path: exchangeRoute.path,
        amountOut: exchangeRoute.amountOutMin,
        block
      })
      return amountIn
    }))

    if(!lastAmountsIn[0] || !lastAmountsIn[1] || !lastAmountsIn[2]) { return }

    if(
      (lastAmountsIn[0].gt(lastAmountsIn[1])) &&
      (lastAmountsIn[1].gt(lastAmountsIn[2]))
    ) {
      const difference1 = lastAmountsIn[0].sub(lastAmountsIn[1])
      const difference2 = lastAmountsIn[1].sub(lastAmountsIn[2])
      let slippage
      if(difference1.lt(difference2)) {
        slippage = difference2.add(difference2.sub(difference1))
      } else {
        slippage = difference1.add(difference1.sub(difference2))
      }

      let newAmountBN = lastAmountsIn[0].add(slippage)
      let readableAmount = await route.fromToken.readable(newAmountBN)
      let roundedAmountBN = await route.fromToken.BigNumber(round(readableAmount))
      if(route.fromAmount == roundedAmountBN.toString()) { return }
      return newAmountBN
    }
  }
  const onRoutesUpdate = async (routes)=>{
    if(routes.length == 0) {
      setAllRoutes([])
      if(props.setMaxRoute) { props.setMaxRoute(null) }
    } else {
      roundAmounts(routes).then(async (roundedRoutes)=>{
        let selectRoute
        if(typeof selectedRoute == 'undefined') {
          selectRoute = roundedRoutes[0]
        } else {
          const newSelectRoute = roundedRoutes[allRoutes.findIndex((route)=>(route.fromToken == selectedRoute.fromToken && route.blockchain == selectedRoute.blockchain))]
          if(newSelectRoute && selectedRoute.fromAmount !== newSelectRoute.fromAmount) {
            const amountInWithSlippage = await calculateAmountInWithSlippage(newSelectRoute)
            if(amountInWithSlippage) {
              await roundAmount(newSelectRoute, amountInWithSlippage)
            }
            setUpdatedRouteWithNewPrice(newSelectRoute)
          }
        }
        if(selectRoute) {
          const amountInWithSlippage = await calculateAmountInWithSlippage(selectRoute)
          if(amountInWithSlippage) {
            await roundAmount(selectRoute, amountInWithSlippage)
          }
          setSelectedRoute(selectRoute)
        }
        await Promise.all(roundedRoutes.map(async (route, index)=>{
          let amountInWithSlippage = await calculateAmountInWithSlippage(route)
          if(amountInWithSlippage) { 
            await roundAmount(route, amountInWithSlippage) 
          }
          return route
        })).then(setAllRoutes)
        if(props.setMaxRoute) { props.setMaxRoute(findMaxRoute(roundedRoutes)) }
      })
    }
  }
  
  const getPaymentRoutes = ({ allRoutes, selectedRoute, updatable })=>{
    if(updatable == false || !props.accept || !account) { return }
    let slowRoutingTimeout = setTimeout(() => { setSlowRouting(true) }, 4000)
    routePayments(Object.assign({}, props, { account })).then((routes)=>{
      clearInterval(slowRoutingTimeout)
      onRoutesUpdate(routes)
    })
  }

  const updateRouteAmount = (route, amountBN)=> {
    route.fromAmount = amountBN.toString()
    route.transaction.params.amounts[0] = amountBN.toString()
    if(route.transaction.value && route.transaction.value.toString() != '0') {
      route.transaction.value = amountBN.toString()
    }
  }

  const roundAmount = async (route, amountBN)=> {
    if(route.directTransfer){ return route }
    let readableAmount = await route.fromToken.readable(amountBN || route.transaction.params.amounts[0])
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

  useEffect(()=>{
    async function updateRouteWithAmountInWithSlippage() {
      const amountInWithSlippage = await calculateAmountInWithSlippage(selectedRoute)
      if(amountInWithSlippage) {
        await roundAmount(selectedRoute, amountInWithSlippage)
        setUpdatedRouteWithNewPrice(selectedRoute)
      }
    }

    if(selectedRoute) { updateRouteWithAmountInWithSlippage() }
  }, [selectedRoute])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReloadCount(reloadCount + 1)
      getPaymentRoutes({ allRoutes, selectedRoute, updatable })  
    }, 15000);

    return () => clearTimeout(timeout)
  }, [reloadCount, allRoutes, selectedRoute, updatable])

  useEffect(() => {
    if(account && props.accept && recover == undefined) {
      setAllRoutes(undefined)
      setSelectedRoute(undefined)
      getPaymentRoutes({})
    } else {
      setAllRoutes(undefined)
      setSelectedRoute(undefined)
    }
  }, [account, props.accept])

  return(
    <PaymentRoutingContext.Provider value={{
      selectedRoute,
      setSelectedRoute,
      getPaymentRoutes,
      allRoutes,
      setAllRoutes,
      slowRouting,
      updatedRouteWithNewPrice,
      updateRouteWithNewPrice
    }}>
      { props.children }
    </PaymentRoutingContext.Provider>
  )
}
