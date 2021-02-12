import CloseDialogComponent from '../components/CloseDialogComponent';
import React from 'react';

class NotEnoughFundsDialog extends React.Component {

  render() {
    
    return (
      <div className='Dialog NotEnoughFundsDialog'>
        <div className='DialogHeader'>
          <CloseDialogComponent/>
        </div>
        <div className='DialogBody HeightAuto TextAlignCenter PaddingSmall'>
          <h1 className='FontSizeLarge PaddingMedium PaddingTopSmall'>
            Not enough funds!
          </h1>
        </div>
        <div className='DialogFooter'>
          <div className='PoweredBy'>
            <a target='_blank' rel='noopener noreferrer' href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment'} className='PoweredByLink' title='Powered by DePay: Decentralized Payments'>
              by DePay
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default NotEnoughFundsDialog;
