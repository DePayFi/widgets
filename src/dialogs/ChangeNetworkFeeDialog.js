import React from 'react';
import CloseContainerContext from '../contexts/CloseContainerContext';
import NavigateStackContext from '../contexts/NavigateStackContext';

class ChangeNetworkFeeDialog extends React.Component {
  
  render() {
    return (
      <CloseContainerContext.Consumer>
        {closeContainer => (
          <NavigateStackContext.Consumer>
            {navigate => (
              <div className='Dialog ChangePaymentDialog'>
                <div className='DialogBody'>
                  Change Network fee
                  <a onClick={()=>navigate('ChangePaymentToken')}>Change Payment again</a>
                </div>
              </div>
            )}
          </NavigateStackContext.Consumer>
        )}
      </CloseContainerContext.Consumer>
    )
  }
}

export default ChangeNetworkFeeDialog;
