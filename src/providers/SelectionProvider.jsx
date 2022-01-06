import React, { useState } from 'react'
import SelectionContext from '../contexts/SelectionContext'

export default (props)=>{

  const [ selection, setSelection ] = useState({})

  return(
    <SelectionContext.Provider value={{
      selection,
      setSelection
    }}>
      { props.children }
    </SelectionContext.Provider>
  )
}
