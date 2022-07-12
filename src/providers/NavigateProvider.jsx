import NavigateContext from '../contexts/NavigateContext'
import React, { useState } from 'react'

export default (props)=>{
  
  let navigator

  const setNavigator = (_navigator)=>{
    navigator = _navigator
  }

  const navigate = (dialog)=>{
    if(navigator) { navigator.navigate(dialog) }
  }

  const set = (dialogs)=>{
    if(navigator) { navigator.set(dialogs) }
  }

  return(
    <NavigateContext.Provider value={{
      navigate,
      set,
      setNavigator,
    }}>
      { props.children }
    </NavigateContext.Provider>
  )
}
