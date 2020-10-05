import CloseContainerContext from '../contexts/CloseContainerContext';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';

class PaymentDialog extends React.Component {
  
  render() {
    return (
      <CloseContainerContext.Consumer>
        {closeContainer => (
          <NavigateStackContext.Consumer>
            {navigate => (
              <div className='Dialog PaymentDialog'>
                <div className='DialogBody'>
                  Payment
                  <a onClick={navigate('ChangePaymentToken')}>Change Payment Token</a>
                </div>
              </div>
            )}
          </NavigateStackContext.Consumer>
        )}
      </CloseContainerContext.Consumer>
    )
  }
}

export default PaymentDialog;
