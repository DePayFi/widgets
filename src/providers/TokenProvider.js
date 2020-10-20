import ImportToken from '../utils/ImportToken';
import React from 'react';
import TokenContext from '../contexts/TokenContext';

class TokenProvider extends React.Component {
  state = {
    initializing: true,
    token: null
  }

  componentDidMount() {
    ImportToken(this.props.token).then(function(token){
      this.setState({
        token: token,
        initializing: false
      });
    }.bind(this));    
  }

  render() {
    return(
      <TokenContext.Provider value={{
        initializing: this.state.initializing,
        token: this.state.token
      }}>
        { this.props.children }
      </TokenContext.Provider>
    )
  }
}

export default TokenProvider;
