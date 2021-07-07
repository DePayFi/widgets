'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

const _jsxFileName = "/Users/sebastian/Work/DePay/depay-widgets/src/Payment.jsx";
var Payment = ({
  amount,
  token,
  receiver,
  document
})=> {

  let _document = document || window.document;

  ReactDOM__default['default'].render(
    React__default['default'].createElement('h1', {__self: undefined, __source: {fileName: _jsxFileName, lineNumber: 14}}, "I am a dialog!"   ),
    _document.body
  );

};

let DePayWidgets = {
  Payment
};

module.exports = DePayWidgets;
