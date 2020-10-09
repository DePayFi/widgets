import React from 'react';
import RoutesContext from '../contexts/RoutesContext';

// Provides potential routes (the most optimal per token)
// Example: [{
//  route: ["0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb", "", ""],
//  token: { "name": "DePay", "address": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb", "symbol": "DEPAY", "decimals": 18, "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png" },
//  required: 200000,
//  balance: 44000000,
//  fee: 4220000 (in gwei)
// }, ...]
//
// Can contain ETH without any routes, as ETH is a native currency and not a token (otherwise it would be WETH)
// Example: [{
//  route: [],
//  token: { "name": "Ethereum", "symbol": "ETH", "decimals": 18, "logoURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC" },
//  required: 200000,
//  balance: 44000000,
//  fee: 20000 (in gwei)
// }, ...]
class RoutesProvider extends React.Component {
  state = {
    initializing: true,
    routes: null,
    selected: null
  };

  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);
  }

  changeSelected(index) {
    this.setState({
      selected: this.state.routes[index]
    });
  }

  componentDidMount() {
    this.getAllTokenRoutes()
      .then(this.unshiftETHRoute.bind(this))
      .then(this.findAndFilterBestRoutes.bind(this))
      .then(function(routes){
        this.setState({ 
          initializing: false,
          routes,
          selected: routes[0]
        })
      }.bind(this))
  }

  getAllTokenRoutes() {
    return new Promise(function(resolve, reject){
      fetch(`https://depay.app/api/payment/${this.props.address}`).then(function(response){
        response.json().then(function(tokens) {
          this.filterTokensWithBalance(tokens).then(function(tokens){
            resolve(
              tokens.map(function(token){
                let tokenInfo = token.tokenInfo;
                let address = DePay.ethers.utils.getAddress(tokenInfo.address);
                return {
                  route: [],
                  token: {
                    name: tokenInfo.name,
                    address: address,
                    symbol: tokenInfo.symbol,
                    decimals: parseInt(tokenInfo.decimals, 10),
                    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/'+address+'/logo.png'
                  },
                  required: 123,
                  requiredInETH: 456,
                  balance: token.balance,
                  fee: 123
                }
              })
            )
          })
        }.bind(this))
      }.bind(this))
    }.bind(this));
  }

  filterTokensWithBalance(tokens){
    return new Promise(function(resolve, reject){
      resolve(
        tokens.filter(function(token){
          return token.balance > 0
        })
      )
    });
  }

  unshiftETHRoute(routes) {
    return routes;
  }

  findAndFilterBestRoutes(routes) {
    return routes.map(function(route){
      return route;
    });
  }

  render() {
    return(
      <RoutesContext.Provider value={{
        initializing: this.state.initializing,
        routes: this.state.routes,
        selected: this.state.selected,
        change: this.changeSelected,
      }}>
        {this.props.children}
      </RoutesContext.Provider>
    )
  }
}

export default RoutesProvider;
