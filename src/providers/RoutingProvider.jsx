import ConfigurationContext from '../contexts/ConfigurationContext'
import LoadingContext from '../contexts/LoadingContext'
import React, { useState, useContext, useEffect } from 'react'
import RoutingContext from '../contexts/RoutingContext'
import WalletContext from '../contexts/WalletContext'
import { route } from 'depay-payment-routing'
import { ethers } from 'ethers'

export default (props)=>{

  const [allRoutes, setAllRoutes] = useState()
  const [selectedRoute, setSelectedRoute] = useState()
  const { setLoading } = useContext(LoadingContext)
  const { amount, token, receiver } = useContext(ConfigurationContext)
  const { account } = useContext(WalletContext)

  useEffect(() => setLoading({ routing: true }), [])

  useEffect(() => {
    if(!account) { return }
    console.log('configuration', {
      from: account,
      to: receiver,
      blockchain: 'ethereum',
      token,
      amount: amount
    })
    let routes = route({
      from: account,
      to: receiver,
      blockchain: 'ethereum',
      token,
      amount: amount
    }).then((routes)=>{
      console.log('routes', routes)
      // setAllRoutes(routes)
    })
  }, [account])
  
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
