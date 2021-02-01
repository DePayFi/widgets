import Erc20Abi from '../abi/Erc20Abi';
import { ethers } from 'ethers';

export default function ImportToken(address){
  address = ethers.utils.getAddress(address);
  return new Promise(function(resolve, reject) {
    const contract = new ethers.Contract(address, Erc20Abi, ethers.provider);
    Promise.all([contract.name(), contract.symbol(), contract.decimals()]).then(function(values){
      resolve({
        name: values[0],
        address: address,
        decimals: values[2],
        symbol: values[1],
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/"+address+"/logo.png"
      });
    }).catch(reject);
  })
}
