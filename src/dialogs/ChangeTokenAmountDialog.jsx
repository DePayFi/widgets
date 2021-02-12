import _ from 'lodash';
import CloseDialogComponent from '../components/CloseDialogComponent';
import DisplayTokenAmount from '../utils/DisplayTokenAmount';
import GoBackDialogComponent from '../components/GoBackDialogComponent';
import LocalCurrency from '../utils/LocalCurrency';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';
import Slider from 'react-rangeslider';
import TokenIconComponent from '../components/TokenIconComponent';
import { SLIPPAGE } from '../utils/Constants';
import { ethers } from 'ethers';

class ChangeTokenAmountDialog extends React.Component {
  state = {
    amount: null
  }

  constructor(props) {
    super(props);

    let maxAmountRoute = _.sortBy(props.routes, function(route){ return parseInt(route.maxAmount,10) })[props.routes.length-1];

    this.state = {
      amount: parseInt(props.amount),
      maxAmount: (parseInt(maxAmountRoute.maxAmount)/SLIPPAGE),
      maxAmountRoute: maxAmountRoute,
    };
  }

  componentWillUnmount() {
    if(this.props.amount !== this.state.amount) {
      this.props.change(this.state.amount);
    }
  }

  changeAmount(val) {
    this.setState({
      amount: val
    })
  }

  changeInputAmount(event){
    let amount = parseInt(event.target.value, 10);
    if(!isNaN(amount)) {
      this.setState({
        amount: parseInt(ethers.utils.parseUnits(amount.toString(), this.props.token.decimals))
      }) 
    }
  }

  render() {
    const tokenMin = parseInt(ethers.utils.formatUnits((10**this.props.token.decimals).toLocaleString('fullwide', {useGrouping:false}), this.props.token.decimals).toString());
    const min = (this.props.amountOptions ? this.props.amountOptions.min : tokenMin) || tokenMin;
    const step = (this.props.amountOptions ? this.props.amountOptions.step : min) || min;
    const max = parseInt(ethers.utils.formatUnits(this.state.maxAmount.toLocaleString('fullwide', {useGrouping:false}), this.props.token.decimals).toString());
    return (
      <NavigateStackContext.Consumer>
        {navigate => (
          <div className='Dialog ChangeTokenAmountDialog'>
            <div className='DialogHeader'>
              <GoBackDialogComponent/>
              <CloseDialogComponent/>
              <h1 className='FontSizeNormal TextAlignCenter'>
                Change amount
              </h1>
              <div className='FontSizeLarge TextAlignCenter'>
                { this.props.token.symbol }
              </div>
            </div>
            <div className='DialogBody HeightAuto'>

              <div className='PaddingSmall'>

                <div className='PaddingTopSmall TextAlignCenter'>
                  <div className='FontSizeLarge'>
                    <input max={max} min={min} step={step} className='Input FontSizeMedium TextAlignCenter' type="number" name="amount" value={ parseFloat(DisplayTokenAmount(this.state.amount.toLocaleString('fullwide', {useGrouping:false}), this.props.token.decimals, '')) } onChange={this.changeInputAmount.bind(this)}/>
                  </div>
                </div>

                <div className='PaddingBottomSmall'>
                  <Slider
                    min={10**this.props.token.decimals*min}
                    max={this.state.maxAmount}
                    step={10**this.props.token.decimals*step}
                    value={this.state.amount}
                    onChange={this.changeAmount.bind(this)}
                  />
                </div>

                <div className='TextAlignCenter TextGrey PaddingBottomSmall'>
                  Max. purchase for<br/>
                  {DisplayTokenAmount(parseInt(this.state.maxAmountRoute.balance / SLIPPAGE).toLocaleString('fullwide', {useGrouping:false}), this.state.maxAmountRoute.token.decimals, this.state.maxAmountRoute.token.symbol)}
                  <TokenIconComponent
                    className='small'
                    title={ this.state.maxAmountRoute.token.name }
                    src={ this.state.maxAmountRoute.token.logoURI }
                  />
                  { this.state.maxAmountRoute.symbol }
                </div>

              </div>
            </div>
            <div className='DialogFooter'>
              <button className='CallToAction MainAction' onClick={ ()=>navigate('back') }>
                Done
              </button>
              <div className='PoweredBy'>
                <a target='_blank' rel='noopener noreferrer' href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment'} className='PoweredByLink' title='Powered by DePay: Decentralized Payments'>
                  by DePay
                </a>
              </div>
            </div>
          </div>
        )}
      </NavigateStackContext.Consumer>
    )
  }
}

export default ChangeTokenAmountDialog;
