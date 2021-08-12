import ConfigurationContext from '../contexts/ConfigurationContext'
import React from 'react'

export default (props)=>{
  
  return(
    <ConfigurationContext.Provider value={ props.configuration }>
      { props.children }
    </ConfigurationContext.Provider>
  )
}
