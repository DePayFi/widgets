import { ethers } from 'ethers'

export default (routes)=> {
  let sortedLowToHigh = [...routes].sort((a,b)=>{
    let aAmountsAvailable = ethers.BigNumber.from(a.fromBalance).div(ethers.BigNumber.from(a.fromAmount));
    let bAmountsAvailable = ethers.BigNumber.from(b.fromBalance).div(ethers.BigNumber.from(b.fromAmount));

    if (aAmountsAvailable.lt(bAmountsAvailable)) {
      return -1;
    }
    if (bAmountsAvailable.lt(aAmountsAvailable)) {
      return 1;
    }
    return 0; // equal
  })
  return sortedLowToHigh[sortedLowToHigh.length-1];
}
