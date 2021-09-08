import ConfigurationContext from '../contexts/ConfigurationContext'
import React, { useEffect } from 'react'
import { setProvider } from 'depay-web3-client'

export default (props)=>{

  useEffect(()=>{
    if(props.configuration.providers != undefined) {
      Object.entries(props.configuration.providers).forEach((entry)=>{
        setProvider(entry[0], entry[1])
      })
    }
  }, [props.configuration])

  return(
    <ConfigurationContext.Provider value={ props.configuration }>
      { props.children }
    </ConfigurationContext.Provider>
  )
}
