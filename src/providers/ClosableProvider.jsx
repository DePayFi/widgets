import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useEffect, useContext } from 'react'
import UpdateContext from '../contexts/UpdateContext'

export default (props)=>{
  
  const [closable, setClosable] = useState(true)
  const [open, setOpen] = useState(true)
  const { setUpdate } = useContext(UpdateContext)

  let close = ()=>{
    if(!closable) { return }
    setUpdate(false)
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
