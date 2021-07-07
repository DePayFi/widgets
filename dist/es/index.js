import React from 'react';
import { ReactDialogStack } from 'depay-react-dialog-stack';
import ReactShadowDOM from 'depay-react-shadow-dom';

const _jsxFileName = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/Payment/PaymentOverviewDialog.jsx";
var PaymentOverviewDialog = ()=>{
  return(
    React.createElement('div', { className: "ReactDialogAnimation DePayWidgetDialog" , __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 5}}
      , React.createElement('h1', {__self: undefined, __source: {fileName: _jsxFileName, lineNumber: 6}}, "I am a dialog"   )
    )
  )
};

const _jsxFileName$1 = "/Users/sebastian/Work/DePay/depay-widgets/src/stacks/PaymentStack.js";
var PaymentStack = (props)=>{
  return(
    React.createElement(ReactDialogStack, {
      open:  true ,
      close: ()=>{},
      start: "PaymentOverview",
      container:  props.container ,
      document:  props.document ,
      dialogs: {
        PaymentOverview: React.createElement(PaymentOverviewDialog, {__self: undefined, __source: {fileName: _jsxFileName$1, lineNumber: 14}})
      }, __self: undefined, __source: {fileName: _jsxFileName$1, lineNumber: 7}}
    )
  )
};

var style = ()=>{
  return(`
    .DePayWidgetDialog {
      background: white;
    }
  `)
};

const _jsxFileName$2 = "/Users/sebastian/Work/DePay/depay-widgets/src/Payment.jsx";
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
  
  ReactShadowDOM({
    document,
    element: document.body,
    content: (container)=> {
      return(
        React.createElement(PaymentStack, {
          document:  document ,
          container:  container , __self: undefined, __source: {fileName: _jsxFileName$2, lineNumber: 32}}
        )
      )
    },
    insideStyle: style()
  });
};

let DePayWidgets = {
  Payment
};

export default DePayWidgets;
