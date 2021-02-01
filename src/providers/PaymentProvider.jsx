import DisplayTokenAmount from '../utils/DisplayTokenAmount';
import LocalCurrency from '../utils/LocalCurrency';
import PaymentContext from '../contexts/PaymentContext';
import React from 'react';
import { ethers } from 'ethers';

class PaymentProvider extends React.Component {
  state = {}

  paymentInETH() {
    if(this.props.selected.amounts.length <= 2) {
      if(this.props.selected.token.symbol === 'ETH') {
        return ethers.utils.formatEther(this.props.selected.amounts[0]);
      } else {
        return ethers.utils.formatEther(this.props.selected.amounts[1]);
      }
    } else {
      return ethers.utils.formatEther(this.props.selected.amounts[1]);
    }
  }

  local() {
    return LocalCurrency(this.paymentInETH() * this.props.price);
  }

  token() {
    return DisplayTokenAmount(this.props.selected.amounts[0], this.props.selected.token.decimals, this.props.selected.token.symbol);
  }

  feeInETH() {
    return parseFloat(ethers.utils.formatUnits(this.props.gas, 'gwei')) * this.props.selected.fee;
  }

  feeLocal() {
    return LocalCurrency(this.feeInETH() * this.props.price);
  }

  feeToken() {
    return DisplayTokenAmount(this.feeInETH(), 0, 'ETH')
  }

  total() {
    return LocalCurrency((this.feeInETH() + parseFloat(this.paymentInETH())) * this.props.price);
  }

  render() {
    if(this.props.selected === null) { return(<div>{this.props.children}</div>) }
    return(
      <PaymentContext.Provider value={{
        local: this.local(),
        token: this.token(),
        feeInETH: this.feeInETH(),
        feeLocal: this.feeLocal(),
        feeToken: this.feeToken(),
        total: this.total()
      }}>
        {this.props.children}
      </PaymentContext.Provider>
    )
  }
}

export default PaymentProvider;
