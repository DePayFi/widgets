import React from 'react';
import CloseContainerContext from '../contexts/CloseContainerContext';

class ChangePaymentTokenDialog extends React.Component {
  
  render() {
    return (
      <CloseContainerContext.Consumer>
        {closeContainer => (
          <div className='Dialog ChangePaymentDialog'>
            <div className='DialogBody'>
              ChangePayment
            </div>
          </div>
        )}
      </CloseContainerContext.Consumer>
    )
  }
}

export default ChangePaymentTokenDialog;
