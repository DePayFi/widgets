import ClosableContext from '../contexts/ClosableContext'
import React, { useState } from 'react'

export default (props)=>{
  
  const [closable, setClosable] = useState(true)

  return(
    <ClosableContext.Provider value={{ closable: closable, setClosable: setClosable }}>
      { props.children }
    </ClosableContext.Provider>
  )
}
