import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useEffect } from 'react'

export default (props)=>{
  
  const [closable, setClosable] = useState(true)
  const [open, setOpen] = useState(true)

  let close = ()=>{
    if(!closable) { return }
    setOpen(false)
    setTimeout(props.unmount, 300)
  }

  return(
    <ClosableContext.Provider value={{
      closable,
      setClosable,
      close,
      open
    }}>
      { props.children }
    </ClosableContext.Provider>
  )
}
