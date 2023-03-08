const isWebView = ()=> {
  return navigator.userAgent.toLowerCase().includes('webview') || navigator.userAgent.toLowerCase().includes('wv')
}

export default isWebView
