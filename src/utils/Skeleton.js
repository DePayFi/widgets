import React from 'react';

class Skeleton extends React.Component {
  
  render() {
    return(
      <div className={`${this.props.className} Skeleton`} style={this.props.style}>
        <div className='SkeletonBackground'>
        </div>
      </div>
    )
  }
}

export default Skeleton;
