import _ from 'lodash';
import MetaMaskConnector from '../connectors/MetaMaskConnector';

class Wallet {
  static connectors = [
    MetaMaskConnector
  ]

  static connector() {
    return _.find(Wallet.connectors, function(connector){
      return connector.isAvailable()
    });
  }

  static isAvailable() {
    return Boolean(Wallet.connector() !== undefined)
  }

  constructor() {
    this.connector = Wallet.connector();
  }

  isConnected() {
    return this.connector.isConnected()
  }

  connect() {
    return this.connector.connect();
  }

  onAddressChange() {
    return this.connector.onAddressChange();
  }

  address() {
    return this.connector.address();
  }

  balance() {
    return this.connector.balance();
  }

  name() {
    return this.connector.name();
  }

  provider() {
    return this.connector.provider();
  }
}

export default Wallet;
