(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('react'), require('ethers'), require('react-rangeslider'), require('react-dom'), require('react-shadow-dom-retarget-events'), require('fuse.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'react', 'ethers', 'react-rangeslider', 'react-dom', 'react-shadow-dom-retarget-events', 'fuse.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DePayWidgets = {}, global._$1, global.React, global.ethers, global.Slider, global.ReactDOM, global.retargetEvents, global.Fuse));
}(this, (function (exports, _$1, React, ethers, Slider, ReactDOM, retargetEvents, Fuse) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var ___default = /*#__PURE__*/_interopDefaultLegacy(_$1);
  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var Slider__default = /*#__PURE__*/_interopDefaultLegacy(Slider);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var retargetEvents__default = /*#__PURE__*/_interopDefaultLegacy(retargetEvents);
  var Fuse__default = /*#__PURE__*/_interopDefaultLegacy(Fuse);

  var CallbackContext = React__default['default'].createContext();

  var DialogContext = React__default['default'].createContext();

  const _jsxFileName = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/DialogProvider.jsx";
  class DialogProvider extends React__default['default'].Component {constructor(...args) { super(...args); DialogProvider.prototype.__init.call(this); }
    __init() {this.state = {
      closable: true
    };}

    setClosable(value) {
      this.setState({ closable: value });
      this.props.setClosable(value);
    }

    render() {
      return(
        React__default['default'].createElement(DialogContext.Provider, { value: {
          closeContainer: this.props.closeContainer,
          setClosable: this.setClosable.bind(this),
          closable: this.state.closable
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
          ,  this.props.children 
        )
      )
    }
  }

  var AmountContext = React__default['default'].createContext();

  const _jsxFileName$1 = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/AmountProvider.jsx";
  class AmountProvider extends React__default['default'].Component {
    __init() {this.state = {
      amount: null
    };}

    constructor(props) {
      super(props);AmountProvider.prototype.__init.call(this);    Object.assign(this.state, {
        token: props.token,
        amount: (typeof props.amount === 'object') ? (props.amount.start || props.amount.min || 1) : parseFloat(props.amount)
      });
    }

    componentDidUpdate(prevProps) {
      if(prevProps.token != this.props.token) {
        this.setState({
          token: this.props.token
        });
      }
    }

    change(amount) {
      this.setState({
        amount: parseFloat(ethers.ethers.utils.formatUnits(amount.toLocaleString('fullwide', {useGrouping:false}), this.state.token.decimals).toString())
      });
    }

    convertedStateAmount() {
      if(this.state.token) {
        return ethers.ethers.utils.parseUnits(this.state.amount.toString(), this.state.token.decimals).toString()
      } else {
        return this.state.amount;
      }
    }

    render() {
      return(
        React__default['default'].createElement(AmountContext.Provider, { value: {
          amount: this.convertedStateAmount(),
          change: this.change.bind(this)
        }, __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 42}}
          , this.props.children
        )
      )
    }
  }

  const _jsxFileName$2 = "/Users/sebastian/Work/DePay/depay-widgets/src/components/CloseDialogComponent.jsx";
  class CloseDialogComponent extends React__default['default'].Component {
    
    render() {
      return(
        React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 8}}
          , dialogContext => (
            React__default['default'].createElement('div', {__self: this, __source: {fileName: _jsxFileName$2, lineNumber: 10}}
              , dialogContext.closable &&
                React__default['default'].createElement('button', { onClick: dialogContext.closeContainer, className: "DialogCloseButton CircularButton" , title: "Close dialog" , __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 12}}, React__default['default'].createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 12}}, React__default['default'].createElement('line', { x1: "18", y1: "6", x2: "6", y2: "18", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 12}}), React__default['default'].createElement('line', { x1: "6", y1: "6", x2: "18", y2: "18", __self: this, __source: {fileName: _jsxFileName$2, lineNumber: 12}})))
              
            )
          )
        )
      )
    }
  }

  const DisplayTokenAmount = function(amount, decimals, symbol){
    let float;
    if(decimals === 0) {
      float = parseFloat(amount);
    } else {
      float = ethers.ethers.utils.formatUnits(amount, decimals);
    }
    const subZeroMatch = float.toString().match(/(?!0)\d/);
    let displayedValue = float.toString();
    if(float.toString().match(/\./) && subZeroMatch) {
      if(float.toString().match(/\./).index > 1) {
        displayedValue = parseFloat(float.toString()).toFixed(2).replace('.00', '');
      } else {
        displayedValue = displayedValue.substring(0, subZeroMatch.index+3).replace(/\.$/, '');
      }
    }
    return `${displayedValue} ${symbol}`
  };

  var NavigateStackContext = React__default['default'].createContext();

  const _jsxFileName$3 = "/Users/sebastian/Work/DePay/depay-widgets/src/components/GoBackDialogComponent.jsx";
  class GoBackDialogComponent extends React__default['default'].Component {
    
    render() {
      return(
        React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$3, lineNumber: 8}}
          , navigate => (
            React__default['default'].createElement('button', { onClick: ()=> navigate('back'), className: "DialogGoBackButton CircularButton" , title: "Go back" , __self: this, __source: {fileName: _jsxFileName$3, lineNumber: 10}}, React__default['default'].createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", __self: this, __source: {fileName: _jsxFileName$3, lineNumber: 10}}, React__default['default'].createElement('line', { x1: "15.2", y1: "6", x2: "8.8", y2: "12.4", __self: this, __source: {fileName: _jsxFileName$3, lineNumber: 10}}), React__default['default'].createElement('line', { x1: "9.2", y1: "12", x2: "15.2", y2: "18", __self: this, __source: {fileName: _jsxFileName$3, lineNumber: 10}})))
          )
        )
      )
    }
  }

  const _jsxFileName$4 = "/Users/sebastian/Work/DePay/depay-widgets/src/components/TokenIconComponent.jsx";
  class TokenIconComponent extends React__default['default'].Component {constructor(...args) { super(...args); TokenIconComponent.prototype.__init.call(this); }
    __init() {this.state = {};}
    
    handleLoadError() {
      this.setState({
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAGFBMVEVHcEz///////////////////////////8dS1W+AAAAB3RSTlMAHklzmMLqCsLrGwAAAQ9JREFUeNrtlrsOgkAQRRdFbDcae4IFrZEYazXRVitqQ2Hrk/19BVdX7XYuiQX3VDZzMsxrVYQQQkibGIyzLNHi8OHaVJRLWXgwMy8KLYnfGEchEFTxjp2/wHxRalBg9v4CNAXzwxYVXCSC2ypJstx+g6/ATaAdqImvoHxHzEVFcPGqWwtOnoLFx++6DGdgq9NnG+T0K8EVEPTqnrZbEKGCFO1CDs2BG2UZbpnABEwMJIA1IRSeZfdCgV8wsjdVnEBuLyKyBu51Fb+xpfhPRgdsgYqeM6DlQwQmoA62AvISgIsc2j0EaxgDL0ojx/CCCs4KPGYnVHCk4CEg7SbIKqbqfyeRAgoaERBCCCGESLgDeRfMNogh3QMAAAAASUVORK5CYII=',
        className: 'notfound'
      });
    }
    
    render() {
      return(
        React__default['default'].createElement('img', {
          title:  this.props.title ,
          className: `CircularIcon ${this.state.className} ${this.props.className}`,
          src:  this.state.src || this.props.src ,
          onError:  this.handleLoadError.bind(this) , __self: this, __source: {fileName: _jsxFileName$4, lineNumber: 15}}
        )
      )
    }
  }

  const _jsxFileName$5 = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/ChangeTokenAmountDialog.jsx";
  class ChangeTokenAmountDialog extends React__default['default'].Component {
    __init() {this.state = {
      amount: null
    };}

    constructor(props) {
      super(props);ChangeTokenAmountDialog.prototype.__init.call(this);
      let maxAmountRoute = ___default['default'].sortBy(props.routes, function(route){ return parseInt(route.maxAmount,10) })[props.routes.length-1];

      this.state = {
        amount: parseInt(props.amount),
        maxAmount: maxAmountRoute.maxAmount,
        maxAmountRoute: maxAmountRoute,
      };
    }

    componentWillUnmount() {
      if(this.props.amount !== this.state.amount) {
        this.props.change(this.state.amount);
      }
    }

    changeAmount(val) {
      this.setState({
        amount: val
      });
    }

    changeInputAmount(event){
      let amount = parseInt(event.target.value, 10);
      if(!isNaN(amount)) {
        this.setState({
          amount: parseInt(ethers.ethers.utils.parseUnits(amount.toString(), this.props.token.decimals))
        }); 
      }
    }

    render() {
      const tokenMin = parseInt(ethers.ethers.utils.formatUnits((10**this.props.token.decimals).toLocaleString('fullwide', {useGrouping:false}), this.props.token.decimals).toString());
      const min = (this.props.amountOptions ? this.props.amountOptions.min : tokenMin) || tokenMin;
      const step = (this.props.amountOptions ? this.props.amountOptions.step : min) || min;
      const max = parseInt(ethers.ethers.utils.formatUnits(this.state.maxAmount.toLocaleString('fullwide', {useGrouping:false}), this.props.token.decimals).toString());
      return (
        React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$5, lineNumber: 56}}
          , navigate => (
            React__default['default'].createElement('div', { className: "Dialog ChangeTokenAmountDialog" , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 58}}
              , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 59}}
                , React__default['default'].createElement(GoBackDialogComponent, {__self: this, __source: {fileName: _jsxFileName$5, lineNumber: 60}})
                , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$5, lineNumber: 61}})
                , React__default['default'].createElement('h1', { className: "FontSizeNormal TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 62}}, "Change amount"

                )
                , React__default['default'].createElement('div', { className: "FontSizeLarge TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 65}}
                  ,  this.props.token.symbol 
                )
              )
              , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 69}}

                , React__default['default'].createElement('div', { className: "PaddingSmall", __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 71}}

                  , React__default['default'].createElement('div', { className: "PaddingTopSmall TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 73}}
                    , React__default['default'].createElement('div', { className: "FontSizeLarge", __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 74}}
                      , React__default['default'].createElement('input', { max: max, min: min, step: step, className: "Input FontSizeMedium TextAlignCenter"  , type: "number", name: "amount", value:  parseFloat(DisplayTokenAmount(this.state.amount.toLocaleString('fullwide', {useGrouping:false}), this.props.token.decimals, '')) , onChange: this.changeInputAmount.bind(this), __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 75}})
                    )
                  )

                  , React__default['default'].createElement('div', { className: "PaddingBottomSmall", __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 79}}
                    , React__default['default'].createElement(Slider__default['default'], {
                      min: 10**this.props.token.decimals*min,
                      max: this.state.maxAmount,
                      step: 10**this.props.token.decimals*step,
                      value: this.state.amount,
                      onChange: this.changeAmount.bind(this), __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 80}}
                    )
                  )

                  , React__default['default'].createElement('div', { className: "TextAlignCenter TextGrey PaddingBottomSmall"  , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 89}}, "Max. purchase for"
                      , React__default['default'].createElement('br', {__self: this, __source: {fileName: _jsxFileName$5, lineNumber: 90}})
                    , DisplayTokenAmount(parseInt(this.state.maxAmountRoute.balance).toLocaleString('fullwide', {useGrouping:false}), this.state.maxAmountRoute.token.decimals, this.state.maxAmountRoute.token.symbol)
                    , React__default['default'].createElement(TokenIconComponent, {
                      className: "small",
                      title:  this.state.maxAmountRoute.token.name ,
                      src:  this.state.maxAmountRoute.token.logoURI , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 92}}
                    )
                    ,  this.state.maxAmountRoute.symbol 
                  )

                )
              )
              , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 102}}
                , React__default['default'].createElement('button', { className: "CallToAction MainAction" , onClick:  ()=>navigate('back') , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 103}}, "Done"

                )
                , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 106}}
                  , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$5, lineNumber: 107}}, "by DePay"

                  )
                )
              )
            )
          )
        )
      )
    }
  }

  var GasContext = React__default['default'].createContext();

  const LocalCurrency = function(price){
    let displayed = parseFloat(price).toFixed(2);
    return "$"+displayed+" USD";
  };

  const _jsxFileName$6 = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/ChangeNetworkFeeDialog.jsx";
  class ChangeNetworkFeeDialog extends React__default['default'].Component {

    select(type, gasContext, navigate) {
      gasContext.change(gasContext[type]);
      navigate('back');
    }

    feeToLocal(gas) {
      const feeInETH = parseFloat(ethers.ethers.utils.formatUnits(gas, 'gwei')) * this.props.selected.fee;
      return LocalCurrency(feeInETH * this.props.price);
    }
    
    render() {
      return (
        React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$6, lineNumber: 24}}
          , navigate => (
            React__default['default'].createElement(GasContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$6, lineNumber: 26}}
              , gasContext => (
                React__default['default'].createElement('div', { className: "Dialog ChangeNetworkFeeDialog" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 28}}
                  , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 29}}
                    , React__default['default'].createElement(GoBackDialogComponent, {__self: this, __source: {fileName: _jsxFileName$6, lineNumber: 30}})
                    , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$6, lineNumber: 31}})
                    , React__default['default'].createElement('h1', { className: "FontSizeMedium TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 32}}, "Change network fee"  )
                    , React__default['default'].createElement('div', { className: "FontSizeMedium FontWeightBold TextAlignCenter"  , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 33}}
                      ,  this.props.paymentContext.feeLocal 
                    )
                  )
                  , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 37}}

                    , React__default['default'].createElement('div', { className: "PaddingSmall", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 39}}

                      , React__default['default'].createElement('div', { className: "PaddingTopSmall TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 41}}
                        , React__default['default'].createElement('div', { className: "FontSizeMedium", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 42}}, gasContext.selected, " gwei" )
                      )

                      , React__default['default'].createElement(Slider__default['default'], {
                        min: gasContext.slow,
                        max: gasContext.fast,
                        value: gasContext.selected,
                        onChange: gasContext.change, __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 45}}
                      )

                      , React__default['default'].createElement('div', { className: "Table", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 52}}
                        , React__default['default'].createElement('div', { className: "TableRow", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 53}}

                          , React__default['default'].createElement('div', { className: "TableCell TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 55}}
                            , React__default['default'].createElement('div', { className: " NetworkFeeButton PaddingSmall"  , onClick: ()=>this.select('slow', gasContext, navigate), __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 56}}
                              , React__default['default'].createElement('div', { className: "FontSizeSmall FontWeightBold" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 57}}, "Slow")
                              , React__default['default'].createElement('div', { className: "depay-dialog-change-network-fee-button-price", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 58}},  this.feeToLocal(gasContext.slow) )
                              , React__default['default'].createElement('div', { className: "FontSizeSmall", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 59}}, "~15 min." )
                              , React__default['default'].createElement('div', { className: "FontSizeSmall TextGrey" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 60}}, gasContext.slow, " gwei" )
                            )
                          )

                          , React__default['default'].createElement('div', { className: "TableCell TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 64}}
                            , React__default['default'].createElement('div', { className: " NetworkFeeButton PaddingSmall"  , onClick: ()=>this.select('standard', gasContext, navigate), __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 65}}
                              , React__default['default'].createElement('div', { className: "FontSizeSmall FontWeightBold" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 66}}, "Average")
                              , React__default['default'].createElement('div', { className: "depay-dialog-change-network-fee-button-price", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 67}},  this.feeToLocal(gasContext.standard) )
                              , React__default['default'].createElement('div', { className: "FontSizeSmall", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 68}}, "~2 min." )
                              , React__default['default'].createElement('div', { className: "FontSizeSmall TextGrey" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 69}}, gasContext.standard, " gwei" )
                            )
                          )

                          , React__default['default'].createElement('div', { className: "TableCell TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 73}}
                            , React__default['default'].createElement('div', { className: " NetworkFeeButton PaddingSmall"  , onClick: ()=>this.select('fast', gasContext, navigate), __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 74}}
                              , React__default['default'].createElement('div', { className: "FontSizeSmall FontWeightBold" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 75}}, "Fast")
                              , React__default['default'].createElement('div', { className: "depay-dialog-change-network-fee-button-price", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 76}},  this.feeToLocal(gasContext.fast) )
                              , React__default['default'].createElement('div', { className: "FontSizeSmall", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 77}}, "seconds")
                              , React__default['default'].createElement('div', { className: "FontSizeSmall TextGrey" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 78}}, gasContext.fast, " gwei" )
                            )
                          )
                        )
                      )
                    )

                    , React__default['default'].createElement('div', { className: "PaddingSmall PaddingTopNone" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 85}}
                      , React__default['default'].createElement('div', { className: "Card information" , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 86}}, "Every transaction on Ethereum requires a network fee (gas). The network fee is paid to 'miners' who help to process and secure what happens on Ethereum. Depending on the current network congestion you either pay more or less network fee."



                      )
                    )

                  )
                  , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 94}}
                    , React__default['default'].createElement('button', { className: "CallToAction MainAction" , onClick:  ()=>navigate('back') , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 95}}, "Done"

                    )
                    , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 98}}
                      , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$6, lineNumber: 99}}, "by DePay"

                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$7 = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/ChangePaymentTokenDialog.jsx";
  class ChangePaymentTokenDialog extends React__default['default'].Component {

    selectNewRoute(index, navigate) {
      this.props.change(index);
      navigate('back');
    }

    renderThirdRow(route, index, routes) {
      let labels = [];

      if(index < (routes.length-1) && route.fee < routes[index+1].fee) {
        labels.push(
          React__default['default'].createElement('span', { key: "networkfee", className: "Label highlight small"  , title: "Significantly lower network fees compared to the other payment options."         , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 21}}, "Lowest Network Fee"

          )
        );
      }

      if(route.approved === false) {
        labels.push(
          React__default['default'].createElement('span', { key: "approval", className: "Label highlight small"  , title: "Requires a one-time additional approval transaction to allow swapping this token to perform payments."             , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 29}}, "Requires Approval"

          )
        );
      }

      if(labels.length) {
        return (
          React__default['default'].createElement('div', { className: "PaymentAmountRow3", __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 37}}
            ,  labels 
          )
        );
      } else {
        return null;
      }
    }
    
    render() {

      return (
        React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$7, lineNumber: 49}}
          , navigate => (
            React__default['default'].createElement('div', { className: "Dialog ChangePaymentDialog" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 51}}
              , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 52}}
                , React__default['default'].createElement(GoBackDialogComponent, {__self: this, __source: {fileName: _jsxFileName$7, lineNumber: 53}})
                , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$7, lineNumber: 54}})
                , React__default['default'].createElement('h1', { className: "FontSizeNormal TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 55}}, "Change payment"

                )
                , React__default['default'].createElement('div', { className: "FontSizeLarge TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 58}}
                  ,  this.props.paymentContext.local 
                )
              )
              , React__default['default'].createElement('div', { className: "DialogBody", __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 62}}
                , this.props.routes.map((route, index) => {
                  
                  const totalDisplayed = DisplayTokenAmount(route.balance, route.token.decimals, route.token.symbol);
                  const displayedTokenAmount = DisplayTokenAmount(route.amounts[0], route.token.decimals, route.token.symbol);

                  return(
                    React__default['default'].createElement('div', { className: "Payment", key: index, __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 69}}

                      , React__default['default'].createElement('div', { className: "PaymentRow ChangePaymentRow" , onClick:  ()=> this.selectNewRoute(index, navigate) , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 71}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 72}}
                          , React__default['default'].createElement(TokenIconComponent, {
                            title:  route.token.name ,
                            src:  route.token.logoURI , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 73}}
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 78}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 79}}
                            ,  route.token.name 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 82}}
                            ,  displayedTokenAmount 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 85}}
                            ,  totalDisplayed 
                          )
                          ,  this.renderThirdRow(route, index, this.props.routes) 
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 90}}
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Select for payment"  , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 91}}, "Select"

                          )
                        )
                      )

                    )
                  )
                })
              )
              , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 101}}
                , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 102}}
                  , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$7, lineNumber: 103}}, "by DePay"

                  )
                )
              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$8 = "/Users/sebastian/Work/DePay/depay-widgets/src/components/CheckMarkComponent.jsx";
  class CheckMarkComponent extends React__default['default'].Component {
    
    render() {
      return(
        React__default['default'].createElement('svg', { className: ['Icon white', this.props.className].join(' '), version: "1.1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName$8, lineNumber: 7}}
          , React__default['default'].createElement('path', { d: "M20,4.9L9.2,16l-5.4-3.9c-0.7-0.5-1.6-0.3-2.1,0.3c-0.5,0.7-0.3,1.6,0.3,2.1l6.4,4.7c0.3,0.2,0.6,0.3,0.9,0.3 c0.4,0,0.8-0.2,1.1-0.5l11.7-12c0.6-0.6,0.6-1.6,0-2.2C21.6,4.3,20.6,4.3,20,4.9z"
    , __self: this, __source: {fileName: _jsxFileName$8, lineNumber: 8}})
        )
      )
    }
  }

  var EthersProvider;

  if (window.ethereum) {
    EthersProvider = new ethers.ethers.providers.Web3Provider(window.ethereum);
  } else if (window.web3 && window.web3.currentProvider) {
    EthersProvider = new ethers.ethers.providers.Web3Provider(window.web3.currentProvider);
  }

  var EthersProvider$1 = EthersProvider;

  var DePayRouterV1Abi = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

  const DePayRouterV1Contract = new ethers.ethers.Contract('0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92', DePayRouterV1Abi, EthersProvider$1);

  var Erc20Abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }],
      "name": "approve",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_from", "type": "address" },
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transferFrom",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "name": "", "type": "uint8" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
      "name": "transfer",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }],
      "name": "allowance",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    { "payable": true, "stateMutability": "payable", "type": "fallback" },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "owner", "type": "address" },
        { "indexed": true, "name": "spender", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "from", "type": "address" },
        { "indexed": true, "name": "to", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ];

  var UniswapV2FactoryAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeToSetter",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token0",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token1",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "pair",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "PairCreated",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allPairs",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "allPairsLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        }
      ],
      "name": "createPair",
      "outputs": [
        {
          "internalType": "address",
          "name": "pair",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "feeTo",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "feeToSetter",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "getPair",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeTo",
          "type": "address"
        }
      ],
      "name": "setFeeTo",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeToSetter",
          "type": "address"
        }
      ],
      "name": "setFeeToSetter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const UniswapV2FactoryContract = new ethers.ethers.Contract('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', UniswapV2FactoryAbi, EthersProvider$1);

  var UniswapV2PairAbi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "Burn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1",
          "type": "uint256"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0In",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1In",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount0Out",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount1Out",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "Swap",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint112",
          "name": "reserve0",
          "type": "uint112"
        },
        {
          "indexed": false,
          "internalType": "uint112",
          "name": "reserve1",
          "type": "uint112"
        }
      ],
      "name": "Sync",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "MINIMUM_LIQUIDITY",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "PERMIT_TYPEHASH",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "burn",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount0",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount1",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "factory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getReserves",
      "outputs": [
        {
          "internalType": "uint112",
          "name": "_reserve0",
          "type": "uint112"
        },
        {
          "internalType": "uint112",
          "name": "_reserve1",
          "type": "uint112"
        },
        {
          "internalType": "uint32",
          "name": "_blockTimestampLast",
          "type": "uint32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_token0",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token1",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "kLast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "nonces",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "permit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "price0CumulativeLast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "price1CumulativeLast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "skim",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount0Out",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount1Out",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "swap",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "sync",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token0",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token1",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const UniswapV2PairContract = function(address){
    return new ethers.ethers.Contract(address, UniswapV2PairAbi, EthersProvider$1);
  };

  var UniswapV2Router02Abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_factory",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_WETH",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "WETH",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountADesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBDesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountAMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "addLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenDesired",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "addLiquidityETH",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "factory",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveOut",
          "type": "uint256"
        }
      ],
      "name": "getAmountIn",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveOut",
          "type": "uint256"
        }
      ],
      "name": "getAmountOut",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        }
      ],
      "name": "getAmountsIn",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        }
      ],
      "name": "getAmountsOut",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserveB",
          "type": "uint256"
        }
      ],
      "name": "quote",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountAMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidity",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidityETH",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "approveMax",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "removeLiquidityETHWithPermit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountToken",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountTokenMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountETHMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "approveMax",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountETH",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenA",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenB",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountAMin",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "approveMax",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "removeLiquidityWithPermit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapETHForExactTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactETHForTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactTokensForETH",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactTokensForTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountInMax",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapTokensForExactETH",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountInMax",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapTokensForExactTokens",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

  const UniswapV2Router02Contract = new ethers.ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', UniswapV2Router02Abi, EthersProvider$1);

  const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const MAXINT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  const SLIPPAGE = 1; // 1% slippage on DEX token swaps

  class UniswapExchange {

    static id() {
      return 0;
    }

    static name() {
      return 'Uniswap';
    }

    static pluginAddress() {
      return '0xe04b08Dfc6CaA0F4Ec523a3Ae283Ece7efE00019';
    }

    static feeDefaults() {
      // return {
      //   transferETH: 43000,
      //   transferERC20: ,
      //   swap: ,
      //   toETH: 230000,
      //   fromETH: 182000
      // }
    }

    static ETHtoWETH(input){
      if(input === ETH) { return WETH }
      return input;
    }

    static linkRoute(route) {
      let path = (route.route || route.path).map(function(step){
        if(step === ETH) { return '83C756Cc2' }
        return step;
      });
      return `https://app.uniswap.org/#/swap?exactAmount=${parseFloat(ethers.ethers.utils.formatEther(route.amounts[0])).toFixed(4)}&inputCurrency=${path[0]}&outputCurrency=${path[path.length-1]}`
    }
    
    static findLiquidity(addressA, addressB) {
      if(addressA === ETH) { addressA = WETH; }
      if(addressB === ETH) { addressB = WETH; }
      if(addressA === addressB) { return(Promise.resolve([ethers.ethers.BigNumber.from(MAXINT.toString()), ethers.ethers.BigNumber.from(MAXINT.toString())])); }
      return new Promise(function(resolve, reject){
        UniswapV2FactoryContract.getPair(addressA, addressB).then(function(pairAddress){
          if(pairAddress.address === ethers.ethers.constants.AddressZero) {
            resolve(null);
          } else {
            UniswapV2PairContract(pairAddress).getReserves()
            .then(function(reserves){
              resolve([reserves[0], reserves[1]]);
            })
            .catch(()=>resolve([ethers.ethers.BigNumber.from('0'), ethers.ethers.BigNumber.from('0')]));
          }
        });
      });
    }

    static findAmounts(route, endTokenAmount) {
      route = route.map(function(step){
        if(step === ETH) {
          return WETH;
        } else {
          return step;
        }
      });
      return new Promise(function(resolve, reject){
        UniswapV2FactoryContract.getPair(route[0], route[1]).then(function(pairAddress){
          if(pairAddress.address === ethers.ethers.constants.AddressZero) {
            return(resolve(null)); // dont bother if there is no pair
          } else {
            UniswapV2Router02Contract.getAmountsIn(
              endTokenAmount.toString(),
              route
            )
            .then(function(amounts){
              resolve(
                amounts.map(function(amount){ return amount.toString() })
              );
            })
            .catch(()=>resolve(null));
          }
        });
      });
    }

    static findMaxAmount(route) {
      return new Promise(function(resolve, reject){
        let inToken = route.token.address;
        if(inToken === ETH) { inToken = WETH; }      let outToken = route.route[route.route.length-1];
        let path;
        if(inToken === WETH) {
          path = [WETH, outToken];
        } else {
          path = [inToken, WETH, outToken];
        }

        UniswapV2Router02Contract.getAmountsOut(
          route.balance,
          path
        ).then(function(amounts){
          resolve(amounts[amounts.length-1].toString());
        })
        .catch(()=>resolve('0'));
      });
    }

    static amountsFromTo(from, fromAmount, to) {
      return new Promise(function(resolve, reject){
        UniswapV2Router02Contract.getAmountsOut(
          fromAmount,
          [this.ETHtoWETH(from), this.ETHtoWETH(to)]
        )
        .then(function(amounts){
          resolve(amounts);
        })
        .catch(()=>resolve(null));
      }.bind(this))
    }
  }

  class Exchanges {
    static __initStatic() {this.all = [
      // MooniswapExchange,
      UniswapExchange
    ];}

    static findByName(name) {
      return Exchanges.all.find(function(exchange){
        return exchange.name() === name;
      });
    }

    static routesWithMaxAmounts(routes) {
      return new Promise(function(resolve, reject){
        Promise.all(routes.map(function(route){
          return Exchanges.findByName(route.exchange).findMaxAmount(route);
        })).then(function(maxAmounts){
          resolve(
            routes.map(function(route, index){
              var maxAmountIncludingSlippage = maxAmounts[index];
              var maxAmountExcludingSlippage = ethers.ethers.BigNumber.from(maxAmountIncludingSlippage).sub(ethers.ethers.BigNumber.from(maxAmountIncludingSlippage).div("100").mul(SLIPPAGE.toString())).toString();
              // slippage gets added later again, so maxAmount need to exclude slippage
              return Object.assign({}, route, {
                maxAmount: maxAmountExcludingSlippage
              })
            })
          );
        });
      });
    }

    static amountsWithOrWithoutSlippage(endTokenAddress, route, amounts) {
      if(amounts[Object.keys(amounts)[0]] == undefined || amounts[Object.keys(amounts)[0]] == null) {
        // No amounts as there is not route
        return amounts;
      } else if(endTokenAddress.toLowerCase() === route.token.address.toLowerCase()) {
        // direct transfer requries no slippage nor a conversion (input = output)
        let amountsWithoutSlippage = amounts[Object.keys(amounts)[0]].slice(0); // create a copy
        amountsWithoutSlippage[0] = amountsWithoutSlippage[amountsWithoutSlippage.length-1];
        amounts[Object.keys(amounts)[0]] = amountsWithoutSlippage;
        return amounts;
      } else {
        // swap requires to add slippage
        let amountsWithSlippage = amounts[Object.keys(amounts)[0]].slice(0); // create a copy
        for (var i = 0; i < amountsWithSlippage.length-1; i++) {
          amountsWithSlippage[i] = ethers.ethers.BigNumber.from(amountsWithSlippage[i]).div("100").mul(SLIPPAGE.toString()).add(amountsWithSlippage[i]).toString();
        }
        amounts[Object.keys(amounts)[0]] = amountsWithSlippage;
        return amounts;
      }
    }

    static findBestRoutesAndRequiredAmountsForEndToken(routes, endTokenAddress, endTokenAmount){
      return new Promise(function(resolve, reject){
        Exchanges.findRoutes(endTokenAddress)
          .then(function(exchangesWithIntermediateRoute){
            Promise.all(routes.map(function(route){
              if(
                (route.token.address === ETH) &&
                (endTokenAddress === ETH)
              ) {
                return Promise.resolve({ all: [endTokenAmount] });
              } else {
                return Exchanges.findAmountsForRoutePerExchange(
                  Object.keys(exchangesWithIntermediateRoute),
                  [route.token.address].concat(Object.values(exchangesWithIntermediateRoute)[0]),
                  endTokenAmount
                )
              }
            })).then(function(amountsForRoutesPerExchange){
              resolve(
                routes.map(function(route, index){
                  return Object.assign(
                    {},
                    route,
                    { route: ___default['default'].uniq([route.token.address].concat(Object.values(exchangesWithIntermediateRoute)[0])) },
                    { amounts: this.amountsWithOrWithoutSlippage(endTokenAddress, route, amountsForRoutesPerExchange[index]) });
                }.bind(this)).filter(function(route){
                  return Boolean(
                    ___default['default'].every(Object.values(route.amounts), function(values){
                      return values !== null && 
                        ___default['default'].every(values, function(value){
                          return ethers.ethers.BigNumber.from(value).gt(0);
                        })
                    })
                  )
                }).map(function(route){
                  return Exchanges.selectBestExchangeRoute(route);
                })
              );
            }.bind(this));
          }.bind(this));
      }.bind(this));
    }

    static selectBestExchangeRoute(route) {
      let bestExchangeRoute = ___default['default'].map(route.amounts, function(amounts, exchangeName){
        return({
          exchange: exchangeName, 
          amounts: amounts
        });
      }.bind(this)).sort(function(a, b){
        if (ethers.ethers.BigNumber.from(a.amounts[0]).gt(ethers.ethers.BigNumber.from(b.amounts[0]))) {
          return 1; // b wins
        }
        if (ethers.ethers.BigNumber.from(b.amounts[0]).gt(ethers.ethers.BigNumber.from(a.amounts[0]))) {
          return -1; // a wins
        }
        return 0; // equal
      })[0];

      return Object.assign(
        {},
        route,
        { exchange: bestExchangeRoute.exchange },
        { amounts: bestExchangeRoute.amounts }
      )
    }

    static findAmountsForRoutePerExchange(exchangeNames, route, endTokenAmount) {
      let findAmountsForRoutePerExchange = {};
      return new Promise(function(resolve, reject){
        Promise.all(exchangeNames.map(function(exchangeName){
          if(route[0] === ETH) { route = route.slice(1,3); }
          if(route[route.length-1] === ETH) { route = [route[0], route[route.length-1]]; }
          return Exchanges.findByName(exchangeName).findAmounts(route, endTokenAmount);
        })).then(function(amounts){
          exchangeNames.forEach(function(exchangeName, index){
            findAmountsForRoutePerExchange[exchangeName] = amounts[index];
          });
          resolve(findAmountsForRoutePerExchange);
        });
      });
    }

    static findRoutes(tokenAddress) {
      let routesPerExchange = {};
      return new Promise(function(resolve, reject){
        if(tokenAddress === 'ETH') {
          Exchanges.all.map(function(exchange){
            routesPerExchange[exchange.name()] = [ETH];
          });
          resolve(routesPerExchange);
        } else {
          Promise.all(Exchanges.all.map(function(exchange){
            return exchange.findLiquidity(ETH, tokenAddress).then(function(liquidity){
              if(liquidity === null || !Boolean(___default['default'].find(liquidity, function(liquidity){ return liquidity.gt(0) }))) {
                return null;
              } else {
                let exchangeWithLiquidity = {};
                exchangeWithLiquidity[exchange.name()] = liquidity;
                return exchangeWithLiquidity;
              }
            })
          })).then(function(exchangesWithLiquidity){
            exchangesWithLiquidity.forEach(function(exchangeWithLiquidity){
              if(exchangeWithLiquidity) {
                routesPerExchange[Object.keys(exchangeWithLiquidity)[0]] = [ETH, tokenAddress];
              }
            });
            resolve(routesPerExchange);
          });
        }
      });
    }

    static findBestRouteFromTo(from, fromAmount, to) {
      return new Promise(function(resolve, reject){
        Promise.all(Exchanges.all.map(function(exchange){
          return exchange.amountsFromTo(from, fromAmount, to)
        })).then(function(amountsPerExchange){
          let bestAmounts = ___default['default'].sortBy(amountsPerExchange, function(amounts){ return ___default['default'].last(amounts) })[0];
          resolve({
            path: [from, to],
            amounts: bestAmounts,
            exchange: Exchanges.all[amountsPerExchange.indexOf(bestAmounts)].name()
          });
        });
      })
    }

    static findBestRouteToFrom(to, toAmount, from) {
      return Promise.all(Exchanges.all.map(function(exchange){
        return exchange.amountsToFrom(to, toAmount, from)
      })).then(function(amountsPerExchange){
        console.log('amountsPerExchange', amountsPerExchange);
      })
    }
  } Exchanges.__initStatic();

  const _jsxFileName$9 = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/NotEnoughFundsDialog.jsx";
  class NotEnoughFundsDialog extends React__default['default'].Component {

    render() {
      
      return (
        React__default['default'].createElement('div', { className: "Dialog NotEnoughFundsDialog" , __self: this, __source: {fileName: _jsxFileName$9, lineNumber: 9}}
          , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$9, lineNumber: 10}}
            , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$9, lineNumber: 11}})
          )
          , React__default['default'].createElement('div', { className: "DialogBody HeightAuto TextAlignCenter PaddingSmall"   , __self: this, __source: {fileName: _jsxFileName$9, lineNumber: 13}}
            , React__default['default'].createElement('h1', { className: "FontSizeLarge PaddingMedium PaddingTopSmall"  , __self: this, __source: {fileName: _jsxFileName$9, lineNumber: 14}}, "Not enough funds!"

            )
          )
          , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$9, lineNumber: 18}}
            , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$9, lineNumber: 19}}
              , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$9, lineNumber: 20}}, "by DePay"

              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$a = "/Users/sebastian/Work/DePay/depay-widgets/src/utils/Skeleton.jsx";
  class Skeleton extends React__default['default'].Component {
    
    render() {
      return(
        React__default['default'].createElement('div', { className: `${this.props.className} Skeleton`, style: this.props.style, __self: this, __source: {fileName: _jsxFileName$a, lineNumber: 7}}
          , React__default['default'].createElement('div', { className: "SkeletonBackground", __self: this, __source: {fileName: _jsxFileName$a, lineNumber: 8}}
          )
        )
      )
    }
  }

  const _jsxFileName$b = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/DonationDialogSkeleton.jsx";
  class DonationDialogSkeleton extends React__default['default'].Component {

    render() {
      return(
        React__default['default'].createElement('div', { className: "Dialog PaymentDialog" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 9}}
          , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 10}}
            , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$b, lineNumber: 11}})
          )
          , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 13}}
            , React__default['default'].createElement('div', { className: "Payment", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 14}}

              , React__default['default'].createElement('div', { className: "PaymentRow loading ChangePaymentRow"  , key: "loading-row-0", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 16}}
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 17}}
                  , React__default['default'].createElement(Skeleton, {
                    className: "CircularIcon",
                    style: {
                      top: '-0.3rem'
                    }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 18}}
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 25}}
                  , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 26}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 27}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow1", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 35}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.6rem',
                        width: '8rem'
                      }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 36}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow2", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 44}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 45}}
                    )
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 54}}
                  , React__default['default'].createElement(Skeleton, {
                    style: {
                      display: 'inline-block',
                      right: '0.7rem',
                      width: '5rem'
                    }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 55}}
                  )
                )
              )

              , React__default['default'].createElement('div', { className: "PaymentRow loading ChangePaymentRow"  , key: "loading-row-1", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 65}}
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 66}}
                  , React__default['default'].createElement(Skeleton, {
                    className: "CircularIcon",
                    style: {
                      top: '-0.3rem'
                    }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 67}}
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 74}}
                  , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 75}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 76}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow1", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 84}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.6rem',
                        width: '8rem'
                      }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 85}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow2", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 93}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 94}}
                    )
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 103}}
                  , React__default['default'].createElement(Skeleton, {
                    style: {
                      display: 'inline-block',
                      right: '0.7rem',
                      width: '5rem'
                    }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 104}}
                  )
                )
              )

            )

          )
          , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 117}}
            , React__default['default'].createElement(Skeleton, {
              className: "CallToAction",
              style: {
                height: '2.8rem',
                width: '50%'
              }, __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 118}}
            )
            , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 125}}
              , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$b, lineNumber: 126}}, "by DePay"

              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$c = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/DonationDialog.jsx";

  class DonationDialog extends React__default['default'].Component {constructor(...args) { super(...args); DonationDialog.prototype.__init.call(this); }
    __init() {this.state={
      approving: null,
      paying: null,
      payed: false
    };}

    componentWillUnmount() {
      clearInterval(this.approvalCheckInterval);
    }

    paymentType() {
      if(this.props.selected.token.address === this.props.receiverToken.address) {
        return 'transfer';
      } else {
        return 'swap';
      }
    }

    paymentTypeText() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'via transfer';
        case 'swap':
          return 'via ' + Exchanges.findByName(this.props.selected.exchange).name();
      }
    }

    paymentTypeTitle() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'Direct token transfer';
        case 'swap':
          return 'Token swap via ' + this.props.selected.exchange;
      }
    }

    paymentTypeLink() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'https://etherscan.io/token/'+this.props.receiverToken.address;
        case 'swap':
          return Exchanges.findByName(this.props.selected.exchange).linkRoute(this.props.selected);
      }
    }

    approve(dialogContext) {
      new ethers.ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider$1)
        .connect(this.props.wallet.provider().getSigner(0))
        .approve(DePayRouterV1Contract.address, MAXINT)
        .catch(function(){ 
          clearInterval(this.approvalCheckInterval);
          this.setState({ approving: false });
        }.bind(this))
        .then(function(transaction){
          if(transaction) {
            dialogContext.setClosable(false);
            this.setState({ approving: {
              transactionHash: transaction.hash
            } });
            transaction.wait(1).then(function(){
              this.checkApproved(dialogContext);
            }.bind(this));
          } else {
            dialogContext.setClosable(true);
            this.setState({ approving: false });
          }
        }.bind(this));

      this.approvalCheckInterval = setInterval(function(){
        this.checkApproved(dialogContext);
      }.bind(this), 1000);
    }

    checkApproved(dialogContext) {
      new ethers.ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider$1).allowance(this.props.wallet.address(), DePayRouterV1Contract.address).then(function(amount){
        if(amount.gt(ethers.ethers.BigNumber.from(this.props.selected.amounts[0]))) {
          this.props.selected.approved = true;
          dialogContext.setClosable(true);
          this.setState({ approving: false });
          clearInterval(this.approvalCheckInterval);
        }
      }.bind(this));
    }

    generatePaymentUUID() {
      let now = +(new Date());
      return(ethers.ethers.BigNumber.from(this.props.wallet.address()).toString()+''+(now).toString());
    }

    pay(dialogContext, callbackContext) {
      let route;

      route = this.props.selected.route;
      
      // Reduce routes with the same token to direct transfers,
      // as for the smart contract it's not a swap, but a transfer
      if(this.paymentType() === 'transfer') {
        route = [route[0]];
      }

      let amountIn = this.props.selected.amounts[0];
      let amountOut = this.props.selected.amounts[this.props.selected.amounts.length-1];
        
      if(route[0] === ETH) ;

      let deadline = Math.round(new Date().getTime() / 1000) + (24 * 3600); // 24 hours from now

      let value = 0;
      if(route[0] === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') { value = amountIn; }

      let plugins = ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'];
      let exchange = Exchanges.findByName(this.props.selected.exchange);
      if(exchange && this.paymentType() != 'transfer') {
        plugins.unshift(exchange.pluginAddress()); // only add exchange plugin if swap is nessary
      }

      DePayRouterV1Contract.connect(this.props.wallet.provider().getSigner(0)).route(
        route,
        [amountIn, amountOut, deadline],
        [this.props.receiver],
        plugins,
        ([]),
        { value: value }
      )
      .catch(function(){
        console.log("pay catch", arguments);
        this.setState({ paying: false });
      }.bind(this))
      .then(function(transaction){
        if(transaction) {
          this.setState({ paying: {
            transactionHash: transaction.hash
          } });
          dialogContext.setClosable(false);
          transaction.wait(1).then(function(transaction){
            if(transaction.status === 1) {
              dialogContext.setClosable(true);
              this.setState({
                paying: false,
                payed: { transactionHash: transaction.transactionHash }
              });
              setTimeout(function(){
                if(typeof callbackContext.callback === 'function') {
                  callbackContext.callback({tx: transaction.transactionHash});
                }
              }, 1600);
            }
          }.bind(this));
        } else {
          console.log("pay then", arguments);
          dialogContext.setClosable(true);
          this.setState({ paying: false });
        }
      }.bind(this));

          
    }

    navigateIfActionable(navigate, path, dialogContext) {
      if(this.isActionable(dialogContext) === false){ return }
      navigate(path);
    }

    isActionable(dialogContext) {
      return dialogContext.closable === true && this.state.payed === false
    }

    render() {
      if(this.props.initializing) { 
        return(
          React__default['default'].createElement(DonationDialogSkeleton, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 201}})
        ) 
      }

      if(!this.props.selected) {
        return(
          React__default['default'].createElement(NotEnoughFundsDialog, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 207}})
        )
      }

      return (
        React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 212}}
          , dialogContext => (
            React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 214}}
              , navigate => (
                React__default['default'].createElement('div', { className: 'Dialog PaymentDialog ' + (this.isActionable(dialogContext) ? '' : 'unactionable'), __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 216}}
                  , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 217}}
                    , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 218}})
                  )
                  , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 220}}
                    , React__default['default'].createElement('div', { className: "Payment", key:  this.props.receiverToken.address , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 221}}
                      , React__default['default'].createElement('div', { className: "PaymentRow ChangeTokenAmount" , onClick:  ()=> this.navigateIfActionable(navigate, 'ChangeTokenAmount', dialogContext) , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 222}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 223}}
                          , React__default['default'].createElement(TokenIconComponent, {
                            title:  this.props.receiverToken.name ,
                            src:  this.props.receiverToken.logoURI , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 224}}
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 229}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 230}}
                            ,  this.props.action || 'Donation' 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , title: DisplayTokenAmount(this.props.receiverAmount, this.props.receiverToken.decimals, this.props.receiverToken.symbol), __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 233}}
                            ,  DisplayTokenAmount(this.props.receiverAmount, this.props.receiverToken.decimals, this.props.receiverToken.symbol) 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 236}}
                            ,  this.props.receiverToken.name 
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 240}}
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Change amount" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 241}}, "Change"

                          )
                        )
                      )

                      , React__default['default'].createElement('div', { className: "PaymentRow ChangePaymentRow" , onClick:  ()=> this.navigateIfActionable(navigate, 'ChangePaymentToken', dialogContext) , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 247}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 248}}
                          , React__default['default'].createElement(TokenIconComponent, {
                            title:  this.props.selected.token.name ,
                            src:  this.props.selected.token.logoURI , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 249}}
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 254}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 255}}, "Payment"

                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 258}}
                            ,  this.props.paymentContext.token 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 261}}
                            ,  this.props.paymentContext.local 
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 265}}
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Change payment" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 266}}, "Change"

                          )
                        )
                      )

                    )
                  )
                  , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 274}}
                    ,  this.renderCallToAction.bind(this)() 
                    , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 276}}
                      ,  this.renderTransaction.bind(this)() 
                      , this.paymentType() &&
                        React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 279}}
                          , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  this.paymentTypeLink() , className: "PoweredByLink", title:  this.paymentTypeTitle() , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 280}}
                            ,  this.paymentTypeText() 
                          )
                          , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 283}}, " • ")
                        )
                      
                      , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 286}}, "by DePay"

                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    }

    renderTransaction() {
      if((this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash)) {
        let transactionHash = (this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash);
        return(
          React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 303}}
            , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+transactionHash , className: "PoweredByLink", title: "Your transaction" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 304}}, "tx"

            )
            , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 307}}, " • ")
          )
        )
      } else {
        return
      }
    }

    renderCallToAction() {
      if(this.props.selected.approved) {
        return(this.renderPaymentButton())
      } else {
        return(
          React__default['default'].createElement('div', { className: "Table", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 320}}
            , React__default['default'].createElement('div', { className: "TableRow", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 321}}
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 322}}
                ,  this.renderApproveButton() 
              )
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 325}}
                , React__default['default'].createElement('button', { className: "CallToAction MainAction disabled"  , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 326}}
                  , React__default['default'].createElement('span', { className: "CallToActionName", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 327}}, "Pay"), " " , React__default['default'].createElement('span', { className: "CallToActionPrice TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 327}},  this.props.paymentContext.total )
                )
              )
            )
          )
        )
      }
    }

    renderApproveButton() {
      if(this.state.approving) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.approving.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait for the approval transaction to be confirmed by the network. Click to open transaction on etherscan."                 , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 339}}, "Approving"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 341}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 342}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 343}}, ".")
          )
        )
      } else {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 348}}
            , dialogContext => (
              React__default['default'].createElement('button', { key: "approve", className: "CallToAction MainAction" , onClick: ()=>this.approve.bind(this)(dialogContext), title: "Click to approve that the selected token is allowed to be swapped for performing this payment. This approval is only required the first time you pay with the selected token."                             , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 350}}, "Approve"

              )
            )
          )
        )
      }
    }

    renderPaymentButton() {
      if(this.state.payed) {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 362}}
            , dialogContext => (
              React__default['default'].createElement('span', { className: "CallToAction MainAction circular"  , onClick:  dialogContext.closeContainer , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 364}}
                , React__default['default'].createElement(CheckMarkComponent, { className: "large", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 365}})
              )
            )
          )
        )
      } else if(this.state.paying) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.paying.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait payment transaction to be confirmed by the network. Click to open transaction on etherscan."               , __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 372}}, "Paying"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 374}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 375}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 376}}, ".")
          )
        )
      } else {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 381}}
            , dialogContext => (
              React__default['default'].createElement(CallbackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$c, lineNumber: 383}}
                , callbackContext => (
                  React__default['default'].createElement('button', { className: "CallToAction MainAction" , onClick: ()=>this.pay.bind(this)(dialogContext, callbackContext), __self: this, __source: {fileName: _jsxFileName$c, lineNumber: 385}}, "Pay "
                     ,  this.props.paymentContext.total 
                  )
                )
              )
            )
          )
        )
      }
    }

  }

  const _jsxFileName$d = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/GasProvider.jsx";
  class GasProvider extends React__default['default'].Component {constructor(...args) { super(...args); GasProvider.prototype.__init.call(this); }
    __init() {this.state = {
      initializing: false,
      slow: null,
      standard: null,
      fast: null,
      selected: null
    };}

    changeSelected(gas) {
      this.setState({
        selected: gas
      });
    }

    componentDidMount() {
      // this.loadGas().then(function(gas){
      //   this.setState({ 
      //     initializing: false,
      //     selected: parseInt((gas.standard + gas.fast) / 2, 10),
      //     slow: gas.slow,
      //     standard: gas.standard,
      //     fast: gas.fast,
      //   });
      // }.bind(this));

      // this.interval = setInterval(function(){
      //   this.loadGas().then(function(gas){
      //     if(this.equalState(gas)) { return }
      //     this.setState({
      //       slow: gas.slow,
      //       standard: gas.standard,
      //       fast: gas.fast,
      //     });
      //   }.bind(this))
      // }.bind(this), 1000 * 30)
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    loadGas() {
      return new Promise(function(resolve, reject){
        fetch('https://ethgasstation.info/api/ethgasAPI.json').then(function(response){
          response.json().then((data)=>(resolve(this.gasToStandardFormat(data))));
        }.bind(this));
      }.bind(this));
    }

    equalState(gas) {
      return(
        this.state.slow === gas.slow &&
        this.state.standard === gas.standard &&
        this.state.fast === gas.fast
      )
    }

    // convert ethgasstation.info format
    gasToStandardFormat(gas) {
      return({
        slow: parseInt(gas.safeLow/10, 10),
        standard: parseInt(gas.average/10, 10),
        fast: parseInt(gas.fast/10, 10)
      })
    }

    render() {
      return(
        React__default['default'].createElement(GasContext.Provider, { value: {
          initializing: this.state.initializing,
          slow: this.state.slow,
          standard: this.state.standard,
          fast: this.state.fast,
          selected: this.state.selected,
          change: this.changeSelected.bind(this)
        }, __self: this, __source: {fileName: _jsxFileName$d, lineNumber: 73}}
          , this.props.children
        )
      )
    }
  }

  var PaymentContext = React__default['default'].createContext();

  const _jsxFileName$e = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/PaymentProvider.jsx";
  class PaymentProvider extends React__default['default'].Component {constructor(...args) { super(...args); PaymentProvider.prototype.__init.call(this); }
    __init() {this.state = {};}

    paymentInETH() {
      if(this.props.route.amounts.length <= 2) {
        if(this.props.route.token.symbol === 'ETH') {
          return ethers.ethers.utils.formatEther(this.props.route.amounts[0]);
        } else {
          return ethers.ethers.utils.formatEther(this.props.route.amounts[1]);
        }
      } else {
        return ethers.ethers.utils.formatEther(this.props.route.amounts[1]);
      }
    }

    local() {
      return LocalCurrency(this.paymentInETH() * this.props.price);
    }

    token() {
      return DisplayTokenAmount(this.props.route.amounts[0], this.props.route.token.decimals, this.props.route.token.symbol);
    }

    feeInETH() {
      if(this.props.gas == undefined) { return }
      return parseFloat(ethers.ethers.utils.formatUnits(this.props.gas, 'gwei')) * this.props.route.fee;
    }

    feeLocal() {
      return LocalCurrency(this.feeInETH() * this.props.price);
    }

    feeToken() {
      return DisplayTokenAmount(this.feeInETH(), 0, 'ETH')
    }

    total() {
      return LocalCurrency((parseFloat(this.paymentInETH())) * this.props.price);
    }

    render() {
      if(!this.props.route) { return(React__default['default'].createElement('div', {__self: this, __source: {fileName: _jsxFileName$e, lineNumber: 48}}, this.props.children)) }
      return(
        React__default['default'].createElement(PaymentContext.Provider, { value: {
          local: this.local(),
          token: this.token(),
          feeInETH: this.feeInETH(),
          feeLocal: this.feeLocal(),
          feeToken: this.feeToken(),
          total: this.total()
        }, __self: this, __source: {fileName: _jsxFileName$e, lineNumber: 50}}
          , this.props.children
        )
      )
    }
  }

  var PriceContext = React__default['default'].createContext();

  var EthUsdPriceAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_aggregator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_accessController",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "int256",
          "name": "current",
          "type": "int256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        }
      ],
      "name": "AnswerUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "startedBy",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        }
      ],
      "name": "NewRound",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "acceptOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "accessController",
      "outputs": [
        {
          "internalType": "contract AccessControllerInterface",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "aggregator",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_aggregator",
          "type": "address"
        }
      ],
      "name": "confirmAggregator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "description",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_roundId",
          "type": "uint256"
        }
      ],
      "name": "getAnswer",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint80",
          "name": "_roundId",
          "type": "uint80"
        }
      ],
      "name": "getRoundData",
      "outputs": [
        {
          "internalType": "uint80",
          "name": "roundId",
          "type": "uint80"
        },
        {
          "internalType": "int256",
          "name": "answer",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint80",
          "name": "answeredInRound",
          "type": "uint80"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_roundId",
          "type": "uint256"
        }
      ],
      "name": "getTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestAnswer",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestRound",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestRoundData",
      "outputs": [
        {
          "internalType": "uint80",
          "name": "roundId",
          "type": "uint80"
        },
        {
          "internalType": "int256",
          "name": "answer",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint80",
          "name": "answeredInRound",
          "type": "uint80"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "name": "phaseAggregators",
      "outputs": [
        {
          "internalType": "contract AggregatorV2V3Interface",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "phaseId",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_aggregator",
          "type": "address"
        }
      ],
      "name": "proposeAggregator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proposedAggregator",
      "outputs": [
        {
          "internalType": "contract AggregatorV2V3Interface",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint80",
          "name": "_roundId",
          "type": "uint80"
        }
      ],
      "name": "proposedGetRoundData",
      "outputs": [
        {
          "internalType": "uint80",
          "name": "roundId",
          "type": "uint80"
        },
        {
          "internalType": "int256",
          "name": "answer",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint80",
          "name": "answeredInRound",
          "type": "uint80"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proposedLatestRoundData",
      "outputs": [
        {
          "internalType": "uint80",
          "name": "roundId",
          "type": "uint80"
        },
        {
          "internalType": "int256",
          "name": "answer",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint80",
          "name": "answeredInRound",
          "type": "uint80"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_accessController",
          "type": "address"
        }
      ],
      "name": "setController",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "version",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const _jsxFileName$f = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/PriceProvider.jsx";
  class PriceProvider extends React__default['default'].Component {constructor(...args) { super(...args); PriceProvider.prototype.__init.call(this); }
    __init() {this.state = {
      initializing: true,
      price: null
    };}

    componentDidMount() {
      this.loadPrice().then(function(price){
        this.setState({
          initializing: false,
          price
        });
      }.bind(this));

      this.interval = setInterval(function(){
        this.loadPrice().then(function(price){
          let diff = Math.abs(this.state.price - price) / this.state.price;
          // only update if price is half a percent difference
          if(diff > 0.005) {
            this.setState({ price });
          }
        }.bind(this));
      }.bind(this), 1000 * 30);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    loadPrice() {
      return new Promise(function(resolve, reject){
        // Chainlink ETH/USDT oracle contract
        new ethers.ethers.Contract(
          '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
          EthUsdPriceAbi,
          EthersProvider$1
        ).latestAnswer().then(function(price){
          // USDT has 6 decimals
          resolve(price.toNumber()/100000000);
        });
      })
    }

    render() {
      return(
        React__default['default'].createElement(PriceContext.Provider, { value: {
          initializing: this.state.initializing,
          price: this.state.price
        }, __self: this, __source: {fileName: _jsxFileName$f, lineNumber: 52}}
          , this.props.children
        )
      )
    }
  }

  var RoutesContext = React__default['default'].createContext();

  const _jsxFileName$g = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/RoutesProvider.jsx";

  class RoutesProvider extends React__default['default'].Component {constructor(...args) { super(...args); RoutesProvider.prototype.__init.call(this); }
    __init() {this.state = {
      initializing: true,
      routes: null,
      selected: null
    };}

    changeSelected(index) {
      this.setState({
        selected: this.state.routes[index]
      });
    }

    componentDidUpdate(prevProps) {
      if(prevProps.amount !== this.props.amount) {
        this.setState({ initializing: true });
        this.computeRoutes();
      }
    }

    componentDidMount() {
      this.setState({ initializing: true });
      this.computeRoutes();
    }

    computeRoutes() {
      this.getAllTokenRoutes()
        .then(this.unshiftETHRoute.bind(this))
        .then(this.findBestRoutesAndRequiredAmounts.bind(this))
        .then(this.filterRoutesWithEnoughBalance.bind(this))
        .then(this.addApprovalStatus.bind(this))
        .then(this.sortRoutes.bind(this))
        .then(this.addMaxAmounts.bind(this))
        .then(function(routes){
          this.setState({selected: routes[0]}, function(){
            // set selected first to prevent flickering "Not enough funds"
            this.setState({
              initializing: false,
              routes
            });
          }); 
          return routes;
        }.bind(this));
    }

    addMaxAmounts(routes){
      if(this.props.addMaxAmounts === true) {
        return Exchanges.routesWithMaxAmounts(routes);
      } else {
        return Promise.resolve(routes);
      }
    }

    addApprovalStatus(routes) {
      return Promise.all(
        routes.map(function(route){
          if(route.token.address === ETH) {
            route.approved = true;
            return Promise.resolve(route);
          } else {
            return new ethers.ethers.Contract(route.token.address, Erc20Abi, EthersProvider$1)
            .allowance(this.props.wallet.address(), DePayRouterV1Contract.address)
            .then(function(amount){
              if(amount.gt(ethers.ethers.BigNumber.from(route.amounts[0]))) {
                route.approved = true;
              } else {
                route.approved = false;
              }
              return route;
            });
          }
        }.bind(this))
      )
    }

    findBestRoutesAndRequiredAmounts(routes) {
      return Exchanges
        .findBestRoutesAndRequiredAmountsForEndToken(
          routes,
          this.props.token,
          this.props.amount
        ).then(function(routes){

          var directTransfer = routes.find(function(route){
            return route.token.address === route.route[route.route.length-1];
          });

          if(directTransfer) {
            // set input amount == output amount as direct transfer is not swapped
            directTransfer.amounts[0] = directTransfer.amounts[directTransfer.amounts.length-1];
          }

          return routes;
        })
    }

    getAllTokenRoutes() {
      return new Promise(function(resolve, reject){
        fetch(`https://depay.fi/api/payment/${this.props.address}`).then(function(response){
          response.json().then(function(tokens) {
            this.filterTokensWithAnyBalance(tokens)
            .then(this.excludeTokens.bind(this))
            .then(this.convertTokensToRoutes.bind(this))
            .then(resolve);
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }

    filterTokensWithAnyBalance(tokens){
      return new Promise(function(resolve, reject){
        resolve(
          tokens.filter(function(token){
            return token.balance > 0
          })
        );
      });
    }

    excludeTokens(tokens){
      return new Promise(function(resolve, reject){
        if(this.props.exclude === undefined) {
          resolve(tokens);
        } else {
          resolve(
            tokens.filter(function(token){
              return token.address.toLowerCase() !== this.props.exclude.toLowerCase()
            }.bind(this))
          );
        }
      }.bind(this));
    }

    filterRoutesWithEnoughBalance(routes) {
      return new Promise(function(resolve, reject){
        resolve(
          routes.filter(function(route){
            return parseFloat(route.balance) >= parseFloat(route.amounts[0])
          })
        );
      });
    }

    convertTokensToRoutes(tokens) {
      return(
        tokens.map(function(token){
          const address = ethers.ethers.utils.getAddress(token.address);
          const transfer = (address === this.props.token);
          const fee = transfer ? 75000 : 155000;
          let route;
          if(transfer) { 
            route = [];
          } else if (this.props.token === ETH) {
            route = [address, ETH];
          } else {
            route = [address, this.props.token];
          }
          return {
            token: {
              name: token.name,
              address: address,
              symbol: token.symbol,
              decimals: parseInt(token.decimals, 10),
              logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/'+address+'/logo.png'
            },
            route: route,
            amounts: [],
            balance: token.balance.toLocaleString('fullwide', {useGrouping:false}),
            fee: fee,
            approved: null
          }
        }.bind(this))
      )
    }

    unshiftETHRoute(routes) {
      return new Promise(function(resolve, reject){
        const transfer = this.props.token === 'ETH';
        // fee for transfer or swap
        const fee = transfer ? 21000 : 155000;

        this.props.wallet.balance().then(function(balance){
          let route = {
            token: {
              name: 'Ether',
              address: ETH,
              symbol: 'ETH',
              decimals: 18,
              logoURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC'
            },
            route: [],
            amounts: [],
            balance: balance.toString(),
            fee: fee,
            approved: true
          };

          resolve([route].concat(routes));
        }.bind(this));
      }.bind(this));
    }

    sortRoutes(routes) {
      return Promise.resolve(routes.sort(function(a, b){
        if (a.fee > b.fee) {
          return 1;
        }
        if (b.fee > a.fee) {
          return -1;
        }
        return 0; // equal
      }));
    }

    render() {
      return(
        React__default['default'].createElement(RoutesContext.Provider, { value: {
          initializing: this.state.initializing,
          routes: this.state.routes,
          selected: this.state.selected,
          change: this.changeSelected.bind(this),
        }, __self: this, __source: {fileName: _jsxFileName$g, lineNumber: 227}}
          , this.props.children
        )
      )
    }
  }

  const _jsxFileName$h = "/Users/sebastian/Work/DePay/depay-widgets/src/utils/Stack.jsx";
  class Stack extends React__default['default'].Component {
    __init() {this.state = {
      stack: [],
      animating: false,
      animation: null,
      direction: 'forward',
    };}

    __init2() {this.animationSpeed = 200;}

    constructor(props) {
      super(props);Stack.prototype.__init.call(this);Stack.prototype.__init2.call(this);    Object.assign(this.state, {
        stack: [props.start]
      });
    }

    navigate(route) {
      if(this.state.stack.indexOf(route) > -1) { return }
      if(route === 'back') { return this.unstack() }

      this.setState({
        stack: this.state.stack.concat(route),
        animating: true,
        direction: 'forward',
        animation: setTimeout(function(){
          this.setState({
            animating: false
          });
        }.bind(this), this.animationSpeed)
      });

    }

    unstack() {
      if(this.state.stack.length <= 1) { return }

      let newStack = [...this.state.stack];
      newStack.pop();
      
      this.setState({
        animating: true,
        direction: 'backward',
        animation: setTimeout(function(){
          this.setState({
            stack: newStack,
            animating: false
          });
        }.bind(this), this.animationSpeed)
      });
    }

    onClickBackground(event, closeContainer) {
      if(
        event.target instanceof HTMLElement &&
        event.target.className.match('StackedDialogCell')
      ) {
        if(this.state.stack.length > 1) {
          this.unstack();
        } else {
          closeContainer();
        }
      }
    }

    classForDialogState(index){
      if(this.state.animating) { return }
      if(this.state.stack.length === 1) {
        return 'active';
      } else {
        if(this.state.stack.length === index+1) {
          return 'active';
        } else {
          return 'inactive';
        }
      }
    }

    classForDialogPosition(index) {
      if(this.state.stack.length > 1) {
        if(this.state.stack.length === index+1) {
          if(this.state.direction === 'forward') {
            return 'next';
          } else {
            return 'previous';
          }
        } else if (this.state.stack.length-1 === index+1) {
          if(this.state.direction === 'forward') {
            return 'previous';
          } else {
            return 'next';
          }
        } else {
          return 'stale';
        }
      }
    }

    classForAnimating() {
      if(this.state.animating) {
        return 'animating';
      }
    }

    classForDirection() {
      return this.state.direction;
    }

    renderStackedDialogs(closeContainer) {
      return this.state.stack.map(function(route, index){
        let stackState = [];
        stackState.push(this.classForDialogState(index));
        stackState.push(this.classForDialogPosition(index));
        stackState.push(this.classForAnimating());
        stackState.push(this.classForDirection());
        return(
          React__default['default'].createElement('div', { key: index, className: ['StackedDialog'].concat(stackState).join(' '), __self: this, __source: {fileName: _jsxFileName$h, lineNumber: 121}}
            , React__default['default'].createElement('div', { className: "StackedDialogRow", __self: this, __source: {fileName: _jsxFileName$h, lineNumber: 122}}
              , React__default['default'].createElement('div', { className: "StackedDialogCell", onClick: (event)=> this.onClickBackground(event, closeContainer), __self: this, __source: {fileName: _jsxFileName$h, lineNumber: 123}}
                , React__default['default'].createElement(NavigateStackContext.Provider, { value: this.navigate.bind(this), __self: this, __source: {fileName: _jsxFileName$h, lineNumber: 124}}
                  ,  this.props.dialogs[route] 
                )
              )
            )
          )
        )
      }.bind(this));
    }

    render() {
      return (
        React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$h, lineNumber: 136}}
        , dialogContext => (
          React__default['default'].createElement('div', {__self: this, __source: {fileName: _jsxFileName$h, lineNumber: 138}}
            ,  this.renderStackedDialogs(dialogContext.closeContainer) 
          )
        )
        )
      );
    }
  }

  var TokenContext = React__default['default'].createContext();

  function ImportToken(address){
    address = ethers.ethers.utils.getAddress(address);
    return new Promise(function(resolve, reject) {
      if(address === ETH) {
        resolve({
          "name": "Ether",
          "symbol": "ETH",
          "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          "decimals": 18,
          "chainId": 1,
          "logoURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC"
        });
      } else {
        const contract = new ethers.ethers.Contract(address, Erc20Abi, EthersProvider$1);
        Promise.all([contract.name(), contract.symbol(), contract.decimals()]).then(function(values){
          resolve({
            name: values[0],
            address: address,
            decimals: values[2],
            symbol: values[1],
            logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/"+address+"/logo.png"
          });
        }).catch(reject);
      }
    })
  }

  const _jsxFileName$i = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/TokenProvider.jsx";
  class TokenProvider extends React__default['default'].Component {
    __init() {this.state = {
      initializing: true,
      token: null
    };}

    constructor(props) {
      super(props);TokenProvider.prototype.__init.call(this);    var address = typeof(this.props.token) === 'object' ? this.props.token.address : this.props.token;
      Object.assign(this.state, {
        token: { address: address },
      });
    }

    componentDidMount() {
      ImportToken(this.state.token.address).then(function(token){
        if(typeof(this.props.token) === 'object') {
          Object.assign(token, {logoURI: this.props.token.image});
        }
        this.setState({
          token: token,
          initializing: false
        });
      }.bind(this));    
    }

    render() {
      return(
        React__default['default'].createElement(TokenContext.Provider, { value: {
          initializing: this.state.initializing,
          token: this.state.token
        }, __self: this, __source: {fileName: _jsxFileName$i, lineNumber: 33}}
          ,  this.props.children 
        )
      )
    }
  }

  var WalletContext = React__default['default'].createContext();

  const _jsxFileName$j = "/Users/sebastian/Work/DePay/depay-widgets/src/stacks/DonationStack.jsx";
  class DonationStack extends React__default['default'].Component {
    __init() {this.state = {
      amount: null,
      token: null,
      receiver: null
    };}

    constructor(props) {
      super(props);DonationStack.prototype.__init.call(this);    Object.assign(this.state, {
        amount: props.amount,
        token: props.token,
        receiver: props.receiver
      });
    }

    render() {
      return (
        React__default['default'].createElement(GasProvider, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 39}}
          , React__default['default'].createElement(GasContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 40}}
            , gasContext => (
              React__default['default'].createElement(PriceProvider, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 42}}
                , React__default['default'].createElement(PriceContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 43}}
                  , priceContext => (
                    React__default['default'].createElement(TokenProvider, {
                      token:  this.state.token , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 45}}
                    
                      , React__default['default'].createElement(TokenContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 48}}
                        , tokenContext => (
                          React__default['default'].createElement(AmountProvider, {
                            amount:  this.state.amount ,
                            token:  tokenContext.token , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 50}}
                          
                            , React__default['default'].createElement(AmountContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 54}}
                              , amountContext => (
                                React__default['default'].createElement(WalletContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 56}}
                                  , walletContext => (
                                    React__default['default'].createElement(RoutesProvider, {
                                      token:  tokenContext.token.address ,
                                      amount:  amountContext.amount ,
                                      address:  walletContext.address ,
                                      wallet:  walletContext.wallet ,
                                      addMaxAmounts:  true , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 58}}
                                    
                                      , React__default['default'].createElement(RoutesContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 65}}
                                        , routesContext => (
                                          React__default['default'].createElement(PaymentProvider, {
                                            route:  routesContext.selected ,
                                            gas:  gasContext.selected ,
                                            price:  priceContext.price ,
                                            amount:  amountContext.amount , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 67}}
                                          
                                            , React__default['default'].createElement(PaymentContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$j, lineNumber: 73}}
                                              , paymentContext => (
                                                React__default['default'].createElement(Stack, {
                                                  dialogs: {
                                                    Donation: React__default['default'].createElement(DonationDialog, {
                                                      selected:  routesContext.selected ,
                                                      initializing:  priceContext.initializing || routesContext.initializing || gasContext.initializing ,
                                                      receiverToken:  tokenContext.token ,
                                                      receiverAmount:  amountContext.amount ,
                                                      paymentContext:  paymentContext ,
                                                      receiver:  this.state.receiver ,
                                                      wallet:  walletContext.wallet , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 77}}
                                                    ),
                                                    ChangeTokenAmount: React__default['default'].createElement(ChangeTokenAmountDialog, {
                                                      token:  tokenContext.token ,
                                                      amount:  amountContext.amount ,
                                                      amountOptions:  this.props.amount ,
                                                      change:  amountContext.change ,
                                                      routes:  routesContext.routes , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 86}}
                                                    ),
                                                    ChangePaymentToken: React__default['default'].createElement(ChangePaymentTokenDialog, {
                                                      routes:  routesContext.routes ,
                                                      change:  routesContext.change ,
                                                      paymentContext:  paymentContext , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 93}}
                                                    ),
                                                    ChangeNetworkFee: React__default['default'].createElement(ChangeNetworkFeeDialog, {
                                                      selected:  routesContext.selected ,
                                                      price:  priceContext.price ,
                                                      gasContext:  gasContext ,
                                                      paymentContext:  paymentContext , __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 98}}
                                                    )
                                                  },
                                                  start: 'Donation', __self: this, __source: {fileName: _jsxFileName$j, lineNumber: 75}}
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }

  function CallToActionCSS(style){
    return `
    .CallToAction {
      background: `+style.colors.primary+`;
      border-radius: 999rem;
      border: 1px solid transparent;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      color: white;
      display: inline-block;
      font-weight: 400;
      text-decoration: none;
      transition: background 0.1s;
    }

    .CallToAction:not(.disabled){
      cursor: pointer;
    }

    .CallToAction:not(.disabled):hover {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.1);
    }

    .CallToAction:not(.disabled):active {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);
    }
  `; 
  }

  function CardCSS(){
    return `
    
    .Card.information {
      background: #f8f9e2;
      border-radius: 1rem;
      border: 1px solid transparent;
      font-size: 68%;
      padding: 0.6rem 1rem;
      text-align: justify;
      color: rgb(80,80,80);
    }
  `;
  }

  function ChangeNetworkFeeDialogCSS(){
    return `
  
    .NetworkFeeButton {
      background: rgb(250,250,250);
      border-right: 3px solid white;
      cursor: pointer;
      border-radius: 1rem;
      width: 100%;
      height: 100%;
    }

    .TableCell:last-child .NetworkFeeButton {
      border-right: 0;
    }

    .NetworkFeeButton:hover {
      background: rgb(248,243,245);
    }

    .NetworkFeeButton:active {
      background: rgb(241,232,235);
    }

  `;
  }

  function CircularButtonCSS(){
    return `

    .CircularButton {
      border-radius: 99rem;
      cursor: pointer;
      height: 2.4rem;
      opacity: 0.35;
      padding: 0.45rem 0.4rem 0.4rem 0.45rem;
      width: 2.4rem;
    }

    .CircularButton:hover {
      background: rgba(0,0,0,0.1);
      opacity: 1;
    }

    .CircularButton:active {
      background: rgba(0,0,0,0.25);
      opacity: 1;
    }
  `;
  }

  function CircularIconCSS(style){
    return `

    .CircularIcon {
      background: white;
      border-radius: 99rem;
      border: 1px solid transparent;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      height: 2rem;
      position: relative;
      vertical-align: middle;
      width: 2rem;
    }

    .CircularIcon.large {
      height: 4rem;
      width: 4rem;
    }

    .CircularIcon.small {
      height: 1.4rem;
      width: 1.4rem;
    }

    .CircularIcon.tiny {
      height: 1rem;
      width: 1rem;
      box-shadow: 0 0px 4px rgba(0,0,0,0.1);
    }

    .CircularIcon.noshadow{
      box-shadow: none;
    }

    .CircularIcon.notfound {
      background: `+style.colors.primary+`;
    }
  `;
  }

  function DialogCSS(){
    return `

    .Dialog {
      margin: 0 auto;
      max-width: 26rem;
      position: relative;
      width: 100%;
    }

    .DialogBody {
      background: white;
      height: 40vh;
      overflow-y: auto;
      overflow-x: hidden;
      border-top: 1px solid rgb(238,238,238);
      border-bottom: 1px solid rgb(238,238,238);
    }

    .DialogBody.HeightAuto {
      height: auto;
    }

    .DialogHeader {
      padding: 1.1rem 1.8rem 1.2rem 1.8rem;
      background: rgb(248,248,248);
      position: relative;
      min-height: 4rem;
      border-top-left-radius: 1.6rem;
      border-top-right-radius: 1.6rem;
    }

    .DialogFooter {
      background: rgb(248,248,248);
      border-bottom-left-radius: 1.6rem;
      border-bottom-right-radius: 1.6rem;
      border-top: 1px solid rgb(255,255,255);
      padding: 0.6rem 1.8rem 0.8rem 1.8rem;
      position: relative;
      text-align: center;
    }

    .DialogCloseButton {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    
    .DialogGoBackButton {
      position: absolute;
      top: 1rem;
      left: 0.9rem;
    }
  `;
  }

  function FontsCSS(){
    return `
    * {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
    }

    .InsideContainerTable {
      font-size: 110%;
    }
  `;
  }

  function IconCSS(){
    return `

    .Icon {
      height: 20px;
      position: relative;
      top: -1px;
      vertical-align: middle;
      width: 20px;
    }

    .Icon.large {
      height: 24px;
      width: 24px;
      top: 0px;
    }

    .Icon.grey * {
      fill: rgb(210,210,210);
      stroke: rgb(210,210,210);
    }

    .Icon.white path {
      fill: white;
      stroke: white;
    }

    .Icon.translucent {
      opacity: 0.6;
    }

    .Icon.translucent:hover {
      opacity: 1.0;
    }

  `;
  }

  function InputCSS(){
    return `
    .Input {
      background: none;
      border: 1px solid transparent;
      margin: 0;
      outline: none !important;
      padding: 0;
      width: 100%;
    }

    .Input::placeholder {
      color: rgb(210,210,210);
    }
  `;
  }

  function InsideContainerCSS(){
    return `
    .InsideContainerTable {
      bottom: 0;
      display: table;
      height: 100%;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      user-select: none;
    }

    .InsideContainerRow {
      display: table-row;
      height: 100%;
      width: 100%;
    }

    .InsideContainerCell {
      display: table-cell;
      height: 100%;
      width: 100%;
      vertical-align: middle;
    }
  `;
  }

  function LabelCSS(style){
    return `

    .Label.highlight {
      background: rgba(40,40,40,0.05);
      color: `+style.colors.primary+`;
      border-radius: 20rem;
      border: 1px solid rgb(210,210,210);
      display: inline-block;
      font-size: 80%;
      padding: 0.1rem 0.6rem 0.15rem;
    }

    .Label.small {
      font-size: 70%;
      padding: 0.1rem 0.5rem 0.15rem;
    }
  `;
  }

  function LoadingDotsCSS(){
    return `

    @keyframes blink {
      0% { opacity: .2; }
      20% { opacity: 1; }
      100% { opacity: .2; }
    }

    .loading .dot {
      animation-name: blink;
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
    }

    .loading .dot:nth-child(2) {
      animation-delay: .2s;
    }

    .loading .dot:nth-child(3) {
      animation-delay: .4s;
    }

  `;
  }

  function MainActionCSS(){
    return `

    .MainAction {
      font-size: 1.35rem;
      letter-spacing: 0px;
      padding: 0.6rem 1.4rem;
      line-height: 2.0rem;
    }

    .MainAction.circular {
      padding: 0;
      width: 3.4rem;
      height: 3.4rem;
      line-height: 3.2rem;
    }

    .Table .MainAction {
      white-space: nowrap;
      width: 100%;
      display: block;
      padding-left: 0.4rem;
      padding-right: 0.4rem;
    }

    .MainAction.disabled {
      background: rgb(210,210,210);
    }
  `;
  }

  function PaddingCSS(){
    return `

    .PaddingLarge {
      padding: 4rem;
    }

    .PaddingTopLarge {
      padding-top: 4rem;
    }

    .PaddingRightLarge {
      padding-right: 4rem;
    }

    .PaddingBottomLarge {
      padding-bottom: 4rem;
    }

    .PaddingLeftLarge {
      padding-left: 4rem;
    }

    .PaddingMedium {
      padding: 2rem;
    }

    .PaddingTopMedium {
      padding-top: 2rem;
    }

    .PaddingRightMedium {
      padding-right: 2rem;
    }

    .PaddingBottomMedium {
      padding-bottom: 2rem;
    }

    .PaddingLeftMedium {
      padding-left: 2rem;
    }

    .PaddingSmall {
      padding: 1rem;
    }

    .PaddingTopSmall {
      padding-top: 1rem;
    }

    .PaddingRightSmall {
      padding-right: 1rem;
    }

    .PaddingBottomSmall {
      padding-bottom: 1rem;
    }

    .PaddingLeftSmall {
      padding-left: 1rem;
    }

    .PaddingTiny {
      padding: 0.3rem;
    }

    .PaddingTopTiny {
      padding-top: 0.3rem;
    }

    .PaddingRightTiny {
      padding-right: 0.3rem;
    }

    .PaddingBottomTiny {
      padding-bottom: 0.3rem;
    }

    .PaddingLeftTiny {
      padding-left: 0.3rem;
    }

    .PaddingNone {
      padding: 0;
    }

    .PaddingTopNone {
      padding-top: 0;
    }

    .PaddingRightNone {
      padding-right: 0;
    }

    .PaddingBottomNone {
      padding-bottom: 0;
    }

    .PaddingLeftNone {
      padding-left: 0;
    }
  `;
  }

  function PaymentCSS(style){
    return `
    .Payment {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .PaymentRow {
      display: table-row;
    }

    .PaymentRow:not(.loading) {
      cursor: pointer;
    }

    .Dialog.unactionable .PaymentRow {
      cursor: default;
    }

    .Dialog:not(.unactionable) .PaymentRow:not(.loading):hover {
      background: rgb(248,243,245);
    }

    .Dialog:not(.unactionable) .PaymentRow:not(.loading):active {
      background: rgb(241,232,235);
    }

    .PaymentColumn {
      border-bottom: 1px solid rgb(246,246,246);
      display: table-cell;
      position: relative;
      vertical-align: middle;
      padding-top: 1.4rem;
      padding-bottom: 1.6rem;
    }

    .PaymentColumn1 {
      width: 20%;
      padding: 1rem;
      text-align: center;
    }

    .PaymentColumn2 {
      width: 52%;
    }

    .PaymentColumn3 {
      text-align: right;
      padding-right: 0.9rem;
      width: 28%;
    }

    .PaymentAmountRow1 {
      font-size: 140%;
      line-height: 2rem;
      position: relative;
    }

    .PaymentAmountRow2, .PaymentDescription {
      color: rgb(110,110,110);
      font-size: 90%;
    }

    .PaymentAmountRow1, .PaymentAmountRow2, .PaymentAmountRow3, .PaymentDescription {
      text-align: left;
      display: block;
    }

    .PaymentAction {
      color: `+style.colors.primary+`;
      padding: 0.3rem 0.8rem;
      border: 1px solid transparent;
      border-radius: 99rem;
    }

    .PaymentAction:not(.disabled){
      cursor: pointer;
    }

    .PaymentAction:hover {
      background: rgba(0,0,0,0.03);
    }
    
    .PaymentAction:active {
      background: rgba(0,0,0,0.08);
    }

    .PaymentDialog.unactionable .PaymentAction {
      display: none;
    }

    .ChangeNetworkFeeRow .PaymentAmountRow1 {
      font-size: 130%;
      line-height: 1.8rem;
    }
  `;
  }

  function PaymentDialogCSS(){
    return `

    .PaymentDialog {
      top: -2rem;
    }
  `;
  }

  function PoweredByCSS(){
    return `
    .PoweredBy {
      text-align: center;
      margin-bottom: -0.6rem;
    }
    
    .PoweredByLink {
      color: rgba(0,0,0,0.2);
      font-size: 80%;
      text-decoration: none;
    }

    a.PoweredByLink:hover {
      color: #cc2c65;
    }

    a.PoweredByLink:active {
      color: #c12a5f;
    }
  `;
  }

  function RangeSliderCSS(style){
    return `

    .rangeslider {
      margin: 20px 0;
      position: relative;
      background: #e6e6e6;
      -ms-touch-action: none;
      touch-action: none;
    }

    .rangeslider,
    .rangeslider__fill {
      display: block;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .rangeslider__handle {
      outline: none;
      cursor: pointer;
      display: inline-block;
      position: absolute;
      border-radius: 50%;
      background-color: `+style.colors.primary+`;
      border: 1px solid white;
      box-shadow: 0 0 8px rgba(0,0,0,0.1);
    }

    .rangeslider__handle:hover {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);
    }

    .rangeslider__handle:active {
      box-shadow: inset 0 0 300px rgba(0,0,0,0.3);
    }

    .rangeslider__active {
      opacity: 1;
    }

    .rangeslider__handle-tooltip {
      display: none;
    }

    .rangeslider-horizontal {
      height: 12px;
      border-radius: 10px;
    }

    .rangeslider-horizontal .rangeslider__fill {
      height: 100%;
      background-color: `+style.colors.primary+`;
      border-radius: 10px;
      top: 0;
    }

    .rangeslider-horizontal .rangeslider__handle {
      width: 18px;
      height: 18px;
      border-radius: 30px;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }

    .rangeslider-horizontal .rangeslider__handle-tooltip {
      top: -55px;
    }
  `;
  }

  function SearchCSS(){
    return `
    .Search {
      border-radius: 1rem;
      font-size: 1.2rem;
      font-weight: 300;
      padding: 1rem 1rem;
      margin-top: 1rem;
      width: 100%;
      border: 1px solid rgb(230,230,230);
      outline: none !important;
    }

    .Search:focus {
      border: 1px solid #c7537a;
    }
  `;
  }

  function SkeletonCSS(){
    return `

    .Skeleton {
      background: rgb(230,230,230) !important;
      border-radius: 99rem;
      border: 1px solid transparent;
      box-shadow: none !important;
      display: inline-block;
      height: 1rem;
      overflow: hidden;
      position: relative;
      width: 100%;
    }

    @keyframes SkeletonBackgroundAnimation {
        from {
            left: -20vw;
        }
        to   {
            left: +20vw;
        }
    }

    .SkeletonBackground {
      animation: SkeletonBackgroundAnimation 2.5s ease infinite;
      background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
      position: absolute;
      width: 200px;
      height: 100%;
    }
  `;
  }

  function StackedDialogCSS(){
    return `

    .StackedDialog {
      bottom: 0;
      display: table;
      height: 100%;
      position: absolute;
      top: 0;
      transition: left 0.1s ease, opacity 0.2s ease;
      width: 100%;
    }

    .StackedDialogRow {
      display: table-row;
    }

    .StackedDialogCell {
      display: table-cell;
      vertical-align: middle;
      padding: 0 0.6rem;
    }

    .StackedDialog {
      left: 0;
      opacity: 1;
    }

    .StackedDialog.inactive {
      display: none;
    }

    .StackedDialog.animating.stale {
      display: none;
    }

    .StackedDialog.animating.previous.forward {
      opacity: 0;
      left: -5rem;
    }

    .StackedDialog.animating.previous.backward {
      opacity: 0;
      left: 5rem;
    }

    .StackedDialog.animating.next.forward {
      opacity: 0;
      left: 5rem;
    }

    .StackedDialog.animating.next.backward {
      opacity: 0;
      left: -5rem;
    }
  `;
  }

  function SwapDialogCSS(){
    return `

    .SwapDialog .PaymentRow {
      background: transparent !important;
      cursor: auto !important;
    }

    .SwapDialog .PaymentColumn {
      border-bottom: 1px solid transparent !important;
    }

    .SwapDialog .FromRow .PaymentColumn2 {
      width: 40%;
    }

    .SwapDialog .FromRow .PaymentColumn3 {
      width: 40%;
    }

    .SwapDialog .ExchangeRow {
      position: absolute;
      width: 100%;
      z-index: 999;
    }

    .SwapDialog .SwapInputs {
      cursor: pointer;
      height: 1.8rem;
      padding-top: 0.6rem;
      position: relative;
      top: -0.9rem;
    }

    .SwapDialog .SwapInputs:hover svg * {
      fill: #c7537a;
      stroke: #c7537a;
    }

    .SwapDialog .SwapInputs:active svg * {
      fill: rgb(190,190,190);
      stroke: rgb(190,190,190);
    }
  `;
  }

  function TableCSS(){
    return `

    .Table {
      display: table;
      table-layout: fixed;
      width: 100%;
    }

    .TableRow {
      display: table-row;
      width: 100%;
    }

    .TableCell {
      display: table-cell;
      width: 100%;
    }

    .Table .CallToActionName {
      display: none;
    }

    .Table .TableCell:first-child {
      padding-right: 3px;
    }

    .Table .TableCell:last-child {
      padding-left: 3px;
    }
  `;
  }

  function TextButtonCSS(){
    return `

    .TextButton {
      border: none;
      background: none;
      color: #c7537a;
      cursor: pointer;
      font-size: 100%;
      padding: 1rem;
      outline: none;
      border-radius: 4rem;
      border: 1px solid transparent;
    }

    .TextButton:hover {
      background: rgb(248,243,245);
    }

    .TextButton:active {
      background: rgb(241,232,235);
    }
  `;
  }

  function TipCSS(style){
    return `

    .TipContainer {
      position: relative;
      z-index: 999;
    }

    .Tip {
      background: `+style.colors.primary+`;
      margin-top: 0.4rem;
      font-size: 1.2rem;
      padding: 0.7rem 2.8rem 0.8rem 1.15rem;
      position: absolute;
      border-radius: 1.3rem;
      box-shadow: 0 0 1rem rgba(0,0,0,0.2);
      color: white;
    }

    .Tip::before {
      content: '';
      position: absolute;
      left: 1.2rem;
      top: -0.49rem;
      border-left: 0.5rem solid transparent;
      border-right: 0.5rem solid transparent;
      border-bottom: 0.5rem solid `+style.colors.primary+`;
    }

    .TipCloseButton {
      top: 0.26rem;
      right: 0.35rem;
      line-height: 0.9rem;
      position: absolute;
      transform: scale(0.8, 0.8);
      transform-origin: center center;
    }

    .TipCloseButton line {
      color: white;
    }
  `;
  }

  function TokenListCSS(){
    return `

    .TokenList {
      display: table;
      background: white;
      width: 100%;
    }

    .TokenListItem {
      cursor: pointer;
      display: table-row;
      width: 100%;
    }

    .TokenListCell {
      border-bottom: 1px solid rgb(246,246,246);
      display: table-cell;
      padding: 1rem 1.8rem;
      position: relative;
      text-align: left;
      vertical-align: middle;
    }

    .TokenListCell:hover {
      background: rgb(248,243,245);
    }

    .TokenListCell:active {
      background: rgb(241,232,235);
    }

    .TokenListImage {
      height: 2rem;
      width: 2rem;
      margin-right: 1rem;
      vertical-align: middle;
    }
    
    .TokenListSymbol {
      font-size: 120%;
      vertical-align: middle;
    }

    .TokenListName {
      font-size: 90%;
      position: absolute;
      right: 1.8rem;
      padding-top: 0.3rem;
      color: rgb(110,110,110);
      vertical-align: middle;
    }
  `;
  }

  function TypographyCSS(){
    return `
    
    .FontSizeLarge {
      font-size: 140%;
    }

    .FontSizeMedium {
      font-size: 120%;
    }

    .FontSizeNormal {
      font-size: 100%;
    }

    .FontSizeSmall {
      font-size: 80%;
    }

    .TextAlignCenter {
      text-align: center;
    }

    .TextEllipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .FontWeightBold {
      font-weight: bold;
    }

    .TextGrey {
      color: rgb(110,110,110);
    }
  `;
  }

  function CSS(style){
    style = ___default['default'].merge({
      colors: {
        primary: '#ea357a'
      }
    }, style);
    return [
      `
      /* RESET START */
      html, body, div, span, applet, object, iframe,
      h1, h2, h3, h4, h5, h6, p, blockquote, pre,
      a, abbr, acronym, address, big, cite, code,
      del, dfn, em, img, ins, kbd, q, s, samp,
      small, strike, strong, sub, sup, tt, var,
      b, u, i, center,
      dl, dt, dd, ol, ul, li,
      fieldset, form, label, legend,
      table, caption, tbody, tfoot, thead, tr, th, td,
      article, aside, canvas, details, embed, 
      figure, figcaption, footer, header, hgroup, 
      menu, nav, output, ruby, section, summary,
      time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        text-align: inherit;
        vertical-align: baseline;
      }
      article, aside, details, figcaption, figure, 
      footer, header, hgroup, menu, nav, section {
        display: block;
      }
      body {
        line-height: 1;
      }
      ol, ul {
        list-style: none;
      }
      blockquote, q {
        quotes: none;
      }
      blockquote:before, blockquote:after,
      q:before, q:after {
        content: '';
        content: none;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      /* RESET END */

      * {
        box-sizing: border-box;
      }

      button {
        border: 0;
        background: none;
        outline: none;
      }
    `,
      FontsCSS(),
      InsideContainerCSS(),
      DialogCSS(),
      SkeletonCSS(),
      CircularButtonCSS(),
      CircularIconCSS(style),
      TipCSS(style),
      TokenListCSS(),
      SearchCSS(),
      TextButtonCSS(),
      StackedDialogCSS(),
      PaymentCSS(style),
      CallToActionCSS(style),
      PoweredByCSS(),
      PaymentDialogCSS(),
      TypographyCSS(),
      PaddingCSS(),
      CardCSS(),
      TableCSS(),
      RangeSliderCSS(style),
      ChangeNetworkFeeDialogCSS(),
      LabelCSS(style),
      IconCSS(),
      LoadingDotsCSS(),
      InputCSS(),
      SwapDialogCSS(),
      MainActionCSS(),
      style.inject
    ].join("\n");
  }

  function ShadowContainer(inputStyle) {
    if (!document.querySelector('#DePayContainerStyle')) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.setAttribute('id', 'DePayContainerStyle');
      style.appendChild(document.createTextNode(`
      #DePayShadowContainer {
        background: rgba(0,0,0,0);
        bottom: 0;
        height: 100%;
        left: 0;
        opacity: 0;
        position: fixed;
        right: 0;
        top: -1rem;
        transition: all 0.4s ease-out;
        width: 100%;
        z-index: 99999;
      }

      #DePayShadowContainer.open {
        background: rgba(0,0,0,0.4);
        opacity: 1;
        top: 0;
      }
    `));
      document.getElementsByTagName('head')[0].appendChild(style);
    }

    let container = document.getElementById('DePayShadowContainer');
    if (container) { container.remove(); }

    container = document.createElement('div');
    container.setAttribute('id', 'DePayShadowContainer');
    document.body.appendChild(container);
    setTimeout(() => {
      container.classList.add('open');
    }, 0);

    const shadow = container.attachShadow({ mode: 'closed' });
    retargetEvents__default['default'](shadow);

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(CSS(inputStyle)));
    shadow.appendChild(style);

    const script = document.createElement('script');
    // script.appendChild(document.createTextNode(RollbarSnippet));
    shadow.appendChild(script);

    const insideContainer = document.createElement('div');
    insideContainer.classList.add('InsideContainerTable');
    const insideContainerRow = document.createElement('div');
    insideContainerRow.classList.add('InsideContainerRow');
    insideContainer.appendChild(insideContainerRow);
    const insideContainerCell = document.createElement('div');
    insideContainerCell.classList.add('InsideContainerCell');
    insideContainerRow.appendChild(insideContainerCell);
    shadow.appendChild(insideContainer);

    let closable = true;
    function setClosable(value) {
      closable = value;
    }

    function closeContainer() {
      if(!closable) { return false }    container.classList.remove('open');
      setTimeout(() => {
        container.remove();
      }, 300);
      return true;
    }

    shadow.addEventListener('click', (event) => {
      if (
        event.target === insideContainerRow
        || event.target === insideContainerCell
      ) {
        closeContainer();
      }
    });

    return [insideContainerCell, closeContainer, setClosable];
  }

  class MetaMaskConnector {
    static __initStatic() {this.ethereum = window.ethereum;}

    static isAvailable() {
      return Boolean(
        typeof(ethereum) == 'object' && ethereum.isMetaMask
      )
    }

    static isConnected() {
      return Boolean(this.address())
    }

    static address() {
      return ethereum.selectedAddress
    }

    static balance() {
      return new Promise(function(resolve, reject) {
        EthersProvider$1.getBalance(MetaMaskConnector.address()).then(function(balance){
          resolve(balance);
        });
      });
    }

    static connect() {
      return new Promise(function(resolve, reject) {
        ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts){
          resolve(accounts[0]);
        });
      });
    }

    static onAddressChange() {
      return new Promise(function(resolve, reject) {
        ethereum.on('accountsChanged', function (accounts) {
          resolve(accounts[0]);
        });
      });
    }

    static name() {
      return 'MetaMask';
    }

    static provider() {
      return EthersProvider$1;
    }
  } MetaMaskConnector.__initStatic();

  class Wallet {
    static __initStatic() {this.connectors = [
      MetaMaskConnector
    ];}

    static connector() {
      return ___default['default'].find(Wallet.connectors, function(connector){
        return connector.isAvailable()
      });
    }

    static isAvailable() {
      return Boolean(Wallet.connector() !== undefined)
    }

    constructor() {
      this.connector = Wallet.connector();
    }

    isConnected() {
      return this.connector.isConnected()
    }

    connect() {
      return this.connector.connect();
    }

    onAddressChange() {
      return this.connector.onAddressChange();
    }

    address() {
      return this.connector.address();
    }

    balance() {
      return this.connector.balance();
    }

    name() {
      return this.connector.name();
    }

    provider() {
      return this.connector.provider();
    }
  } Wallet.__initStatic();

  const _jsxFileName$k = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/WalletNotFoundDialog.jsx";
  class WalletNotFoundDialog extends React__default['default'].Component {

    render() {
      
      return (
        React__default['default'].createElement('div', { className: "Dialog WalletNotFoundDialog" , __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 9}}
          , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 10}}
            , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$k, lineNumber: 11}})
          )
          , React__default['default'].createElement('div', { className: "DialogBody HeightAuto TextAlignCenter PaddingSmall"   , __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 13}}
            , React__default['default'].createElement('div', { className: "PaddingTopSmall", __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 14}}
              , React__default['default'].createElement('img', { className: "CircularIcon large" , src: "data:image/png;base64,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", __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 15}})
            )
            , React__default['default'].createElement('h1', { className: "FontSizeLarge PaddingMedium PaddingTopSmall"  , __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 17}}, "No Wallet Found"

            )
          )
          , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 21}}
            , React__default['default'].createElement('button', { className: "CallToAction MainAction" , __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 22}}, "Install"

            )
            , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 25}}
              , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$k, lineNumber: 26}}, "by DePay"

              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$l = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/WalletConnectDialog.js";
  class WalletConnectDialog extends React__default['default'].Component {

    render() {
      
      return (
        React__default['default'].createElement(WalletContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$l, lineNumber: 10}}
          , walletContext => (
            React__default['default'].createElement('div', { className: "Dialog WalletConnectDialog" , __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 12}}
              , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 13}}
                , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$l, lineNumber: 14}})
              )
              , React__default['default'].createElement('div', { className: "DialogBody HeightAuto TextAlignCenter PaddingSmall"   , __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 16}}
                , React__default['default'].createElement('div', { className: "PaddingTopSmall", __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 17}}
                  , React__default['default'].createElement('img', { className: "CircularIcon large" , src: "data:image/png;base64,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", __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 18}})
                )
                , React__default['default'].createElement('h1', { className: "FontSizeLarge PaddingMedium PaddingTopSmall"  , __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 20}}, "Connect With "
                    , walletContext.wallet.name()
                )
              )
              , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 24}}
                , React__default['default'].createElement('button', { className: "CallToAction MainAction" , onClick: this.props.connect, __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 25}}, "Connect"

                )
                , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 28}}
                  , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$l, lineNumber: 29}}, "by DePay"

                  )
                )
              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$m = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/WalletProvider.jsx";
  class WalletProvider extends React__default['default'].Component {
    __init() {this.state = {
      address: null,
      connected: false,
      available: true,
    };}

    constructor(props) {
      super(props);WalletProvider.prototype.__init.call(this);
      if(Wallet.isAvailable() === false) {
        Object.assign(this.state, {
          available: false
        });
        return;
      }

      this.wallet = new Wallet();

      Object.assign(this.state, {
        wallet: this.wallet,
        address: this.wallet.address(),
        connected: this.wallet.isConnected(),
      });
    }

    componentDidMount() {
      if(this.state.available === false) { return }

      if(this.wallet.isConnected() === false) { 
        this.wallet.connect().then(function(address){
          this.setState({
            address,
            connected: true
          });
        }.bind(this));
      }

      this.wallet.onAddressChange(function(address){
        this.setState({
          address
        });
      }.bind(this));
    }

    connect() {
      this.wallet.connect().then(function(){
        this.setState({
          address: this.wallet.address(),
          connected: true
        });
      }.bind(this));
    }

    render() {
      if(this.state.available === false) { return this.renderNoWallet() }
      if(this.state.connected === false) { return this.renderConnect() }
      return (
        React__default['default'].createElement(WalletContext.Provider, { value: {
          wallet: this.wallet,
          address: this.state.address,
          connected: this.state.connected
        }, __self: this, __source: {fileName: _jsxFileName$m, lineNumber: 65}}
          , this.props.children
        )
      );
    }

    renderNoWallet() {
      return(React__default['default'].createElement(WalletNotFoundDialog, {__self: this, __source: {fileName: _jsxFileName$m, lineNumber: 76}}))
    }

    renderConnect() {
      return(
        React__default['default'].createElement(WalletContext.Provider, { value: {
          wallet: this.wallet,
          address: this.state.address,
          connected: this.state.connected
        }, __self: this, __source: {fileName: _jsxFileName$m, lineNumber: 81}}
          , React__default['default'].createElement(WalletConnectDialog, {
            connect: this.connect.bind(this), __self: this, __source: {fileName: _jsxFileName$m, lineNumber: 86}}
          )
        )
      )
    }
  }

  const _jsxFileName$n = "/Users/sebastian/Work/DePay/depay-widgets/src/Donation.jsx";
  function checkArguments(args){
    if(args.length == 0 || args.length > 1) {
      throw 'Unknown amount of arguments.'
    }
  }

  function toElement(arg) {
    if(typeof arg === 'string') {
      return document.querySelector(arg);
    } else if (___default['default'].isElement(arg)) {
      return arg;
    } else {
      throw 'Unknown element or element query.'
    }
  }

  function checkAndPrepOptions(input) {
    var options = Object.assign({}, input); // shallow copy

    // token
    if(___default['default'].isEmpty(options.token))  { throw '"token" needs to be set.' }
    options.token = (options.token === ETH) ? ETH : ethers.ethers.utils.getAddress(ethers.ethers.utils.getAddress(options.token));

    // receiver
    if(___default['default'].isEmpty(options.receiver))     { throw '"receiver" needs to be set.' }
    options.receiver = ethers.ethers.utils.getAddress(ethers.ethers.utils.getAddress(options.receiver));

    // element
    if(!___default['default'].isEmpty(options.element)) {
      options.element = toElement(options.element);
    }

    // route
    if(!___default['default'].isEmpty(options.route)) {
      options.route = ethers.ethers.utils.getAddress(ethers.ethers.utils.getAddress(options.route));
    }

    // callback
    if(options.callback !== undefined && typeof options.callback !== 'function') { throw 'callback needs to be a function' }

    return options;
  }

  function Donation() {
    checkArguments(arguments);
    var options = checkAndPrepOptions(arguments[0]);
    const [shadowContainer, closeContainer, setClosable] = ShadowContainer();

    let unmountAndClose = function(){
      let closed = closeContainer();
      if(closed) { ReactDOM__default['default'].unmountComponentAtNode(shadowContainer); }
    };

    return new Promise(() => {
      ReactDOM__default['default'].render(
        React__default['default'].createElement(CallbackContext.Provider, { value: {
          callback: options.callback
        }, __self: this, __source: {fileName: _jsxFileName$n, lineNumber: 67}}
          , React__default['default'].createElement(DialogProvider, {
            closeContainer:  unmountAndClose ,
            setClosable:  setClosable , __self: this, __source: {fileName: _jsxFileName$n, lineNumber: 70}}
          
            , React__default['default'].createElement(WalletProvider, {__self: this, __source: {fileName: _jsxFileName$n, lineNumber: 74}}
              , React__default['default'].createElement(DonationStack, {
                amount: options.amount,
                token: options.token,
                receiver: options.receiver, __self: this, __source: {fileName: _jsxFileName$n, lineNumber: 75}}
              )
            )
          )
        )
        , shadowContainer
      );
    });
  }

  const _jsxFileName$o = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/PaymentDialogSkeleton.jsx";
  class PaymentDialogSkeleton extends React__default['default'].Component {

    render() {
      return(
        React__default['default'].createElement('div', { className: "Dialog PaymentDialog" , __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 9}}
          , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 10}}
            , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$o, lineNumber: 11}})
          )
          , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 13}}
            , React__default['default'].createElement('div', { className: "Payment", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 14}}

              , React__default['default'].createElement('div', { className: "PaymentRow loading ChangePaymentRow"  , key: "loading-row-1", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 16}}
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 17}}
                  , React__default['default'].createElement(Skeleton, {
                    className: "CircularIcon",
                    style: {
                      top: '-0.3rem'
                    }, __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 18}}
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 25}}
                  , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 26}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 27}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow1", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 35}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.6rem',
                        width: '8rem'
                      }, __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 36}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow2", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 44}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 45}}
                    )
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 54}}
                  , React__default['default'].createElement(Skeleton, {
                    style: {
                      display: 'inline-block',
                      right: '0.7rem',
                      width: '5rem'
                    }, __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 55}}
                  )
                )
              )

            )

          )
          , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 68}}
            , React__default['default'].createElement(Skeleton, {
              style: {
                height: '2.8rem',
                width: '50%',
                margin: '0 auto -0.5rem'
              }, __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 69}}
            )
            , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 76}}
              , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$o, lineNumber: 77}}, "by DePay"

              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$p = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/PaymentDialog.jsx";
  class PaymentDialog extends React__default['default'].Component {constructor(...args) { super(...args); PaymentDialog.prototype.__init.call(this); }
    __init() {this.state={
      approving: null,
      paying: null,
      payed: false
    };}

    componentWillUnmount() {
      clearInterval(this.approvalCheckInterval);
    }

    paymentType() {
      if(this.props.selected.token.address === this.props.receiverToken.address) {
        return 'transfer';
      } else {
        return 'swap';
      }
    }

    paymentTypeText() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'via transfer';
        case 'swap':
          return 'via ' + Exchanges.findByName(this.props.selected.exchange).name();
      }
    }

    paymentTypeTitle() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'Direct token transfer';
        case 'swap':
          return 'Token swap via ' + this.props.selected.exchange;
      }
    }

    paymentTypeLink() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'https://etherscan.io/token/'+this.props.receiverToken.address;
        case 'swap':
          return Exchanges.findByName(this.props.selected.exchange).linkRoute(this.props.selected);
      }
    }

    approve(dialogContext) {
      new ethers.ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider$1)
        .connect(this.props.wallet.provider().getSigner(0))
        .approve(DePayRouterV1Contract.address, MAXINT)
        .catch(function(){ 
          clearInterval(this.approvalCheckInterval);
          this.setState({ approving: false });
        }.bind(this))
        .then(function(transaction){
          if(transaction) {
            dialogContext.setClosable(false);
            this.setState({ approving: {
              transactionHash: transaction.hash
            } });
            transaction.wait(1).then(function(){
              this.checkApproved(dialogContext);
            }.bind(this));
          } else {
            dialogContext.setClosable(true);
            this.setState({ approving: false });
          }
        }.bind(this));

      this.approvalCheckInterval = setInterval(function(){
        this.checkApproved(dialogContext);
      }.bind(this), 1000);
    }

    checkApproved(dialogContext) {
      new ethers.ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider$1).allowance(this.props.wallet.address(), DePayRouterV1Contract.address).then(function(amount){
        if(amount.gt(ethers.ethers.BigNumber.from(this.props.selected.amounts[0]))) {
          this.props.selected.approved = true;
          dialogContext.setClosable(true);
          this.setState({ approving: false });
          clearInterval(this.approvalCheckInterval);
        }
      }.bind(this));
    }

    generatePaymentUUID() {
      let now = +(new Date());
      return(ethers.ethers.BigNumber.from(this.props.wallet.address()).toString()+''+(now).toString());
    }

    pay(dialogContext, callbackContext, gasContext) {
      let route;

      route = this.props.selected.route;
      
      // Reduce routes with the same token to direct transfers,
      // as for the smart contract it's not a swap, but a transfer
      if(this.paymentType() === 'transfer') {
        route = [route[0]];
      }

      let amountIn = this.props.selected.amounts[0];
      let amountOut = this.props.selected.amounts[this.props.selected.amounts.length-1];
      if(route[0] === ETH) ;

      let deadline = Math.round(new Date().getTime() / 1000) + (24 * 3600); // 24 hours from now

      let value = 0;
      if(route[0] === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') { value = amountIn; }

      let plugins = ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'];
      let exchange = Exchanges.findByName(this.props.selected.exchange);
      if(exchange && this.paymentType() != 'transfer') {
        plugins.unshift(exchange.pluginAddress()); // only add exchange plugin if swap is nessary
      }
      let from = this.props.wallet.address();

      DePayRouterV1Contract.connect(this.props.wallet.provider().getSigner(0)).route(
        route,
        [amountIn, amountOut, deadline],
        [this.props.receiver],
        plugins,
        [], // data
        { value: value }
      )
      .catch(function(){
        console.log("pay catch", arguments);
        this.setState({ paying: false });
      }.bind(this))
      .then(function(transaction){
        if(transaction) {
          this.setState({ paying: {
            transactionHash: transaction.hash
          } });
          if(typeof callbackContext.sent === 'function') {
            callbackContext.sent({
              tx: transaction.hash,
              amount: amountOut,
              token: route[route.length-1],
              from: from,
              nonce: transaction.nonce
            });
          }
          dialogContext.setClosable(false);
          transaction.wait(1).then(function(transaction){
            if(transaction.status === 1) {
              dialogContext.setClosable(true);
              this.setState({
                paying: false,
                payed: { transactionHash: transaction.transactionHash }
              });
              setTimeout(function(){
                if(typeof callbackContext.callback === 'function') {
                  callbackContext.callback({tx: transaction.transactionHash}); 
                }
                if(typeof callbackContext.confirmed === 'function') {
                  callbackContext.confirmed({
                    tx: transaction.transactionHash,
                    amount: amountOut,
                    token: route[route.length-1],
                    from: from
                  }); 
                }
              }, 100);
            }
          }.bind(this));
        } else {
          console.log("pay then", arguments);
          dialogContext.setClosable(true);
          this.setState({ paying: false });
        }
      }.bind(this));
    }

    navigateIfActionable(navigate, path, dialogContext) {
      if(this.isActionable(dialogContext) === false){ return }
      navigate(path);
    }

    isActionable(dialogContext) {
      return dialogContext.closable === true && this.state.payed === false
    }

    render() {
      if(this.props.initializing) { 
        return(
          React__default['default'].createElement(PaymentDialogSkeleton, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 216}})
        ) 
      }

      if(!this.props.selected) {
        return(
          React__default['default'].createElement(NotEnoughFundsDialog, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 222}})
        )
      }

      return (
        React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 227}}
          , dialogContext => (
            React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 229}}
              , navigate => (
                React__default['default'].createElement('div', { className: 'Dialog PaymentDialog ' + (this.isActionable(dialogContext) ? '' : 'unactionable'), __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 231}}
                  , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 232}}
                    , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 233}})
                  )
                  , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 235}}
                    , React__default['default'].createElement('div', { className: "Payment", key:  this.props.selected.token.address , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 236}}
                      , React__default['default'].createElement('div', { className: "PaymentRow ChangePaymentRow" , onClick:  ()=> this.navigateIfActionable(navigate, 'ChangePaymentToken', dialogContext) , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 237}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 238}}
                          , React__default['default'].createElement(TokenIconComponent, {
                            title:  this.props.selected.token.name ,
                            src:  this.props.selected.token.logoURI , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 239}}
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 244}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 245}}, "Payment"

                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 248}}
                            ,  this.props.paymentContext.token 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 251}}
                            ,  this.props.paymentContext.local 
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 255}}
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Change payment" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 256}}, "Change"

                          )
                        )
                      )
                    )
                  )
                  , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 263}}
                    ,  this.renderCallToAction.bind(this)() 
                    , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 265}}
                      ,  this.renderTransaction.bind(this)() 
                      , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/token/'+this.props.receiverToken.address , title: 'Sending '+DisplayTokenAmount(this.props.receiverAmount, this.props.receiverToken.decimals, this.props.receiverToken.symbol)+' to the receiver', __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 267}}
                        , React__default['default'].createElement(TokenIconComponent, {
                          src:  this.props.receiverToken.logoURI ,
                          className:  'tiny' , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 268}}
                        )
                      )
                      , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 273}}, " • ")
                      , this.paymentType() &&
                        React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 275}}
                          , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  this.paymentTypeLink() , className: "PoweredByLink", title:  this.paymentTypeTitle() , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 276}}
                            ,  this.paymentTypeText() 
                          )
                          , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 279}}, " • ")
                        )
                      
                      , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 282}}, "by DePay"

                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    }

    renderTransaction() {
      if((this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash)) {
        let transactionHash = (this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash);
        return(
          React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 299}}
            , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+transactionHash , className: "PoweredByLink", title: "Your transaction" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 300}}, "tx"

            )
            , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 303}}, " • ")
          )
        )
      } else {
        return
      }
    }

    renderCallToAction() {
      if(this.props.selected.approved) {
        return(this.renderPaymentButton())
      } else {
        return(
          React__default['default'].createElement('div', { className: "Table", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 316}}
            , React__default['default'].createElement('div', { className: "TableRow", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 317}}
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 318}}
                ,  this.renderApproveButton() 
              )
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 321}}
                , React__default['default'].createElement('button', { className: "CallToAction MainAction disabled"  , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 322}}
                  , React__default['default'].createElement('span', { className: "CallToActionName", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 323}}, "Pay"), " " , React__default['default'].createElement('span', { className: "CallToActionPrice TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 323}},  this.props.paymentContext.total )
                )
              )
            )
          )
        )
      }
    }

    renderApproveButton() {
      if(this.state.approving) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.approving.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait for the approval transaction to be confirmed by the network. Click to open transaction on etherscan."                 , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 335}}, "Approving"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 337}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 338}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 339}}, ".")
          )
        )
      } else {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 344}}
            , dialogContext => (
              React__default['default'].createElement('button', { key: "approve", className: "CallToAction MainAction" , onClick: ()=>this.approve.bind(this)(dialogContext), title: "Click to approve that the selected token is allowed to be swapped for performing this payment. This approval is only required the first time you pay with the selected token."                             , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 346}}, "Approve"

              )
            )
          )
        )
      }
    }

    renderPaymentButton() {
      if(this.state.payed) {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 358}}
            , dialogContext => (
              React__default['default'].createElement('span', { className: "CallToAction MainAction circular"  , onClick:  dialogContext.closeContainer , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 360}}
                , React__default['default'].createElement(CheckMarkComponent, { className: "large", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 361}})
              )
            )
          )
        )
      } else if(this.state.paying) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.paying.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait payment transaction to be confirmed by the network. Click to open transaction on etherscan."               , __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 368}}, "Paying"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 370}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 371}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 372}}, ".")
          )
        )
      } else {
        return(
          React__default['default'].createElement(GasContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 377}}
            , gasContext => (
              React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 379}}
                , dialogContext => (
                  React__default['default'].createElement(CallbackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$p, lineNumber: 381}}
                    , callbackContext => (
                      React__default['default'].createElement('button', { className: "CallToAction MainAction" , onClick: ()=>this.pay.bind(this)(dialogContext, callbackContext, gasContext), __self: this, __source: {fileName: _jsxFileName$p, lineNumber: 383}}, "Pay "
                         ,  this.props.paymentContext.total 
                      )
                    )
                  )
                )
              )
            )
          )
        )
      }
    }

  }

  const _jsxFileName$q = "/Users/sebastian/Work/DePay/depay-widgets/src/stacks/PaymentStack.jsx";
  class PaymentStack extends React__default['default'].Component {
    __init() {this.state = {
      amount: null,
      token: null,
      receiver: null
    };}

    constructor(props) {
      super(props);PaymentStack.prototype.__init.call(this);    Object.assign(this.state, {
        amount: props.amount,
        token: props.token,
        receiver: props.receiver
      });
    }

    render() {
      return (
        React__default['default'].createElement(GasProvider, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 38}}
          , React__default['default'].createElement(GasContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 39}}
            , gasContext => (
              React__default['default'].createElement(PriceProvider, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 41}}
                , React__default['default'].createElement(PriceContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 42}}
                  , priceContext => (
                    React__default['default'].createElement(TokenProvider, {
                      token:  this.state.token , __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 44}}
                    
                      , React__default['default'].createElement(TokenContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 47}}
                        , tokenContext => (
                          React__default['default'].createElement(AmountProvider, {
                            amount:  this.state.amount ,
                            token:  tokenContext.token , __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 49}}
                          
                            , React__default['default'].createElement(AmountContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 53}}
                              , amountContext => (
                                React__default['default'].createElement(WalletContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 55}}
                                  , walletContext => (
                                    React__default['default'].createElement(RoutesProvider, {
                                      token:  tokenContext.token.address ,
                                      amount:  amountContext.amount ,
                                      address:  walletContext.address ,
                                      wallet:  walletContext.wallet , __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 57}}
                                    
                                      , React__default['default'].createElement(RoutesContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 63}}
                                        , routesContext => (
                                          React__default['default'].createElement(PaymentProvider, {
                                            route:  routesContext.selected ,
                                            gas:  gasContext.selected ,
                                            receiverToken:  tokenContext.token ,
                                            price:  priceContext.price ,
                                            amount:  amountContext.amount , __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 65}}
                                          
                                            , React__default['default'].createElement(PaymentContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$q, lineNumber: 72}}
                                              , paymentContext => (
                                                React__default['default'].createElement(Stack, {
                                                  dialogs: {
                                                    Payment: React__default['default'].createElement(PaymentDialog, {
                                                      selected:  routesContext.selected ,
                                                      initializing:  priceContext.initializing || routesContext.initializing || gasContext.initializing ,
                                                      receiverToken:  tokenContext.token ,
                                                      receiverAmount:  amountContext.amount ,
                                                      paymentContext:  paymentContext ,
                                                      receiver:  this.state.receiver ,
                                                      wallet:  walletContext.wallet , __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 76}}
                                                    ),
                                                    ChangePaymentToken: React__default['default'].createElement(ChangePaymentTokenDialog, {
                                                      routes:  routesContext.routes ,
                                                      change:  routesContext.change ,
                                                      paymentContext:  paymentContext , __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 85}}
                                                    ),
                                                    ChangeNetworkFee: React__default['default'].createElement(ChangeNetworkFeeDialog, {
                                                      selected:  routesContext.selected ,
                                                      price:  priceContext.price ,
                                                      gasContext:  gasContext ,
                                                      paymentContext:  paymentContext , __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 90}}
                                                    )
                                                  },
                                                  start: 'Payment', __self: this, __source: {fileName: _jsxFileName$q, lineNumber: 74}}
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }

  const _jsxFileName$r = "/Users/sebastian/Work/DePay/depay-widgets/src/Payment.jsx";
  function checkArguments$1(args){
    if(args.length == 0 || args.length > 1) {
      throw 'Unknown amount of arguments.'
    }
  }

  function toElement$1(arg) {
    if(typeof arg === 'string') {
      return document.querySelector(arg);
    } else if (___default['default'].isElement(arg)) {
      return arg;
    } else {
      throw 'Unknown element or element query.'
    }
  }

  function checkAndPrepOptions$1(input) {
    var options = Object.assign({}, input); // shallow copy

    // amount
    if(typeof options.amount != 'string') { throw '"amount" needs to be passed as a string.' }
    if(___default['default'].isEmpty(options.amount)) { throw '"amount" needs to be set.' }

    // token
    if(___default['default'].isEmpty(options.token))  { throw '"token" needs to be set.' }
    options.token = (options.token === ETH) ? ETH : ethers.ethers.utils.getAddress(ethers.ethers.utils.getAddress(options.token));

    // receiver
    if(___default['default'].isEmpty(options.receiver))     { throw '"receiver" needs to be set.' }
    options.receiver = ethers.ethers.utils.getAddress(ethers.ethers.utils.getAddress(options.receiver));

    // element
    if(!___default['default'].isEmpty(options.element)) {
      options.element = toElement$1(options.element);
    }

    // route
    if(!___default['default'].isEmpty(options.route)) {
      options.route = ethers.ethers.utils.getAddress(ethers.ethers.utils.getAddress(options.route));
    }

    // callback
    if(options.callback !== undefined && typeof options.callback !== 'function') { throw 'callback needs to be a function' }
    if(options.sent !== undefined && typeof options.sent !== 'function') { throw 'sent callback needs to be a function' }
    if(options.confirmed !== undefined && typeof options.confirmed !== 'function') { throw 'confirmed callback needs to be a function' }

    return options;
  }

  function Payment() {
    checkArguments$1(arguments);
    var options = checkAndPrepOptions$1(arguments[0]);
    const [shadowContainer, closeContainer, setClosable] = ShadowContainer();

    let unmountAndClose = function(){
      let closed = closeContainer();
      if(closed) { ReactDOM__default['default'].unmountComponentAtNode(shadowContainer); }
    };

    return new Promise(() => {
      ReactDOM__default['default'].render(
        React__default['default'].createElement(CallbackContext.Provider, { value: {
          callback: options.callback,
          sent: options.sent,
          confirmed: options.confirmed
        }, __self: this, __source: {fileName: _jsxFileName$r, lineNumber: 73}}
          , React__default['default'].createElement(DialogProvider, {
            closeContainer:  unmountAndClose ,
            setClosable:  setClosable , __self: this, __source: {fileName: _jsxFileName$r, lineNumber: 78}}
          
            , React__default['default'].createElement(WalletProvider, {__self: this, __source: {fileName: _jsxFileName$r, lineNumber: 82}}
              , React__default['default'].createElement(PaymentStack, {
                amount: options.amount,
                token: options.token,
                receiver: options.receiver, __self: this, __source: {fileName: _jsxFileName$r, lineNumber: 83}}
              )
            )
          )
        )
        , shadowContainer
      );
    });
  }

  const _jsxFileName$s = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/SaleDialogSkeleton.jsx";
  class SaleDialogSkeleton extends React__default['default'].Component {

    render() {
      return(
        React__default['default'].createElement('div', { className: "Dialog PaymentDialog" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 9}}
          , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 10}}
            , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$s, lineNumber: 11}})
          )
          , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 13}}
            , React__default['default'].createElement('div', { className: "Payment", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 14}}

              , React__default['default'].createElement('div', { className: "PaymentRow loading ChangePaymentRow"  , key: "loading-row-0", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 16}}
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 17}}
                  , React__default['default'].createElement(Skeleton, {
                    className: "CircularIcon",
                    style: {
                      top: '-0.3rem'
                    }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 18}}
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 25}}
                  , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 26}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 27}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow1", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 35}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.6rem',
                        width: '8rem'
                      }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 36}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow2", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 44}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 45}}
                    )
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 54}}
                  , React__default['default'].createElement(Skeleton, {
                    style: {
                      display: 'inline-block',
                      right: '0.7rem',
                      width: '5rem'
                    }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 55}}
                  )
                )
              )

              , React__default['default'].createElement('div', { className: "PaymentRow loading ChangePaymentRow"  , key: "loading-row-1", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 65}}
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 66}}
                  , React__default['default'].createElement(Skeleton, {
                    className: "CircularIcon",
                    style: {
                      top: '-0.3rem'
                    }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 67}}
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 74}}
                  , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 75}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 76}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow1", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 84}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.6rem',
                        width: '8rem'
                      }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 85}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow2", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 93}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 94}}
                    )
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 103}}
                  , React__default['default'].createElement(Skeleton, {
                    style: {
                      display: 'inline-block',
                      right: '0.7rem',
                      width: '5rem'
                    }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 104}}
                  )
                )
              )

            )

          )
          , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 117}}
            , React__default['default'].createElement(Skeleton, {
              className: "CallToAction",
              style: {
                height: '2.8rem',
                width: '50%'
              }, __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 118}}
            )
            , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 125}}
              , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$s, lineNumber: 126}}, "by DePay"

              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$t = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/SaleDialog.jsx";
  class SaleDialog extends React__default['default'].Component {constructor(...args) { super(...args); SaleDialog.prototype.__init.call(this); }
    __init() {this.state={
      approving: null,
      paying: null,
      payed: false
    };}

    componentWillUnmount() {
      clearInterval(this.approvalCheckInterval);
    }

    paymentType() {
      if(this.props.selected.token.address === this.props.token) {
        return 'transfer';
      } else {
        return 'swap';
      }
    }

    paymentTypeText() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'via transfer';
        case 'swap':
          return 'via ' + Exchanges.findByName(this.props.selected.exchange).name();
      }
    }

    paymentTypeTitle() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'Direct token transfer';
        case 'swap':
          return 'Token swap via ' + this.props.selected.exchange;
      }
    }

    paymentTypeLink() {
      switch (this.paymentType()) {
        case 'transfer':
          return 'https://etherscan.io/token/'+this.props.token;
        case 'swap':
          return Exchanges.findByName(this.props.selected.exchange).linkRoute(this.props.selected);
      }
    }

    approve(dialogContext) {
      new ethers.ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider$1)
        .connect(this.props.wallet.provider().getSigner(0))
        .approve(DePayRouterV1Contract.address, MAXINT)
        .catch(function(){ 
          clearInterval(this.approvalCheckInterval);
          this.setState({ approving: false });
        }.bind(this))
        .then(function(transaction){
          if(transaction) {
            dialogContext.setClosable(false);
            this.setState({ approving: {
              transactionHash: transaction.hash
            } });
            transaction.wait(1).then(function(){
              this.checkApproved(dialogContext);
            }.bind(this));
          } else {
            dialogContext.setClosable(true);
            this.setState({ approving: false });
          }
        }.bind(this));

      this.approvalCheckInterval = setInterval(function(){
        this.checkApproved(dialogContext);
      }.bind(this), 1000);
    }

    checkApproved(dialogContext) {
      new ethers.ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider$1).allowance(this.props.wallet.address(), DePayRouterV1Contract.address).then(function(amount){
        if(amount.gt(ethers.ethers.BigNumber.from(this.props.selected.amounts[0]))) {
          this.props.selected.approved = true;
          dialogContext.setClosable(true);
          this.setState({ approving: false });
          clearInterval(this.approvalCheckInterval);
        }
      }.bind(this));
    }

    generatePaymentUUID() {
      let now = +(new Date());
      return(ethers.ethers.BigNumber.from(this.props.wallet.address()).toString()+''+(now).toString());
    }

    pay(dialogContext, callbackContext) {
      let route;

      route = this.props.selected.route;

      // Reduce routes with the same token to direct transfers,
      // as for the smart contract it's not a swap, but a transfer
      if(route.length === 2 && route[0] === route[1]) {
        route = [route[0]];
      }
      
      let amountIn = this.props.selected.amounts[0];
      let amountOut = this.props.selected.amounts[this.props.selected.amounts.length-1];
      if(route[0] === ETH) ;

      let deadline = Math.round(new Date().getTime() / 1000) + (24 * 3600); // 24 hours from now

      let addresses;
      if(this.props.addresses && this.props.addresses.length) {
        addresses = ___default['default'].map(this.props.addresses, function(address){
          if(address === 'user') { return this.props.wallet.address() }
          return address;
        }.bind(this));
      } else {
        addresses = [this.props.wallet.address()];
      }

      let plugins;
      plugins = [
        Exchanges.findByName(this.props.selected.exchange).pluginAddress(),
        '0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9' // payment plugin
      ];

      let value = 0;
      if(route[0] === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') { value = amountIn; }

      DePayRouterV1Contract.connect(this.props.wallet.provider().getSigner(0)).route(
        route,
        [amountIn, amountOut, deadline],
        addresses,
        plugins,
        ([]),
        { value: value }
      )
      .catch(function(){
        console.log("pay catch", arguments);
        this.setState({ paying: false });
      }.bind(this))
      .then(function(transaction){
        if(transaction) {
          this.setState({ paying: {
            transactionHash: transaction.hash
          } });
          dialogContext.setClosable(false);
          transaction.wait(1).then(function(transaction){
            if(transaction.status === 1) {
              dialogContext.setClosable(true);
              this.setState({
                paying: false,
                payed: { transactionHash: transaction.transactionHash }
              });
              setTimeout(function(){
                if(typeof callbackContext.callback === 'function') {
                  callbackContext.callback({tx: transaction.transactionHash});
                }
              }, 1600);
            }
          }.bind(this));
        } else {
          console.log("pay then", arguments);
          dialogContext.setClosable(true);
          this.setState({ paying: false });
        }
      }.bind(this));

          
    }

    navigateIfActionable(navigate, path, dialogContext) {
      if(this.isActionable(dialogContext) === false){ return }
      navigate(path);
    }

    isActionable(dialogContext) {
      return dialogContext.closable === true && this.state.payed === false
    }

    render() {
      if(this.props.initializing) { 
        return(
          React__default['default'].createElement(SaleDialogSkeleton, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 210}})
        ) 
      }

      if(!this.props.selected) {
        return(
          React__default['default'].createElement(NotEnoughFundsDialog, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 216}})
        )
      }

      return (
        React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 221}}
          , dialogContext => (
            React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 223}}
              , navigate => (
                React__default['default'].createElement('div', { className: 'Dialog PaymentDialog ' + (this.isActionable(dialogContext) ? '' : 'unactionable'), __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 225}}
                  , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 226}}
                    , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 227}})
                  )
                  , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 229}}
                    , React__default['default'].createElement('div', { className: "Payment", key:  this.props.tokenContext.token.address , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 230}}
                      , React__default['default'].createElement('div', { className: "PaymentRow ChangeTokenAmount" , onClick:  ()=> this.navigateIfActionable(navigate, 'ChangeTokenAmount', dialogContext) , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 231}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 232}}
                          , React__default['default'].createElement(TokenIconComponent, {
                            title:  this.props.tokenContext.token.name ,
                            src:  this.props.tokenContext.token.logoURI , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 233}}
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 238}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 239}}
                            ,  this.props.action || 'Purchase' 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , title: DisplayTokenAmount(this.props.amount, this.props.tokenContext.decimals, this.props.tokenContext.token.symbol), __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 242}}
                            ,  DisplayTokenAmount(this.props.amount, this.props.tokenContext.token.decimals, this.props.tokenContext.token.symbol) 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 245}}
                            ,  this.props.tokenContext.token.name 
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 249}}
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Change amount" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 250}}, "Change"

                          )
                        )
                      )

                      , React__default['default'].createElement('div', { className: "PaymentRow ChangePaymentRow" , onClick:  ()=> this.navigateIfActionable(navigate, 'ChangePaymentToken', dialogContext) , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 256}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 257}}
                          , React__default['default'].createElement(TokenIconComponent, {
                            title:  this.props.selected.token.name ,
                            src:  this.props.selected.token.logoURI , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 258}}
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 263}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 264}}, "Payment"

                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 267}}
                            ,  this.props.paymentContext.token 
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 270}}
                            ,  this.props.paymentContext.local 
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 274}}
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Change payment" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 275}}, "Change"

                          )
                        )
                      )

                    )
                  )
                  , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 283}}
                    ,  this.renderCallToAction.bind(this)() 
                    , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 285}}
                      ,  this.renderTransaction.bind(this)() 
                      , this.paymentType() &&
                        React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 288}}
                          , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  this.paymentTypeLink() , className: "PoweredByLink", title:  this.paymentTypeTitle() , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 289}}
                            ,  this.paymentTypeText() 
                          )
                          , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 292}}, " • ")
                        )
                      
                      , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 295}}, "by DePay"

                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    }

    renderTransaction() {
      if((this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash)) {
        let transactionHash = (this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash);
        return(
          React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 312}}
            , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+transactionHash , className: "PoweredByLink", title: "Your transaction" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 313}}, "tx"

            )
            , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 316}}, " • ")
          )
        )
      } else {
        return
      }
    }

    renderCallToAction() {
      if(this.props.selected.approved) {
        return(this.renderPaymentButton())
      } else {
        return(
          React__default['default'].createElement('div', { className: "Table", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 329}}
            , React__default['default'].createElement('div', { className: "TableRow", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 330}}
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 331}}
                ,  this.renderApproveButton() 
              )
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 334}}
                , React__default['default'].createElement('button', { className: "CallToAction MainAction disabled"  , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 335}}
                  , React__default['default'].createElement('span', { className: "CallToActionName", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 336}}, "Pay"), " " , React__default['default'].createElement('span', { className: "CallToActionPrice TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 336}},  this.props.paymentContext.total )
                )
              )
            )
          )
        )
      }
    }

    renderApproveButton() {
      if(this.state.approving) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.approving.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait for the approval transaction to be confirmed by the network. Click to open transaction on etherscan."                 , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 348}}, "Approving"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 350}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 351}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 352}}, ".")
          )
        )
      } else {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 357}}
            , dialogContext => (
              React__default['default'].createElement('button', { key: "approve", className: "CallToAction MainAction" , onClick: ()=>this.approve.bind(this)(dialogContext), title: "Click to approve that the selected token is allowed to be swapped for performing this payment. This approval is only required the first time you pay with the selected token."                             , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 359}}, "Approve"

              )
            )
          )
        )
      }
    }

    renderPaymentButton() {
      if(this.state.payed) {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 371}}
            , dialogContext => (
              React__default['default'].createElement('span', { className: "CallToAction MainAction circular"  , onClick:  dialogContext.closeContainer , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 373}}
                , React__default['default'].createElement(CheckMarkComponent, { className: "large", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 374}})
              )
            )
          )
        )
      } else if(this.state.paying) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.paying.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait payment transaction to be confirmed by the network. Click to open transaction on etherscan."               , __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 381}}, "Paying"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 383}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 384}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 385}}, ".")
          )
        )
      } else {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 390}}
            , dialogContext => (
              React__default['default'].createElement(CallbackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$t, lineNumber: 392}}
                , callbackContext => (
                  React__default['default'].createElement('button', { className: "CallToAction MainAction" , onClick: ()=>this.pay.bind(this)(dialogContext, callbackContext), __self: this, __source: {fileName: _jsxFileName$t, lineNumber: 394}}, "Pay "
                     ,  this.props.paymentContext.total 
                  )
                )
              )
            )
          )
        )
      }
    }

  }

  const _jsxFileName$u = "/Users/sebastian/Work/DePay/depay-widgets/src/stacks/SaleStack.jsx";
  class SaleStack extends React__default['default'].Component {
    __init() {this.state = {
      token: null
    };}

    constructor(props) {
      super(props);SaleStack.prototype.__init.call(this);    Object.assign(this.state, {
        token: props.token,
        action: props.action
      });
    }

    render() {
      return (
        React__default['default'].createElement(GasProvider, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 36}}
          , React__default['default'].createElement(GasContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 37}}
            , gasContext => (
              React__default['default'].createElement(PriceProvider, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 39}}
                , React__default['default'].createElement(PriceContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 40}}
                  , priceContext => (
                    React__default['default'].createElement(TokenProvider, {
                      token:  this.state.token , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 42}}
                    
                      , React__default['default'].createElement(TokenContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 45}}
                        , tokenContext => (
                          React__default['default'].createElement(AmountProvider, {
                            amount:  this.props.amount ,
                            token:  tokenContext.token , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 47}}
                          
                            , React__default['default'].createElement(AmountContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 51}}
                              , amountContext => (
                                React__default['default'].createElement(WalletContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 53}}
                                  , walletContext => (
                                    React__default['default'].createElement(RoutesProvider, {
                                      exclude:  tokenContext.token.address ,
                                      token:  tokenContext.token.address ,
                                      amount:  amountContext.amount ,
                                      address:  walletContext.address ,
                                      addresses:  this.props.addresses ,
                                      plugins:  this.props.plugins ,
                                      data:  this.props.data ,
                                      wallet:  walletContext.wallet ,
                                      addMaxAmounts:  true , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 55}}
                                    
                                      , React__default['default'].createElement(RoutesContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 66}}
                                        , routesContext => (
                                          React__default['default'].createElement(PaymentProvider, {
                                            route:  routesContext.selected ,
                                            gas:  gasContext.selected ,
                                            price:  priceContext.price ,
                                            amount:  amountContext.amount , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 68}}
                                          
                                            , React__default['default'].createElement(PaymentContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$u, lineNumber: 74}}
                                              , paymentContext => (
                                                React__default['default'].createElement(Stack, {
                                                  dialogs: {
                                                    Sale: React__default['default'].createElement(SaleDialog, {
                                                      selected:  routesContext.selected ,
                                                      initializing:  priceContext.initializing || routesContext.initializing || tokenContext.initializing ,
                                                      token:  tokenContext.token.address ,
                                                      paymentContext:  paymentContext ,
                                                      wallet:  walletContext.wallet ,
                                                      tokenContext:  tokenContext ,
                                                      amount:  amountContext.amount ,
                                                      action:  this.state.action ,
                                                      addresses:  this.props.addresses ,
                                                      plugins:  this.props.plugins ,
                                                      data:  this.props.data , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 78}}
                                                    ),
                                                    ChangeTokenAmount: React__default['default'].createElement(ChangeTokenAmountDialog, {
                                                      token:  tokenContext.token ,
                                                      amount:  amountContext.amount ,
                                                      amountOptions:  this.props.amount ,
                                                      change:  amountContext.change ,
                                                      routes:  routesContext.routes , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 91}}
                                                    ),
                                                    ChangePaymentToken: React__default['default'].createElement(ChangePaymentTokenDialog, {
                                                      routes:  routesContext.routes ,
                                                      change:  routesContext.change ,
                                                      paymentContext:  paymentContext , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 98}}
                                                    ),
                                                    ChangeNetworkFee: React__default['default'].createElement(ChangeNetworkFeeDialog, {
                                                      selected:  routesContext.selected ,
                                                      price:  priceContext.price ,
                                                      gasContext:  gasContext ,
                                                      paymentContext:  paymentContext , __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 103}}
                                                    )
                                                  },
                                                  start: 'Sale', __self: this, __source: {fileName: _jsxFileName$u, lineNumber: 76}}
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }

  const _jsxFileName$v = "/Users/sebastian/Work/DePay/depay-widgets/src/Sale.jsx";


  function checkArguments$2(args){
    if(args.length == 0 || args.length > 1) {
      throw 'Unknown amount of arguments.'
    }
  }

  function checkAndPrepOptions$2(input) {
    var options = Object.assign({}, input); // shallow copy
    return options;
  }

  function TokenSale() {
    checkArguments$2(arguments);
    var options = checkAndPrepOptions$2(arguments[0]);
    const [shadowContainer, closeContainer, setClosable] = ShadowContainer(options.style);

    let unmountAndClose = function(){
      let closed = closeContainer();
      if(closed) { ReactDOM__default['default'].unmountComponentAtNode(shadowContainer); }
    };

    return new Promise(() => {
      ReactDOM__default['default'].render(
        React__default['default'].createElement(CallbackContext.Provider, { value: {
          callback: options.callback
        }, __self: this, __source: {fileName: _jsxFileName$v, lineNumber: 35}}
          , React__default['default'].createElement(DialogProvider, {
            closeContainer:  unmountAndClose ,
            setClosable:  setClosable , __self: this, __source: {fileName: _jsxFileName$v, lineNumber: 38}}
          
            , React__default['default'].createElement(WalletProvider, {__self: this, __source: {fileName: _jsxFileName$v, lineNumber: 42}}
              , React__default['default'].createElement(SaleStack, {
                action: options.action,
                amount: options.amount,
                token: options.token,
                addresses: options.addresses,
                plugins: options.plugins,
                data: options.data, __self: this, __source: {fileName: _jsxFileName$v, lineNumber: 43}}
              )
            )
          )
        )
        , shadowContainer
      );
    });
  }

  function TokenList(){
    // return fetch('https://gateway.ipfs.io/ipns/tokens.uniswap.org')
    return [
      {
        "name": "0xBitcoin Token",
        "address": "0xB6eD7644C69416d67B522e20bC294A9a9B405B31",
        "symbol": "0xBTC",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB6eD7644C69416d67B522e20bC294A9a9B405B31/logo.png"
      },
      {
        "name": "Aave Interest bearing DAI",
        "address": "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d",
        "symbol": "aDAI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d/logo.png"
      },
      {
        "name": "Amon",
        "address": "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c",
        "symbol": "AMN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c/logo.png"
      },
      {
        "name": "Ampleforth",
        "address": "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
        "symbol": "AMPL",
        "decimals": 9,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD46bA6D942050d489DBd938a2C909A5d5039A161/logo.png"
      },
      {
        "name": "Aragon Network Juror",
        "address": "0xcD62b1C403fa761BAadFC74C525ce2B51780b184",
        "symbol": "ANJ",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xcD62b1C403fa761BAadFC74C525ce2B51780b184/logo.png"
      },
      {
        "name": "Aragon Network Token",
        "address": "0x960b236A07cf122663c4303350609A66A7B288C0",
        "symbol": "ANT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x960b236A07cf122663c4303350609A66A7B288C0/logo.png"
      },
      {
        "name": "AirSwap Token",
        "address": "0x27054b13b1B798B345b591a4d22e6562d47eA75a",
        "symbol": "AST",
        "decimals": 4,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x27054b13b1B798B345b591a4d22e6562d47eA75a/logo.png"
      },
      {
        "name": "Balancer",
        "address": "0xba100000625a3754423978a60c9317c58a424e3D",
        "symbol": "BAL",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png"
      },
      {
        "name": "BandToken",
        "address": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
        "symbol": "BAND",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55/logo.png"
      },
      {
        "name": "Basic Attention Token",
        "address": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
        "symbol": "BAT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/logo.png"
      },
      {
        "name": "Bloom Token",
        "address": "0x107c4504cd79C5d2696Ea0030a8dD4e92601B82e",
        "symbol": "BLT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x107c4504cd79C5d2696Ea0030a8dD4e92601B82e/logo.png"
      },
      {
        "name": "Bancor Network Token",
        "address": "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        "symbol": "BNT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png"
      },
      {
        "name": "PieDAO BTC++",
        "address": "0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd",
        "symbol": "BTC++",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd/logo.png"
      },
      {
        "name": "bZx Protocol Token",
        "address": "0x56d811088235F11C8920698a204A5010a788f4b3",
        "symbol": "BZRX",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x56d811088235F11C8920698a204A5010a788f4b3/logo.png"
      },
      {
        "name": "Compound Dai",
        "address": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
        "symbol": "cDAI",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643/logo.png"
      },
      {
        "name": "Celsius",
        "address": "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
        "symbol": "CEL",
        "decimals": 4,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d/logo.png"
      },
      {
        "name": "CelerToken",
        "address": "0x4F9254C83EB525f9FCf346490bbb3ed28a81C667",
        "symbol": "CELR",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4F9254C83EB525f9FCf346490bbb3ed28a81C667/logo.png"
      },
      {
        "name": "Chai",
        "address": "0x06AF07097C9Eeb7fD685c692751D5C66dB49c215",
        "symbol": "CHAI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x06AF07097C9Eeb7fD685c692751D5C66dB49c215/logo.png"
      },
      {
        "name": "Compound",
        "address": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
        "symbol": "COMP",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png"
      },
      {
        "name": "Curve DAO Token",
        "address": "0xD533a949740bb3306d119CC777fa900bA034cd52",
        "symbol": "CRV",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png"
      },
      {
        "name": "Compound Dai v1.0 SAI",
        "address": "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC",
        "symbol": "cSAI",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF5DCe57282A584D2746FaF1593d3121Fcac444dC/logo.png"
      },
      {
        "name": "Compound USD Coin",
        "address": "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
        "symbol": "cUSDC",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x39AA39c021dfbaE8faC545936693aC917d5E7563/logo.png"
      },
      {
        "name": "Dai Stablecoin",
        "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "symbol": "DAI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
      },
      {
        "name": "Streamr DATAcoin",
        "address": "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023",
        "symbol": "DATA",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0Cf0Ee63788A0849fE5297F3407f701E122cC023/logo.png"
      },
      {
        "name": "DigixDAO",
        "address": "0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A",
        "symbol": "DGD",
        "decimals": 9,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A/logo.png"
      },
      {
        "name": "Digix Gold Token",
        "address": "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF",
        "symbol": "DGX",
        "decimals": 9,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF/logo.png"
      },
      {
        "name": "Decentralized Insurance Protocol",
        "address": "0xc719d010B63E5bbF2C0551872CD5316ED26AcD83",
        "symbol": "DIP",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc719d010B63E5bbF2C0551872CD5316ED26AcD83/logo.png"
      },
      {
        "name": "DePay",
        "address": "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb",
        "symbol": "DEPAY",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png"
      },
      {
        "name": "Donut",
        "address": "0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9",
        "symbol": "DONUT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9/logo.png"
      },
      {
        "name": "Ether",
        "symbol": "ETH",
        "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC"
      },
      {
        "name": "EURBASE Stablecoin",
        "address": "0x86FADb80d8D2cff3C3680819E4da99C10232Ba0F",
        "symbol": "EBASE",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x86FADb80d8D2cff3C3680819E4da99C10232Ba0F/logo.png"
      },
      {
        "name": "Enjin Coin",
        "address": "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
        "symbol": "ENJ",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c/logo.png"
      },
      {
        "name": "SAINT FAME Genesis Shirt",
        "address": "0x06f65b8CfCb13a9FE37d836fE9708dA38Ecb29B2",
        "symbol": "FAME",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x06f65b8CfCb13a9FE37d836fE9708dA38Ecb29B2/logo.png"
      },
      {
        "name": "FOAM Token",
        "address": "0x4946Fcea7C692606e8908002e55A582af44AC121",
        "symbol": "FOAM",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4946Fcea7C692606e8908002e55A582af44AC121/logo.png"
      },
      {
        "name": "FunFair",
        "address": "0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b",
        "symbol": "FUN",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b/logo.png"
      },
      {
        "name": "Flexacoin",
        "address": "0x4a57E687b9126435a9B19E4A802113e266AdeBde",
        "symbol": "FXC",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4a57E687b9126435a9B19E4A802113e266AdeBde/logo.png"
      },
      {
        "name": "DAOstack",
        "address": "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf",
        "symbol": "GEN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf/logo.png"
      },
      {
        "name": "Gnosis Token",
        "address": "0x6810e776880C02933D47DB1b9fc05908e5386b96",
        "symbol": "GNO",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png"
      },
      {
        "name": "GRID Token",
        "address": "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD",
        "symbol": "GRID",
        "decimals": 12,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD/logo.png"
      },
      {
        "name": "Gastoken.io",
        "address": "0x0000000000b3F879cb30FE243b4Dfee438691c04",
        "symbol": "GST2",
        "decimals": 2,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000b3F879cb30FE243b4Dfee438691c04/logo.png"
      },
      {
        "name": "HedgeTrade",
        "address": "0xF1290473E210b2108A85237fbCd7b6eb42Cc654F",
        "symbol": "HEDG",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF1290473E210b2108A85237fbCd7b6eb42Cc654F/logo.png"
      },
      {
        "name": "HoloToken",
        "address": "0x6c6EE5e31d828De241282B9606C8e98Ea48526E2",
        "symbol": "HOT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6c6EE5e31d828De241282B9606C8e98Ea48526E2/logo.png"
      },
      {
        "name": "HUSD",
        "address": "0xdF574c24545E5FfEcb9a659c229253D4111d87e1",
        "symbol": "HUSD",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdF574c24545E5FfEcb9a659c229253D4111d87e1/logo.png"
      },
      {
        "name": "Fulcrum DAI iToken",
        "address": "0x493C57C4763932315A328269E1ADaD09653B9081",
        "symbol": "iDAI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x493C57C4763932315A328269E1ADaD09653B9081/logo.png"
      },
      {
        "name": "IoTeX Network",
        "address": "0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69",
        "symbol": "IOTX",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69/logo.png"
      },
      {
        "name": "Fulcrum SAI iToken ",
        "address": "0x14094949152EDDBFcd073717200DA82fEd8dC960",
        "symbol": "iSAI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x14094949152EDDBFcd073717200DA82fEd8dC960/logo.png"
      },
      {
        "name": "KEY",
        "address": "0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c",
        "symbol": "KEY",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4Cd988AfBad37289BAAf53C13e98E2BD46aAEa8c/logo.png"
      },
      {
        "name": "Kyber Network Crystal",
        "address": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
        "symbol": "KNC",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdd974D5C2e2928deA5F71b9825b8b646686BD200/logo.png"
      },
      {
        "name": "EthLend Token",
        "address": "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
        "symbol": "LEND",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x80fB784B7eD66730e8b1DBd9820aFD29931aab03/logo.png"
      },
      {
        "name": "ChainLink Token",
        "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        "symbol": "LINK",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png"
      },
      {
        "name": "LoomToken",
        "address": "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
        "symbol": "LOOM",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0/logo.png"
      },
      {
        "name": "Livepeer Token",
        "address": "0x58b6A8A3302369DAEc383334672404Ee733aB239",
        "symbol": "LPT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x58b6A8A3302369DAEc383334672404Ee733aB239/logo.png"
      },
      {
        "name": "Liquidity.Network Token",
        "address": "0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4",
        "symbol": "LQD",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4/logo.png"
      },
      {
        "name": "LoopringCoin V2",
        "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
        "symbol": "LRC",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD/logo.png"
      },
      {
        "name": "Decentraland MANA",
        "address": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
        "symbol": "MANA",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0F5D2fB29fb7d3CFeE444a200298f468908cC942/logo.png"
      },
      {
        "name": "Matic Token",
        "address": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        "symbol": "MATIC",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png"
      },
      {
        "name": "Marblecoin",
        "address": "0x8888889213DD4dA823EbDD1e235b09590633C150",
        "symbol": "MBC",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8888889213DD4dA823EbDD1e235b09590633C150/logo.png"
      },
      {
        "name": "MachiX Token",
        "address": "0xd15eCDCF5Ea68e3995b2D0527A0aE0a3258302F8",
        "symbol": "MCX",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xd15eCDCF5Ea68e3995b2D0527A0aE0a3258302F8/logo.png"
      },
      {
        "name": "Metronome",
        "address": "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e",
        "symbol": "MET",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e/logo.png"
      },
      {
        "name": "Magnolia Token",
        "address": "0x80f222a749a2e18Eb7f676D371F19ad7EFEEe3b7",
        "symbol": "MGN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x80f222a749a2e18Eb7f676D371F19ad7EFEEe3b7/logo.png"
      },
      {
        "name": "Maker",
        "address": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
        "symbol": "MKR",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png"
      },
      {
        "name": "Melon Token",
        "address": "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
        "symbol": "MLN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xec67005c4E498Ec7f55E092bd1d35cbC47C91892/logo.png"
      },
      {
        "name": "Modum Token",
        "address": "0x957c30aB0426e0C93CD8241E2c60392d08c6aC8e",
        "symbol": "MOD",
        "decimals": 0,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x957c30aB0426e0C93CD8241E2c60392d08c6aC8e/logo.png"
      },
      {
        "name": "Meta",
        "address": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
        "symbol": "MTA",
        "chainId": 1,
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2/logo.png"
      },
      {
        "name": "mStable USD",
        "address": "0xe2f2a5C287993345a840Db3B0845fbC70f5935a5",
        "symbol": "mUSD",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xe2f2a5C287993345a840Db3B0845fbC70f5935a5/logo.png"
      },
      {
        "name": "Nexo",
        "address": "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
        "symbol": "NEXO",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206/logo.png"
      },
      {
        "name": "Numeraire",
        "address": "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
        "symbol": "NMR",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671/logo.png"
      },
      {
        "name": "Ocean Token",
        "address": "0x7AFeBBB46fDb47ed17b22ed075Cde2447694fB9e",
        "symbol": "OCEAN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7AFeBBB46fDb47ed17b22ed075Cde2447694fB9e/logo.png"
      },
      {
        "name": "Orchid",
        "address": "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb",
        "symbol": "OXT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4575f41308EC1483f3d399aa9a2826d74Da13Deb/logo.png"
      },
      {
        "name": "Panvala pan",
        "address": "0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44",
        "symbol": "PAN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44/logo.png"
      },
      {
        "name": "PAX",
        "address": "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
        "symbol": "PAX",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8E870D67F660D95d5be530380D0eC0bd388289E1/logo.png"
      },
      {
        "name": "Paxos Gold",
        "address": "0x45804880De22913dAFE09f4980848ECE6EcbAf78",
        "symbol": "PAXG",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x45804880De22913dAFE09f4980848ECE6EcbAf78/logo.png"
      },
      {
        "name": "Pinakion",
        "address": "0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d",
        "symbol": "PNK",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d/logo.png"
      },
      {
        "name": "POA ERC20 on Foundation",
        "address": "0x6758B7d441a9739b98552B373703d8d3d14f9e62",
        "symbol": "POA20",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6758B7d441a9739b98552B373703d8d3d14f9e62/logo.png"
      },
      {
        "name": "QChi",
        "address": "0x687BfC3E73f6af55F0CccA8450114D107E781a0e",
        "symbol": "QCH",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x687BfC3E73f6af55F0CccA8450114D107E781a0e/logo.png"
      },
      {
        "name": "Quant",
        "address": "0x4a220E6096B25EADb88358cb44068A3248254675",
        "symbol": "QNT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4a220E6096B25EADb88358cb44068A3248254675/logo.png"
      },
      {
        "name": "Quantstamp Token",
        "address": "0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d",
        "symbol": "QSP",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d/logo.png"
      },
      {
        "name": "Ripio Credit Network Token",
        "address": "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6",
        "symbol": "RCN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6/logo.png"
      },
      {
        "name": "Raiden Token",
        "address": "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6",
        "symbol": "RDN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6/logo.png"
      },
      {
        "name": "Republic Token",
        "address": "0x408e41876cCCDC0F92210600ef50372656052a38",
        "symbol": "REN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png"
      },
      {
        "name": "renBCH",
        "address": "0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf",
        "symbol": "renBCH",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x459086F2376525BdCebA5bDDA135e4E9d3FeF5bf/logo.png"
      },
      {
        "name": "renBTC",
        "address": "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
        "symbol": "renBTC",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D/logo.png"
      },
      {
        "name": "renZEC",
        "address": "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
        "symbol": "renZEC",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2/logo.png"
      },
      {
        "name": "Reputation Augur v1",
        "address": "0x1985365e9f78359a9B6AD760e32412f4a445E862",
        "symbol": "REP",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1985365e9f78359a9B6AD760e32412f4a445E862/logo.png"
      },
      {
        "name": "Reputation Augur v2",
        "address": "0x221657776846890989a759BA2973e427DfF5C9bB",
        "symbol": "REPv2",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x221657776846890989a759BA2973e427DfF5C9bB/logo.png"
      },
      {
        "name": "Darwinia Network Native Token",
        "address": "0x9469D013805bFfB7D3DEBe5E7839237e535ec483",
        "symbol": "RING",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9469D013805bFfB7D3DEBe5E7839237e535ec483/logo.png"
      },
      {
        "name": "iEx.ec Network Token",
        "address": "0x607F4C5BB672230e8672085532f7e901544a7375",
        "symbol": "RLC",
        "decimals": 9,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x607F4C5BB672230e8672085532f7e901544a7375/logo.png"
      },
      {
        "name": "Rocket Pool",
        "address": "0xB4EFd85c19999D84251304bDA99E90B92300Bd93",
        "symbol": "RPL",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4EFd85c19999D84251304bDA99E90B92300Bd93/logo.png"
      },
      {
        "name": "Dai Stablecoin v1.0 SAI",
        "address": "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
        "symbol": "SAI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359/logo.png"
      },
      {
        "name": "Salt",
        "address": "0x4156D3342D5c385a87D264F90653733592000581",
        "symbol": "SALT",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4156D3342D5c385a87D264F90653733592000581/logo.png"
      },
      {
        "name": "SANtiment network token",
        "address": "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098",
        "symbol": "SAN",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098/logo.png"
      },
      {
        "name": "Synth sETH",
        "address": "0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb",
        "symbol": "sETH",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb/logo.png"
      },
      {
        "name": "Shuffle.Monster V3",
        "address": "0x3A9FfF453d50D4Ac52A6890647b823379ba36B9E",
        "symbol": "SHUF",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3A9FfF453d50D4Ac52A6890647b823379ba36B9E/logo.png"
      },
      {
        "name": "Status Network Token",
        "address": "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E",
        "symbol": "SNT",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x744d70FDBE2Ba4CF95131626614a1763DF805B9E/logo.png"
      },
      {
        "name": "Synthetix Network Token",
        "address": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
        "symbol": "SNX",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png"
      },
      {
        "name": "Unisocks Edition 0",
        "address": "0x23B608675a2B2fB1890d3ABBd85c5775c51691d5",
        "symbol": "SOCKS",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x23B608675a2B2fB1890d3ABBd85c5775c51691d5/logo.png"
      },
      {
        "name": "SPANK",
        "address": "0x42d6622deCe394b54999Fbd73D108123806f6a18",
        "symbol": "SPANK",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x42d6622deCe394b54999Fbd73D108123806f6a18/logo.png"
      },
      {
        "name": "Serum",
        "address": "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
        "symbol": "SRM",
        "chainId": 1,
        "decimals": 6,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x476c5E26a75bd202a9683ffD34359C0CC15be0fF/logo.png"
      },
      {
        "name": "STAKE",
        "address": "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
        "symbol": "STAKE",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0Ae055097C6d159879521C384F1D2123D1f195e6/logo.png"
      },
      {
        "name": "StorjToken",
        "address": "0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC",
        "symbol": "STORJ",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC/logo.png"
      },
      {
        "name": "Synth sUSD",
        "address": "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        "symbol": "sUSD",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x57Ab1ec28D129707052df4dF418D58a2D46d5f51/logo.png"
      },
      {
        "name": "Swipe",
        "address": "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
        "symbol": "SXP",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9/logo.png"
      },
      {
        "name": "TrueAUD",
        "address": "0x00006100F7090010005F1bd7aE6122c3C2CF0090",
        "symbol": "TAUD",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x00006100F7090010005F1bd7aE6122c3C2CF0090/logo.png"
      },
      {
        "name": "TrueCAD",
        "address": "0x00000100F2A2bd000715001920eB70D229700085",
        "symbol": "TCAD",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x00000100F2A2bd000715001920eB70D229700085/logo.png"
      },
      {
        "name": "TrueGBP",
        "address": "0x00000000441378008EA67F4284A57932B1c000a5",
        "symbol": "TGBP",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x00000000441378008EA67F4284A57932B1c000a5/logo.png"
      },
      {
        "name": "TrueHKD",
        "address": "0x0000852600CEB001E08e00bC008be620d60031F2",
        "symbol": "THKD",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000852600CEB001E08e00bC008be620d60031F2/logo.png"
      },
      {
        "name": "Monolith TKN",
        "address": "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a",
        "symbol": "TKN",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a/logo.png"
      },
      {
        "name": "Tellor Tributes",
        "address": "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
        "symbol": "TRB",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5/logo.png"
      },
      {
        "name": "Trustcoin",
        "address": "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B",
        "symbol": "TRST",
        "decimals": 6,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B/logo.png"
      },
      {
        "name": "BiLira",
        "address": "0x2C537E5624e4af88A7ae4060C022609376C8D0EB",
        "symbol": "TRYB",
        "decimals": 6,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2C537E5624e4af88A7ae4060C022609376C8D0EB/logo.png"
      },
      {
        "name": "TrueUSD",
        "address": "0x0000000000085d4780B73119b644AE5ecd22b376",
        "symbol": "TUSD",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png"
      },
      {
        "name": "UniBright",
        "address": "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e",
        "symbol": "UBT",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e/logo.png"
      },
      {
        "name": "UMA Voting Token v1",
        "address": "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
        "symbol": "UMA",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png"
      },
      {
        "name": "PieDAO USD++",
        "address": "0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e",
        "symbol": "USD++",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e/logo.png"
      },
      {
        "name": "USDCoin",
        "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "symbol": "USDC",
        "decimals": 6,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
      },
      {
        "name": "StableUSD",
        "address": "0xA4Bdb11dc0a2bEC88d24A3aa1E6Bb17201112eBe",
        "symbol": "USDS",
        "decimals": 6,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA4Bdb11dc0a2bEC88d24A3aa1E6Bb17201112eBe/logo.png"
      },
      {
        "name": "Tether USD",
        "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "symbol": "USDT",
        "decimals": 6,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
      },
      {
        "name": "dForce",
        "address": "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549",
        "symbol": "USDx",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xeb269732ab75A6fD61Ea60b06fE994cD32a83549/logo.png"
      },
      {
        "name": "Veritaseum",
        "address": "0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374",
        "symbol": "VERI",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374/logo.png"
      },
      {
        "name": "Wrapped BTC",
        "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        "symbol": "WBTC",
        "decimals": 8,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png"
      },
      {
        "name": "Wrapped CryptoKitties",
        "address": "0x09fE5f0236F0Ea5D930197DCE254d77B04128075",
        "symbol": "WCK",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x09fE5f0236F0Ea5D930197DCE254d77B04128075/logo.png"
      },
      {
        "name": "Wrapped Ether",
        "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "symbol": "WETH",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
      },
      {
        "name": "CryptoFranc",
        "address": "0xB4272071eCAdd69d933AdcD19cA99fe80664fc08",
        "symbol": "XCHF",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB4272071eCAdd69d933AdcD19cA99fe80664fc08/logo.png"
      },
      {
        "name": "XIO Network",
        "address": "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704",
        "symbol": "XIO",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704/logo.png"
      },
      {
        "name": "0x Protocol Token",
        "address": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
        "symbol": "ZRX",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png"
      }
    ];
  }

  const _jsxFileName$w = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/TokenSelectorDialog.jsx";
  class TokenSelectorDialog extends React__default['default'].Component {
    
    constructor(props) {
      super(props);
      this.tokens = props.tokenList || TokenList();
      this.state = {
        tokens: this.tokens,
        search: ''
      };
      this.fuse = new Fuse__default['default'](this.tokens, {
        keys: ['name', 'symbol'],
        isCaseSensitive: false,
        shouldSort: true,
        threshold: 0.4
      });
    }

    selectToken(token) {
      if(this.props.closeContainer) { this.props.closeContainer(); }    this.props.callback(token);
    }

    changeSearch(event) {
      var value = event.target.value;
      this.setState({search: value});
      if(ethers.ethers.utils.isAddress(value)) {
        var address = ethers.ethers.utils.getAddress(value);
        this.setState({search: address});
        if(!this.props.disableImportTokens) {
          ImportToken(address).then(function(token){
            this.setState({tokens: [token]});
          }.bind(this));
        }
      } else if(value.length == 0) {
        this.setState({tokens: this.tokens});
      } else {
        var results = this.fuse.search(value);
        this.setState({tokens: results.map(function(result){ return result.item })});
      }
    }

    showImportTokenTip() {
      this.setState({ showImportTokenTip: true });
      this.input.focus();
      this.input.setAttribute('data-placeholder', this.input.getAttribute('placeholder'));
      this.input.setAttribute('placeholder', 'Paste token address here');
    }

    hideImportTokenTip() {
      this.setState({showImportTokenTip: false});
      this.input.setAttribute('placeholder', this.input.getAttribute('data-placeholder'));
    }

    renderDialogHeader() {
      if(this.props.dialogContext) {
        return(
          React__default['default'].createElement('div', {__self: this, __source: {fileName: _jsxFileName$w, lineNumber: 67}}
            , React__default['default'].createElement(GoBackDialogComponent, {__self: this, __source: {fileName: _jsxFileName$w, lineNumber: 68}})
            , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$w, lineNumber: 69}})
            , React__default['default'].createElement('label', { htmlFor: "SearchToken", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 70}}
              , React__default['default'].createElement('h1', { className: "FontSizeMedium TextAlignCenter" , __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 71}}, "Select a token"  )
            )
          )
        )
      } else {
        return(
          React__default['default'].createElement('div', {__self: this, __source: {fileName: _jsxFileName$w, lineNumber: 77}}
            , React__default['default'].createElement('button', { onClick: this.props.closeContainer, className: "DialogCloseButton CircularButton" , title: "Close dialog" , __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 78}}, React__default['default'].createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 78}}, React__default['default'].createElement('line', { x1: "18", y1: "6", x2: "6", y2: "18", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 78}}), React__default['default'].createElement('line', { x1: "6", y1: "6", x2: "18", y2: "18", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 78}})))
            , React__default['default'].createElement('label', { htmlFor: "SearchToken", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 79}}, React__default['default'].createElement('h1', { className: "FontSizeMedium", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 79}}, "Select a token"  ))
          )
        )
      }
    }

    render() {
      return (
        React__default['default'].createElement('div', { className: "Dialog SelectTokenDialog" , __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 87}}
          , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 88}}
            ,  this.renderDialogHeader() 
            , React__default['default'].createElement('input', { ref: (input) => { this.input = input; },  value: this.state.search, id: "SearchToken", autoFocus: "autofocus", onChange: this.changeSearch.bind(this), className: "Search", type: "text", placeholder: this.props.disableImportTokens ? 'Search by name' : 'Search by name or paste address', __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 90}})
            , this.state.showImportTokenTip &&
              React__default['default'].createElement('div', { className: "TipContainer", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 92}}
                , React__default['default'].createElement('div', { className: "Tip", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 93}}, "Copy & paste any token address into this field."

                  , React__default['default'].createElement('button', { onClick: this.hideImportTokenTip.bind(this), className: "TipCloseButton CircularButton" , title: "Hide", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 95}}, React__default['default'].createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"   , fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 95}}, React__default['default'].createElement('line', { x1: "18", y1: "6", x2: "6", y2: "18", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 95}}), React__default['default'].createElement('line', { x1: "6", y1: "6", x2: "18", y2: "18", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 95}})))
                )
              )
            
          )
          , React__default['default'].createElement('div', { className: "DialogBody", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 100}}
            , React__default['default'].createElement('ul', { className: "TokenList", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 101}}
              , this.state.tokens.map((token) => {
                return (
                  React__default['default'].createElement('li', { key: token.symbol, className: "TokenListItem", onClick: ()=> this.selectToken(token), __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 104}}
                    , React__default['default'].createElement('div', { className: "TokenListCell", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 105}}
                      , React__default['default'].createElement(TokenIconComponent, {
                        className:  'TokenListImage' ,
                        title:  token.name ,
                        src:  token.logoURI , __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 106}}
                      )
                      , React__default['default'].createElement('span', { className: "TokenListSymbol", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 111}}, token.symbol)
                      , React__default['default'].createElement('span', { className: "TokenListName", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 112}}, token.name)
                    )
                  )
                )
              })
            )
          )
          , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 119}}
            ,  !this.props.disableImportTokens &&
              React__default['default'].createElement('button', { type: "button", onClick: this.showImportTokenTip.bind(this), className: "TextButton", __self: this, __source: {fileName: _jsxFileName$w, lineNumber: 121}}, "Token missing? Add it."   )
            
          )
        )
      )
    }
  }

  const _jsxFileName$x = "/Users/sebastian/Work/DePay/depay-widgets/src/Selector.jsx";
  function Selector(callback){
    const [shadowContainer, closeContainer] = ShadowContainer();
    ReactDOM__default['default'].render(
      React__default['default'].createElement(TokenSelectorDialog, {
        closeContainer: closeContainer, 
        callback: callback, __self: this, __source: {fileName: _jsxFileName$x, lineNumber: 9}}
      ),
      shadowContainer
    );
  }

  var RouteContext = React__default['default'].createContext();

  const _jsxFileName$y = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/RouteProvider.jsx";
  class RouteProvider extends React__default['default'].Component {constructor(...args) { super(...args); RouteProvider.prototype.__init.call(this); }
    __init() {this.state = {
      loading: false,
      fromAmount: null,
      toAmount: null,
      route: null
    };}

    componentDidUpdate(prevProps) {
      if(this.props.to && this.props.from) {
        if(this.props.fromAmount && (this.state.fromAmount !== this.props.fromAmount)) {
          this.setState({
            loading: true,
            fromAmount: this.props.fromAmount,
            toAmount: null
          }, this.findRouteFromTo);
        } else if (this.props.toAmount && this.state.toAmount !== this.props.toAmount) {
          this.setState({
            loading: true,
            toAmount: this.props.toAmount,
            fromAmount: null
          }, this.findRouteToFrom);
        }
      }
    }

    addApprovalStateToRoute(route) {
      return new Promise(function(resolve, reject){
        if(route.path[0] === ETH) {
          route.approved = true;
          resolve(route);
        } else {
          new ethers.ethers.Contract(route.path[0], Erc20Abi, EthersProvider$1)
          .allowance(this.props.wallet.address(), DePayRouterV1Contract.address)
          .then(function(amount){
            if(amount.gt(ethers.ethers.BigNumber.from(route.amounts[0]))) {
              route.approved = true;
            } else {
              route.approved = false;
            }
            resolve(route);
          });
        }
      });
    }

    findRouteFromTo() {
      Exchanges.findBestRouteFromTo(
        this.props.from,
        this.state.fromAmount,
        this.props.to
      ).then(function(route){
        this.addApprovalStateToRoute(route).then(function(route){
          this.setState({
            route: route,
            loading: false,
            toAmount: _.last(route.amounts).toString()
          });
        }.bind(this));
      }.bind(this));
    }

    findRouteToFrom() {
      console.log('findRouteToFrom');
    }

    render() {
      return(
        React__default['default'].createElement(RouteContext.Provider, { value: {
          loading: this.state.loading,
          route: this.state.route,
          fromAmount: this.state.fromAmount,
          toAmount: this.state.toAmount
        }, __self: this, __source: {fileName: _jsxFileName$y, lineNumber: 78}}
          , this.props.children
        )
      )
    }
  }

  const _jsxFileName$z = "/Users/sebastian/Work/DePay/depay-widgets/src/components/ExchangeComponent.jsx";
  class ExchangeComponent extends React__default['default'].Component {
    
    render() {
      return(
        React__default['default'].createElement('svg', { className: ['Icon grey', this.props.className].join(' '), version: "1.1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName$z, lineNumber: 7}}
          , React__default['default'].createElement('line', { x1: "5.37", y1: "2.07", x2: "5.37", y2: "11.47", fill: "none", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.33", __self: this, __source: {fileName: _jsxFileName$z, lineNumber: 8}})
          , React__default['default'].createElement('polyline', { points: "9.97 6.77 5.37 11.47 0.67 6.77"     , fill: "none", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.33", __self: this, __source: {fileName: _jsxFileName$z, lineNumber: 9}})
          , React__default['default'].createElement('line', { x1: "16.17", y1: "10.07", x2: "16.17", y2: "0.67", fill: "none", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.33", __self: this, __source: {fileName: _jsxFileName$z, lineNumber: 10}})
          , React__default['default'].createElement('polyline', { points: "11.57 5.37 16.17 0.67 20.87 5.37"     , fill: "none", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.33", __self: this, __source: {fileName: _jsxFileName$z, lineNumber: 11}})
        )
      )
    }
  }

  const _jsxFileName$A = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/SwapDialogSkeleton.jsx";
  class SwapDialogSkeleton extends React__default['default'].Component {

    render() {
      return(
        React__default['default'].createElement('div', { className: "Dialog SwapDialog" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 9}}
          , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 10}}
            , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$A, lineNumber: 11}})
          )
          , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 13}}
            , React__default['default'].createElement('div', { className: "Payment", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 14}}

              , React__default['default'].createElement('div', { className: "PaymentRow loading ChangePaymentRow"  , key: "loading-row-1", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 16}}
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 17}}
                  , React__default['default'].createElement(Skeleton, {
                    className: "CircularIcon",
                    style: {
                      top: '-0.3rem'
                    }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 18}}
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 25}}
                  , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 26}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 27}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow1", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 35}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.6rem',
                        width: '8rem'
                      }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 36}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow2", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 44}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 45}}
                    )
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 54}}
                  , React__default['default'].createElement(Skeleton, {
                    style: {
                      display: 'inline-block',
                      right: '0.7rem',
                      width: '5rem'
                    }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 55}}
                  )
                )
              )

              , React__default['default'].createElement('div', { className: "PaymentRow loading ChangeNetworkFeeRow"  , key: "loading-row-2", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 65}}
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 66}}
                  , React__default['default'].createElement(Skeleton, {
                    className: "CircularIcon",
                    style: {
                      top: '-0.3rem'
                    }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 67}}
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 74}}
                  , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 75}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 76}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow1", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 84}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.6rem',
                        width: '8rem'
                      }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 85}}
                    )
                  )
                  , React__default['default'].createElement('div', { className: "PaymentAmountRow2", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 93}}
                    , React__default['default'].createElement(Skeleton, {
                      style: {
                        display: 'inline-block',
                        height: '1.1rem',
                        width: '4rem',
                      }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 94}}
                    )
                  )
                )
                , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 103}}
                  , React__default['default'].createElement(Skeleton, {
                    style: {
                      display: 'inline-block',
                      right: '0.7rem',
                      width: '5rem'
                    }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 104}}
                  )
                )
              )
            )

          )
          , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 116}}
            , React__default['default'].createElement(Skeleton, {
              style: {
                height: '2.8rem',
                width: '50%',
                margin: '0 auto -0.5rem'
              }, __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 117}}
            )
            , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 124}}
              , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$A, lineNumber: 125}}, "by DePay"

              )
            )
          )
        )
      )
    }
  }

  const _jsxFileName$B = "/Users/sebastian/Work/DePay/depay-widgets/src/dialogs/SwapDialog.js";
  class SwapDialog extends React__default['default'].Component {
    __init() {this.state={
      approving: null,
      paying: null,
      payed: false,
      fromAmount: '',
      toAmount: '',
      entered: null
    };}

    constructor(props) {
      super(props);SwapDialog.prototype.__init.call(this);    this.toTokenAmount = React__default['default'].createRef();
      this.fromTokenAmount = React__default['default'].createRef();
    }

    componentWillUnmount() {
      clearInterval(this.approvalCheckInterval);
    }

    paymentType() {
      return 'swap';
    }

    paymentTypeTitle() {
      return 'Token swap via ' + this.props.route.exchange;
    }

    paymentTypeLink() {
      return Exchanges.findByName(this.props.route.exchange).linkRoute(this.props.route);
    }

    approve(dialogContext) {
      new ethers.ethers.Contract(this.props.route.token.address, Erc20Abi, EthersProvider$1)
        .connect(this.props.wallet.provider().getSigner(0))
        .approve(DePayRouterV1Contract.address, MAXINT)
        .catch(function(){ 
          clearInterval(this.approvalCheckInterval);
          this.setState({ approving: false });
        }.bind(this))
        .then(function(transaction){
          if(transaction) {
            dialogContext.setClosable(false);
            this.setState({ approving: {
              transactionHash: transaction.hash
            } });
            transaction.wait(1).then(function(){
              this.checkApproved(dialogContext);
            }.bind(this));
          } else {
            dialogContext.setClosable(true);
            this.setState({ approving: false });
          }
        }.bind(this));

      this.approvalCheckInterval = setInterval(function(){
        this.checkApproved(dialogContext);
      }.bind(this), 1000);
    }

    checkApproved(dialogContext) {
      new ethers.ethers.Contract(this.props.route.token.address, Erc20Abi, EthersProvider$1).allowance(this.props.wallet.address(), DePayRouterV1Contract.address).then(function(amount){
        if(amount.gt(ethers.ethers.BigNumber.from(this.props.route.amounts[0]))) {
          this.props.route.approved = true;
          dialogContext.setClosable(true);
          this.setState({ approving: false });
          clearInterval(this.approvalCheckInterval);
        }
      }.bind(this));
    }

    pay(dialogContext, callbackContext) {
      let route;

      // Drop intermediate ETH routes
      // as only start and end ETH is relevant for the smart contract.
      route = this.props.route.path.filter(function(step, index){
        return index === 0 || 
          index === this.props.route.path.length-1 || 
          step !== ETH
      }.bind(this));

      // Reduce routes with the same token to direct transfers,
      // as for the smart contract it's not a swap, but a transfer
      if(route.length === 2 && route[0] === route[1]) {
        route = [route[0]];
      }
      
      let amountIn = this.props.route.amounts[0];
      let amountOut = this.props.route.amounts[this.props.route.amounts.length-1];
      if(route[0] === ETH) ;

      let deadline = Math.round(new Date().getTime() / 1000) + (24 * 3600); // 24 hours from now

      DePayRouterV1Contract.connect(this.props.wallet.provider().getSigner(0)).pay(
        route,
        [amountIn, amountOut, deadline],
        this.props.addresses,
        this.props.plugins,
        this.props.data
      )
      .catch(function(){
        console.log("pay catch", arguments);
        this.setState({ paying: false });
      }.bind(this))
      .then(function(transaction){
        if(transaction) {
          this.setState({ paying: {
            transactionHash: transaction.hash
          } });
          dialogContext.setClosable(false);
          transaction.wait(1).then(function(transaction){
            if(transaction.status === 1) {
              dialogContext.setClosable(true);
              this.setState({
                paying: false,
                payed: true
              });
              setTimeout(function(){
                dialogContext.closeContainer();
                callbackContext.callback();
              }, 1600);
            }
          }.bind(this));
        } else {
          console.log("pay then", arguments);
          dialogContext.setClosable(true);
          this.setState({ paying: false });
        }
      }.bind(this));

          
    }

    navigateIfActionable(navigate, path, dialogContext) {
      if(this.isActionable(dialogContext) === false){ return }
      navigate(path);
    }

    isActionable(dialogContext) {
      return dialogContext.closable === true && this.state.payed === false
    }

    considerFocusToTokenAmount(prevProps) {
      if(
        (this.props.to && prevProps.to === null) ||
        (this.props.to && prevProps.to.address !== this.props.to.address)
      ) {
        if(this.props.fromAmount === '') {
          setTimeout(function(){
            this.toTokenAmount.current.focus();
          }.bind(this), 250);
        }
      }
    }
    
    considerFocusFromTokenAmount(prevProps) {
      if(
        (this.props.from && prevProps.from === null) ||
        (this.props.from && prevProps.from.address !== this.props.from.address)
      ) {
        if(this.props.toAmount === '') {
          setTimeout(function(){
            this.fromTokenAmount.current.focus();
          }.bind(this), 250);
        }
      }
    }

    considerSettingFromAmountFromProps(prevProps) {
      if(this.props.fromAmount === prevProps.fromAmount) { return }
      if(this.props.fromAmount === null) {
        this.setState({ fromAmount: '' });
      } else {
        this.setState({ fromAmount: ethers.ethers.utils.formatUnits(this.props.fromAmount, this.props.from.decimals) });
      }
    }

    considerSettingToAmountFromProps(prevProps) {
      if(this.props.toAmount === prevProps.toAmount) { return }
      if(this.props.toAmount === null) {
        this.setState({ toAmount: '' });
      } else {
        this.setState({ toAmount: ethers.ethers.utils.formatUnits(this.props.toAmount, this.props.to.decimals) });
      }
    }

    componentDidUpdate(prevProps) {
      this.considerFocusToTokenAmount(prevProps);
      this.considerFocusFromTokenAmount(prevProps);
      this.considerSettingFromAmountFromProps(prevProps);
      this.considerSettingToAmountFromProps(prevProps);    
    }

    setMax() {
      this.setState({
        fromAmount: ethers.ethers.utils.formatUnits(this.props.from.balance, this.props.from.decimals),
        entered: 'from'
      });
      this.props.changeFromAmount(this.props.from.balance);
    }

    changeFromAmount(event){
      this.setState({
        fromAmount: event.target.value,
        entered: 'from'
      });
      let value;
      try {
        value = ethers.ethers.utils.parseUnits(event.target.value.toString(), this.props.from.decimals);
      } catch (e) {}
      if(
        value !== undefined
      ) {
        this.props.changeFromAmount(value.toString());
      }
    }

    changeToAmount(event){
      this.setState({
        toAmount: event.target.value,
        entered: 'to'
      });
      let value;
      try {
        value = ethers.ethers.utils.parseUnits(event.target.value.toString(), this.props.to.decimals);
      } catch (e2) {}
      if(
        value !== undefined
      ) {
        this.props.changeFromAmount(value.toString());
      }
    }

    swapInputs() {
      if(this.state.entered === 'from') {
        this.setState({
          fromAmount: '',
          toAmount: this.state.fromAmount,
          entered: 'to'
        });
        this.props.swapFromTo();
      } else if (this.state.entered === 'to') {
        this.setState({
          fromAmount: this.state.toAmount,
          toAmount: '',
          entered: 'from'
        });
        this.props.swapToFrom();
      }
    }

    render() {
      if(this.props.initializing) { 
        return(
          React__default['default'].createElement(SwapDialogSkeleton, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 277}})
        ) 
      }

      return (
        React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 282}}
          , dialogContext => (
            React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 284}}
              , navigate => (
                React__default['default'].createElement('div', { className: 'Dialog SwapDialog ' + (this.isActionable(dialogContext) ? '' : 'unactionable'), __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 286}}
                  , React__default['default'].createElement('div', { className: "DialogHeader", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 287}}
                    , React__default['default'].createElement(CloseDialogComponent, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 288}})
                  )
                  , React__default['default'].createElement('div', { className: "DialogBody HeightAuto" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 290}}
                    , React__default['default'].createElement('div', { className: "Payment", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 291}}
                      , React__default['default'].createElement('div', { className: "PaymentRow FromRow" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 292}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 293}}
                          , React__default['default'].createElement('label', { htmlFor: "TokenSwapFrom", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 294}}
                            , React__default['default'].createElement(TokenIconComponent, {
                              title:  this.props.from.name ,
                              src:  this.props.from.logoURI , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 295}}
                            )
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 301}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 302}}
                            , React__default['default'].createElement('label', { htmlFor: "TokenSwapFrom", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 303}}, "From"

                            )
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 307}}
                            , React__default['default'].createElement('input', { onChange:  this.changeFromAmount.bind(this) , value:  this.state.fromAmount , ref: this.fromTokenAmount, name: "TokenSwapFrom", id: "TokenSwapFrom", className: "Input TextEllipsis FontSizeMedium"  , placeholder: "0.0", maxLength: "79", minLength: "1", inputMode: "decimal", pattern: "^[0-9]*[.,]?[0-9]*$", autocorret: "off", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 308}} )
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 310}}
                            , React__default['default'].createElement('label', { htmlFor: "TokenSwapFrom", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 311}}
                              ,  this.props.from.symbol 
                            )
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 316}}
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Set max. amount"  , onClick:  this.setMax.bind(this) , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 317}}, "Max"

                          )
                          , React__default['default'].createElement('span', { className: "PaymentAction", title: "Change token" , onClick:  ()=>this.navigateIfActionable(navigate, 'ChangeFromToken', dialogContext) , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 320}}, "Change"

                          )
                        )
                      )
                    )

                    , React__default['default'].createElement('div', { className: "TextAlignCenter ExchangeRow" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 327}}
                      , React__default['default'].createElement('button', { className: "SwapInputs", title: "Swap tokens and amounts"   , onClick:  this.swapInputs.bind(this) , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 328}}
                        , React__default['default'].createElement(ExchangeComponent, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 329}})
                      )
                    )

                    , React__default['default'].createElement('div', { className: "Payment", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 333}}

                      , React__default['default'].createElement('div', { className: "PaymentRow ToRow" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 335}}
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn1" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 336}}
                          , React__default['default'].createElement('label', { htmlFor: "TokenSwapTo", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 337}}
                            , React__default['default'].createElement(TokenIconComponent, {
                              title:  this.props.to ? this.props.to.name : 'Please select a token' ,
                              src:  this.props.to ? this.props.to.logoURI : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAGFBMVEVHcEz///////////////////////////8dS1W+AAAAB3RSTlMAHklzmMLqCsLrGwAAAQ9JREFUeNrtlrsOgkAQRRdFbDcae4IFrZEYazXRVitqQ2Hrk/19BVdX7XYuiQX3VDZzMsxrVYQQQkibGIyzLNHi8OHaVJRLWXgwMy8KLYnfGEchEFTxjp2/wHxRalBg9v4CNAXzwxYVXCSC2ypJstx+g6/ATaAdqImvoHxHzEVFcPGqWwtOnoLFx++6DGdgq9NnG+T0K8EVEPTqnrZbEKGCFO1CDs2BG2UZbpnABEwMJIA1IRSeZfdCgV8wsjdVnEBuLyKyBu51Fb+xpfhPRgdsgYqeM6DlQwQmoA62AvISgIsc2j0EaxgDL0ojx/CCCs4KPGYnVHCk4CEg7SbIKqbqfyeRAgoaERBCCCGESLgDeRfMNogh3QMAAAAASUVORK5CYII=' ,
                              className:  this.props.to ? '' : 'notfound' , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 338}}
                            )
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn2" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 345}}
                          , React__default['default'].createElement('div', { className: "PaymentDescription", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 346}}
                            , React__default['default'].createElement('label', { htmlFor: "TokenSwapTo", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 347}}, "To"

                            )
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow1 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 351}}
                            , React__default['default'].createElement('input', { onChange:  this.changeToAmount.bind(this) , value:  this.state.toAmount , ref: this.toTokenAmount, name: "TokenSwapTo", id: "TokenSwapTo", className: "Input TextEllipsis FontSizeMedium"  , placeholder: "0.0", maxLength: "79", minLength: "1", inputMode: "decimal", pattern: "^[0-9]*[.,]?[0-9]*$", autocorret: "off", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 352}} )
                          )
                          , React__default['default'].createElement('div', { className: "PaymentAmountRow2 TextEllipsis" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 354}}
                            , React__default['default'].createElement('label', { htmlFor: "TokenSwapTo", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 355}}
                              ,  this.props.to && this.props.to.symbol 
                              ,  !this.props.to && 
                                React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 358}}, " ")
                              
                            )
                          )
                        )
                        , React__default['default'].createElement('div', { className: "PaymentColumn PaymentColumn3" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 363}}
                          ,  this.props.to &&
                            React__default['default'].createElement('span', { className: "PaymentAction", onClick:  ()=>this.navigateIfActionable(navigate, 'ChangeToToken', dialogContext) , title: "Change token" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 365}}, "Change"

                            )
                          
                          , 
                            !this.props.to &&
                            React__default['default'].createElement('span', { className: "PaymentAction CallToAction" , onClick:  ()=>this.navigateIfActionable(navigate, 'ChangeToToken', dialogContext) , title: "Select token" , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 371}}, "Select"

                            ) 
                          
                        )
                      )
                    )
                  )
                  , React__default['default'].createElement('div', { className: "DialogFooter", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 379}}
                    ,  this.renderCallToAction.bind(this)() 
                    , React__default['default'].createElement('div', { className: "PoweredBy", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 381}}
                      , this.props.route && this.paymentType() &&
                        React__default['default'].createElement('span', {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 383}}
                          , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  this.paymentTypeLink() , className: "PoweredByLink", title:  this.paymentTypeTitle() , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 384}}
                            ,  'via '+this.props.route.exchange 
                          )
                          , React__default['default'].createElement('span', { className: "PoweredByLink", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 387}}, " • ")
                        )
                      
                      , React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href: 'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment', className: "PoweredByLink", title: "Powered by DePay: Decentralized Payments"    , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 390}}, "by DePay"

                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    }

    renderCallToAction() {
      if(this.props.loadingRoute) {
        return(
          React__default['default'].createElement('button', { className: "CallToAction MainAction disabled"  , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 406}}, "Loading..."

          )
        )
      } else if(!this.props.route || this.props.route.approved) {
        return(this.renderPaymentButton())
      } else {
        return(
          React__default['default'].createElement('div', { className: "Table", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 414}}
            , React__default['default'].createElement('div', { className: "TableRow", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 415}}
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 416}}
                ,  this.renderApproveButton() 
              )
              , React__default['default'].createElement('div', { className: "TableCell", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 419}}
                , React__default['default'].createElement('button', { className: "CallToAction MainAction disabled"  , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 420}}, "Swap"

                )
              )
            )
          )
        )
      }
    }

    renderApproveButton() {
      if(this.state.approving) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.approving.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait for the approval transaction to be confirmed by the network. Click to open transaction on etherscan."                 , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 433}}, "Approving"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 435}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 436}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 437}}, ".")
          )
        )
      } else {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 442}}
            , dialogContext => (
              React__default['default'].createElement('button', { key: "approve", className: "CallToAction MainAction" , onClick: ()=>this.approve.bind(this)(dialogContext), title: "Click to approve that the selected token is allowed to be swapped for performing this payment. This approval is only required the first time you pay with the selected token."                             , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 444}}, "Approve"

              )
            )
          )
        )
      }
    }

    renderPaymentButton() {
      if(this.state.payed) {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 456}}
            , dialogContext => (
              React__default['default'].createElement('span', { className: "CallToAction MainAction circular"  , onClick:  dialogContext.closeContainer , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 458}}
                , React__default['default'].createElement(CheckMarkComponent, { className: "large", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 459}})
              )
            )
          )
        )
      } else if(this.state.paying) {
        return(
          React__default['default'].createElement('a', { target: "_blank", rel: "noopener noreferrer" , href:  'https://etherscan.io/tx/'+this.state.paying.transactionHash , key: "approving", className: "CallToAction MainAction loading"  , title: "Please wait payment transaction to be confirmed by the network. Click to open transaction on etherscan."               , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 466}}, "Swapping"

            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 468}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 469}}, ".")
            , React__default['default'].createElement('span', { className: "dot", __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 470}}, ".")
          )
        )
      } else if(this.props.route === null) {
        return(
          React__default['default'].createElement('button', { className: "CallToAction MainAction disabled"  , __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 475}}, "Swap"

          )
        )
      } else {
        return(
          React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 481}}
            , dialogContext => (
              React__default['default'].createElement(CallbackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$B, lineNumber: 483}}
                , callbackContext => (
                  React__default['default'].createElement('button', { className: "CallToAction MainAction" , onClick: ()=>this.pay.bind(this)(dialogContext, callbackContext), __self: this, __source: {fileName: _jsxFileName$B, lineNumber: 485}}, "Swap"

                  )
                )
              )
            )
          )
        )
      }
    }

  }

  var WalletTokensContext = React__default['default'].createContext();

  const _jsxFileName$C = "/Users/sebastian/Work/DePay/depay-widgets/src/providers/WalletTokensProvider.jsx";
  class WalletTokensProvider extends React__default['default'].Component {constructor(...args) { super(...args); WalletTokensProvider.prototype.__init.call(this); }
    __init() {this.state = {
      initializing: true
    };}

    componentDidMount() {
      this.loadWalletTokens()
        .then(this.addTokenImages)
        .then(this.filterForTokensWithBalance)
        .then(this.filterForExchangableTokens)
        .then(this.setBalancePerToken)
        .then(this.unshiftEther.bind(this))
        .then(this.filterForBalance)
        .then(function(tokens){
          if(this.props.afterInitialization) {
            this.props.afterInitialization(tokens);
          }
          this.setState({
            initializing: false,
            tokens: tokens
          });
        }.bind(this));
    }

    unshiftEther(tokens) {
      return new Promise(function(resolve, reject){
        this.props.wallet.balance().then(function(balance){
          let token = {
            name: 'Ether',
            address: ETH,
            symbol: 'ETH',
            decimals: 18,
            logoURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC',
            balance: balance.toString()
          };

          resolve([token].concat(tokens));
        }.bind(this));
      }.bind(this));
    }

    setBalancePerToken(tokens) {
      return Promise.resolve(tokens.map(function(token){
        return Object.assign(token, {
          balance: token.balance.toLocaleString('fullwide', {useGrouping:false})
        })
      }))
    }

    filterForBalance(tokens) {
      return Promise.resolve(tokens.filter(function(token){
        return ethers.ethers.BigNumber.from(token.balance).gt(0)
      }))
    }

    loadWalletTokens() {
      return new Promise(function(resolve, reject){
        fetch(`https://depay.fi/api/payment/${this.props.address}`).then(function(response){
          response.json().then(resolve);
        }.bind(this));
      }.bind(this));
    }

    addTokenImages(tokens) {
      return Promise.resolve(tokens.map(function(token){
        return Object.assign(token, {
          logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/"+ethers.ethers.utils.getAddress(token.address)+"/logo.png"
        })
      }))
    }

    filterForTokensWithBalance(tokens) {
      return new Promise(function(resolve){
        resolve(tokens.filter(function(token){
          return(token.balance > 0);
        }));
      });
    }

    filterForExchangableTokens(tokens) {
      return new Promise(function(resolve){
        Promise.all(tokens.map(function(token){
          return Exchanges.findRoutes(token.address)
        })).then(function(routesForTokensPerExchange){
          resolve(tokens.filter(function(token, index){
            return Object.keys(routesForTokensPerExchange[index]).length > 0
          }));
        });
      });
    }

    render() {
      return(
        React__default['default'].createElement(WalletTokensContext.Provider, { value: {
          initializing: this.state.initializing,
          tokens: this.state.tokens
        }, __self: this, __source: {fileName: _jsxFileName$C, lineNumber: 100}}
          , this.props.children
        )
      )
    }
  }

  const _jsxFileName$D = "/Users/sebastian/Work/DePay/depay-widgets/src/stacks/SwapStack.jsx";


  class SwapStack extends React__default['default'].Component {
    __init() {this.state = {
      from: null,
      fromAmount: null,
      to: null,
      toAmount: null
    };}

    constructor(props) {
      super(props);SwapStack.prototype.__init.call(this);  }

    changeFromAmount(amount) {
      this.setState({
        fromAmount: amount,
        toAmount: null
      });
    }


    changeToAmount(amount) {
      this.setState({
        toAmount: amount,
        fromAmount: null
      });
    }

    changeToTokenCallback(token, navigate) {
      this.setState({ 
        to: token,
        toAmount: null
      });
      navigate('back');
    }

    changeFromTokenCallback(token, navigate) {
      this.setState({ 
        from: token,
        fromAmount: null
      });
      navigate('back');
    }

    setFirstFromToken(tokens) {
      this.setState({ 
        from: tokens[0]
      });
    }

    swapFromTo() {
      this.setState({
        from: this.state.to,
        to: this.state.from,
        fromAmount: null,
        toAmount: this.state.fromAmount
      });
    }

    swapToFrom() {
      this.setState({
        from: this.state.to,
        to: this.state.from,
        fromAmount: this.state.toAmount,
        toAmount: null
      });
    }

    render() {
      return (
        React__default['default'].createElement(DialogContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$D, lineNumber: 94}}
          , dialogContext => (
            React__default['default'].createElement(WalletContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$D, lineNumber: 96}}
              , walletContext => (
                React__default['default'].createElement(WalletTokensProvider, {
                  address:  walletContext.address ,
                  wallet:  walletContext.wallet ,
                  afterInitialization:  this.setFirstFromToken.bind(this) , __self: this, __source: {fileName: _jsxFileName$D, lineNumber: 98}}
                
                  , React__default['default'].createElement(WalletTokensContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$D, lineNumber: 103}}
                    , walletTokensContext => (
                      React__default['default'].createElement(RouteProvider, {
                        from:  this.state.from ? this.state.from.address : null ,
                        fromAmount:  this.state.fromAmount ,
                        to:  this.state.to ? this.state.to.address : null ,
                        toAmount:  this.state.toAmount ,
                        wallet:  walletContext.wallet , __self: this, __source: {fileName: _jsxFileName$D, lineNumber: 105}}
                      
                        , React__default['default'].createElement(RouteContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$D, lineNumber: 112}}
                          , routeContext => (
                            React__default['default'].createElement(Stack, {
                              dialogs: {
                                Swap: React__default['default'].createElement(SwapDialog, {
                                  initializing:  walletTokensContext.initializing ,
                                  loadingRoute:  routeContext.loading ,
                                  changeFromAmount:  this.changeFromAmount.bind(this) ,
                                  changeToAmount:  this.changeToAmount.bind(this) ,
                                  swapFromTo:  this.swapFromTo.bind(this) ,
                                  swapToFrom:  this.swapToFrom.bind(this) ,
                                  from:  this.state.from ,
                                  fromAmount:  routeContext.fromAmount || this.state.fromAmount ,
                                  to:  this.state.to ,
                                  toAmount:  routeContext.toAmount || this.state.toAmount ,
                                  route :   routeContext.route ,
                                  receiver:  walletContext.address ,
                                  wallet:  walletContext.wallet , __self: this, __source: {fileName: _jsxFileName$D, lineNumber: 116}}
                                ),
                                ChangeFromToken: React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$D, lineNumber: 131}}
                                  , navigate => (
                                    React__default['default'].createElement(TokenSelectorDialog, {
                                      tokenList:  walletTokensContext.tokens ,
                                      disableImportTokens:  true ,
                                      dialogContext:   dialogContext ,
                                      callback:  (token)=> this.changeFromTokenCallback.bind(this)(token, navigate), __self: this, __source: {fileName: _jsxFileName$D, lineNumber: 133}}
                                    )
                                  )
                                ),
                                ChangeToToken: React__default['default'].createElement(NavigateStackContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$D, lineNumber: 141}}
                                  , navigate => (
                                    React__default['default'].createElement(TokenSelectorDialog, {
                                      dialogContext:  dialogContext ,
                                      callback:  (token)=> this.changeToTokenCallback.bind(this)(token, navigate), __self: this, __source: {fileName: _jsxFileName$D, lineNumber: 143}}
                                    )
                                  )
                                )
                              },
                              start: 'Swap', __self: this, __source: {fileName: _jsxFileName$D, lineNumber: 114}}
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }

  const _jsxFileName$E = "/Users/sebastian/Work/DePay/depay-widgets/src/Swap.jsx";


  function checkArguments$3(args){
    if(args.length == 0 || args.length > 1) {
      throw 'Unknown amount of arguments.'
    }
  }

  function checkAndPrepOptions$3(input) {
    var options = Object.assign({}, input); // shallow copy
    return options;
  }

  function Swap() {
    checkArguments$3(arguments);
    var options = checkAndPrepOptions$3(arguments[0]);
    const [shadowContainer, closeContainer, setClosable] = ShadowContainer();

    let unmountAndClose = function(){
      let closed = closeContainer();
      if(closed) { ReactDOM__default['default'].unmountComponentAtNode(shadowContainer); }
    };

    return new Promise(() => {
      ReactDOM__default['default'].render(
        React__default['default'].createElement(CallbackContext.Provider, { value: {
          callback: options.callback
        }, __self: this, __source: {fileName: _jsxFileName$E, lineNumber: 35}}
          , React__default['default'].createElement(DialogProvider, {
            closeContainer:  unmountAndClose ,
            setClosable:  setClosable , __self: this, __source: {fileName: _jsxFileName$E, lineNumber: 38}}
          
            , React__default['default'].createElement(WalletProvider, {__self: this, __source: {fileName: _jsxFileName$E, lineNumber: 42}}
              , React__default['default'].createElement(WalletContext.Consumer, {__self: this, __source: {fileName: _jsxFileName$E, lineNumber: 43}}
                , walletContext => (
                  React__default['default'].createElement(SwapStack, {
                    amount: options.amount,
                    token: options.token,
                    receiver: walletContext.wallet.address(), __self: this, __source: {fileName: _jsxFileName$E, lineNumber: 45}}
                  )
                )
              )
            )
          )
        )
        , shadowContainer
      );
    });
  }

  var index = {
    ethers: ethers.ethers,
    Donation,
    Payment,
    Sale: TokenSale,
    Selector,
    Swap,
  };

  Object.defineProperty(exports, 'ethers', {
    enumerable: true,
    get: function () {
      return ethers.ethers;
    }
  });
  exports.Donation = Donation;
  exports.Payment = Payment;
  exports.Sale = TokenSale;
  exports.Selector = Selector;
  exports.Swap = Swap;
  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
