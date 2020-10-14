import CloseDialogComponent from '../components/CloseDialogComponent';
import GasContext from '../contexts/GasContext';
import GoBackDialogComponent from '../components/GoBackDialogComponent';
import LocalCurrency from '../utils/LocalCurrency';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';
import Skeleton from '../utils/Skeleton';
import Slider from 'react-rangeslider';

class ChangeNetworkFeeDialog extends React.Component {

  select(type, gasContext, navigate) {
    gasContext.change(gasContext[type]);
    navigate('back');
  }

  feeToLocal(gas) {
    const feeInETH = parseFloat(DePay.ethers.utils.formatUnits(gas, 'gwei')) * this.props.selected.fee;
    return LocalCurrency(feeInETH * this.props.price);
  }
  
  render() {
    return (
      <NavigateStackContext.Consumer>
        {navigate => (
          <GasContext.Consumer>
            {gasContext => (
              <div className='Dialog ChangeNetworkFeeDialog'>
                <div className='DialogHeader'>
                  <GoBackDialogComponent/>
                  <CloseDialogComponent/>
                  <h1 className='FontSizeMedium TextAlignCenter'>Change network fee</h1>
                  <div className='FontSizeMedium FontWeightBold TextAlignCenter'>
                    { this.props.paymentContext.feeLocal }
                  </div>
                </div>
                <div className='DialogBody HeightAuto'>

                  <div className='PaddingSmall'>

                    <div className='PaddingTopSmall TextAlignCenter'>
                      <div className='FontSizeMedium'>{gasContext.selected} gwei</div>
                    </div>

                    <Slider
                      min={gasContext.slow}
                      max={gasContext.fast}
                      value={gasContext.selected}
                      onChange={gasContext.change}
                    />

                    <div className='Table'>
                      <div className='TableRow'>

                        <div className='TableCell TextAlignCenter'>
                          <div className=' NetworkFeeButton PaddingSmall' onClick={()=>this.select('slow', gasContext, navigate)}>
                            <div className='FontSizeSmall FontWeightBold'>Slow</div>
                            <div className='depay-dialog-change-network-fee-button-price'>{ this.feeToLocal(gasContext.slow) }</div>
                            <div className='FontSizeSmall'>~15 min.</div>
                            <div className='FontSizeSmall TextGrey'>{gasContext.slow} gwei</div>
                          </div>
                        </div>

                        <div className='TableCell TextAlignCenter'>
                          <div className=' NetworkFeeButton PaddingSmall' onClick={()=>this.select('standard', gasContext, navigate)}>
                            <div className='FontSizeSmall FontWeightBold'>Average</div>
                            <div className='depay-dialog-change-network-fee-button-price'>{ this.feeToLocal(gasContext.standard) }</div>
                            <div className='FontSizeSmall'>~2 min.</div>
                            <div className='FontSizeSmall TextGrey'>{gasContext.standard} gwei</div>
                          </div>
                        </div>

                        <div className='TableCell TextAlignCenter'>
                          <div className=' NetworkFeeButton PaddingSmall' onClick={()=>this.select('fast', gasContext, navigate)}>
                            <div className='FontSizeSmall FontWeightBold'>Fast</div>
                            <div className='depay-dialog-change-network-fee-button-price'>{ this.feeToLocal(gasContext.fast) }</div>
                            <div className='FontSizeSmall'>seconds</div>
                            <div className='FontSizeSmall TextGrey'>{gasContext.fast} gwei</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='PaddingSmall PaddingTopNone'>
                    <div className='Card information'>
                      Every transaction on Ethereum requires a network fee (gas).
                      The network fee is paid to 'miners' who help to process and secure what happens on Ethereum.
                      Depending on the current network congestion you either pay more or less network fee.
                    </div>
                  </div>

                </div>
                <div className='DialogFooter'>
                  <button className='CallToAction' onClick={ ()=>navigate('back') }>
                    Done
                  </button>
                  <div className='PoweredBy'>
                    <a target='_blank' rel='noopener noreferrer' href='https://depay.app' className='PoweredByLink' title='Powered by DePay: Decentralized Payments'>
                      by DePay
                    </a>
                  </div>
                </div>
              </div>
            )}
          </GasContext.Consumer>
        )}
      </NavigateStackContext.Consumer>
    )
  }
}

export default ChangeNetworkFeeDialog;
