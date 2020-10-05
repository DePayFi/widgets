import React from 'react';
import ReactDOM from 'react-dom';
import ShadowContainer from './utils/ShadowContainer';
import PayDialog from './dialogs/PayDialog';

function checkArguments(args){
  if(args.length == 0 || args.length > 1) {
    throw 'Unknown amount of arguments.'
  }
}

function checkAndPrepOptions(input) {
  var options = Object.assign({}, input); // shallow copy

  // amount
  if(_.isEmpty(options.amount)) { throw '"amount" needs to be set.' }
  if(typeof options.amount != 'string') { throw '"amount" needs to be passed as a string.' }

  // token
  if(_.isEmpty(options.token))  { throw '"token" needs to be set.' }
  options.token = DePay.ethers.utils.getAddress(DePay.ethers.utils.getAddress(options.token));

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
      <PayDialog
        paymentAmount={options.amount}
        paymentToken={options.token}
        paymentReceiver={options.receiver}
        closeContainer={closeContainer}
      />,
      shadowContainer,
    );
  });
}
