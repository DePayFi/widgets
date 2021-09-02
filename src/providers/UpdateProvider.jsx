import React, { useState } from 'react'
import UpdateContext from '../contexts/UpdateContext'

export default (props)=>{

  const [ update, setUpdate ] = useState(true)

  return(
    <UpdateContext.Provider value={{
      update,
      setUpdate
    }}>
      { props.children }
    </UpdateContext.Provider>
  )
}
