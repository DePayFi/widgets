import apiKey from '../apiKey'
import ConfigurationContext from '../contexts/ConfigurationContext'
import React, { useState, useContext, useEffect } from 'react'
import round from '../helpers/round'
import RoutingContext from '../contexts/RoutingContext'
import UpdateContext from '../contexts/UpdateContext'
import WalletContext from '../contexts/WalletContext'
import { CONSTANTS } from 'depay-web3-constants'
import { ethers } from 'ethers'
import { route } from 'depay-web3-payments'

export default (props)=>{

  const [allRoutes, setAllRoutes] = useState()
  const [selectedRoute, setSelectedRoute] = useState()
  const [reloadCount, setReloadCount] = useState(0)
  const { accept } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)
  const { update } = useContext(UpdateContext)
  const getPaymentRoutes = ({ allRoutes, selectedRoute, update })=>{
    if(update == false) { return }
    route({
      accept: accept.map((configuration)=>({ ...configuration, fromAddress: account, toAddress: configuration.receiver })),
      apiKey
    }).then((routes)=>{
      if(routes.length == 0) {
        setAllRoutes([])
      } else {
        roundAmounts(routes).then((roundedRoutes)=>{
          let selected = selectedRoute ? roundedRoutes[allRoutes.indexOf(selectedRoute)] : roundedRoutes[0]
          setSelectedRoute(selected)
          setAllRoutes(roundedRoutes)
        })
      }
    })
  }
  const roundAmounts = async (routes)=> {
    return Promise.all(routes.map(async (route)=>{
      if(route.directTransfer){ return route }
      let readableAmount = await route.fromToken.readable(route.transaction.params.amounts[0])
      let roundedAmountBN = await route.fromToken.BigNumber(round(readableAmount))
      route.fromAmount = roundedAmountBN
      route.transaction.params.amounts[0] = roundedAmountBN
      if(route.transaction.value && route.transaction.value.toString() != '0') {
        route.transaction.value = roundedAmountBN
      }
      return route
    }))
  }

  useEffect(() => {
    if(account) { getPaymentRoutes({}) }
  }, [account])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReloadCount(reloadCount + 1)
      getPaymentRoutes({ allRoutes, selectedRoute, update })
    }, 15000);

    return () => clearTimeout(timeout)
  }, [reloadCount, allRoutes, selectedRoute, update])

  return(
    <RoutingContext.Provider value={{
      selectedRoute: selectedRoute,
      setSelectedRoute: setSelectedRoute,
      allRoutes: allRoutes,
      setAllRoutes: setAllRoutes
    }}>
      { props.children }
    </RoutingContext.Provider>
  )
}
