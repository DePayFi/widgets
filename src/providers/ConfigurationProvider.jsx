/*#if _EVM

import { setProviderEndpoints } from '@depay/web3-client-evm'

/*#elif _SOLANA

import { setProviderEndpoints } from '@depay/web3-client-solana'

//#else */

import { setProviderEndpoints } from '@depay/web3-client'

//#endif

import ConfigurationContext from '../contexts/ConfigurationContext'
import React, { useEffect } from 'react'
import { Currency } from '@depay/local-currency'

export default (props)=>{
  const currencyCode = new Currency({ code: props.configuration.currency }).code

  useEffect(()=>{
    if(props.configuration.providers != undefined) {
      Object.entries(props.configuration.providers).forEach((entry)=>{
        setProviderEndpoints(entry[0], entry[1])
      })
    }
  }, [props.configuration])

  return(
    <ConfigurationContext.Provider value={ Object.assign({}, props.configuration, { currencyCode }) }>
      { props.children }
    </ConfigurationContext.Provider>
  )
}
