import React from 'react';
import GasContext from '../contexts/GasContext';

class GasProvider extends React.Component {
  state = {
    initializing: true,
    slow: null,
    standard: null,
    fast: null,
    instant: null,
    selected: null
  };

  changeSelected(gas) {
    this.setState({
      selected: gas
    })
  }

  componentDidMount() {
    this.loadGas().then(function(gas){
      this.setGas(gas);
      this.setState({ initializing: false });
    }.bind(this));

    this.interval = setInterval(function(){
      this.loadGas().then(function(gas){
        if(this.equalState(gas)) { return }
        this.setGas(gas);
      }.bind(this))
    }.bind(this), 1000 * 30)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  loadGas() {
    return new Promise(function(resolve, reject){
      fetch('https://api.anyblock.tools/latest-minimum-gasprice').then(function(response){
        response.json().then(resolve);
      });
    });
  }

  equalState(gas) {
    return(
      this.state.slow === gas.slow &&
      this.state.standard === gas.standard &&
      this.state.fast === gas.fast &&
      this.state.instant === gas.instant
    )
  }

  setGas(gas){
    this.setState({
      slow: gas.slow,
      standard: gas.standard,
      fast: gas.fast,
      instant: gas.instant
    });
  }

  render() {
    return(
      <GasContext.Provider value={{
        initializing: this.state.initializing,
        slow: this.state.slow,
        standard: this.state.standard,
        fast: this.state.fast,
        instant: this.state.instant,
        selected: this.state.selected,
        change: this.changeSelected.bind(this)
      }}>
        {this.props.children}
      </GasContext.Provider>
    )
  }
}

export default GasProvider;
