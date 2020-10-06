import React from 'react';
import CloseContainerContext from '../contexts/CloseContainerContext';
import NavigateStackContext from '../contexts/NavigateStackContext';

class ChangePaymentTokenDialog extends React.Component {
  
  render() {
    return (
      <CloseContainerContext.Consumer>
        {closeContainer => (
          <NavigateStackContext.Consumer>
            {navigate => (
              <div className='Dialog ChangePaymentDialog'>
                <div className='DialogBody'>
                  ChangePayment Token
                  <a onClick={()=>navigate('ChangeNetworkFee')}>Change Network Fee</a>
                </div>
              </div>
            )}
          </NavigateStackContext.Consumer>
        )}
      </CloseContainerContext.Consumer>
    )
  }
}

export default ChangePaymentTokenDialog;
