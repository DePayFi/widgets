import CloseDialogComponent from '../components/CloseDialogComponent';
import NavigateStackContext from '../contexts/NavigateStackContext';
import PaymentDialogSkeleton from '../dialogs/PaymentDialogSkeleton';
import React from 'react';
import TokenIconComponent from '../components/TokenIconComponent';

class PaymentDialog extends React.Component {

  render() {
    if(this.props.initializing) { 
      return(
        <PaymentDialogSkeleton/>
      ) 
    }

    return (
      <NavigateStackContext.Consumer>
        {navigate => (
          <div className='Dialog PaymentDialog'>
            <div className='DialogHeader'>
              <CloseDialogComponent/>
            </div>
            <div className='DialogBody HeightAuto'>
              <div className='Payment' key={ this.props.selected.token.address }>
                <div className='PaymentRow ChangePaymentRow' onClick={ ()=> navigate('ChangePaymentToken') }>
                  <div className='PaymentColumn PaymentColumn1'>
                    <TokenIconComponent
                      title={ this.props.selected.token.name }
                      src={ this.props.selected.token.logoURI }
                    />
                  </div>
                  <div className='PaymentColumn PaymentColumn2'>
                    <div className='PaymentDescription'>
                      Payment
                    </div>
                    <div className='PaymentAmountRow1 TextEllipsis'>
                      { this.props.paymentContext.local }
                    </div>
                    <div className='PaymentAmountRow2 TextEllipsis'>
                      { this.props.paymentContext.token }
                    </div>
                  </div>
                  <div className='PaymentColumn PaymentColumn3'>
                    <span className='PaymentAction' title='Change payment'>
                      Change
                    </span>
                  </div>
                </div>

                <div className='PaymentRow ChangeNetworkFeeRow' onClick={ ()=> navigate('ChangeNetworkFee') }>
                  <div className='PaymentColumn PaymentColumn1'>
                    <TokenIconComponent
                      title={ 'Ethereum network fee' }
                      src={ 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC' }
                    />
                  </div>
                  <div className='PaymentColumn PaymentColumn2'>
                    <div className='PaymentDescription'>
                      Network fee
                    </div>
                    <div className='PaymentAmountRow1 TextEllipsis'>
                      { this.props.paymentContext.feeLocal }
                    </div>
                    <div className='PaymentAmountRow2 TextEllipsis'>
                      { this.props.paymentContext.feeToken }
                    </div>
                  </div>
                  <div className='PaymentColumn PaymentColumn3'>
                    <span className='PaymentAction' title='Change network fee'>
                      Change
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='DialogFooter'>
              <button className='CallToAction'>
                Pay { this.props.paymentContext.total }
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

export default PaymentDialog;
