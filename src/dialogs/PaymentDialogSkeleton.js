import CloseDialogComponent from '../components/CloseDialogComponent';
import React from 'react';
import Skeleton from '../utils/Skeleton';

class PaymentDialogSkeleton extends React.Component {

  render() {
    return(
      <div className='Dialog PaymentDialog'>
        <div className='DialogHeader'>
          <CloseDialogComponent/>
        </div>
        <div className='DialogBody HeightAuto'>
          <div className='Payment'>

            <div className='PaymentRow loading ChangePaymentRow' key='loading-row-1'>
              <div className='PaymentColumn PaymentColumn1'>
                <Skeleton
                  className='CircularIcon'
                  style={{
                    top: '-0.3rem'
                  }}
                />
              </div>
              <div className='PaymentColumn PaymentColumn2'>
                <div className='PaymentDescription'>
                  <Skeleton
                    style={{
                      display: 'inline-block',
                      height: '1.1rem',
                      width: '4rem',
                    }}
                  />
                </div>
                <div className='PaymentAmountRow1'>
                  <Skeleton
                    style={{
                      display: 'inline-block',
                      height: '1.6rem',
                      width: '8rem'
                    }}
                  />
                </div>
                <div className='PaymentAmountRow2'>
                  <Skeleton
                    style={{
                      display: 'inline-block',
                      height: '1.1rem',
                      width: '4rem',
                    }}
                  />
                </div>
              </div>
              <div className='PaymentColumn PaymentColumn3'>
                <Skeleton
                  style={{
                    display: 'inline-block',
                    right: '0.7rem',
                    width: '5rem'
                  }}
                />
              </div>
            </div>

            <div className='PaymentRow loading ChangeNetworkFeeRow' key='loading-row-2'>
              <div className='PaymentColumn PaymentColumn1'>
                <Skeleton
                  className='CircularIcon'
                  style={{
                    top: '-0.3rem'
                  }}
                />
              </div>
              <div className='PaymentColumn PaymentColumn2'>
                <div className='PaymentDescription'>
                  <Skeleton
                    style={{
                      display: 'inline-block',
                      height: '1.1rem',
                      width: '4rem',
                    }}
                  />
                </div>
                <div className='PaymentAmountRow1'>
                  <Skeleton
                    style={{
                      display: 'inline-block',
                      height: '1.6rem',
                      width: '8rem'
                    }}
                  />
                </div>
                <div className='PaymentAmountRow2'>
                  <Skeleton
                    style={{
                      display: 'inline-block',
                      height: '1.1rem',
                      width: '4rem',
                    }}
                  />
                </div>
              </div>
              <div className='PaymentColumn PaymentColumn3'>
                <Skeleton
                  style={{
                    display: 'inline-block',
                    right: '0.7rem',
                    width: '5rem'
                  }}
                />
              </div>
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

export default PaymentDialogSkeleton;
