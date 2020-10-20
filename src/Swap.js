import _ from 'lodash';
import CallbackContext from './contexts/CallbackContext';
import DialogProvider from './providers/DialogProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from './utils/ShadowContainer';
import SwapStack from './stacks/SaleStack';
import WalletContext from './contexts/WalletContext';
import WalletProvider from './providers/WalletProvider';
import { ETH } from './utils/Constants';

function checkArguments(args){
  if(args.length == 0 || args.length > 1) {
    throw 'Unknown amount of arguments.'
  }
}

function checkAndPrepOptions(input) {
  var options = Object.assign({}, input); // shallow copy
  return options;
}

export default function Swap() {
  checkArguments(arguments);
  var options = checkAndPrepOptions(arguments[0]);
  const [shadowContainer, closeContainer, setClosable] = ShadowContainer();

  let unmountAndClose = function(){
    let closed = closeContainer();
    if(closed) { ReactDOM.unmountComponentAtNode(shadowContainer); }
  }

  return new Promise(() => {
    ReactDOM.render(
      <CallbackContext.Provider value={{
        callback: options.callback
      }}>
        <DialogProvider
          closeContainer={ unmountAndClose }
          setClosable={ setClosable }
        >
          <WalletProvider>
            <WalletContext.Consumer>
              {walletContext => (
                <SwapStack
                  amount={options.amount}
                  token={options.token}
                  receiver={walletContext.wallet.address()}
                />
              )}
            </WalletContext.Consumer>
          </WalletProvider>
        </DialogProvider>
      </CallbackContext.Provider>
      , shadowContainer
    );
  });
}
