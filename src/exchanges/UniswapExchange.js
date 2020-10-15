import UniswapV2FactoryContract from '../contracts/UniswapV2FactoryContract';
import UniswapV2PairContract from '../contracts/UniswapV2PairContract';
import UniswapV2Router02Contract from '../contracts/UniswapV2Router02Contract';
import { ethers } from 'ethers';

class UniswapExchange {
  
  static findLiquidity(addressA, addressB) {
    return new Promise(function(resolve, reject){
      UniswapV2FactoryContract.getPair(addressA, addressB).then(function(pairAddress){
        if(pairAddress.address === ethers.constants.AddressZero) {
          resolve(null);
        } else {
          UniswapV2PairContract(pairAddress).getReserves().then(function(reserves){
            resolve([reserves[0], reserves[1]]);
          })
        }
      })
    });
  }

  static findAmounts(route, endTokenAmount) {
    return new Promise(function(resolve, reject){
      UniswapV2FactoryContract.getPair(route[0], route[1]).then(function(pairAddress){
        if(pairAddress.address === ethers.constants.AddressZero) {
          return(resolve(null)); // dont bother if there is no pair
        } else {
          UniswapV2Router02Contract.getAmountsIn(
            endTokenAmount.toString(),
            route
          )
          .then(function(amounts){
            resolve(
              amounts.map(function(amount){ return amount.toString() })
            )
          })
          .catch(()=>resolve(null))
        }
      });
    });
  }
}

export default UniswapExchange;
