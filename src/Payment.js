import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from './utils/ShadowContainer';
import PaymentStack from './stacks/PaymentStack';
import CloseContainerContext from './contexts/CloseContainerContext';
import WalletProvider from './providers/WalletProvider';

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
  options.token = (options.token === 'ETH') ? 'ETH' : DePay.ethers.utils.getAddress(DePay.ethers.utils.getAddress(options.token));

  // receiver
  if(_.isEmpty(options.receiver))     { throw '"receiver" needs to be set.' }
  options.receiver = DePay.ethers.utils.getAddress(DePay.ethers.utils.getAddress(options.receiver));

  // element
  if(!_.isEmpty(options.element)) {
    options.element = toElement(options.element);
  }

  // route
  if(!_.isEmpty(options.route)) {
    options.route = DePay.ethers.utils.getAddress(DePay.ethers.utils.getAddress(options.route));
  }

  return options;
}

export default function Payment() {
  checkArguments(arguments);
  var options = checkAndPrepOptions(arguments[0]);
  const [shadowContainer, closeContainer] = ShadowContainer();
  return new Promise(() => {
    ReactDOM.render(
      <CloseContainerContext.Provider value={closeContainer}>
        <WalletProvider>
          <PaymentStack
            amount={options.amount}
            token={options.token}
            receiver={options.receiver}
          />
        </WalletProvider>
      </CloseContainerContext.Provider>
      , shadowContainer
    );
  });
}
