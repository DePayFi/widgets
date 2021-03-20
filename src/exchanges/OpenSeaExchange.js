class OpenSeaExchange {

  static id() {
    return 0;
  }

  static name() {
    return 'OpenSea';
  }

  static pluginAddress() {
    return 'XXX';
  }

  static feeDefaults() {
  }

  static linkRoute(route) {
    let path = (route.route || route.path).map(function(step){
      if(step === ETH) { return '83C756Cc2' }
      return step;
    });
    return `https://opensea.com`
  }
  
  static findLiquidity(addressA, addressB) {
    return new Promise(function(resolve, reject){
      debugger;
    });
  }

  static findAmounts(route, endTokenAmount) {
    return new Promise(function(resolve, reject){
      debugger;
    });
  }

  static findMaxAmount(route) {
    return new Promise(function(resolve, reject){
      debugger;
    });
  }

  static amountsFromTo(from, fromAmount, to) {
    return new Promise(function(resolve, reject){
      debugger;
    }.bind(this))
  }
}

export default OpenSeaExchange;
