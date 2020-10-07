import React from 'react';
import Wallet from '../utils/Wallet';
import WalletContext from '../contexts/WalletContext';
import WalletNotFoundDialog from '../dialogs/WalletNotFoundDialog';
import WalletConnectDialog from '../dialogs/WalletConnectDialog';

class WalletProvider extends React.Component {
  state = {
    address: null,
    connected: false,
    available: true,
  };

  constructor(props) {
    super(props);

    if(Wallet.isAvailable() === false) {
      Object.assign(this.state, {
        available: false
      });
      return;
    }

    this.wallet = new Wallet();

    Object.assign(this.state, {
      address: this.wallet.address(),
      connected: this.wallet.isConnected(),
    });
  }

  componentDidMount() {
    if(this.state.available === false) { return }

    if(this.wallet.isConnected() === false) { 
      this.wallet.connect().then(function(address){
        this.setState({
          address,
          connected: true
        });
      }.bind(this))
    }

    this.wallet.onAddressChange(function(address){
      this.setState({
        address
      });
    }.bind(this));
  }

  connect() {
    this.wallet.connect().then(function(){
      this.setState({
        address: this.wallet.address(),
        connected: true
      })
    }.bind(this));
  }

  render() {
    if(this.state.available === false) { return this.renderNoWallet() }
    if(this.state.connected === false) { return this.renderConnect() }
    return (
      <WalletContext.Provider value={{
        wallet: this.wallet,
        address: this.state.address,
        connected: this.state.connected
      }}>
        {this.props.children}
      </WalletContext.Provider>
    );
  }

  renderNoWallet() {
    return(<WalletNotFoundDialog/>)
  }

  renderConnect() {
    return(
      <WalletContext.Provider value={{
        wallet: this.wallet,
        address: this.state.address,
        connected: this.state.connected
      }}>
        <WalletConnectDialog
          connect={this.connect.bind(this)}
        />
      </WalletContext.Provider>
    )
  }
}

export default WalletProvider;
