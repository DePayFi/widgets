(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('depay-react-dialog-stack'), require('depay-react-shadow-dom')) :
  typeof define === 'function' && define.amd ? define(['react', 'depay-react-dialog-stack', 'depay-react-shadow-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DePayWidgets = factory(global.React, global.depayReactDialogStack, global.ReactShadowDOM));
}(this, (function (React, depayReactDialogStack, ReactShadowDOM) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactShadowDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactShadowDOM);

  const _jsxFileName = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/Payment/PaymentOverviewDialog.jsx";
  var PaymentOverviewDialog = ()=>{
    return(
      React__default['default'].createElement('div', { className: "ReactDialogAnimation DePayWidgetDialog" , __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 5}}
        , React__default['default'].createElement('h1', {__self: undefined, __source: {fileName: _jsxFileName, lineNumber: 6}}, "I am a dialog"   )
      )
    )
  };

  const _jsxFileName$1 = "/Users/sebastian/Work/DePay/depay-widgets/src/stacks/PaymentStack.js";
  var PaymentStack = (props)=>{
    return(
      React__default['default'].createElement(depayReactDialogStack.ReactDialogStack, {
        open:  true ,
        close: ()=>{},
        start: "PaymentOverview",
        container:  props.container ,
        document:  props.document ,
        dialogs: {
          PaymentOverview: React__default['default'].createElement(PaymentOverviewDialog, {__self: undefined, __source: {fileName: _jsxFileName$1, lineNumber: 14}})
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
    
    ReactShadowDOM__default['default']({
      document,
      element: document.body,
      content: (container)=> {
        return(
          React__default['default'].createElement(PaymentStack, {
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

  return DePayWidgets;

})));
