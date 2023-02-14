import isMobile from './isMobile'

const isAndroid = ()=> {
  return isMobile() && navigator.userAgent.toLowerCase().includes('android')
}

export default isAndroid
