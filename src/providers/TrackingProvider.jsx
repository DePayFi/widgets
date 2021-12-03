import ConfigurationContext from '../contexts/ConfigurationContext'
import React, { useEffect, useContext, useState } from 'react'
import TrackingContext from '../contexts/TrackingContext'

export default (props)=>{
  const { track } = useContext(ConfigurationContext)
  const [ tracking, setTracking ] = useState(track && !!track.endpoint)

  useEffect(()=>{
    setTracking(track && !!track.endpoint)
  }, [track])

  const initializeTracking = ()=>{
    console.log('initializeTracking')
  }

  return(
    <TrackingContext.Provider value={{
      tracking,
      initializeTracking
    }}>
      { props.children }
    </TrackingContext.Provider>
  )
}
