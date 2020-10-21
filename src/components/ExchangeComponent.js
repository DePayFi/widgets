import React from 'react';

class ExchangeComponent extends React.Component {
  
  render() {
    return(
      <svg className={['Icon grey', this.props.className].join(' ')} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
        <line x1="5.37" y1="2.07" x2="5.37" y2="11.47" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33"/>
        <polyline points="9.97 6.77 5.37 11.47 0.67 6.77" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33"/>
        <line x1="16.17" y1="10.07" x2="16.17" y2="0.67" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33"/>
        <polyline points="11.57 5.37 16.17 0.67 20.87 5.37" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.33"/>
      </svg>
    )
  }
}

export default ExchangeComponent;
