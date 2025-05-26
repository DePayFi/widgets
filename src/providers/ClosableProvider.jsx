import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useEffect, useContext } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'
import useEvent from '../hooks/useEvent'

export default (props)=>{
  
  const [closable, setClosable] = useState(props.closable || true)
  const [open, setOpen] = useState(true)
  const { setUpdatable } = useContext(UpdatableContext)

  const close = useEvent(()=>{
    if(props.closable === false) { return }
    if(!closable) { return }
    let close = true
    if(typeof closable === 'string') {
      close = confirm(closable)
    }
    if(close) {
      setUpdatable(false)
      setOpen(false)
      setTimeout(props.unmount, 300)
    }
  })

  useEffect(()=>{
    const preventReload = (event) => {
      if(!closable || props.closable === false) {
        const msg = 'Payment is still pending. Please wait!'
        event.preventDefault()
        event.returnValue = msg
        return msg
      } else if (typeof closable === 'string') {
        const msg = closable
        event.preventDefault()
        event.returnValue = msg
        return msg
      }
    }
    window.addEventListener('beforeunload', preventReload);
    return ()=>{
      window.removeEventListener('beforeunload', preventReload);
    }
  }, [closable, props.closable])

  return(
    <ClosableContext.Provider value={{
      closable,
      setClosable,
      close,
      open,
      setOpen,
    }}>
      { props.children }
    </ClosableContext.Provider>
  )
}
