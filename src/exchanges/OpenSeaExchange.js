import { ethers } from 'ethers';

class OpenSeaExchange {

  static name() {
    return 'OpenSea';
  }

  static pluginAddress() {
    return 'XXX';
  }

  static feeDefaults() {
  }

  static linkRoute(route) {
    return `https://opensea.com`
  }
  
  static findLiquidity(addressA, addressB) {
    return new Promise(function(resolve, reject){
      resolve([ethers.BigNumber.from('1')]);
    });
  }

  static findAmounts(route, endTokenAmount, completeRoute) {
    return new Promise(function(resolve, reject){
      if(completeRoute.nft){
        fetch(`https://api.opensea.io/wyvern/v1/orders?bundled=false&include_bundled=false&include_invalid=false&limit=5&offset=0&order_by=base_price&order_direction=desc&asset_contract_address=`+completeRoute.token.address+`&token_id=`+completeRoute.token.id).then(function(response){
          response.json().then(function(data) {
            if(data.count < 0) {
              resolve(null);
            } else {
              resolve([
                "1", // 1 NFT for
                data.orders[0].base_price // that much WETH
              ]);
            }
          });
        });
      } else {
        resolve(null);
      }
    });
  }

  static findMaxAmount(route) {
    return new Promise(function(resolve, reject){
      resolve(undefined);
    });
  }

  static amountsFromTo(from, fromAmount, to) {
    return new Promise(function(resolve, reject){
      // debugger;
      resolve(undefined);
    }.bind(this))
  }
}

export default OpenSeaExchange;
