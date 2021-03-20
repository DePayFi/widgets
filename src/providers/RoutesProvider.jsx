import _ from 'lodash';
import DePayRouterV1Contract from '../contracts/DePayRouterV1Contract';
import Erc20Abi from '../abi/Erc20Abi';
import EthersProvider from '../utils/EthersProvider';
import Exchanges from '../utils/Exchanges';
import React from 'react';
import RoutesContext from '../contexts/RoutesContext';
import { WETH, ETH } from '../utils/Constants';
import { ethers } from 'ethers';

class RoutesProvider extends React.Component {
  state = {
    initializing: true,
    routes: null,
    selected: null
  };

  changeSelected(index) {
    this.setState({
      selected: this.state.routes[index]
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.amount !== this.props.amount) {
      this.setState({ initializing: true });
      this.computeRoutes();
    }
  }

  componentDidMount() {
    this.setState({ initializing: true });
    this.computeRoutes();
  }

  computeRoutes() {
    this.getAllTokenRoutes()
      .then(this.addNFTRoutes.bind(this))
      .then(this.unshiftETHRoute.bind(this))
      .then(this.findBestRoutesAndRequiredAmounts.bind(this))
      .then(this.filterRoutesWithEnoughBalance.bind(this))
      .then(this.addApprovalStatus.bind(this))
      .then(this.sortRoutes.bind(this))
      .then(this.addMaxAmounts.bind(this))
      .then(function(routes){
        console.log(routes);
        this.setState({selected: routes[0]}, function(){
          // set selected first to prevent flickering "Not enough funds"
          this.setState({
            initializing: false,
            routes
          });
        }); 
        return routes;
      }.bind(this))
  }

  addMaxAmounts(routes){
    if(this.props.addMaxAmounts === true) {
      return Exchanges.routesWithMaxAmounts(routes);
    } else {
      return Promise.resolve(routes);
    }
  }

  addApprovalStatus(routes) {
    return Promise.all(
      routes.map(function(route){
        if(route.token.address === ETH) {
          route.approved = true;
          return Promise.resolve(route);
        } else {
          return new ethers.Contract(route.token.address, Erc20Abi, EthersProvider)
          .allowance(this.props.wallet.address(), DePayRouterV1Contract.address)
          .then(function(amount){
            if(amount.gt(ethers.BigNumber.from(route.amounts[0]))) {
              route.approved = true;
            } else {
              route.approved = false;
            }
            return route;
          });
        }
      }.bind(this))
    )
  }

  findBestRoutesAndRequiredAmounts(routes) {
    return Exchanges
      .findBestRoutesAndRequiredAmountsForEndToken(
        routes,
        this.props.token,
        this.props.amount
      ).then(function(routes){
        var directTransfer = routes.find(function(route){
          return route.token.address === route.route[route.route.length-1];
        });

        if(directTransfer) {
          // set input amount == output amount as direct transfer is not swapped
          directTransfer.amounts[0] = directTransfer.amounts[directTransfer.amounts.length-1];
        }

        return routes;
      })
  }

  getAllTokenRoutes() {
    return new Promise(function(resolve, reject){
      fetch(`https://depay.fi/api/payment/${this.props.address}`).then(function(response){
        response.json().then(function(tokens) {
          this.filterTokensWithAnyBalance(tokens)
          .then(this.excludeTokens.bind(this))
          .then(this.convertTokensToRoutes.bind(this))
          .then(resolve)
        }.bind(this))
      }.bind(this))
    }.bind(this));
  }

  filterTokensWithAnyBalance(tokens){
    return new Promise(function(resolve, reject){
      resolve(
        tokens.filter(function(token){
          return token.balance > 0
        })
      )
    });
  }

  excludeTokens(tokens){
    return new Promise(function(resolve, reject){
      if(this.props.exclude === undefined) {
        resolve(tokens)
      } else {
        resolve(
          tokens.filter(function(token){
            return token.address.toLowerCase() !== this.props.exclude.toLowerCase()
          }.bind(this))
        )
      }
    }.bind(this));
  }

  filterRoutesWithEnoughBalance(routes) {
    return new Promise(function(resolve, reject){
      resolve(
        routes.filter(function(route){
          if(route.amounts === null) { return false }
          return parseFloat(route.balance) >= parseFloat(route.amounts[0])
        })
      )
    });
  }

  convertTokensToRoutes(tokens) {
    return(
      tokens.map(function(token){
        const address = ethers.utils.getAddress(token.address);
        const transfer = (address === this.props.token);
        const fee = transfer ? 75000 : 155000;
        let route;
        if(transfer) { 
          route = [];
        } else if (this.props.token === ETH) {
          route = [address, ETH];
        } else {
          route = [address, this.props.token];
        }
        return {
          token: {
            name: token.name,
            address: address,
            symbol: token.symbol,
            decimals: parseInt(token.decimals, 10),
            logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/'+address+'/logo.png'
          },
          route: route,
          amounts: [],
          balance: token.balance.toLocaleString('fullwide', {useGrouping:false}),
          fee: fee,
          approved: null
        }
      }.bind(this))
    )
  }

  unshiftETHRoute(routes) {
    return new Promise(function(resolve, reject){
      const transfer = this.props.token === 'ETH';
      // fee for transfer or swap
      const fee = transfer ? 21000 : 155000;

      this.props.wallet.balance().then(function(balance){
        let route = {
          token: {
            name: 'Ether',
            address: ETH,
            symbol: 'ETH',
            decimals: 18,
            logoURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC'
          },
          route: [],
          amounts: [],
          balance: balance.toString(),
          fee: fee,
          approved: true
        }

        resolve([route].concat(routes));
      }.bind(this))
    }.bind(this));
  }

  addNFTRoutes(routes) {
    return new Promise(function(resolve, reject){
      fetch(`https://api.opensea.io/api/v1/assets?owner=`+this.props.wallet.address()+`&order_direction=desc&offset=0&limit=1`).then(function(response){
        response.json().then(function(data) {
          routes = routes.concat(data.assets.map(function(asset){
            return {
              token: {
                name: asset.name,
                address: asset.asset_contract.address,
                symbol: asset.asset_contract.name,
                logoURI: asset.image_url,
                id: asset.token_id
              },
              route: [WETH], // let's assume NFTs always go for WETH
              nft: true,
              balance: '1',
              approved: true
            }            
          }));
          resolve(routes);
        });
      });
    }.bind(this));
  }

  sortRoutes(routes) {
    return Promise.resolve(routes.sort(function(a, b){
      if (a.fee > b.fee) {
        return 1;
      }
      if (b.fee > a.fee) {
        return -1;
      }
      return 0; // equal
    }));
  }

  render() {
    return(
      <RoutesContext.Provider value={{
        initializing: this.state.initializing,
        routes: this.state.routes,
        selected: this.state.selected,
        change: this.changeSelected.bind(this),
      }}>
        {this.props.children}
      </RoutesContext.Provider>
    )
  }
}

export default RoutesProvider;
