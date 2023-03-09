const isWebView = ()=> {
  const userAgentToLower = navigator.userAgent.toLowerCase()
  return(
    userAgentToLower.includes('webview') ||
    userAgentToLower.includes('wv') ||
    (navigator.userAgent.toLowerCase().match(/\) mobile\//) && !userAgentToLower.includes('safari'))
  )
}

export default isWebView
