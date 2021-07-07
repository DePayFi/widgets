import React from 'react';
import { ReactDialogStack } from 'depay-react-dialog-stack';
import ReactDOM from 'react-dom';

var PaymentOverviewDialog = ()=>{
  console.log('PAYMENT OVERVIEW DIALOG');
  return(React.createElement('h1', {}, 'I am a dialog!'))
};

const _jsxFileName = "/Users/sebastian/Work/DePay/depay-widgets/src/stacks/PaymentStack.js";
var PaymentStack = (props)=>{
  console.log('PaymentStack props.document', props.document);
  return(
    React.createElement(ReactDialogStack, {
      open:  true ,
      close: ()=>{},
      start: "PaymentOverview",
      document:  props.document ,
      dialogs: {
        PaymentOverview: React.createElement(PaymentOverviewDialog, {__self: undefined, __source: {fileName: _jsxFileName, lineNumber: 14}})
      }, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 8}}
    )
  )
};

const _jsxFileName$1 = "/Users/sebastian/Work/DePay/depay-widgets/src/Payment.jsx";
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

  if(typeof document === 'undefined') { document = window.document; }

  await preflight({ amount, token, receiver });

  ReactDOM.render(
    React.createElement(PaymentStack, {
      document:  document , __self: undefined, __source: {fileName: _jsxFileName$1, lineNumber: 27}}
    ), 
    document.body
  );
};

let DePayWidgets = {
  Payment
};

export default DePayWidgets;
