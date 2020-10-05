import React from 'react';
import CloseContainerContext from '../contexts/CloseContainerContext';

class ChangeNetworkFeeDialog extends React.Component {
  
  render() {
    return (
      <CloseContainerContext.Consumer>
        {closeContainer => (
          <div className='Dialog ChangeNetworkFeeDialog'>
            <div className='DialogBody'>
              ChangeNetworkFee
            </div>
          </div>
        )}
      </CloseContainerContext.Consumer>
    )
  }
}

export default ChangeNetworkFeeDialog;
