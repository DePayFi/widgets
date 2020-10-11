import CloseDialogComponent from '../components/CloseDialogComponent';
import GoBackDialogComponent from '../components/GoBackDialogComponent';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';
import Skeleton from '../utils/Skeleton';
import Slider from 'react-rangeslider';

class ChangeNetworkFeeDialog extends React.Component {
  
  render() {
    return (
      <NavigateStackContext.Consumer>
        {navigate => (
          <div className='Dialog ChangeNetworkFeeDialog'>
            <div className='DialogHeader'>
              <GoBackDialogComponent/>
              <CloseDialogComponent/>
              <h1 className='FontSizeMedium TextAlignCenter'>Change network fee</h1>
              <div className='FontSizeMedium FontWeightBold TextAlignCenter'>
                $300 USD
              </div>
            </div>
            <div className='DialogBody HeightAuto'>

              <div className='PaddingSmall'>

                <div className='PaddingTopSmall TextAlignCenter'>
                  <div className='FontSizeMedium'>40 seconds</div>
                  <div className='TextGrey'>200 gwei</div>
                </div>

                <Slider
                  min={20}
                  max={150}
                  value={this.props.gasPrice}
                  onChange={this.props.changeGasPrice}
                />

                <div className='Table'>
                  <div className='TableRow'>

                    <div className='TableCell TextAlignCenter'>
                      <div className=' NetworkFeeButton PaddingSmall'>
                        <div className='FontSizeSmall FontWeightBold'>Slow</div>
                        <div className='depay-dialog-change-network-fee-button-price'>$1.00 USD</div>
                        <div className='FontSizeSmall'>45 sec</div>
                        <div className='FontSizeSmall TextGrey'>150 gwei</div>
                      </div>
                    </div>

                    <div className='TableCell TextAlignCenter'>
                      <div className=' NetworkFeeButton PaddingSmall'>
                        <div className='FontSizeSmall FontWeightBold'>Average</div>
                        <div className='depay-dialog-change-network-fee-button-price'>$1.00 USD</div>
                        <div className='FontSizeSmall'>45 sec</div>
                        <div className='FontSizeSmall TextGrey'>150 gwei</div>
                      </div>
                    </div>

                    <div className='TableCell TextAlignCenter'>
                      <div className=' NetworkFeeButton PaddingSmall'>
                        <div className='FontSizeSmall FontWeightBold'>Fast</div>
                        <div className='depay-dialog-change-network-fee-button-price'>$1.00 USD</div>
                        <div className='FontSizeSmall'>45 sec</div>
                        <div className='FontSizeSmall TextGrey'>150 gwei</div>
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
      </NavigateStackContext.Consumer>
    )
  }
}

export default ChangeNetworkFeeDialog;
