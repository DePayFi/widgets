import {ethers} from 'ethers';

var EthersProvider = function(){
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else if (window.web3 && window.web3.currentProvider) {
    return new ethers.providers.Web3Provider(window.web3.currentProvider);
  }
}

export default EthersProvider;
