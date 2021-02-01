import _ from 'lodash';
import CallbackContext from './contexts/CallbackContext';
import DialogProvider from './providers/DialogProvider';
import PaymentStack from './stacks/PaymentStack';
import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from './utils/ShadowContainer';
import WalletProvider from './providers/WalletProvider';
import { ETH } from './utils/Constants';
import { ethers } from 'ethers';

function checkArguments(args){
  if(args.length == 0 || args.length > 1) {
    throw 'Unknown amount of arguments.'
  }
}

function toElement(arg) {
  if(typeof arg === 'string') {
    return document.querySelector(arg);
  } else if (_.isElement(arg)) {
    return arg;
  } else {
    throw 'Unknown element or element query.'
  }
}

function checkAndPrepOptions(input) {
  var options = Object.assign({}, input); // shallow copy

  // amount
  if(_.isEmpty(options.amount)) { throw '"amount" needs to be set.' }
  if(typeof options.amount != 'string') { throw '"amount" needs to be passed as a string.' }

  // token
  if(_.isEmpty(options.token))  { throw '"token" needs to be set.' }
  options.token = (options.token === ETH) ? ETH : ethers.utils.getAddress(ethers.utils.getAddress(options.token));

  // receiver
  if(_.isEmpty(options.receiver))     { throw '"receiver" needs to be set.' }
  options.receiver = ethers.utils.getAddress(ethers.utils.getAddress(options.receiver));

  // element
  if(!_.isEmpty(options.element)) {
    options.element = toElement(options.element);
  }

  // route
  if(!_.isEmpty(options.route)) {
    options.route = ethers.utils.getAddress(ethers.utils.getAddress(options.route));
  }

  // callback
  if(options.callback !== undefined && typeof options.callback !== 'function') { throw 'callback needs to be a function' }

  return options;
}

export default function Payment() {
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
            <PaymentStack
              amount={options.amount}
              token={options.token}
              receiver={options.receiver}
            />
          </WalletProvider>
        </DialogProvider>
      </CallbackContext.Provider>
      , shadowContainer
    );
  });
}
