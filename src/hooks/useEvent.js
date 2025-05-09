import React, { useRef, useEffect, useCallback } from 'react'

export default function useEvent(fn) {
  const ref = useRef(fn)
  useEffect(() => { ref.current = fn }, [fn])
  return useCallback((...args) => {
    return ref.current(...args)
  }, [])
}
