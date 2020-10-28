import React from 'react';
import RouteContext from '../contexts/RouteContext';
import Exchanges from '../utils/Exchanges';

class RouteProvider extends React.Component {
  state = {
    loading: false,
    fromAmount: null,
    toAmount: null,
    route: null
  }

  componentDidUpdate(prevProps) {
    if(this.props.to && this.props.from) {
      if(this.props.fromAmount && (this.state.fromAmount !== this.props.fromAmount)) {
        this.setState({
          loading: true,
          fromAmount: this.props.fromAmount,
          toAmount: null
        }, this.findRouteFromTo)
      } else if (this.props.toAmount && this.state.toAmount !== this.props.toAmount) {
        this.setState({
          loading: true,
          toAmount: this.props.toAmount,
          fromAmount: null
        }, this.findRouteToFrom)
      }
    }
  }

  findRouteFromTo() {
    console.log('findRouteFromTo');
    Exchanges.findBestRouteFromTo(
      this.props.from,
      this.state.fromAmount,
      this.props.to
    ).then(function(route){
      this.setState({
        route: route,
        loading: false,
        toAmount: _.last(route.amounts).toString()
      })
    }.bind(this))
  }

  findRouteToFrom() {
    console.log('findRouteToFrom');
  }

  render() {
    return(
      <RouteContext.Provider value={{
        loading: this.state.loading,
        route: this.state.route,
        fromAmount: this.state.fromAmount,
        toAmount: this.state.toAmount
      }}>
        {this.props.children}
      </RouteContext.Provider>
    )
  }
}

export default RouteProvider;
