import { ethers } from 'ethers'

export default (routes)=> {
  let sortedLowToHigh = [...routes].sort((a,b)=>{
    if(a.fromBalance == '0' || a.fromAmount == '0') {
      return -1; // b
    }

    if(b.fromBalance == '0' || b.fromAmount == '0') {
      return 1; // a
    }

    let aAmountsAvailable = ethers.BigNumber.from(a.fromBalance).div(ethers.BigNumber.from(a.fromAmount));
    let bAmountsAvailable = ethers.BigNumber.from(b.fromBalance).div(ethers.BigNumber.from(b.fromAmount));

    if (aAmountsAvailable.lt(bAmountsAvailable)) {
      return -1; // b
    }
    if (bAmountsAvailable.lt(aAmountsAvailable)) {
      return 1; // a
    }
    return 0; // equal
  })
  return sortedLowToHigh[sortedLowToHigh.length-1];
}
