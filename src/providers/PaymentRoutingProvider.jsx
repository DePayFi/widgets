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

export default (props)=>{
  const [ allRoutes, setAllRoutes ] = useState()
  const [ selectedRoute, setSelectedRoute ] = useState()
  const [ slowRouting, setSlowRouting ] = useState(false)
  const [ reloadCount, setReloadCount ] = useState(0)
  const { account } = useContext(WalletContext)
  const { updatable } = useContext(UpdatableContext)
  const { recover } = useContext(ConfigurationContext)  
  const onRoutesUpdate = (routes)=>{
    if(routes.length == 0) {
      setAllRoutes([])
      if(props.setMaxRoute) { props.setMaxRoute(null) }
    } else {
      roundAmounts(routes).then((roundedRoutes)=>{
        let selected
        if(selectedRoute) {
          selected = roundedRoutes[allRoutes.findIndex((route)=>(route.fromToken == selectedRoute.fromToken && route.blockchain == selectedRoute.blockchain))]
        }
        if(selected == undefined) {
          selected = roundedRoutes[0]
        }
        setSelectedRoute(selected)
        setAllRoutes(roundedRoutes)
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
  const roundAmounts = async (routes)=> {
    return Promise.all(routes.map(async (route)=>{
      if(route.directTransfer){ return route }
      let readableAmount = await route.fromToken.readable(route.transaction.params.amounts[0])
      let roundedAmountBN = await route.fromToken.BigNumber(round(readableAmount))
      route.fromAmount = roundedAmountBN.toString()
      route.transaction.params.amounts[0] = roundedAmountBN.toString()
      if(route.transaction.value && route.transaction.value.toString() != '0') {
        route.transaction.value = roundedAmountBN.toString()
      }
      return route
    }))
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
      slowRouting
    }}>
      { props.children }
    </PaymentRoutingContext.Provider>
  )
}
