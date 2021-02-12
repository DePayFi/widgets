import ImportToken from '../utils/ImportToken';
import React from 'react';
import TokenContext from '../contexts/TokenContext';

class TokenProvider extends React.Component {
  state = {
    initializing: true,
    token: null
  }

  constructor(props) {
    super(props);
    var address = typeof(this.props.token) === 'object' ? this.props.token.address : this.props.token;
    Object.assign(this.state, {
      token: { address: address },
    })
  }

  componentDidMount() {
    ImportToken(this.state.token.address).then(function(token){
      if(typeof(this.props.token) === 'object') {
        Object.assign(token, {logoURI: this.props.token.image})
      }
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
