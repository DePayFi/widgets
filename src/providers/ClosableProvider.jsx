import ClosableContext from '../contexts/ClosableContext'
import React, { useState } from 'react'

export default (props)=>{
  
  const [closable, setClosable] = useState(true)
  const [open, setOpen] = useState(true)

  let close = ()=>{
    setOpen(false)
    props.unmount()
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
