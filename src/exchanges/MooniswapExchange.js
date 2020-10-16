import _ from 'lodash';
import MoonifactoryContract from '../contracts/MoonifactoryContract';
import MooniswapContract from '../contracts/MooniswapContract';
import { ethers } from 'ethers';
import { WETH } from '../utils/Constants';

const ETH = '0x0000000000000000000000000000000000000000';

class MooniswapExchange {

  static name() {
    return 'Mooniswap';
  }

  static linkRoute(route) {
    return `https://mooniswap.exchange/#/swap?exactAmount=${parseFloat(ethers.utils.formatEther(route.amounts[0])).toFixed(4)}&inputCurrency=${route.route[0]}&outputCurrency=${route.route[route.route.length-1]}`
  }

  static ETHis0(address) {
    if(address === WETH) { return ETH }
    return address;
  }
  
  static findLiquidity(addressA, addressB) {
    return new Promise(function(resolve, reject){
      MoonifactoryContract.pools(
        MooniswapExchange.ETHis0(addressA),
        MooniswapExchange.ETHis0(addressB)
      ).then(function(pairAddress){
        if(pairAddress === ethers.constants.AddressZero) {
          resolve(null);
        } else {
          MooniswapContract(pairAddress)
          .getBalanceForAddition(MooniswapExchange.ETHis0(addressB))
          .then(function(amount){
            resolve([amount]);
          })
        }
      })
    });
  }

  static findAmounts(route, endTokenAmount) {
    return new Promise(function(resolve, reject){
      var routes = [[route[0], route[1]], [route[1], route[2]]].filter(function(partRoute){
        return(partRoute[0] && partRoute[1]);
      });
      Promise.all(
        routes.map(function(route){
          return new Promise(function(innerResolve, reject){
            MoonifactoryContract.pools(
              MooniswapExchange.ETHis0(route[0]),
              MooniswapExchange.ETHis0(route[1])
            ).then(function(pairAddress){
              if(pairAddress === ethers.constants.AddressZero) {
               return innerResolve(null); // dont bother if there is no pair
              }
              MooniswapContract(pairAddress).getReturn(
                MooniswapExchange.ETHis0(route[1]),
                MooniswapExchange.ETHis0(route[0]),
                endTokenAmount
              ).then(function(amount){
                innerResolve([amount.toString(), endTokenAmount])
              })
            })
          })
        })
      ).then(function(amounts){
        if(_.every(amounts, function(amount){ return amount !== null })) {
          let flattenedAmounts = amounts.flat(1);
          flattenedAmounts.splice(2,1);
          resolve(flattenedAmounts);
        } else {
          resolve(null)
        }
      })
    });
  }
}

export default MooniswapExchange;
