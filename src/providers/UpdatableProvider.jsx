import React, { useState } from 'react'
import UpdatableContext from '../contexts/UpdatableContext'

export default (props)=>{

  const [ updatable, setUpdatable ] = useState(true)

  return(
    <UpdatableContext.Provider value={{
      updatable,
      setUpdatable
    }}>
      { props.children }
    </UpdatableContext.Provider>
  )
}
