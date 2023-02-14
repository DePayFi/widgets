const isMobile = ()=> {
  if (typeof window !== 'undefined') {
    return Boolean(
      window.matchMedia('(pointer:coarse)').matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)
    )
  }

  return false
}

export default isMobile
