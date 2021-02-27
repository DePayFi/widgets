import Erc20Abi from '../abi/Erc20Abi';
import EthersProvider from '../utils/EthersProvider';
import { ethers } from 'ethers';
import { ETH } from '../utils/Constants';

export default function ImportToken(address){
  address = ethers.utils.getAddress(address);
  return new Promise(function(resolve, reject) {
    if(address === ETH) {
      resolve({
        "name": "Ether",
        "symbol": "ETH",
        "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC"
      })
    } else {
      const contract = new ethers.Contract(address, Erc20Abi, EthersProvider);
      Promise.all([contract.name(), contract.symbol(), contract.decimals()]).then(function(values){
        resolve({
          name: values[0],
          address: address,
          decimals: values[2],
          symbol: values[1],
          logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/"+address+"/logo.png"
        });
      }).catch(reject);
    }
  })
}
