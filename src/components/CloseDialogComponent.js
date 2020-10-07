import React from 'react';
import CloseContainerContext from '../contexts/CloseContainerContext';

class CloseDialogComponent extends React.Component {
  
  render() {
    return(
      <CloseContainerContext.Consumer>
        {closeContainer => (
          <button onClick={closeContainer} className='DialogCloseButton CircularButton' title='Close dialog'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        )}
      </CloseContainerContext.Consumer>
    )
  }
}

export default CloseDialogComponent;
