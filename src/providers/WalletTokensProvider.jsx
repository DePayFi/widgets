import Exchanges from '../utils/Exchanges';
import React from 'react';
import WalletTokensContext from '../contexts/WalletTokensContext';
import { ETH } from '../utils/Constants';
import { ethers } from 'ethers';

class WalletTokensProvider extends React.Component {
  state = {
    initializing: true
  }

  componentDidMount() {
    this.loadWalletTokens()
      .then(this.addTokenImages)
      .then(this.filterForTokensWithBalance)
      .then(this.filterForExchangableTokens)
      .then(this.setBalancePerToken)
      .then(this.unshiftEther.bind(this))
      .then(this.filterForBalance)
      .then(function(tokens){
        if(this.props.afterInitialization) {
          this.props.afterInitialization(tokens);
        }
        this.setState({
          initializing: false,
          tokens: tokens
        })
      }.bind(this))
  }

  unshiftEther(tokens) {
    return new Promise(function(resolve, reject){
      this.props.wallet.balance().then(function(balance){
        let token = {
          name: 'Ether',
          address: ETH,
          symbol: 'ETH',
          decimals: 18,
          logoURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC',
          balance: balance.toString()
        }

        resolve([token].concat(tokens));
      }.bind(this))
    }.bind(this));
  }

  setBalancePerToken(tokens) {
    return Promise.resolve(tokens.map(function(token){
      return Object.assign(token, {
        balance: token.balance.toLocaleString('fullwide', {useGrouping:false})
      })
    }))
  }

  filterForBalance(tokens) {
    return Promise.resolve(tokens.filter(function(token){
      return ethers.BigNumber.from(token.balance).gt(0)
    }))
  }

  loadWalletTokens() {
    return new Promise(function(resolve, reject){
      fetch(`https://depay.fi/api/payment/${this.props.address}`).then(function(response){
        response.json().then(resolve)
      }.bind(this))
    }.bind(this));
  }

  addTokenImages(tokens) {
    return Promise.resolve(tokens.map(function(token){
      return Object.assign(token, {
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/"+ethers.utils.getAddress(token.address)+"/logo.png"
      })
    }))
  }

  filterForTokensWithBalance(tokens) {
    return new Promise(function(resolve){
      resolve(tokens.filter(function(token){
        return(token.balance > 0);
      }));
    });
  }

  filterForExchangableTokens(tokens) {
    return new Promise(function(resolve){
      Promise.all(tokens.map(function(token){
        return Exchanges.findRoutes(token.address)
      })).then(function(routesForTokensPerExchange){
        resolve(tokens.filter(function(token, index){
          return Object.keys(routesForTokensPerExchange[index]).length > 0
        }));
      });
    });
  }

  render() {
    return(
      <WalletTokensContext.Provider value={{
        initializing: this.state.initializing,
        tokens: this.state.tokens
      }}>
        {this.props.children}
      </WalletTokensContext.Provider>
    )
  }
}

export default WalletTokensProvider;
