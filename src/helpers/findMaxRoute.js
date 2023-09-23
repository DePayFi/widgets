import { Decimal } from 'decimal.js'
import { ethers } from 'ethers'

export default (routes)=> {
  let sortedLowToHigh = [...routes].sort((a,b)=>{
    if(a?.usdRoute?.length === undefined || a?.usdRoute?.length == 0) {
      return -1; //b
    }

    if(b?.usdRoute?.length === undefined || b?.usdRoute?.length == 0) {
      return 1; //a
    }

    if(a.usdRoute[0].amountOut == '0') {
      return -1; // b
    }

    if(b.usdRoute[0].amountOut == '0') {
      return 1; // a
    }

    let aMaxUsdAmountAsDecimal = new Decimal(ethers.utils.formatUnits(a.usdRoute[0].amountOut, a.usdRoute[0].decimalsOut));
    let bMaxUsdAmountAsDecimal = new Decimal(ethers.utils.formatUnits(b.usdRoute[0].amountOut, b.usdRoute[0].decimalsOut));

    if (aMaxUsdAmountAsDecimal.lt(bMaxUsdAmountAsDecimal)) {
      return -1; // b
    }
    if (bMaxUsdAmountAsDecimal.lt(aMaxUsdAmountAsDecimal)) {
      return 1; // a
    }
    return 0; // equal
  })
  return sortedLowToHigh[sortedLowToHigh.length-1];
}
