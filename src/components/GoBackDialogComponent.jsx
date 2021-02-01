import React from 'react';
import NavigateStackContext from '../contexts/NavigateStackContext';

class GoBackDialogComponent extends React.Component {
  
  render() {
    return(
      <NavigateStackContext.Consumer>
        {navigate => (
          <button onClick={()=> navigate('back')} className='DialogGoBackButton CircularButton' title='Go back'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="15.2" y1="6" x2="8.8" y2="12.4"/><line x1="9.2" y1="12" x2="15.2" y2="18"/></svg></button>
        )}
      </NavigateStackContext.Consumer>
    )
  }
}

export default GoBackDialogComponent;
