const isIOS = ()=> {
  return Boolean(
    (/iPad|iPhone|iPod/.test(navigator.userAgent)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export default isIOS
