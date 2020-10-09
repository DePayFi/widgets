import React from 'react';

class TokenIconComponent extends React.Component {
  state = {}
  
  handleLoadError() {
    this.setState({
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAGFBMVEVHcEz///////////////////////////8dS1W+AAAAB3RSTlMAHklzmMLqCsLrGwAAAQ9JREFUeNrtlrsOgkAQRRdFbDcae4IFrZEYazXRVitqQ2Hrk/19BVdX7XYuiQX3VDZzMsxrVYQQQkibGIyzLNHi8OHaVJRLWXgwMy8KLYnfGEchEFTxjp2/wHxRalBg9v4CNAXzwxYVXCSC2ypJstx+g6/ATaAdqImvoHxHzEVFcPGqWwtOnoLFx++6DGdgq9NnG+T0K8EVEPTqnrZbEKGCFO1CDs2BG2UZbpnABEwMJIA1IRSeZfdCgV8wsjdVnEBuLyKyBu51Fb+xpfhPRgdsgYqeM6DlQwQmoA62AvISgIsc2j0EaxgDL0ojx/CCCs4KPGYnVHCk4CEg7SbIKqbqfyeRAgoaERBCCCGESLgDeRfMNogh3QMAAAAASUVORK5CYII=',
      className: 'notfound'
    })
  }
  
  render() {
    return(
      <img
        title={ this.props.title }
        className={`CircularIcon ${this.state.className}`}
        src={ this.state.src || this.props.src }
        onError={ this.handleLoadError.bind(this) }
      />
    )
  }
}

export default TokenIconComponent;
