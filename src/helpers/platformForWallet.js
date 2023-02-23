import isAndroid from './isAndroid'
import isIOS from './isIOS'
import isMobile from './isMobile'

export default (walletMetaData)=>{
  let platform
  if(isMobile()) {
    if(isAndroid()) {
      platform = walletMetaData.mobile?.android
    } else if(isIOS()) {
      platform = walletMetaData.mobile?.ios
    }
  } else {
    platform = walletMetaData.desktop
  }
  return platform
}
