import LoadingContext from '../contexts/LoadingContext'
import React, { useState, useEffect } from 'react'

export default (props)=>{
  
  const [loading, setLoading] = useState({})
  
  return(
    <LoadingContext.Provider value={{
      loading: Object.values(loading).every((element)=>Boolean(element)),
      setLoading: setLoading 
    }}>
      { props.children }
    </LoadingContext.Provider>
  )
}
