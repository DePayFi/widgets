import React from 'react';

class CheckMarkComponent extends React.Component {
  
  render() {
    return(
      <svg className={['Icon white', this.props.className].join(' ')} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
        <path d="M20,4.9L9.2,16l-5.4-3.9c-0.7-0.5-1.6-0.3-2.1,0.3c-0.5,0.7-0.3,1.6,0.3,2.1l6.4,4.7c0.3,0.2,0.6,0.3,0.9,0.3
  c0.4,0,0.8-0.2,1.1-0.5l11.7-12c0.6-0.6,0.6-1.6,0-2.2C21.6,4.3,20.6,4.3,20,4.9z"/>
      </svg>
    )
  }
}

export default CheckMarkComponent;
