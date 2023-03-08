const isWebView = ()=> {
  return navigator.userAgent.toLowerCase().includes('WebView') || navigator.userAgent.toLowerCase().includes('wv')
}

export default isWebView
