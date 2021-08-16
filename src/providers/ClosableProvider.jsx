import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useContext, useEffect } from 'react'
import { NavigateStackContext, StackContext } from 'depay-react-dialog-stack'

export default (props)=>{
  
  const [closable, setClosable] = useState(true)
  const navigate = useContext(NavigateStackContext)
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
