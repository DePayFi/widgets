import CloseDialogComponent from '../components/CloseDialogComponent';
import Fuse from 'fuse.js';
import GoBackDialogComponent from '../components/GoBackDialogComponent';
import ImportToken from '../utils/ImportToken';
import PropTypes from 'prop-types';
import React from 'react';
import TokenList from '../utils/TokenList';

class TokenSelectorDialog extends React.Component {
  
  constructor(props) {
    super(props);
    this.tokens = props.tokenList || TokenList();
    this.state = {
      tokens: this.tokens,
      search: ''
    };
    this.fuse = new Fuse(this.tokens, {
      keys: ['name', 'symbol'],
      isCaseSensitive: false,
      shouldSort: true,
      threshold: 0.4
    });
  }

  selectToken(token) {
    if(this.props.closeContainer) { this.props.closeContainer() };
    this.props.callback(token);
  }

  changeSearch(event) {
    var value = event.target.value;
    this.setState({search: value});
    if(DePay.ethers.utils.isAddress(value)) {
      var address = DePay.ethers.utils.getAddress(value);
      this.setState({search: address});
      ImportToken(address).then(function(token){
        this.setState({tokens: [token]});
      }.bind(this));
    } else if(value.length == 0) {
      this.setState({tokens: this.tokens});
    } else {
      var results = this.fuse.search(value);
      this.setState({tokens: results.map(function(result){ return result.item })});
    }
  }

  showImportTokenTip() {
    this.setState({ showImportTokenTip: true });
    this.input.focus();
    this.input.setAttribute('data-placeholder', this.input.getAttribute('placeholder'));
    this.input.setAttribute('placeholder', 'Paste token address here');
  }

  hideImportTokenTip() {
    this.setState({showImportTokenTip: false})
    this.input.setAttribute('placeholder', this.input.getAttribute('data-placeholder'));
  }

  renderDialogHeader() {
    if(this.props.dialogContext) {
      return(
        <div>
          <GoBackDialogComponent/>
          <CloseDialogComponent/>
          <label htmlFor='SearchToken'>
            <h1 className='FontSizeMedium TextAlignCenter'>Select a token</h1>
          </label>
        </div>
      )
    } else {
      return(
        <div>
          <button onClick={this.props.closeContainer} className='DialogCloseButton CircularButton' title='Close dialog'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
          <label htmlFor='SearchToken'><h1 className='FontSizeMedium'>Select a token</h1></label>
        </div>
      )
    }
  }

  render() {
    return (
      <div className='Dialog SelectTokenDialog'>
        <div className='DialogHeader'>
          { this.renderDialogHeader() }
          <input ref={(input) => { this.input = input; }}  value={this.state.search} id='SearchToken' autoFocus='autofocus' onChange={this.changeSearch.bind(this)} className='Search' type='text' placeholder='Search name or paste address'/>
          {this.state.showImportTokenTip &&
            <div className='TipContainer'>
              <div className='Tip'>
                Copy & paste any token address into this field.
                <button onClick={this.hideImportTokenTip.bind(this)} className='TipCloseButton CircularButton' title='Hide'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
              </div>
            </div>
          }
        </div>
        <div className='DialogBody'>
          <ul className='TokenList'>
            {this.state.tokens.map((token) => {
              return (
                <li key={token.symbol} className='TokenListItem' onClick={()=> this.selectToken(token)}>
                  <div className='TokenListCell'>
                    <img className='TokenListImage' src={token.logoURI}/>
                    <span className='TokenListSymbol'>{token.symbol}</span>
                    <span className='TokenListName'>{token.name}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <div className='DialogFooter'>
          <button type='button' onClick={this.showImportTokenTip.bind(this)} className='TextButton'>Token missing? Add it.</button>
        </div>        
      </div>
    )
  }
}

export default TokenSelectorDialog;
