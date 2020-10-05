var ethers = require('ethers');

var EthersProvider;

if (window.ethereum) {
  EthersProvider = new ethers.providers.Web3Provider(window.ethereum);
} else if (window.web3 && window.web3.currentProvider) {
  EthersProvider = new ethers.providers.Web3Provider(window.web3.currentProvider);
}

export default EthersProvider;
