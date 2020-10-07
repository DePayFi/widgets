import React from 'react';
import RouteContext from '../contexts/RouteContext';

class RouteProvider extends React.Component {
  state = {
    routes: null,
    tokens: null,
    amounts: null,
    required: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadRoutes();
  }

  loadRoutes() {
    fetch(`https://depay.app/api/payment/${this.props.token}/${this.props.address}`).then(function(response){
      response.json().then(function(data) {
        console.log(data);
      })
    })
  }

  render() {
    return(
      <RouteContext.Provider value={{
        
      }}>
        {this.props.children}
      </RouteContext.Provider>
    )
  }
}

export default RouteProvider;
