import React from 'react';
import AmountContext from '../contexts/AmountContext';

class AmountProvider extends React.Component {
  state = {
    amount: null
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      amount: props.amount
    })
  }

  change(amount) {
    this.setState({
      amount: amount.toLocaleString('fullwide', {useGrouping:false})
    })
  }

  render() {
    return(
      <AmountContext.Provider value={{
        amount: this.state.amount,
        change: this.change.bind(this)
      }}>
        {this.props.children}
      </AmountContext.Provider>
    )
  }
}

export default AmountProvider;
