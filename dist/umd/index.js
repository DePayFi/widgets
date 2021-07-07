(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DePayWidgets = factory());
}(this, (function () { 'use strict';

  let DePayWidgets = {
    Payment: function(){}
  };

  return DePayWidgets;

})));
