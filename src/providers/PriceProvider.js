import React from 'react';
import PriceContext from '../contexts/PriceContext';
import EthUsdPriceAbi from '../abi/EthUsdPriceAbi';

class PriceProvider extends React.Component {
  state = {
    price: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadPrice().then(function(price){
      this.setState({ price });
    }.bind(this));

    this.priceInterval = setInterval(function(){
      this.loadPrice().then(function(price){
        let diff = Math.abs(this.state.price - price) / this.state.price;
        // only update if price is half a percent difference
        if(diff > 0.005) {
          this.setState({ price });
        }
      }.bind(this))
    }.bind(this), 1000 * 30)
  }

  componentWillUnmount() {
    clearInterval(this.priceInterval);
  }

  loadAndSetPrice() {
    this.loadPrice().then(function(price){
      this.setState({ price });
    }.bind(this));
  }

  loadPrice() {
    return new Promise(function(resolve, reject){
      // Chainlink ETH/USDT oracle contract
      new DePay.ethers.Contract(
        '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
        EthUsdPriceAbi,
        DePay.ethers.provider
      ).latestAnswer().then(function(price){
        // USDT has 6 decimals
        resolve(price.toNumber()/100000000);
      })
    })
  }

  render() {
    return(
      <PriceContext.Provider value={this.state.price}>
        {this.props.children}
      </PriceContext.Provider>
    )
  }
}

export default PriceProvider;
