import apiKey from '../apiKey'
import ConfigurationContext from '../contexts/ConfigurationContext'
import LoadingContext from '../contexts/LoadingContext'
import React, { useState, useContext, useEffect } from 'react'
import RoutingContext from '../contexts/RoutingContext'
import WalletContext from '../contexts/WalletContext'
import { ethers } from 'ethers'
import { route } from 'depay-web3-payments'

export default (props)=>{

  const [allRoutes, setAllRoutes] = useState()
  const [selectedRoute, setSelectedRoute] = useState()
  const { updateLoading } = useContext(LoadingContext)
  const { blockchain, amount, token, receiver } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)

  useEffect(() => {
    if(!account) { return }
    let routes = route({
      fromAddress: account,
      toAddress: receiver,
      blockchain,
      token,
      amount: amount,
      apiKey
    }).then((routes)=>{
      setAllRoutes(routes)
      setSelectedRoute(routes[0])
    })
  }, [account])

  useEffect(()=>{
    if(allRoutes && selectedRoute) {
      updateLoading({ routing: false })
    } else {
      updateLoading({ routing: true })
    }
  }, [allRoutes, selectedRoute])
  
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
