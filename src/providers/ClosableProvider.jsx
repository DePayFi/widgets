import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useEffect, useContext } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'

export default (props)=>{
  
  const [closable, setClosable] = useState(true)
  const [open, setOpen] = useState(true)
  const { setUpdatable } = useContext(UpdatableContext)

  let close = ()=>{
    if(!closable) { return }
    setUpdatable(false)
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
