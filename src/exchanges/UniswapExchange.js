import UniswapV2FactoryContract from '../contracts/UniswapV2FactoryContract';
import UniswapV2PairContract from '../contracts/UniswapV2PairContract';
import UniswapV2Router02Contract from '../contracts/UniswapV2Router02Contract';
import { ethers } from 'ethers';

class UniswapExchange {
  logo = 'data:image/png;base64,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'
  
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
