import React from 'react';
import ReactDOM from 'react-dom';

const _jsxFileName = "/Users/sebastian/Work/DePay/depay-widgets/src/Payment.jsx";
let preflight = async ({
  amount,
  token,
  receiver
})=> {
  if(typeof amount === 'undefined') { throw('DePayWidgets.Payment: You need to set the amount you want to receive as payment!') }
  if(typeof token === 'undefined') { throw('DePayWidgets.Payment: You need to set the token you want to receive as payment!') }
  if(typeof receiver === 'undefined') { throw('DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!') }
};

var Payment = async ({
  amount,
  token,
  receiver,
  document
})=> {

  await preflight({ amount, token, receiver });

  let _document = document || window.document;

  ReactDOM.render(
    React.createElement('h1', {__self: undefined, __source: {fileName: _jsxFileName, lineNumber: 26}}, "I am a dialog!"   ),
    _document.body
  );

};

let DePayWidgets = {
  Payment
};

export default DePayWidgets;
