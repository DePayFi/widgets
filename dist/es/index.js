import React from 'react';
import ReactDOM from 'react-dom';

const _jsxFileName = "/Users/sebastian/Work/DePay/depay-widgets/src/Payment.jsx";
var Payment = ({
  amount,
  token,
  receiver,
  document
})=> {

  let _document = document || window.document;

  ReactDOM.render(
    React.createElement('h1', {__self: undefined, __source: {fileName: _jsxFileName, lineNumber: 14}}, "I am a dialog!"   ),
    _document.body
  );

};

let DePayWidgets = {
  Payment
};

export default DePayWidgets;
