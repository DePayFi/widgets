import CloseDialogComponent from '../components/CloseDialogComponent';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';
import Skeleton from '../utils/Skeleton';
import TokenIconComponent from '../components/TokenIconComponent';

class PaymentDialog extends React.Component {

  render() {
    if(this.props.initializing) { return this.renderSkeleton() }

    return (
      <NavigateStackContext.Consumer>
        {navigate => (
          <div className='Dialog PaymentDialog'>
            <div className='DialogHeader'>
              <CloseDialogComponent/>
            </div>
            <div className='DialogBody HeightAuto'>
              <div className='Payment'>

                <div className='PaymentRow ChangePaymentRow' onClick={ ()=> navigate('ChangePaymentToken') }>
                  <div className='PaymentCell'>
                    <div className='PaymentCellInner'>
                      <TokenIconComponent
                        title={ this.props.selected.token.name }
                        src={ this.props.selected.token.logoURI }
                      />
                      <div className='PaymentCellInside'>
                        <div className='PaymentCellInnerRow1'>
                          <div className='PaymentAmountInLocalCurrency' title={ `$${ this.props.selected.requiredInETH * this.props.price } USD` }>
                            ${ this.props.selected.requiredInETH * this.props.price } USD
                          </div>
                          <span className='PaymentAction'>
                            Change
                          </span>
                        </div>
                        <div className='PaymentOriginalAmount'>
                          { this.props.selected.required } { this.props.selected.token.symbol }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='PaymentRow ChangeNetworkFeeRow' onClick={ ()=> navigate('ChangeNetworkFee') }>
                  <div className='PaymentCell'>
                    <div className='PaymentCellInner'>
                      <TokenIconComponent
                        title={ 'Ethereum network fee' }
                        src={ 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC' }
                      />
                      <div className='PaymentCellInside'>
                        <div className='PaymentCellInnerRow1'>
                          <div className='PaymentAmountInLocalCurrency'>
                            $15.00 USD
                          </div>
                          <span className='PaymentAction'>
                            Change
                          </span>
                        </div>
                        <div className='PaymentOriginalAmount'>
                          0.4121 ETH
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='DialogFooter'>
              <button className='CallToAction'>
                Pay $10.41 USD
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

  renderSkeleton() {
    return(
      <div className='Dialog PaymentDialog'>
        <div className='DialogHeader'>
          <CloseDialogComponent/>
        </div>
        <div className='DialogBody HeightAuto'>
          <div className='Payment'>

            <div className='PaymentRow ChangePaymentRow' key='loading-row-1'>
              <div className='PaymentCell loading'>
                <div className='PaymentCellInner' style={{ paddingTop: '1.5rem' }}>
                  <Skeleton
                    className='CircularIcon'
                  />
                  <div className='PaymentCellInside'>
                    <div className='PaymentCellInnerRow1'>
                      <Skeleton
                        className='PaymentAmountInLocalCurrency'
                        style={{
                          display: 'inline-block',
                          height: '1.6rem',
                          top: '0.1rem',
                          width: '8rem'
                        }}
                      />
                      <Skeleton
                        style={{
                          display: 'inline-block',
                          height: '1.1rem',
                          top: '0.3rem',
                          width: '4rem',
                          position: 'absolute',
                          right: 0
                        }}
                      />
                    </div>
                    <Skeleton
                      className='PaymentOriginalAmount'
                      style={{
                        display: 'inline-block',
                        top: '0.53rem',
                        right: '0',
                        width: '5rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='PaymentRow ChangeNetworkFeeRow' key='loading-row-2'>
              <div className='PaymentCell loading'>
                <div className='PaymentCellInner'>
                  <Skeleton
                    className='CircularIcon'
                  />
                  <div className='PaymentCellInside'>
                    <div className='PaymentCellInnerRow1'>
                      <Skeleton
                        className='PaymentAmountInLocalCurrency'
                        style={{
                          display: 'inline-block',
                          height: '1.6rem',
                          top: '0.1rem',
                          width: '8rem'
                        }}
                      />
                      <Skeleton
                        style={{
                          display: 'inline-block',
                          height: '1.1rem',
                          top: '0.3rem',
                          width: '4rem',
                          position: 'absolute',
                          right: 0
                        }}
                      />
                    </div>
                    <Skeleton
                      className='PaymentOriginalAmount'
                      style={{
                        display: 'inline-block',
                        top: '0.53rem',
                        right: '0',
                        width: '5rem'
                      }}
                    />
                  </div>
                </div>
              </div>s
            </div>
          </div>
        </div>
        <div className='DialogFooter'>
          <Skeleton
            style={{
              height: '2.8rem',
              width: '50%',
              margin: '0 auto -0.5rem'
            }}
          />
          <div className='PoweredBy'>
            <a target='_blank' rel='noopener noreferrer' href='https://depay.app' className='PoweredByLink' title='Powered by DePay: Decentralized Payments'>
              by DePay
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default PaymentDialog;
