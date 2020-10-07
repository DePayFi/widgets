class MetaMaskConnector {
  static ethereum = window.ethereum;

  static isAvailable() {
    return Boolean(
      typeof(ethereum) == 'object' && ethereum.isMetaMask
    )
  }

  static isConnected() {
    return Boolean(this.address())
  }

  static address() {
    return ethereum.selectedAddress
  }

  static connect() {
    return new Promise(function(resolve, reject) {
      ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts){
        resolve(accounts[0]);
      });
    });
  }

  static onAddressChange() {
    return new Promise(function(resolve, reject) {
      ethereum.on('accountsChanged', function (accounts) {
        resolve(accounts[0]);
      });
    });
  }

  static name() {
    return 'MetaMask';
  }
}

export default MetaMaskConnector;
