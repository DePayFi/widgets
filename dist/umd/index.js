(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DePayWidgets = factory(global.React, global.ReactDOM));
}(this, (function (React, ReactDOM) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

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

    ReactDOM__default['default'].render(
      React__default['default'].createElement('h1', {__self: undefined, __source: {fileName: _jsxFileName, lineNumber: 26}}, "I am a dialog!"   ),
      _document.body
    );

  };

  let DePayWidgets = {
    Payment
  };

  return DePayWidgets;

})));
