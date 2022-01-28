import NavigateContext from '../contexts/NavigateContext'
import React, { useState } from 'react'

export default (props)=>{
  
  let navigator

  const setNavigate = (_navigator)=>{
    navigator = _navigator
  }

  const navigate = (dialog)=>{
    if(navigator) { navigator(dialog) }
  }

  return(
    <NavigateContext.Provider value={{
      navigate,
      setNavigate,
    }}>
      { props.children }
    </NavigateContext.Provider>
  )
}
