import LoadingContext from '../contexts/LoadingContext'
import React, { useState, useEffect } from 'react'

export default (props)=>{
  
  const [instances, setInstances] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(Object.values(instances).some((element)=>Boolean(element)))
  }, [instances])

  const updateLoading = (instance)=>{
    setInstances(Object.assign({}, Object.assign(instances, instance)))
  }

  return(
    <LoadingContext.Provider value={{
      loading,
      updateLoading
    }}>
      { props.children }
    </LoadingContext.Provider>
  )
}
