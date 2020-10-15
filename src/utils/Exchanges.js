import _ from 'lodash';
import UniswapExchange from '../exchanges/UniswapExchange';
import MooniswapExchange from '../exchanges/MooniswapExchange';
import { WETH } from '../utils/Constants';
import { ethers } from 'ethers';

class Exchanges {
  static all = [
    UniswapExchange
  ]

  static findByName(name) {
    return Exchanges.all.find(function(exchange){
      return exchange.name === name;
    });
  }

  static findBestRoutesAndRequiredAmountsForEndToken(routes, endTokenAddress, endTokenAmount){
    return new Promise(function(resolve, reject){
      Exchanges.findIntermediateRoute(endTokenAddress)
        .then(function(exchangesWithIntermediateRoute){
          // can be { <exchange>: [WETH, endTokenAddress] }
          // or just { <exchange>: [WETH] } if endTokenAddress is WETH or ETH
          Promise.all(routes.map(function(route){
            if(
              (route.token.address === 'ETH' || route.token.address === WETH) &&
              endTokenAddress === 'ETH' || endTokenAddress === WETH
            ) {
              return Promise.resolve({ all: [endTokenAmount] });
            } else {
              return Exchanges.findAmountsForRoutePerExchange(
                Object.keys(exchangesWithIntermediateRoute),
                [route.token.address].concat(Object.values(exchangesWithIntermediateRoute)[0]),
                endTokenAmount
              )
            }
          })).then(function(amountsForRoutesPerExchange){
            resolve(
              routes.map(function(route, index){
                return Object.assign(
                  {},
                  route,
                  { route: [route.token.address].concat(Object.values(exchangesWithIntermediateRoute)[0]) },
                  { amounts: amountsForRoutesPerExchange[index] });
              }).filter(function(route){
                return Boolean(
                  _.every(Object.values(route.amounts), function(values){
                    return values !== null && 
                      _.every(values, function(value){
                        return ethers.BigNumber.from(value).gt(0);
                      })
                  })
                )
              }).map(function(route){
                return Exchanges.selectBestExchangeRoute(route);
              })
            )
          })
        });
    });
  }

  static selectBestExchangeRoute(route) {
    let bestExchangeRoute = _.map(route.amounts, function(amounts, exchangeName){
      return({ exchange: exchangeName, amounts: amounts })
    }).sort(function(a, b){
      debugger;
      // if (a.fee > b.fee) {
      //   return 1; // b wins
      // }
      // if (b.fee > a.fee) {
      //   return -1; // a wins
      // }
      // return 0; // equal
    })[0];

    return Object.assign(
      {},
      route,
      { exchange: bestExchangeRoute.exchange },
      { amounts: bestExchangeRoute.amounts }
    )
  }

  static findAmountsForRoutePerExchange(exchangeNames, route, endTokenAmount) {
    let findAmountsForRoutePerExchange = {};
    return new Promise(function(resolve, reject){
      Promise.all(exchangeNames.map(function(exchangeName){
        if(route[0] === 'ETH') { route = route.slice(1,3); }
        return Exchanges.findByName(exchangeName).findAmounts(route, endTokenAmount);
      })).then(function(amounts){
        exchangeNames.forEach(function(exchangeName, index){
          findAmountsForRoutePerExchange[exchangeName] = amounts[index];
        })
        resolve(findAmountsForRoutePerExchange);
      });
    });
  }

  static findIntermediateRoute(tokenAddress) {
    let routesPerExchange = {};
    return new Promise(function(resolve, reject){
      if(tokenAddress === 'ETH' || tokenAddress === WETH) {
        Exchanges.all.map(function(exchange){
          routesPerExchange[exchange.name] = [WETH];
        });
        resolve(routesPerExchange);
      } else {
        Promise.all(Exchanges.all.map(function(exchange){
          return exchange.findLiquidity(WETH, tokenAddress).then(function(liquidity){
            if(liquidity === null || liquidity[0].eq(0) || liquidity[1].eq(0)) {
              return null;
            } else {
              let exchangeWithLiquidity = {};
              exchangeWithLiquidity[exchange.name] = liquidity;
              return exchangeWithLiquidity;
            }
          })
        })).then(function(exchangesWithLiquidity){
          exchangesWithLiquidity.forEach(function(exchangeWithLiquidity){
            routesPerExchange[Object.keys(exchangeWithLiquidity)[0]] = [WETH, tokenAddress];
          })
          resolve(routesPerExchange);
        })
      }
    });
  }
}

export default Exchanges;
