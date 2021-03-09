import React from 'react';
import GasContext from '../contexts/GasContext';

class GasProvider extends React.Component {
  state = {
    initializing: false,
    slow: null,
    standard: null,
    fast: null,
    selected: null
  };

  changeSelected(gas) {
    this.setState({
      selected: gas
    })
  }

  componentDidMount() {
    // this.loadGas().then(function(gas){
    //   this.setState({ 
    //     initializing: false,
    //     selected: parseInt((gas.standard + gas.fast) / 2, 10),
    //     slow: gas.slow,
    //     standard: gas.standard,
    //     fast: gas.fast,
    //   });
    // }.bind(this));

    // this.interval = setInterval(function(){
    //   this.loadGas().then(function(gas){
    //     if(this.equalState(gas)) { return }
    //     this.setState({
    //       slow: gas.slow,
    //       standard: gas.standard,
    //       fast: gas.fast,
    //     });
    //   }.bind(this))
    // }.bind(this), 1000 * 30)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadGas() {
    return new Promise(function(resolve, reject){
      fetch('https://ethgasstation.info/api/ethgasAPI.json').then(function(response){
        response.json().then((data)=>(resolve(this.gasToStandardFormat(data))));
      }.bind(this));
    }.bind(this));
  }

  equalState(gas) {
    return(
      this.state.slow === gas.slow &&
      this.state.standard === gas.standard &&
      this.state.fast === gas.fast
    )
  }

  // convert ethgasstation.info format
  gasToStandardFormat(gas) {
    return({
      slow: parseInt(gas.safeLow/10, 10),
      standard: parseInt(gas.average/10, 10),
      fast: parseInt(gas.fast/10, 10)
    })
  }

  render() {
    return(
      <GasContext.Provider value={{
        initializing: this.state.initializing,
        slow: this.state.slow,
        standard: this.state.standard,
        fast: this.state.fast,
        selected: this.state.selected,
        change: this.changeSelected.bind(this)
      }}>
        {this.props.children}
      </GasContext.Provider>
    )
  }
}

export default GasProvider;
