import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useEffect, useContext } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'

export default (props)=>{
  
  const [closable, setClosable] = useState(true)
  const [open, setOpen] = useState(true)
  const { setUpdatable } = useContext(UpdatableContext)

  const close = ()=>{
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
  }

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
    setTimeout(()=>{
      window.addEventListener('beforeunload', preventReload);
    }, 800) // timeout to prevent beforeunload error in case browser redirects to wallet (e.g. Solana Mobile Wallet Adapter)
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
