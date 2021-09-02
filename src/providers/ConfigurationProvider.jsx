import ConfigurationContext from '../contexts/ConfigurationContext'
import React, { useEffect } from 'react'

export default (props)=>{

  return(
    <ConfigurationContext.Provider value={ props.configuration }>
      { props.children }
    </ConfigurationContext.Provider>
  )
}
