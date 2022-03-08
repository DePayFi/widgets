(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('@depay/react-dialog-stack'), require('@depay/web3-wallets'), require('react-dom'), require('@depay/react-shadow-dom'), require('ethers'), require('@depay/web3-constants'), require('decimal.js'), require('@depay/web3-exchanges'), require('@depay/web3-tokens'), require('@depay/local-currency'), require('@depay/web3-client'), require('@depay/web3-blockchains'), require('@depay/web3-payments'), require('react-rangeslider'), require('@depay/react-token-image')) :
  typeof define === 'function' && define.amd ? define(['react', '@depay/react-dialog-stack', '@depay/web3-wallets', 'react-dom', '@depay/react-shadow-dom', 'ethers', '@depay/web3-constants', 'decimal.js', '@depay/web3-exchanges', '@depay/web3-tokens', '@depay/local-currency', '@depay/web3-client', '@depay/web3-blockchains', '@depay/web3-payments', 'react-rangeslider', '@depay/react-token-image'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DePayWidgets = factory(global.React, global.ReactDialogStack, global.Web3Wallets, global.ReactDOM, global.ReactShadowDOM, global.ethers, global.Web3Constants, global.Decimal, global.Web3Exchanges, global.Web3Tokens, global.LocalCurrency, global.Web3Client, global.Web3Blockchains, global.Web3Payments, global.ReactRangeslider, global.ReactTokenImage));
}(this, (function (React, reactDialogStack, web3Wallets, ReactDOM, reactShadowDom, ethers, web3Constants, decimal_js, web3Exchanges, web3Tokens, localCurrency, web3Client, web3Blockchains, web3Payments, Slider, reactTokenImage) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var Slider__default = /*#__PURE__*/_interopDefaultLegacy(Slider);

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime_1 = createCommonjsModule(function (module) {
  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    });
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    define(Gp, iteratorSymbol, function() {
      return this;
    });

    define(Gp, "toString", function() {
      return "[object Generator]";
    });

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
  });

  var regenerator = runtime_1;

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  var ClosableContext = /*#__PURE__*/React__default['default'].createContext();

  var UpdatableContext = /*#__PURE__*/React__default['default'].createContext();

  var ClosableProvider = (function (props) {
    var _useState = React.useState(true),
        _useState2 = _slicedToArray(_useState, 2),
        closable = _useState2[0],
        setClosable = _useState2[1];

    var _useState3 = React.useState(true),
        _useState4 = _slicedToArray(_useState3, 2),
        open = _useState4[0],
        setOpen = _useState4[1];

    var _useContext = React.useContext(UpdatableContext),
        setUpdatable = _useContext.setUpdatable;

    var close = function close() {
      if (props.closable === false) {
        return;
      }

      if (!closable) {
        return;
      }

      setUpdatable(false);
      setOpen(false);
      setTimeout(props.unmount, 300);
    };

    return /*#__PURE__*/React__default['default'].createElement(ClosableContext.Provider, {
      value: {
        closable: closable,
        setClosable: setClosable,
        close: close,
        open: open,
        setOpen: setOpen
      }
    }, props.children);
  });

  var ChevronLeft = (function () {
    return /*#__PURE__*/React__default['default'].createElement("svg", {
      className: "ChevronLeft Icon",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, /*#__PURE__*/React__default['default'].createElement("path", {
      strokeWidth: "1",
      fillRule: "evenodd",
      d: "M10.4,1.6c0.2,0.2,0.2,0.5,0,0.7L4.7,8l5.6,5.6c0.2,0.2,0.2,0.5,0,0.7s-0.5,0.2-0.7,0l-6-6l0,0,c-0.2-0.2-0.2-0.5,0-0.7l6-6l0,0C9.8,1.5,10.2,1.5,10.4,1.6L10.4,1.6z"
    }));
  });

  var CloseIcon = (function () {
    return /*#__PURE__*/React__default['default'].createElement("svg", {
      className: "CloseIcon Icon",
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default['default'].createElement("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /*#__PURE__*/React__default['default'].createElement("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    }));
  });

  var Dialog$1 = (function (props) {
    var _useContext = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext.navigate;

    var _useContext2 = React.useContext(ClosableContext),
        close = _useContext2.close,
        closable = _useContext2.closable;

    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: "Dialog"
    }, /*#__PURE__*/React__default['default'].createElement("div", {
      className: ["DialogHeader", props.stacked ? 'TextCenter' : ''].join(' ')
    }, props.stacked && /*#__PURE__*/React__default['default'].createElement("div", {
      className: "DialogHeaderActionLeft PaddingTopS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React__default['default'].createElement("button", {
      onClick: function onClick() {
        return navigate('back');
      },
      className: "ButtonCircular",
      title: "Go back"
    }, /*#__PURE__*/React__default['default'].createElement(ChevronLeft, null))), props.header, /*#__PURE__*/React__default['default'].createElement("div", {
      className: "DialogHeaderActionRight PaddingTopS PaddingLeftS PaddingRightS"
    }, closable && /*#__PURE__*/React__default['default'].createElement("button", {
      onClick: close,
      className: "ButtonCircular",
      title: "Close dialog"
    }, /*#__PURE__*/React__default['default'].createElement(CloseIcon, null)))), /*#__PURE__*/React__default['default'].createElement("div", {
      className: ["DialogBody", props.bodyClassName].join(' ')
    }, props.body), /*#__PURE__*/React__default['default'].createElement("div", {
      className: "DialogFooter"
    }, props.footer));
  });

  var ConnectingWalletDialog = (function (props) {
    var _useState = React.useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        showConnectButton = _useState2[0],
        setShowConnectButton = _useState2[1];

    var _useContext = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext.navigate;

    var wallet = props.wallet;
    wallet !== null && wallet !== void 0 && wallet.name ? wallet.name : 'wallet';
    var walletLogo = wallet !== null && wallet !== void 0 && wallet.logo ? wallet.logo : undefined;
    React.useEffect(function () {
      var timeout = setTimeout(function () {
        return setShowConnectButton(true);
      }, 10000);
      return function () {
        return clearTimeout(timeout);
      };
    }, []);

    if (props.pending) {
      return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
        stacked: true,
        body: /*#__PURE__*/React__default['default'].createElement("div", {
          className: "TextCenter"
        }, walletLogo && /*#__PURE__*/React__default['default'].createElement("div", {
          className: "GraphicWrapper PaddingTopS PaddingBottomS"
        }, /*#__PURE__*/React__default['default'].createElement("img", {
          className: "Graphic",
          src: walletLogo
        })), /*#__PURE__*/React__default['default'].createElement("h1", {
          className: "LineHeightL Text FontSizeL FontWeightBold PaddingTopS"
        }, "Connect Wallet"), /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
        }, /*#__PURE__*/React__default['default'].createElement("strong", {
          className: "FontSizeM PaddingLeftM PaddingRightM"
        }, "Your wallet is already open and asking for permission to connect. Please find your wallet dialog and confirm this connection.")))
      });
    } else {
      return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
        stacked: true,
        body: /*#__PURE__*/React__default['default'].createElement("div", {
          className: "TextCenter"
        }, walletLogo && /*#__PURE__*/React__default['default'].createElement("div", {
          className: "GraphicWrapper PaddingTopS PaddingBottomS"
        }, /*#__PURE__*/React__default['default'].createElement("img", {
          className: "Graphic",
          src: walletLogo
        })), /*#__PURE__*/React__default['default'].createElement("h1", {
          className: "LineHeightL Text FontSizeL FontWeightBold PaddingTopS"
        }, "Connect Wallet"), /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
        }, /*#__PURE__*/React__default['default'].createElement("p", {
          className: "FontSizeM PaddingLeftM PaddingRightM"
        }, "Access to your wallet is required. Please login and authorize access to your account to continue."), /*#__PURE__*/React__default['default'].createElement("div", {
          className: "PaddingTopS"
        }, /*#__PURE__*/React__default['default'].createElement("button", {
          onClick: function onClick() {
            return navigate('back');
          },
          className: "TextButton"
        }, "Connect with another wallet")))),
        footer: showConnectButton && /*#__PURE__*/React__default['default'].createElement("div", {
          className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
        }, /*#__PURE__*/React__default['default'].createElement("button", {
          className: "ButtonPrimary",
          onClick: function onClick() {
            return props.connect(wallet);
          }
        }, "Connect"))
      });
    }
  });

  var ChevronRight = (function () {
    return /*#__PURE__*/React__default['default'].createElement("svg", {
      className: "ChevronRight Icon",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, /*#__PURE__*/React__default['default'].createElement("path", {
      strokeWidth: "1",
      fillRule: "evenodd",
      d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
    }));
  });

  var SelectWalletDialog = (function (props) {
    var _useState = React.useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        showExplanation = _useState2[0],
        setShowExplanation = _useState2[1];

    var _useContext = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext.navigate;

    var wallet = web3Wallets.getWallet();
    React.useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var accounts;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!wallet) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return wallet.accounts();

            case 3:
              accounts = _context.sent;

              if (accounts == undefined || accounts.length == 0) {
                navigate('ConnectingWallet');
              }

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), [wallet]);

    var connect = function connect(walletClass) {
      var wallet = new walletClass();
      props.setWallet(wallet);
      navigate('ConnectingWallet');
      props.connect(wallet);
    };

    var availableWallets = [web3Wallets.wallets.WalletConnect];

    if (wallet) {
      availableWallets.unshift(wallet.constructor);
    }

    var walletCards = availableWallets.map(function (wallet, index) {
      return /*#__PURE__*/React__default['default'].createElement("div", {
        key: index,
        className: "PaddingBottomXS"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "Card small",
        title: "Connect ".concat(wallet.info.name),
        onClick: function onClick() {
          return connect(wallet);
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "transparent",
        src: wallet.info.logo
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBodyWrapper PaddingLeftXS"
      }, /*#__PURE__*/React__default['default'].createElement("h2", {
        className: "CardText FontWeightBold"
      }, wallet.info.name)))));
    });
    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Select a wallet")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingBottomS PaddingLeftS PaddingRightS"
      }, walletCards),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "FontSizeS FontWeightBold TextButton",
        onClick: function onClick() {
          return setShowExplanation(!showExplanation);
        }
      }, /*#__PURE__*/React__default['default'].createElement("strong", {
        className: "Opacity05"
      }, "What is a wallet?")), showExplanation && /*#__PURE__*/React__default['default'].createElement("p", {
        className: "PaddingLeftM PaddingRightM"
      }, "Wallets are used to send, receive, and store digital assets. Wallets come in many forms. They are either built into your browser, an extension added to your browser, a piece of hardware plugged into your computer or even an app on your phone."))
    });
  });

  var ConnectStack = (function (props) {
    var _useContext = React.useContext(ClosableContext),
        open = _useContext.open,
        close = _useContext.close;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        pending = _useState2[0],
        setPending = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        wallet = _useState4[0],
        setWallet = _useState4[1];

    var connect = function connect(wallet) {
      wallet.connect().then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var accounts;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return wallet.accounts();

              case 2:
                accounts = _context.sent;

                if (accounts instanceof Array && accounts.length > 0) {
                  if (props.autoClose) close();
                  if (props.resolve) props.resolve({
                    wallet: wallet,
                    account: accounts[0],
                    accounts: accounts
                  });
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })))["catch"](function (error) {
        setPending(false);

        if ((error === null || error === void 0 ? void 0 : error.code) == 4001) {
          // User rejected the request.
          return;
        } else if ((error === null || error === void 0 ? void 0 : error.code) == -32002) {
          // Request of type 'wallet_requestPermissions' already pending...
          setPending(true);
          return;
        } else {
          if (props.reject) props.reject(error);
        }
      });
    };

    React.useEffect(function () {
      var wallet = web3Wallets.getWallet();

      if (wallet) {
        setWallet(wallet);
      }
    }, []);
    React.useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
      var accounts;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!wallet) {
                _context2.next = 5;
                break;
              }

              _context2.next = 3;
              return wallet.accounts();

            case 3:
              accounts = _context2.sent;

              if (accounts instanceof Array && accounts.length > 0) {
                if (props.resolve) props.resolve({
                  wallet: wallet,
                  account: accounts[0],
                  accounts: accounts
                });
              } else {
                connect(wallet);
              }

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), [wallet]);
    return /*#__PURE__*/React__default['default'].createElement(reactDialogStack.ReactDialogStack, {
      open: open,
      close: close,
      start: "SelectWallet",
      container: props.container,
      document: props.document,
      dialogs: {
        SelectWallet: /*#__PURE__*/React__default['default'].createElement(SelectWalletDialog, {
          setWallet: setWallet,
          connect: connect
        }),
        ConnectingWallet: /*#__PURE__*/React__default['default'].createElement(ConnectingWalletDialog, {
          wallet: wallet,
          pending: pending,
          connect: connect
        })
      }
    });
  });

  var ensureDocument = (function (document) {
    if (typeof document === 'undefined') {
      return window.document;
    } else {
      return document;
    }
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  var ErrorContext = /*#__PURE__*/React__default['default'].createContext();

  var ErrorGraphic = "data:image/png;base64,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";

  function ReactDialogStyle (styles) {
    let background =
      typeof styles === 'object' && styles.background ? styles.background : 'rgba(0,0,0,0.4)';

    return `
    .ReactDialog {
      bottom: 0;
      display: flex;
      height: 100%;
      height: 100vh;
      left: 0;
      min-height: 100%;
      min-height: 100vh;
      overflow: hidden;
      position: fixed;
      right: 0;
      top: 0;
      width: 100%;
      width: 100vw;
    }

    .ReactDialogInner {
      align-items: center;
      display: flex;
      flex: 1;
      justify-content: center;
    }

    .ReactDialogBackground {
      background: ${background};
      bottom: 0;
      display: block;
      height: 100%;
      left: 0;
      opacity: 0;
      position: fixed;
      right: 0;
      top: 0;
      transition: opacity 0.4s ease;
      width: 100%;
    }

    .ReactDialog.ReactDialogOpen .ReactDialogBackground {
      opacity: 1;
    }

    .ReactDialogAnimation {
      display: inline-block;
      position: relative;
      opacity: 0;
      top: -17vh;
      transition: opacity 0.4s ease, top 0.4s ease;
    }

    .ReactDialog.ReactDialogOpen .ReactDialogAnimation {
      opacity: 1.0;
      top: -5vh;
    }
  `
  }

  const _jsxFileName = "/home/runner/work/react-dialog/react-dialog/src/components/Dialog.jsx";
  class Dialog extends React__default['default'].Component {
    constructor(props) {
      super(props);

      this.handler = this.onKeyDown.bind(this);

      this.state = {
        open: true,
      };
    }

    closeDialog() {
      this.props.close();
    }

    onKeyDown(event) {
      if (event.key === 'Escape') {
        this.closeDialog();
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.open === false && prevProps.open === true) {
        this.setState({ open: false });
      }
    }

    onClickBackground(event) {
      this.closeDialog();
    }

    componentDidMount() {
      this.setState({ open: false }, () => {
        // make sure state is false first before opening the dialog
        // to ensure opening is animated
        setTimeout(() => {
          this.setState({ open: true });
        }, 10);
      });
      this.props.document.addEventListener('keydown', this.handler, true);
    }

    componentWillUnmount() {
      this.props.document.removeEventListener('keydown', this.handler, true);
    }

    render() {
      const classNames = ['ReactDialog', this.state.open ? 'ReactDialogOpen' : ''];
      const style = ReactDialogStyle({ background: this.props.background });
      return (
        React__default['default'].createElement('div', { className: classNames.join(' '), __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
          , React__default['default'].createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}, style)
          , React__default['default'].createElement('div', { className: "ReactDialogInner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
            , React__default['default'].createElement('div', { className: "ReactDialogBackground", onClick: this.onClickBackground.bind(this), __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}} )
            , this.props.children
          )
        )
      )
    }
  }

  const _jsxFileName$1 = "/home/runner/work/react-dialog/react-dialog/src/index.jsx";
  class ReactDialog extends React__default['default'].Component {
    constructor(props) {
      super(props);

      this.state = {
        open: props.open,
      };
    }

    componentDidUpdate(prevProps) {
      if (this.props.open === false && prevProps.open === true) {
        setTimeout(() => {
          this.setState({ open: false });
        }, 400);
      } else if (this.props.open === true && prevProps.open === false) {
        this.setState({ open: true });
      }
    }

    render() {
      let _document = this.props.document || document;
      let container = this.props.container || _document.body;
      if (this.state.open) {
        return ReactDOM__default['default'].createPortal(
          React__default['default'].createElement(Dialog, {
            background: this.props.background,
            close: this.props.close,
            document: _document,
            open: this.props.open, __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 29}}
          
            , this.props.children
          ),
          container,
        )
      } else {
        // enforces unmount
        return null
      }
    }
  }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
    _inherits(ErrorBoundary, _React$Component);

    var _super = _createSuper(ErrorBoundary);

    function ErrorBoundary(props) {
      _classCallCheck(this, ErrorBoundary);

      return _super.call(this, props);
    }

    _createClass(ErrorBoundary, [{
      key: "componentDidCatch",
      value: function componentDidCatch(error, errorInfo) {
        this.props.setError(error);
      }
    }, {
      key: "render",
      value: function render() {
        return this.props.children;
      }
    }]);

    return ErrorBoundary;
  }(React__default['default'].Component);

  var ErrorProvider = (function (props) {
    var _useState = React.useState(props.error),
        _useState2 = _slicedToArray(_useState, 2),
        error = _useState2[0],
        setError = _useState2[1];

    var _useState3 = React.useState(true),
        _useState4 = _slicedToArray(_useState3, 2),
        open = _useState4[0],
        setOpen = _useState4[1];

    var setErrorFromChildren = function setErrorFromChildren(error) {
      setError(error);

      if (props.errorCallback) {
        props.errorCallback(error);
      }
    };

    var close = function close() {
      setOpen(false);
      setTimeout(props.unmount, 300);
    };

    if (error) {
      console.log(error);
      return /*#__PURE__*/React__default['default'].createElement(ReactDialog, {
        container: props.container,
        close: close,
        open: open
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Dialog ReactDialogAnimation"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "DialogHeader"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftS PaddingRightS"
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "DialogBody TextCenter"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "GraphicWrapper PaddingTopS"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "Graphic",
        src: ErrorGraphic
      })), /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
      }, "Oops, Something Went Wrong"), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftS PaddingRightS"
      }, /*#__PURE__*/React__default['default'].createElement("pre", {
        className: "ErrorSnippetText"
      }, error.toString())), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("strong", {
        className: "FontSizeM PaddingTopS"
      }, "If this keeps happening, please report it.")))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "DialogFooter"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "ButtonPrimary",
        onClick: close
      }, "Try again")))));
    } else {
      return /*#__PURE__*/React__default['default'].createElement(ErrorContext.Provider, {
        value: {
          setError: setErrorFromChildren,
          errorCallback: props.errorCallback
        }
      }, /*#__PURE__*/React__default['default'].createElement(ErrorBoundary, {
        setError: setErrorFromChildren
      }, props.children));
    }
  });

  var AlertStyle = (function (style) {
    return "\n\n    .Alert {\n      background: rgba(0,0,0,0.08);\n      border-radius: 0.4rem;\n      font-weight: 500;\n      padding: 0.5rem;\n    }\n  ";
  });

  var BlockchainLogoStyle = (function (style) {
    return "\n\n    .BlockchainLogo {\n      border-radius: 999px;\n    }\n\n    .BlockchainLogo.small {\n      height: 18px;\n      width: 18px;\n    }\n  ";
  });

  var ButtonCircularStyle = (function () {
    return "\n\n    .ButtonCircular {\n      border-radius: 99rem;\n      cursor: pointer;\n      height: 34px;\n      opacity: 0.5;\n      padding: 5px 4px 4px 4px;\n      width: 34px;\n    }\n\n    .ButtonCircular:hover {\n      background: rgba(0,0,0,0.1);\n      opacity: 1;\n    }\n\n    .ButtonCircular:active {\n      background: rgba(0,0,0,0.25);\n      opacity: 1;\n    }\n  ";
  });

  var ButtonPrimaryStyle = (function (style) {
    return "\n\n    .ButtonPrimary {\n      align-items: center;\n      align-self: center;\n      background: ".concat(style.colors.primary, ";\n      border-radius: 0.8rem;\n      border: 1px solid transparent;\n      box-shadow: 0 0 16px rgba(0,0,0,0.1);\n      font-size: 1.3rem;\n      font-weight: 400;\n      line-height: 2.8rem;\n      height: 3.6rem;\n      justify-content: center;\n      width: 100%;\n      overflow: hidden;\n      padding: 0.4rem 0;\n      position: relative;\n      text-align: center;\n      text-decoration: none;\n      text-overflow: ellipsis;\n      transition: background 0.1s;\n      vertical-align: middle;\n      display: inline-block;\n    }\n\n    .ButtonPrimary, .ButtonPrimary * {\n      color: ").concat(style.colors.buttonText, ";\n    }\n\n    .ButtonPrimary.disabled {\n      background: rgb(210,210,210);\n      color: rgb(140,140,140);\n    }\n\n    .ButtonPrimary:not(.disabled){\n      cursor: pointer;\n    }\n    .ButtonPrimary:not(.disabled):hover {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.1);\n    }\n    .ButtonPrimary:not(.disabled):active {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);\n    }\n  ");
  });

  var CardStyle = (function (style) {
    return "\n\n    .Card {\n      align-items: center;\n      background: rgb(255,255,255);\n      border-radius: 0.8rem;\n      box-shadow: 0 0 8px rgba(0,0,0,0.03);\n      cursor: pointer;\n      display: flex;\n      flex-direction: row;\n      margin-bottom: 0.5rem;\n      min-height: 4.78rem;\n      padding: 1rem 0.6rem;\n      width: 100%;\n    }\n\n    .Card.Row {\n      border-radius: 0;\n      margin-bottom: 0;\n      box-shadow: none;\n      min-height: 4.3rem;\n      padding: 0.4rem 1.3rem;\n      border-top: 1px solid rgba(0,0,0,0.05);\n    }\n\n    .Card.Row .CardText {\n      font-size: 1.2rem;\n    }\n\n    .CardTokenSymbol {\n      width: 40%;\n      min-width: 0;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .CardTokenName {\n      text-align: right;\n      opacity: 0.5;\n      width: 60%;\n      min-width: 0;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n    \n    .Card.Row .CardTokenName .CardText {\n      font-size: 1rem;\n    }\n\n    .Card.Row .CardImage {\n      width: 2.5rem;\n    }\n\n    .Card.Row .CardImage img {\n      height: 1.9rem;\n      width: 1.9rem;\n    }\n\n    a.Card, a.Card * {\n      color: inherit;\n      text-decoration: none;\n    }\n\n    .Card.transparent {\n      background: none;\n      box-shadow: none;\n    }\n\n    .Card.small {\n      min-height: auto;\n      padding: 0.5rem 0.5rem;\n      margin: 0;\n    }\n\n    .CardImage.small {\n      width: 1.7rem;\n    }\n\n    .CardImage.small img {\n      height: 1.4rem;\n      width: 1.4rem;\n    }\n\n    .Card.disabled {\n      cursor: default;\n    }\n\n    .Card:hover:not(.disabled) {\n      background: rgb(240,240,240);\n      box-shadow: 0 0 0 rgba(0,0,0,0); \n    }\n\n    .Card:active:not(.disabled) {\n      background: rgb(235,235,235);\n      box-shadow: inset 0 0 6px rgba(0,0,0,0.02);\n      color: inherit;\n    }\n\n    .Card:hover:not(.disabled) .CardAction {\n      opacity: 0.4;\n    }\n\n    .CardImage, .CardBody, .CardAction, .CardInfo {\n      align-items: center;\n      display: flex;\n      min-width: 0;\n      padding: 0 0.4rem;\n    }\n\n    .CardImage {\n      flex-basis: auto;\n      flex-grow: 0;\n      flex-shrink: 0;\n      justify-content: center;\n      position: relative;\n      width: 3.6rem;\n    }\n\n    .CardBody {\n      flex-basis: auto;\n      flex-grow: 1;\n      flex-shrink: 1;\n      line-height: 1.4rem;\n      padding-left: 0.6rem;\n      text-align: left;\n    }\n\n    .CardBodyWrapper {\n      min-width: 0;\n    }\n\n    .CardAction {\n      flex-basis: auto;\n      flex-shrink: 0;\n      flex-grow: 0;\n      padding-right: 0;\n      margin-left: auto;\n    }\n\n    .Card.disabled .CardAction {\n      opacity: 0;  \n    }\n\n    .CardInfo {\n      display: flex;\n      flex-basis: auto;\n      flex-direction: column;\n      flex-grow: 0;\n      flex-shrink: 1;\n      justify-content: center;\n      margin-left: auto; \n      padding-right: 0;\n    }\n\n    .CardImage img {\n      background: white;\n      border-radius: 99rem;\n      border: 1px solid white;\n      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);\n      height: 2.8rem;\n      position: relative;\n      vertical-align: middle;\n      width: 2.8rem;\n    }\n\n    .CardImage img.transparent {\n      border: none;\n      background: none;\n      box-shadow: none;\n    }\n    \n    .CardImage .BlockchainLogo {\n      position: absolute;\n      bottom: 0;\n      right: 0;\n    }\n\n    .CardTitle {\n      font-size: 0.9rem;\n      color: rgb(150,150,150);\n    }\n    \n    .CardText, a .CardText {\n      color: ".concat(style.colors.text, ";\n      flex: 1;\n      font-size: 1.3rem;\n    }\n\n    .CardText strong {\n      font-weight: 500;\n    }\n\n    .CardText small {\n      font-size: 1.1rem;\n      color: rgb(150,150,150);\n    }\n\n    .CardAction {\n      opacity: 0.2;\n    }\n\n    .Card.More {\n      display: inline-block;\n      text-align: center;\n    }\n  ");
  });

  var DialogStyle = (function (style) {
    return "\n\n    .ReactDialogBackground {\n      backdrop-filter: blur(5px);\n      background: rgba(0,0,0,0.7);\n    }\n\n    .Dialog {\n      margin: 0 auto;\n      position: relative;\n      width: 420px;\n      box-shadow: 0 0 20px rgba(0,0,0,0.1);\n      border-radius: 0.8rem;\n      background: rgb(248,248,248);\n    }\n\n    @media (max-width: 450px) {\n\n      .Dialog {\n        border-radius: 0;\n        width: 100%;\n      }\n\n\n      .DialogHeader {\n        border-top-left-radius: 0 !important;\n        border-top-right-radius: 0 !important;\n      }\n    }\n\n    @media (orientation: portrait) and (max-width: 800px) {\n\n      .ReactDialogAnimation {\n        width: 100%;\n      }\n\n      .ReactDialog {\n        height: 100%;\n        min-height: 100%;\n      }\n\n      .ReactDialogStack {\n        align-items: flex-end;\n      }\n\n      .Dialog {\n        align-content: stretch;\n        border-radius: 0.8rem;\n        border-top-radius: 0.8rem;\n        display: flex;\n        flex-direction: column;\n      }\n\n      .DialogBody {\n        flex: 1;\n        align-items: flex-end;\n      }\n\n      .DialogFooter {\n        padding-bottom: 20px;\n      }\n\n      .ReactDialogAnimation {\n        margin-bottom: -100px !important;\n        top: inherit !important;\n        position: relative;\n        transition: opacity 0.4s ease, margin-bottom 0.4s ease;\n      }\n\n      .ReactDialog.ReactDialogOpen .ReactDialogAnimation {\n        margin-bottom: 0px !important;\n      }\n\n      .DialogFooter {\n        border-bottom-left-radius: 0 !important;\n        border-bottom-right-radius: 0 !important;\n      }\n\n      .ReactShadowDOMInsideContainer > .ReactDialog {\n        align-items: flex-end;\n      }\n    }\n\n    .DialogBody {\n      background: rgb(248,248,248);\n      overflow-x: hidden;\n      overflow-y: auto;\n    }\n\n    .DialogBody.ScrollHeight {\n      height: 30vh !important;\n      max-height: 30vh !important;\n    }\n\n    .DialogHeader {\n      background: rgb(248,248,248);\n      border-top-left-radius: 0.8rem;\n      border-top-right-radius: 0.8rem;\n      min-height: 3.4rem;\n      position: relative;\n      width: 100%;\n    }\n\n    .DialogHeaderActionRight {\n      position: absolute;\n      top: 0;\n      right: 0;\n      height: 3rem;\n    }\n\n    .DialogHeaderActionLeft {\n      position: absolute;\n      top: 0;\n      left: 0;\n      height: 3rem;\n    }\n\n    .DialogFooter {\n      background: rgb(248,248,248);\n      border-bottom-left-radius: 0.8rem;\n      border-bottom-right-radius: 0.8rem;\n      line-height: 1.5rem;\n      min-height: 2rem;\n      position: relative;\n      text-align: center;\n    }\n\n  ";
  });

  var FontStyle = (function (style) {
    return "\n\n    *, div, div * {\n      font-family: ".concat(style.fontFamily, ";\n    }\n\n    .FontSizeS {\n      font-size: 1rem;\n    }\n\n    .FontSizeM {\n      font-size: 1.2rem;\n    }\n\n    .FontSizeL {\n      font-size: 1.4rem;\n    }\n\n    .FontSizeXL {\n      font-size: 2.0rem;\n    }\n\n    .FontWeightBold {\n      font-weight: bold;\n    }\n\n    .FontItalic {\n      font-style: italic;\n    }\n  ");
  });

  var GraphicStyle = (function () {
    return "\n\n    .GraphicWrapper {\n      display: block;\n    }\n\n    .Graphic {\n      width: 50%;\n      position: relative;\n    }\n  ";
  });

  var HeightStyle = (function () {
    return "\n\n    .MaxHeight {\n      max-height: 320px;\n      overflow-y: auto;\n    }\n  ";
  });

  var IconStyle = (function (style) {
    return "\n\n    .Icon {\n      fill : ".concat(style.colors.icons, ";\n      stroke : ").concat(style.colors.icons, ";\n    }\n\n    .ChevronLeft, .ChevronRight {\n      position: relative;\n      top: 1px;\n    }\n\n    .Checkmark {\n      height: 24px;\n      position: relative;\n      top: -1px;\n      vertical-align: middle;\n      width: 24px;\n    }\n\n    .AlertIcon {\n      height: 20px;\n      position: relative;\n      top: -1px;\n      vertical-align: middle;\n      width: 20px;\n      fill: #e42626;\n      stroke: transparent;\n    }\n\n    .CheckMark.small {\n      height: 16px;\n      width: 16px;\n    }\n\n    .DigitalWalletIcon {\n      height: 24px;\n      position: relative;\n      top: -1px;\n      vertical-align: middle;\n      width: 24px;\n    }\n\n    .ButtonPrimary .Icon {\n      fill : ").concat(style.colors.buttonText, ";\n      stroke : ").concat(style.colors.buttonText, ";\n    }\n\n    .Loading {\n      border: 3px solid ").concat(style.colors.primary, ";\n      border-top: 3px solid rgba(0,0,0,0.1);\n      border-radius: 100%;\n      position: relative;\n      left: -1px;\n      width: 18px;\n      height: 18px;\n      animation: spin 1.5s linear infinite;\n    }\n\n    @keyframes spin {\n      0% { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    }\n  ");
  });

  var ImageStyle = (function (style) {
    return "\n\n    .MaxAmountImage {\n      display: inline-block;\n      padding-right: 6px;\n    }\n    \n    .MaxAmountImage img {\n      height: 16px;\n      width: 16px;\n      position: relative;\n      top: 3px;\n    }\n  ";
  });

  var InputStyle = (function (style) {
    return "\n\n    .Input {\n      background: none;\n      border: 1px solid transparent;\n      margin: 0;\n      outline: none !important;\n      padding: 0 0 0 14px;\n      width: 100%;\n    }\n\n    .Input::placeholder {\n      color: rgb(210,210,210);\n    }\n    \n  ";
  });

  var LabelStyle = (function (style) {
    return "\n\n    .Label {\n      background: rgb(248,248,248);\n      border-radius: 999px;\n      color: ".concat(style.colors.primary, ";\n      font-size: 0.8rem;\n      padding: 0.1rem 0.5rem;\n      margin: 0.1rem;\n    }\n\n  ");
  });

  var LinkStyle = (function (style) {
    return "\n\n    .Link {\n      color: ".concat(style.colors.primary, ";\n      cursor: pointer;\n      text-decoration: none;\n    }\n\n    .Link:hover {\n      filter: brightness(0.8);\n    }\n\n    .Link:active {\n      filter: brightness(1.0);\n    }\n  ");
  });

  var LoadingTextStyle = (function (style) {
    return "\n\n    .LoadingText {\n      color: ".concat(style.colors.buttonText, ";\n      display: inline-block;\n      text-decoration: none;\n    }\n\n    @keyframes blink {\n      0% { opacity: .2; }\n      20% { opacity: 1; }\n      100% { opacity: .2; }\n    }\n    \n    .LoadingText .dot {\n      animation-name: blink;\n      animation-duration: 1.4s;\n      animation-iteration-count: infinite;\n      animation-fill-mode: both;\n    }\n    \n    .LoadingText .dot:nth-child(2) {\n      animation-delay: .2s;\n    }\n    \n    .LoadingText .dot:nth-child(3) {\n      animation-delay: .4s;\n    }\n  ");
  });

  var OpacityStyle = (function (style) {
    return "\n\n    .Opacity05 {\n      opacity: 0.5;\n    }\n  ";
  });

  var PaddingStyle = (function () {
    return "\n\n    .PaddingTopXS {\n      padding-top: 0.2rem;\n    }\n\n    .PaddingRightXS {\n      padding-right: 0.2rem;\n    }\n\n    .PaddingBottomXS {\n      padding-bottom: 0.2rem;\n    }\n\n    .PaddingLeftXS {\n      padding-left: 0.2rem; \n    }\n\n    .PaddingTopS {\n      padding-top: 0.8rem;\n    }\n\n    .PaddingRightS {\n      padding-right: 0.8rem;\n    }\n\n    .PaddingBottomS {\n      padding-bottom: 0.8rem;\n    }\n\n    .PaddingLeftS {\n      padding-left: 0.8rem; \n    }\n\n    .PaddingTopM {\n      padding-top: 1.2rem;\n    }\n\n    .PaddingRightM {\n      padding-right: 1.2rem;\n    }\n\n    .PaddingBottomM {\n      padding-bottom: 1.2rem;\n    }\n\n    .PaddingLeftM {\n      padding-left: 1.2rem; \n    }\n\n    .PaddingTopL {\n      padding-top: 1.8rem;\n    }\n\n    .PaddingRightL {\n      padding-right: 1.8rem;\n    }\n\n    .PaddingBottomL {\n      padding-bottom: 1.8rem;\n    }\n\n    .PaddingLeftL {\n      padding-left: 1.28em; \n    }\n  ";
  });

  var PoweredByStyle = (function (style) {
    return "\n\n    .PoweredByWrapper {\n      display: block;\n      left: 0;\n      padding-top: 0.2rem;\n      position: fixed;\n      right: 0;\n      text-align: center;\n      top: 0;\n    }\n\n    .PoweredByLink {\n      font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\" !important;\n      color: white;\n      opacity: 0.4;\n      display: inline-block;\n      font-size: 0.78rem;\n      font-style: italic;\n      font-weight: bold;\n      letter-spacing: -0.2px;\n      margin-left: 0.5rem;\n      text-decoration: none;\n    }\n\n    .PoweredByLink:hover, .PoweredByLink:active {\n      opacity: 1.0;\n      color: ".concat(style.colors.primary, ";\n    }\n  ");
  });

  var RangeSliderStyle = (function (style) {
    return "\n\n    .rangeslider {\n      margin: 20px 0;\n      position: relative;\n      background: #e6e6e6;\n      -ms-touch-action: none;\n      touch-action: none;\n    }\n\n    .rangeslider,\n    .rangeslider__fill {\n      display: block;\n      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);\n    }\n\n    .rangeslider__handle {\n      outline: none;\n      cursor: pointer;\n      display: inline-block;\n      position: absolute;\n      border-radius: 50%;\n      background-color: " + style.colors.primary + ";\n      border: 1px solid white;\n      box-shadow: 0 0 8px rgba(0,0,0,0.1);\n    }\n\n    .rangeslider__handle:hover {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);\n    }\n\n    .rangeslider__handle:active {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.3);\n    }\n\n    .rangeslider__active {\n      opacity: 1;\n    }\n\n    .rangeslider__handle-tooltip {\n      display: none;\n    }\n\n    .rangeslider-horizontal {\n      height: 12px;\n      border-radius: 10px;\n    }\n\n    .rangeslider-horizontal .rangeslider__fill {\n      height: 100%;\n      background-color: " + style.colors.primary + ";\n      border-radius: 10px;\n      top: 0;\n    }\n    .rangeslider-horizontal .rangeslider__handle {\n      width: 18px;\n      height: 18px;\n      border-radius: 30px;\n      top: 50%;\n      transform: translate3d(-50%, -50%, 0);\n    }\n\n\n    .rangeslider-horizontal .rangeslider__handle-tooltip {\n      top: -55px;\n    }\n\n  ";
  });

  var ResetStyle = (function () {
    return "\n\n      html, body, div, span, applet, object, iframe,\n      h1, h2, h3, h4, h5, h6, p, blockquote, pre,\n      a, abbr, acronym, address, big, cite, code,\n      del, dfn, em, img, ins, kbd, q, s, samp,\n      small, strike, strong, sub, sup, tt, var,\n      b, u, i, center,\n      dl, dt, dd, ol, ul, li,\n      fieldset, form, label, legend,\n      table, caption, tbody, tfoot, thead, tr, th, td,\n      article, aside, canvas, details, embed, \n      figure, figcaption, footer, header, hgroup, \n      menu, nav, output, ruby, section, summary,\n      time, mark, audio, video {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        font-size: 100%;\n        font: inherit;\n        text-align: inherit;\n        vertical-align: baseline;\n      }\n\n      article, aside, details, figcaption, figure, \n      footer, header, hgroup, menu, nav, section {\n        display: block;\n      }\n\n      body {\n        line-height: 1;\n      }\n\n      ol, ul {\n        list-style: none;\n      }\n\n      blockquote, q {\n        quotes: none;\n      }\n\n      blockquote:before, blockquote:after,\n      q:before, q:after {\n        content: '';\n        content: none;\n      }\n      \n      table {\n        border-collapse: collapse;\n        border-spacing: 0;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n\n      button {\n        border: 0;\n        background: none;\n        outline: none;\n      }\n\n  ";
  });

  var SearchStyle = (function (style) {
    return "\n\n    .Search {\n      border-radius: 0.8rem;\n      border: 1px solid rgba(0,0,0,0.2);\n      outline: none !important;\n      color: ".concat(style.colors.text, ";\n      font-size: 1.2rem;\n      padding: 0.8rem;\n      width: 100%;\n    }\n\n    .Search::placeholder {\n      color: rgb(180,180,180);\n    } \n\n    .Search:focus, .Search:focus-visible {\n      border: 1px solid ").concat(style.colors.primary, ";\n    }\n\n  ");
  });

  var SkeletonStyle = (function () {
    return "\n        \n    .Skeleton {\n      background: rgb(230,230,230) !important;\n      border: 0px solid transparent !important;\n      box-shadow: none !important;\n      cursor: inherit !important;\n      line-height: 0;\n      overflow: hidden;\n      position: relative;\n    }\n\n    @keyframes SkeletonBackgroundAnimation {\n      from {\n        left: -500px;\n      }\n      to   {\n        left: +120%;\n      }\n    }\n\n    .SkeletonBackground {\n      animation: 2s SkeletonBackgroundAnimation 0.2s ease infinite;\n      background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%);\n      height: 100%;\n      left: -140%;\n      position: absolute;\n      top: 0;\n      width: 400px;\n    }\n\n    .SkeletonWrapper {\n      line-height: 0;\n    }\n  ";
  });

  var TableStyle = (function (style) {
    return "\n\n    .Table {\n      border-collapse: separate;\n      border-radius: 0.4rem;\n      border-style: hidden;\n      border: 1px solid rgba(0,0,0,0.1);\n      font-size: 94%;\n      width: 100%;\n    }\n\n    .Table tr.small td {\n      font-size: 90%;\n    }\n\n    .Table tr td {\n      border-bottom: 1px solid rgba(0,0,0,0.1);\n      word-break: break-all;\n    }\n    \n    .Table tr:last-child td {\n      border-bottom: none;\n    }\n    \n    .Table tr td {\n      padding: 0.5rem 0.9rem;\n      text-align: left;\n    }\n    \n    .Table tr td:first-child {\n      width: 30%\n    }\n\n    .Table tr td:last-child {\n      width: 70%\n    }\n    \n    .Table .TableSubTitle {\n      font-weight: 300;\n      opacity: 0.7;\n    }\n\n    .Table tr td:last-child {\n      font-weight: 500;\n    }\n  ";
  });

  var TextButtonStyle = (function (style) {
    return "\n\n    .TextButton {\n      cursor: pointer;\n      font-size: 16px;\n      color: ".concat(style.colors.primary, "\n    }\n\n    .TextButton:hover * {\n      opacity: 1.0;\n    }\n  ");
  });

  var TextStyle = (function (style) {
    return "\n\n    * {\n      color: ".concat(style.colors.text, ";\n    }\n\n    h1, h2, h3, h4, h5, h6 {\n      display: block;\n    }\n\n    .TextLeft, .TextLeft * {\n      text-align: left;\n    }\n\n    .TextCenter, .TextCenter * {\n      text-align: center;\n    }\n\n    .LineHeightL {\n      line-height: 2.0rem;\n    }\n\n    .ErrorSnippetText {\n      background: rgb(30, 30, 20);\n      border-radius: 1.2rem;\n      border: 0.5rem solid rgb(30, 30, 20);\n      color: #00FF41;\n      font-size: 0.9rem;\n      font-style: italic;\n      max-height: 100px;\n      padding: 6px;\n      overflow-wrap: break-word;\n      overflow-y: auto;\n      white-space: pre-wrap;\n      word-wrap: break-word;\n    }\n  ");
  });

  var TokenAmountStyle = (function () {
    return "\n        \n    .TokenAmountRow {\n      min-width: 0;\n      width: 100%;\n      display: flex;\n      flex-direction: row;\n    }\n\n    .TokenAmountCell {\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .TokenSymbolCell {\n    }\n  ";
  });

  var TokenImageStyle = (function (style) {
    return "\n\n    .TokenImage img {\n      border-radius: 99rem;\n      border: 1px solid white;\n      background: white;\n      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);\n      height: 2.8rem;\n      position: relative;\n      vertical-align: middle;\n      width: 2.8rem;\n    }\n\n    .TokenImage.medium img {\n      height: 5.8rem;\n      width: 5.8rem;\n    }\n  ";
  });

  var TooltipStyle = (function (style) {
    return "\n\n    .Tooltip {\n      background: ".concat(style.colors.primary, ";\n      border-radius: 0.6rem;\n      color: ").concat(style.colors.buttonText, ";\n      padding: 0.6rem 0.8rem;\n      position: relative;\n      box-shadow: 0 0 8px rgba(0,0,0,0.2);\n    }\n\n    .TooltipArrowUp {\n      border-bottom: 10px solid ").concat(style.colors.primary, ";\n      border-left: 10px solid transparent;\n      border-right: 10px solid transparent;\n      height: 0; \n      left: 12px;\n      position: absolute;\n      top: -8px;\n      width: 0; \n    }\n  ");
  });

  var styleRenderer = (function (style) {
    style = Object.assign({
      colors: {
        primary: '#ea357a',
        buttonText: '#ffffff',
        icons: '#000000',
        text: '#212529'
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    }, style);
    return [ResetStyle(), FontStyle(style), DialogStyle(), ButtonCircularStyle(), ButtonPrimaryStyle(style), CardStyle(style), PoweredByStyle(style), GraphicStyle(), SkeletonStyle(), TokenAmountStyle(), TextStyle(style), IconStyle(style), OpacityStyle(), PaddingStyle(), HeightStyle(), LabelStyle(style), LoadingTextStyle(style), RangeSliderStyle(style), InputStyle(), TextButtonStyle(style), ImageStyle(), BlockchainLogoStyle(), SearchStyle(style), TokenImageStyle(), AlertStyle(), TableStyle(), LinkStyle(style), TooltipStyle(style)].join('');
  });

  var mount = (function (_ref, content) {
    var style = _ref.style,
        document = _ref.document,
        closed = _ref.closed;
    var insideStyle = styleRenderer(style);

    if (style && style.css) {
      insideStyle = [insideStyle, style.css].join(' ');
    }

    var unmountShadowDOM = function unmountShadowDOM() {
      // setTimeout to allow dialog to animate out first
      setTimeout(function () {
        unmount();

        if (typeof closed == 'function') {
          closed();
        }
      }, 300);
    };

    var _ReactShadowDOM = reactShadowDom.ReactShadowDOM({
      document: document,
      element: document.body,
      content: content(unmountShadowDOM),
      insideStyle: insideStyle,
      outsideStyle: "\n      position: fixed;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      right: 0;\n      z-index: 99999;\n    "
    }),
        unmount = _ReactShadowDOM.unmount;

    return unmount;
  });

  var PoweredBy = (function () {
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: "PoweredByWrapper"
    }, /*#__PURE__*/React__default['default'].createElement("a", {
      href: 'https://depay.fi?utm_source=' + window.location.hostname + '&utm_medium=widget&utm_campaign=WidgetV2',
      rel: "noopener noreferrer",
      target: "_blank",
      className: "PoweredByLink"
    }, "by DePay"));
  });

  var UpdatableProvider = (function (props) {
    var _useState = React.useState(true),
        _useState2 = _slicedToArray(_useState, 2),
        updatable = _useState2[0],
        setUpdatable = _useState2[1];

    return /*#__PURE__*/React__default['default'].createElement(UpdatableContext.Provider, {
      value: {
        updatable: updatable,
        setUpdatable: setUpdatable
      }
    }, props.children);
  });

  var Connect = function Connect(options) {
    var style, error, document;

    if (_typeof(options) == 'object') {
      style = options.style;
      error = options.error;
      document = options.document;
    }

    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
        var wallet, accounts;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                wallet = web3Wallets.getWallet();

                if (!wallet) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return wallet.accounts();

              case 4:
                accounts = _context.sent;

                if (!(accounts instanceof Array && accounts.length > 0)) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", resolve({
                  wallet: wallet,
                  accounts: accounts,
                  account: accounts[0]
                }));

              case 7:
                mount({
                  style: style,
                  document: ensureDocument(document)
                }, function (unmount) {
                  var rejectBeforeUnmount = function rejectBeforeUnmount() {
                    reject('USER_CLOSED_DIALOG');
                    unmount();
                  };

                  return function (container) {
                    return /*#__PURE__*/React__default['default'].createElement(ErrorProvider, {
                      errorCallback: error,
                      container: container,
                      unmount: unmount
                    }, /*#__PURE__*/React__default['default'].createElement(UpdatableProvider, null, /*#__PURE__*/React__default['default'].createElement(ClosableProvider, {
                      unmount: rejectBeforeUnmount
                    }, /*#__PURE__*/React__default['default'].createElement(ConnectStack, {
                      document: document,
                      container: container,
                      resolve: resolve,
                      reject: reject,
                      autoClose: true
                    }), /*#__PURE__*/React__default['default'].createElement(PoweredBy, null))));
                  };
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  };

  var ChangableAmountContext = /*#__PURE__*/React__default['default'].createContext();

  var ConfigurationContext = /*#__PURE__*/React__default['default'].createContext();

  var ConversionRateContext = /*#__PURE__*/React__default['default'].createContext();

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  var findMaxRoute = (function (routes) {
    var sortedLowToHigh = _toConsumableArray(routes).sort(function (a, b) {
      var aAmountsAvailable = ethers.ethers.BigNumber.from(a.fromBalance).div(ethers.ethers.BigNumber.from(a.fromAmount));
      var bAmountsAvailable = ethers.ethers.BigNumber.from(b.fromBalance).div(ethers.ethers.BigNumber.from(b.fromAmount));

      if (aAmountsAvailable.lt(bAmountsAvailable)) {
        return -1;
      }

      if (bAmountsAvailable.lt(aAmountsAvailable)) {
        return 1;
      }

      return 0; // equal
    });

    return sortedLowToHigh[sortedLowToHigh.length - 1];
  });

  var round = (function (input) {
    var _digitsAfterDecimal;

    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'up';
    var inputAsFloat = parseFloat(input);
    var digitsAfterDecimal = inputAsFloat.toString().match(/\d+\.0*(\d{3})/);

    if ((_digitsAfterDecimal = digitsAfterDecimal) !== null && _digitsAfterDecimal !== void 0 && _digitsAfterDecimal.length) {
      digitsAfterDecimal = digitsAfterDecimal[0];
      var focus = digitsAfterDecimal.match(/\d{3}$/)[0];

      if (focus.match(/^00/)) {
        return inputAsFloat;
      }

      var _float;

      var focusToFixed;

      if (focus.match(/^0/)) {
        if (direction == 'up') {
          _float = parseFloat("".concat(focus[1], ".").concat(focus[2]));
        } else {
          _float = parseFloat("".concat(focus[1], ".").concat(focus[2]));
        }

        focusToFixed = parseFloat(_float).toFixed(1);
        focusToFixed = "0".concat(focusToFixed).replace('.', '');
      } else {
        if (direction == 'up') {
          _float = parseFloat("".concat(focus[0], ".").concat(focus[1], "9"));
        } else {
          _float = parseFloat("".concat(focus[0], ".").concat(focus[1], "1"));
        }

        focusToFixed = parseFloat(_float).toFixed(1).replace('.', '');
      }

      if (focusToFixed.toString()[0] != "0" && focusToFixed.toString().length > 2) {
        return parseInt(inputAsFloat.toFixed(0));
      } else {
        return parseFloat(digitsAfterDecimal.replace(/\d{3}$/, focusToFixed));
      }
    } else {
      return parseFloat(inputAsFloat.toFixed(2));
    }
  });

  var WalletContext = /*#__PURE__*/React__default['default'].createContext();

  var ChangableAmountProvider = (function (props) {
    var configurationsMissAmounts = function configurationsMissAmounts(configurations) {
      return !configurations.every(function (configuration) {
        return typeof configuration.amount != 'undefined' || typeof configuration.fromAmount != 'undefined';
      });
    };

    var _useContext = React.useContext(ConfigurationContext),
        amountConfiguration = _useContext.amount;
        _useContext.toAmount;
        var recover = _useContext.recover;

    var _useState = React.useState(recover == undefined ? configurationsMissAmounts(props.accept) : false),
        _useState2 = _slicedToArray(_useState, 2),
        amountsMissing = _useState2[0],
        setAmountsMissing = _useState2[1];

    var _useContext2 = React.useContext(WalletContext),
        account = _useContext2.account;

    var _useContext3 = React.useContext(ConversionRateContext),
        conversionRate = _useContext3.conversionRate;

    var _useContext4 = React.useContext(ErrorContext),
        setError = _useContext4.setError;

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        acceptWithAmount = _useState4[0],
        setAcceptWithAmount = _useState4[1];

    var _useState5 = React.useState(amountsMissing ? _typeof(amountConfiguration) == "object" && amountConfiguration.start ? amountConfiguration.start : 1 : null),
        _useState6 = _slicedToArray(_useState5, 2),
        amount = _useState6[0],
        setAmount = _useState6[1];

    var _useState7 = React.useState(),
        _useState8 = _slicedToArray(_useState7, 2),
        maxRoute = _useState8[0],
        setMaxRoute = _useState8[1];

    var _useState9 = React.useState(100),
        _useState10 = _slicedToArray(_useState9, 2),
        maxAmount = _useState10[0],
        setMaxAmount = _useState10[1];

    React.useEffect(function () {
      if (recover) {
        return;
      }

      setAmountsMissing(configurationsMissAmounts(props.accept));
    }, [props.accept, recover]);

    var getAmounts = function getAmounts() {
      return new Promise(function (resolve, reject) {
        if (amountConfiguration && amountConfiguration.token) {
          resolve(props.accept.map(function () {
            return amount;
          }));
        } else {
          Promise.all(props.accept.map(function (configuration) {
            return web3Exchanges.route({
              blockchain: configuration.blockchain,
              tokenIn: web3Constants.CONSTANTS[configuration.blockchain].USD,
              amountIn: 1.00 / conversionRate * amount,
              tokenOut: configuration.token,
              fromAddress: account,
              toAddress: account
            });
          })).then(function (routes) {
            Promise.all(routes.map(function (routes, index) {
              if (routes[0] == undefined) {
                return;
              }

              return web3Tokens.Token.readable({
                blockchain: props.accept[index].blockchain,
                amount: routes[0].amountOut,
                address: routes[0].tokenOut
              });
            })).then(resolve)["catch"](setError);
          })["catch"](setError);
        }
      });
    };

    React.useEffect(function () {
      if (recover) {
        return;
      }

      if (amountsMissing && account && conversionRate) {
        getAmounts().then(function (amounts) {
          setAcceptWithAmount(props.accept.map(function (configuration, index) {
            if (amounts[index] == undefined) {
              return;
            }

            return {
              blockchain: configuration.blockchain,
              amount: round(amounts[index]),
              token: configuration.token,
              receiver: configuration.receiver || account
            };
          }).filter(function (configuration) {
            return !!configuration;
          }));
        })["catch"](setError);
      }
    }, [amountsMissing, account, conversionRate, amount, recover]);
    React.useEffect(function () {
      if (amountsMissing && maxRoute) {
        maxRoute.fromToken.readable(maxRoute.fromBalance).then(function (readableMaxAmount) {
          if (amountConfiguration && amountConfiguration.token) {
            web3Exchanges.route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: maxRoute.toToken.address,
              amountIn: parseFloat(readableMaxAmount),
              fromAddress: account,
              toAddress: account
            }).then(function (routes) {
              web3Tokens.Token.readable({
                amount: routes[0].amountOut,
                blockchain: maxRoute.blockchain,
                address: maxRoute.toToken.address
              }).then(function (readableMaxAmount) {
                var slippage = 1.01;
                var maxAmount = parseFloat(new decimal_js.Decimal(readableMaxAmount).div(slippage).mul(conversionRate).toString());
                setMaxAmount(maxAmount > 10 ? Math.round(maxAmount) : round(maxAmount));
              })["catch"](setError);
            })["catch"](setError);
          } else if (maxRoute.fromToken.address == web3Constants.CONSTANTS[maxRoute.blockchain].USD) {
            var _maxAmount = parseFloat(new decimal_js.Decimal(readableMaxAmount).mul(conversionRate).toString());

            setMaxAmount(_maxAmount > 10 ? Math.round(_maxAmount) : _maxAmount);
          } else {
            web3Exchanges.route({
              blockchain: maxRoute.blockchain,
              tokenIn: maxRoute.fromToken.address,
              tokenOut: web3Constants.CONSTANTS[maxRoute.blockchain].USD,
              amountIn: parseFloat(readableMaxAmount),
              fromAddress: account,
              toAddress: account
            }).then(function (routes) {
              web3Tokens.Token.readable({
                amount: routes[0].amountOut,
                blockchain: maxRoute.blockchain,
                address: web3Constants.CONSTANTS[maxRoute.blockchain].USD
              }).then(function (readableMaxAmount) {
                var slippage = 1.01;
                var maxAmount = parseFloat(new decimal_js.Decimal(readableMaxAmount).div(slippage).mul(conversionRate).toString());
                setMaxAmount(maxAmount > 10 ? Math.round(maxAmount) : round(maxAmount));
              })["catch"](setError);
            })["catch"](setError);
          }
        })["catch"](setError);
      } else {
        setMaxAmount(100);
      }
    }, [account, maxRoute]);
    return /*#__PURE__*/React__default['default'].createElement(ChangableAmountContext.Provider, {
      value: {
        amountsMissing: amountsMissing,
        acceptWithAmount: acceptWithAmount,
        amount: amount,
        setAmount: setAmount,
        setMaxRoute: setMaxRoute,
        maxAmount: maxAmount
      }
    }, props.children);
  });

  var ConfigurationProvider = (function (props) {
    var currencyCode = new localCurrency.Currency({
      code: props.configuration.currency
    }).code;
    React.useEffect(function () {
      if (props.configuration.providers != undefined) {
        Object.entries(props.configuration.providers).forEach(function (entry) {
          web3Client.setProviderEndpoints(entry[0], entry[1]);
        });
      }
    }, [props.configuration]);
    return /*#__PURE__*/React__default['default'].createElement(ConfigurationContext.Provider, {
      value: Object.assign({}, props.configuration, {
        currencyCode: currencyCode
      })
    }, props.children);
  });

  var ConversionRateProvider = (function (props) {
    var _useContext = React.useContext(ErrorContext);
        _useContext.setError;

    var _useContext2 = React.useContext(ConfigurationContext),
        currency = _useContext2.currency;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        conversionRate = _useState2[0],
        setConversionRate = _useState2[1];

    React.useEffect(function () {
      localCurrency.Currency.fromUSD({
        amount: 1,
        code: currency
      }).then(function (conversion) {
        return setConversionRate(conversion.amount);
      })["catch"](setConversionRate(1));
    }, []);
    return /*#__PURE__*/React__default['default'].createElement(ConversionRateContext.Provider, {
      value: {
        conversionRate: conversionRate
      }
    }, props.children);
  });

  var DonationRoutingContext = /*#__PURE__*/React__default['default'].createContext();

  var NavigateContext = /*#__PURE__*/React__default['default'].createContext();

  var QuestionsGraphic = "data:image/png;base64,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";

  var NoPaymentMethodFoundDialog = (function () {
    var _useContext = React.useContext(ClosableContext),
        close = _useContext.close;

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM"
      }),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TextCenter"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "GraphicWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "Graphic",
        src: QuestionsGraphic
      })), /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
      }, "Insufficient Balance"), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Text PaddingTopS PaddingBottomM PaddingLeftM PaddingRightM"
      }, /*#__PURE__*/React__default['default'].createElement("strong", {
        className: "FontSizeM"
      }, "We were not able to find any asset with enough value in your wallet. Please top up your account in order to proceed with this payment."))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "ButtonPrimary",
        onClick: close
      }, "Ok"))
    });
  });

  var PaymentContext = /*#__PURE__*/React__default['default'].createContext();

  var PaymentRoutingContext = /*#__PURE__*/React__default['default'].createContext();

  var PaymentTrackingContext = /*#__PURE__*/React__default['default'].createContext();

  var TransactionTrackingContext = /*#__PURE__*/React__default['default'].createContext();

  var PaymentProvider = (function (props) {
    var _useContext = React.useContext(ErrorContext),
        setError = _useContext.setError;

    var _useContext2 = React.useContext(ConfigurationContext),
        _sent = _useContext2.sent,
        confirmed = _useContext2.confirmed,
        failed = _useContext2.failed,
        recover = _useContext2.recover;

    var _useContext3 = React.useContext(PaymentRoutingContext),
        selectedRoute = _useContext3.selectedRoute,
        getPaymentRoutes = _useContext3.getPaymentRoutes;

    var _useContext4 = React.useContext(ClosableContext),
        open = _useContext4.open,
        close = _useContext4.close,
        setClosable = _useContext4.setClosable;

    var _useContext5 = React.useContext(PaymentRoutingContext),
        allRoutes = _useContext5.allRoutes;

    var _useContext6 = React.useContext(UpdatableContext),
        setUpdatable = _useContext6.setUpdatable;

    var _useContext7 = React.useContext(NavigateContext),
        navigate = _useContext7.navigate;

    var _useContext8 = React.useContext(WalletContext),
        wallet = _useContext8.wallet;

    var _useContext9 = React.useContext(PaymentTrackingContext),
        release = _useContext9.release,
        tracking = _useContext9.tracking,
        initializePaymentTracking = _useContext9.initializeTracking;

    var _useContext10 = React.useContext(TransactionTrackingContext),
        foundTransaction = _useContext10.foundTransaction,
        initializeTransactionTracking = _useContext10.initializeTracking;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        payment = _useState2[0],
        setPayment = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        transaction = _useState4[0],
        setTransaction = _useState4[1];

    var _useState5 = React.useState(),
        _useState6 = _slicedToArray(_useState5, 2),
        approvalTransaction = _useState6[0],
        setApprovalTransaction = _useState6[1];

    var _useState7 = React.useState('initialized'),
        _useState8 = _slicedToArray(_useState7, 2),
        paymentState = _useState8[0],
        setPaymentState = _useState8[1];

    var paymentConfirmed = function paymentConfirmed(transaction) {
      if (tracking != true) {
        setClosable(true);
      }

      setPaymentState('confirmed');

      if (confirmed) {
        confirmed(transaction);
      }
    };

    var paymentFailed = function paymentFailed(transaction, error) {
      if (failed) {
        failed(transaction, error);
      }

      setPaymentState('initialized');
      setPayment(null);
      setClosable(true);
      setUpdatable(true);
      getPaymentRoutes({});
      navigate('PaymentError');
    };

    var pay = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var currentBlock;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                setClosable(false);
                setPaymentState('paying');
                setUpdatable(false);
                _context.next = 5;
                return web3Client.request({
                  blockchain: payment.route.transaction.blockchain,
                  method: 'latestBlockNumber'
                });

              case 5:
                currentBlock = _context.sent;
                wallet.sendTransaction(Object.assign({}, payment.route.transaction, {
                  sent: function sent(transaction) {
                    initializeTransactionTracking(transaction, currentBlock);

                    if (_sent) {
                      _sent(transaction);
                    }
                  },
                  confirmed: paymentConfirmed,
                  failed: paymentFailed
                })).then(function (sentTransaction) {
                  initializePaymentTracking(sentTransaction, currentBlock, payment.route);
                  setTransaction(sentTransaction);
                })["catch"](function (error) {
                  console.log('error', error);
                  setPaymentState('initialized');
                  setClosable(true);
                  setUpdatable(true);

                  if ((error === null || error === void 0 ? void 0 : error.code) == 'WRONG_NETWORK') {
                    navigate('WrongNetwork');
                  }
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function pay() {
        return _ref.apply(this, arguments);
      };
    }();

    var approve = function approve() {
      setClosable(false);
      setPaymentState('approving');
      wallet.sendTransaction(Object.assign({}, payment.route.approvalTransaction, {
        confirmed: function confirmed() {
          payment.route.approvalRequired = false;
          setPayment(payment);
          setClosable(true);
          setPaymentState('initialized');
        }
      })).then(function (sentTransaction) {
        setApprovalTransaction(sentTransaction);
      })["catch"](function (error) {
        console.log('error', error);
        setPaymentState('initialized');
        setClosable(true);
      });
    };

    React.useEffect(function () {
      if (release) {
        setPaymentState('confirmed');
      }
    }, [release]);
    React.useEffect(function () {
      if (recover) {
        setClosable(false);
        setUpdatable(false);
        setPaymentState('paying');
        setTransaction({
          blockchain: recover.blockchain,
          id: recover.transaction,
          url: web3Blockchains.Blockchain.findByName(recover.blockchain).explorerUrlFor({
            transaction: {
              id: recover.transaction
            }
          })
        });
        var paymentToken = new web3Tokens.Token({
          blockchain: recover.blockchain,
          address: recover.token
        });
        Promise.all([paymentToken.name(), paymentToken.symbol()]).then(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              name = _ref3[0],
              symbol = _ref3[1];

          setPayment({
            blockchain: recover.blockchain,
            token: recover.token,
            name: name,
            symbol: symbol.toUpperCase(),
            amount: recover.amount
          });
        })["catch"](setError);
      }
    }, [recover]);
    React.useEffect(function () {
      if (foundTransaction && foundTransaction.id && foundTransaction.status) {
        var newTransaction;

        if (foundTransaction.id.toLowerCase() != transaction.id.toLowerCase()) {
          newTransaction = Object.assign({}, transaction, {
            id: foundTransaction.id,
            url: web3Blockchains.Blockchain.findByName(transaction.blockchain).explorerUrlFor({
              transaction: foundTransaction
            })
          });
          setTransaction(newTransaction);
        }

        if (foundTransaction.status == 'success') {
          paymentConfirmed(newTransaction || transaction);
        } else if (foundTransaction.status == 'failed') {
          paymentFailed(newTransaction || transaction);
        }
      }
    }, [foundTransaction, transaction]);
    React.useEffect(function () {
      if (selectedRoute) {
        var fromToken = selectedRoute.fromToken;
        Promise.all([fromToken.name(), fromToken.symbol(), fromToken.readable(selectedRoute.fromAmount)]).then(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 3),
              name = _ref5[0],
              symbol = _ref5[1],
              amount = _ref5[2];

          setPayment({
            blockchain: selectedRoute.blockchain,
            route: selectedRoute,
            token: fromToken.address,
            name: name,
            symbol: symbol.toUpperCase(),
            amount: amount
          });
        })["catch"](setError);
      } else {
        setPayment(undefined);
      }
    }, [selectedRoute]);
    React.useEffect(function () {
      if (allRoutes && allRoutes.length == 0) {
        setUpdatable(false);
      } else if (allRoutes && allRoutes.length > 0) {
        setUpdatable(true);
      }
    }, [allRoutes]);

    if (allRoutes instanceof Array && allRoutes.length == 0) {
      return /*#__PURE__*/React__default['default'].createElement(reactDialogStack.ReactDialogStack, {
        open: open,
        close: close,
        start: "NoPaymentMethodFound",
        container: props.container,
        document: props.document,
        dialogs: {
          NoPaymentMethodFound: /*#__PURE__*/React__default['default'].createElement(NoPaymentMethodFoundDialog, null)
        }
      });
    } else {
      return /*#__PURE__*/React__default['default'].createElement(PaymentContext.Provider, {
        value: {
          payment: payment,
          paymentState: paymentState,
          pay: pay,
          transaction: transaction,
          approve: approve,
          approvalTransaction: approvalTransaction
        }
      }, props.children);
    }
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var PaymentRoutingProvider = (function (props) {
    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        allRoutes = _useState2[0],
        setAllRoutes = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        selectedRoute = _useState4[0],
        setSelectedRoute = _useState4[1];

    var _useState5 = React.useState(0),
        _useState6 = _slicedToArray(_useState5, 2),
        reloadCount = _useState6[0],
        setReloadCount = _useState6[1];

    var _useContext = React.useContext(WalletContext),
        account = _useContext.account;

    var _useContext2 = React.useContext(UpdatableContext),
        updatable = _useContext2.updatable;

    var _useContext3 = React.useContext(ConfigurationContext),
        recover = _useContext3.recover;

    var prepareAcceptedPayments = function prepareAcceptedPayments(accept) {
      var toAddress = _typeof(accept.receiver) == 'object' ? accept.receiver.address : accept.receiver;
      var toContract = _typeof(accept.receiver) == 'object' ? accept.receiver : undefined;
      return _objectSpread(_objectSpread({}, accept), {}, {
        toAddress: toAddress,
        toContract: toContract,
        fromAddress: account
      });
    };

    var getPaymentRoutes = function getPaymentRoutes(_ref) {
      var allRoutes = _ref.allRoutes,
          selectedRoute = _ref.selectedRoute,
          updatable = _ref.updatable;

      if (updatable == false || !props.accept || !account) {
        return;
      }

      web3Payments.route({
        accept: props.accept.map(prepareAcceptedPayments),
        whitelist: props.whitelist,
        blacklist: props.blacklist,
        event: props.event,
        fee: props.fee
      }).then(function (routes) {
        if (routes.length == 0) {
          setAllRoutes([]);

          if (props.setMaxRoute) {
            props.setMaxRoute(null);
          }
        } else {
          roundAmounts(routes).then(function (roundedRoutes) {
            var selected = selectedRoute ? roundedRoutes[allRoutes.indexOf(selectedRoute)] || roundedRoutes[0] : roundedRoutes[0];
            setSelectedRoute(selected);
            setAllRoutes(roundedRoutes);

            if (props.setMaxRoute) {
              props.setMaxRoute(findMaxRoute(roundedRoutes));
            }
          });
        }
      });
    };

    var roundAmounts = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(routes) {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", Promise.all(routes.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(route) {
                    var readableAmount, roundedAmountBN;
                    return regenerator.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!route.directTransfer) {
                              _context.next = 2;
                              break;
                            }

                            return _context.abrupt("return", route);

                          case 2:
                            _context.next = 4;
                            return route.fromToken.readable(route.transaction.params.amounts[0]);

                          case 4:
                            readableAmount = _context.sent;
                            _context.next = 7;
                            return route.fromToken.BigNumber(round(readableAmount));

                          case 7:
                            roundedAmountBN = _context.sent;
                            route.fromAmount = roundedAmountBN.toString();
                            route.transaction.params.amounts[0] = roundedAmountBN.toString();

                            if (route.transaction.value && route.transaction.value.toString() != '0') {
                              route.transaction.value = roundedAmountBN.toString();
                            }

                            return _context.abrupt("return", route);

                          case 12:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }())));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function roundAmounts(_x) {
        return _ref2.apply(this, arguments);
      };
    }();

    React.useEffect(function () {
      var timeout = setTimeout(function () {
        setReloadCount(reloadCount + 1);
        getPaymentRoutes({
          allRoutes: allRoutes,
          selectedRoute: selectedRoute,
          updatable: updatable
        });
      }, 15000);
      return function () {
        return clearTimeout(timeout);
      };
    }, [reloadCount, allRoutes, selectedRoute, updatable]);
    React.useEffect(function () {
      if (account && props.accept && recover == undefined) {
        setAllRoutes(undefined);
        setSelectedRoute(undefined);
        getPaymentRoutes({});
      } else {
        setAllRoutes(undefined);
        setSelectedRoute(undefined);
      }
    }, [account, props.accept]);
    return /*#__PURE__*/React__default['default'].createElement(PaymentRoutingContext.Provider, {
      value: {
        selectedRoute: selectedRoute,
        setSelectedRoute: setSelectedRoute,
        getPaymentRoutes: getPaymentRoutes,
        allRoutes: allRoutes,
        setAllRoutes: setAllRoutes
      }
    }, props.children);
  });

  var PaymentValueContext = /*#__PURE__*/React__default['default'].createContext();

  var PaymentValueProvider = (function (props) {
    var _useContext = React.useContext(ErrorContext),
        setError = _useContext.setError;

    var _useContext2 = React.useContext(WalletContext),
        account = _useContext2.account;

    var _useContext3 = React.useContext(UpdatableContext),
        updatable = _useContext3.updatable;

    var _useContext4 = React.useContext(PaymentContext),
        payment = _useContext4.payment;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        paymentValue = _useState2[0],
        setPaymentValue = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        paymentValueLoss = _useState4[0],
        setPaymentValueLoss = _useState4[1];

    var _useContext5 = React.useContext(ConfigurationContext),
        currency = _useContext5.currency;

    var _useState5 = React.useState(0),
        _useState6 = _slicedToArray(_useState5, 2),
        reloadCount = _useState6[0],
        setReloadCount = _useState6[1];

    var updatePaymentValue = function updatePaymentValue(_ref) {
      var updatable = _ref.updatable,
          payment = _ref.payment;

      if (updatable == false || (payment === null || payment === void 0 ? void 0 : payment.route) == undefined) {
        return;
      }

      Promise.all([web3Exchanges.route({
        blockchain: payment.route.blockchain,
        tokenIn: payment.route.toToken.address,
        tokenOut: web3Constants.CONSTANTS[payment.route.blockchain].USD,
        amountIn: payment.route.toAmount,
        fromAddress: account,
        toAddress: account
      }), !payment.route.directTransfer ? web3Exchanges.route({
        blockchain: payment.route.blockchain,
        tokenIn: payment.route.toToken.address,
        tokenOut: payment.route.fromToken.address,
        amountIn: payment.route.toAmount,
        fromAddress: account,
        toAddress: account
      }) : Promise.resolve([]), new web3Tokens.Token({
        blockchain: payment.route.blockchain,
        address: web3Constants.CONSTANTS[payment.route.blockchain].USD
      }).decimals()]).then(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 3),
            toTokenUSDExchangeRoutes = _ref3[0],
            reverseRoutes = _ref3[1],
            USDDecimals = _ref3[2];

        var toTokenUSDRoute = toTokenUSDExchangeRoutes[0];
        var reverseRoute = reverseRoutes[0];

        if (reverseRoute) {
          var reverseAmountOutBN = ethers.ethers.BigNumber.from(reverseRoute.amountOut);
          var paymentAmountInBN = ethers.ethers.BigNumber.from(payment.route.fromAmount);
          var divPercent = 100 - reverseAmountOutBN.mul(ethers.ethers.BigNumber.from('100')).div(paymentAmountInBN).abs().toString();

          if (divPercent >= 10) {
            setPaymentValueLoss(divPercent);
          } else {
            setPaymentValueLoss(null);
          }
        }

        var toTokenUSDAmount;

        if (payment.route.toToken.address.toLowerCase() == web3Constants.CONSTANTS[payment.route.blockchain].USD.toLowerCase()) {
          toTokenUSDAmount = payment.route.toAmount.toString();
        } else if (toTokenUSDRoute == undefined) {
          setPaymentValue('');
          return;
        } else {
          toTokenUSDAmount = toTokenUSDRoute.amountOut.toString();
        }

        var toTokenUSDValue = ethers.ethers.utils.formatUnits(toTokenUSDAmount, USDDecimals);
        localCurrency.Currency.fromUSD({
          amount: toTokenUSDValue,
          code: currency
        }).then(setPaymentValue);
      })["catch"](setError);
    };

    React.useEffect(function () {
      if (account && payment) {
        updatePaymentValue({
          updatable: updatable,
          payment: payment
        });
      }
    }, [payment, account]);
    React.useEffect(function () {
      var timeout = setTimeout(function () {
        setReloadCount(reloadCount + 1);
        updatePaymentValue({
          updatable: updatable
        });
      }, 15000);
      return function () {
        return clearTimeout(timeout);
      };
    }, [reloadCount, updatable]);
    return /*#__PURE__*/React__default['default'].createElement(PaymentValueContext.Provider, {
      value: {
        paymentValue: paymentValue,
        paymentValueLoss: paymentValueLoss
      }
    }, props.children);
  });

  var DonationRoutingProvider = (function (props) {
    var _useContext = React.useContext(ChangableAmountContext),
        acceptWithAmount = _useContext.acceptWithAmount,
        setMaxRoute = _useContext.setMaxRoute;

    var _useContext2 = React.useContext(ConfigurationContext),
        blacklist = _useContext2.blacklist;

    return /*#__PURE__*/React__default['default'].createElement(DonationRoutingContext.Provider, {
      value: {}
    }, /*#__PURE__*/React__default['default'].createElement(PaymentRoutingProvider, {
      accept: acceptWithAmount,
      blacklist: blacklist,
      setMaxRoute: setMaxRoute
    }, /*#__PURE__*/React__default['default'].createElement(PaymentProvider, {
      container: props.container,
      document: props.document
    }, /*#__PURE__*/React__default['default'].createElement(PaymentValueProvider, null, props.children))));
  });

  var format = (function (input) {
    var _float = round(input);

    var floatToString = _float.toString();

    if (new RegExp(/\./).test(floatToString)) {
      var exploded = floatToString.split('.');
      return new Intl.NumberFormat().format(parseInt(exploded[0])) + '.' + exploded[1];
    } else {
      return new Intl.NumberFormat().format(_float);
    }
  });

  var ChangeAmountDialog = (function (props) {
    var _useContext = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext.navigate;

    var _useContext2 = React.useContext(ErrorContext);
        _useContext2.setError;

    var _useContext3 = React.useContext(WalletContext);
        _useContext3.account;

    var _useContext4 = React.useContext(ChangableAmountContext),
        amount = _useContext4.amount,
        setAmount = _useContext4.setAmount,
        maxAmount = _useContext4.maxAmount;

    var _useState = React.useState(amount),
        _useState2 = _slicedToArray(_useState, 2),
        inputAmount = _useState2[0],
        setInputAmount = _useState2[1];

    var _useContext5 = React.useContext(ConfigurationContext),
        currencyCode = _useContext5.currencyCode,
        amountConfiguration = _useContext5.amount;

    var _useContext6 = React.useContext(PaymentRoutingContext);
        _useContext6.allRoutes;

    var min = _typeof(amountConfiguration) == "object" && amountConfiguration.min ? amountConfiguration.min : 1;
    var step = _typeof(amountConfiguration) == "object" && amountConfiguration.step ? amountConfiguration.step : 1;
    var displayedCurrencyCode = amountConfiguration != undefined && amountConfiguration.token ? null : currencyCode;

    var changeAmountAndGoBack = function changeAmountAndGoBack() {
      setAmount(toValidValue(parseFloat(inputAmount)));
      navigate('back');
    };

    var changeAmount = function changeAmount(value) {
      if (Number.isNaN(value)) {
        return;
      }

      setInputAmount(value);
    };

    var toValidStep = function toValidStep(value) {
      if (step) {
        value = parseFloat(new decimal_js.Decimal(Math.floor(new decimal_js.Decimal(value).div(step))).mul(step).toString());
      }

      return value;
    };

    var toValidValue = function toValidValue(value) {
      value = toValidStep(value);
      value = Math.max(min, Math.min(value, maxAmount));
      value = toValidStep(value);
      return value;
    };

    var setValidValue = function setValidValue(value) {
      setInputAmount(toValidValue(value));
    };

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      stacked: true,
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL TextCenter"
      }, "Change Amount"), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "FontSizeL TextCenter FontWeightBold"
      }, /*#__PURE__*/React__default['default'].createElement("strong", null, displayedCurrencyCode))),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "MaxHeight PaddingTopXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS TextCenter PaddingBottomL"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "FontSizeL"
      }, /*#__PURE__*/React__default['default'].createElement("input", {
        max: parseFloat(maxAmount),
        min: min,
        step: step,
        className: "Input FontSizeXL TextAlignCenter",
        type: "number",
        name: "amount",
        value: parseFloat(inputAmount),
        onChange: function onChange(event) {
          changeAmount(event.target.value);
        },
        onBlur: function onBlur(event) {
          setValidValue(event.target.value);
        }
      })), /*#__PURE__*/React__default['default'].createElement(Slider__default['default'], {
        max: parseFloat(maxAmount),
        min: min,
        step: step,
        value: parseFloat(inputAmount),
        onChange: function onChange(value) {
          changeAmount(toValidStep(value));
        },
        onChangeComplete: function onChangeComplete() {
          setValidValue(inputAmount);
        }
      }), /*#__PURE__*/React__default['default'].createElement("div", {
        style: {
          height: '40px'
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", null, format(toValidStep(maxAmount)), /*#__PURE__*/React__default['default'].createElement("button", {
        className: "TextButton",
        onClick: function onClick() {
          changeAmount(toValidValue(maxAmount));
        }
      }, "(Max)")))))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "ButtonPrimary",
        onClick: changeAmountAndGoBack
      }, "Done"))
    });
  });

  var ChangePaymentSkeleton = (function (props) {
    var _useContext = React.useContext(PaymentValueContext),
        paymentValue = _useContext.paymentValue;

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      stacked: true,
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL TextCenter"
      }, "Change Payment"), paymentValue != undefined && /*#__PURE__*/React__default['default'].createElement("div", {
        className: "FontSizeL TextCenter FontWeightBold"
      }, /*#__PURE__*/React__default['default'].createElement("strong", null, paymentValue.toString()))),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "MaxHeight PaddingTopXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      }))))
    });
  });

  var ChangePaymentDialog = (function (props) {
    var _useContext = React.useContext(ErrorContext),
        setError = _useContext.setError;

    var _useContext2 = React.useContext(PaymentRoutingContext),
        allRoutes = _useContext2.allRoutes,
        setSelectedRoute = _useContext2.setSelectedRoute;

    var _useContext3 = React.useContext(PaymentValueContext),
        paymentValue = _useContext3.paymentValue;

    var _useContext4 = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext4.navigate;

    var _useState = React.useState([]),
        _useState2 = _slicedToArray(_useState, 2),
        allPaymentRoutesWithData = _useState2[0],
        setAllPaymentRoutesWithData = _useState2[1];

    var _useState3 = React.useState([]),
        _useState4 = _slicedToArray(_useState3, 2),
        cards = _useState4[0],
        setCards = _useState4[1];

    React.useEffect(function () {
      if (allRoutes == undefined) {
        return;
      }

      Promise.all(allRoutes.map(function (route) {
        route.exchangeRoutes[0];
        route.fromToken;
        return Promise.all([route.fromToken.name(), route.fromToken.symbol(), route.fromToken.decimals(), route.fromToken.readable(route.fromAmount)]);
      })).then(function (allPaymentRoutesWithData) {
        setAllPaymentRoutesWithData(allRoutes.map(function (route, index) {
          return {
            name: allPaymentRoutesWithData[index][0],
            symbol: allPaymentRoutesWithData[index][1].toUpperCase(),
            decimals: allPaymentRoutesWithData[index][2],
            amount: allPaymentRoutesWithData[index][3],
            route: route
          };
        }));
      })["catch"](setError);
    }, [allRoutes]);
    React.useEffect(function () {
      setCards(allPaymentRoutesWithData.map(function (payment, index) {
        var blockchain = web3Blockchains.Blockchain.findByName(payment.route.blockchain);
        return /*#__PURE__*/React__default['default'].createElement("div", {
          key: index,
          className: "Card",
          title: "Select ".concat(payment.symbol, " as payment"),
          onClick: function onClick() {
            setSelectedRoute(payment.route);
            navigate('back');
          }
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardImage"
        }, /*#__PURE__*/React__default['default'].createElement(reactTokenImage.TokenImage, {
          blockchain: payment.route.blockchain,
          address: payment.route.fromToken.address
        }), /*#__PURE__*/React__default['default'].createElement("img", {
          className: "BlockchainLogo small",
          src: blockchain.logo,
          alt: blockchain.label,
          title: blockchain.label
        })), /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBody"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBodyWrapper"
        }, /*#__PURE__*/React__default['default'].createElement("h2", {
          className: "CardText"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "TokenAmountRow"
        }, /*#__PURE__*/React__default['default'].createElement("span", {
          className: "TokenSymbolCell"
        }, payment.symbol), /*#__PURE__*/React__default['default'].createElement("span", null, "\xA0"), /*#__PURE__*/React__default['default'].createElement("span", {
          className: "TokenAmountCell"
        }, format(payment.amount)))), /*#__PURE__*/React__default['default'].createElement("h3", {
          className: "CardText"
        }, /*#__PURE__*/React__default['default'].createElement("small", null, format(round(parseFloat(payment.route.fromBalance.toString()) / Math.pow(10, payment.decimals), 'down')))))));
      }));
    }, [allPaymentRoutesWithData]);

    if (allPaymentRoutesWithData.length == 0 || cards.length == 0) {
      return /*#__PURE__*/React__default['default'].createElement(ChangePaymentSkeleton, null);
    }

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      stacked: true,
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL TextCenter"
      }, "Change Payment"), paymentValue != undefined && /*#__PURE__*/React__default['default'].createElement("div", {
        className: "FontSizeL TextCenter FontWeightBold"
      }, /*#__PURE__*/React__default['default'].createElement("strong", null, paymentValue.toString()))),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "MaxHeight PaddingTopXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM"
      }, cards)),
      footer: /*#__PURE__*/React__default['default'].createElement("div", null)
    });
  });

  var DonationOverviewSkeleton = (function (props) {
    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Donation")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM PaddingBottomXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      }))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "ButtonPrimary Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      }))))
    });
  });

  var AlertIcon = (function (props) {
    return /*#__PURE__*/React__default['default'].createElement("svg", {
      className: "AlertIcon Icon " + props.className,
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      x: "0px",
      y: "0px",
      viewBox: "0 0 20 20"
    }, /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M19.64 16.36L11.53 2.3A1.85 1.85 0 0 0 10 1.21 1.85 1.85 0 0 0 8.48 2.3L.36 16.36C-.48 17.81.21 19 1.88 19h16.24c1.67 0 2.36-1.19 1.52-2.64zM11 16H9v-2h2zm0-4H9V6h2z"
    }));
  });

  var Checkmark = (function (props) {
    return /*#__PURE__*/React__default['default'].createElement("svg", {
      className: "Checkmark Icon " + props.className,
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      x: "0px",
      y: "0px",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M20,4.9L9.2,16l-5.4-3.9c-0.7-0.5-1.6-0.3-2.1,0.3c-0.5,0.7-0.3,1.6,0.3,2.1l6.4,4.7c0.3,0.2,0.6,0.3,0.9,0.3 c0.4,0,0.8-0.2,1.1-0.5l11.7-12c0.6-0.6,0.6-1.6,0-2.2C21.6,4.3,20.6,4.3,20,4.9z"
    }));
  });

  var DigitalWalletIcon = (function (props) {
    return /*#__PURE__*/React__default['default'].createElement("svg", {
      className: "DigitalWalletIcon Icon " + props.className,
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      height: "24",
      width: "24",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M8.51,4.84l-.39-.53,4-2.89a2.2,2.2,0,0,1,3.06.48l.4.56-.53.39-.4-.56A1.54,1.54,0,0,0,12.5,2Z",
      transform: "translate(-0.81 -1)"
    }), /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M9.77,4.89l-.21-.62,6.31-2.13h0a2.18,2.18,0,0,1,.67-.1h0a2.21,2.21,0,0,1,2.08,1.49l.32.95-.63.21L18,3.73a1.53,1.53,0,0,0-1.45-1h0a1.61,1.61,0,0,0-.48.08h0Z",
      transform: "translate(-0.81 -1)"
    }), /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M19.72,16.2H18.27a3.28,3.28,0,1,1,0-6.56h1.45a3.21,3.21,0,0,1,1.33.28h0a3.28,3.28,0,0,1,0,6A3.21,3.21,0,0,1,19.72,16.2Zm-1.45-5.9a2.63,2.63,0,0,0,0,5.25h1.45a2.56,2.56,0,0,0,1.06-.23,2.62,2.62,0,0,0,0-4.8,2.55,2.55,0,0,0-1.06-.22ZM19,14.53a1.61,1.61,0,1,1,1.61-1.61A1.62,1.62,0,0,1,19,14.53ZM19,12a1,1,0,1,0,.95.95A1,1,0,0,0,19,12Z",
      transform: "translate(-0.81 -1)"
    }), /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M10.49,19.69a1.58,1.58,0,1,1,1.58-1.57A1.57,1.57,0,0,1,10.49,19.69Zm0-2.49a.92.92,0,1,0,.92.92A.92.92,0,0,0,10.49,17.2Z",
      transform: "translate(-0.81 -1)"
    }), /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M19.09,22.14H2.79a2,2,0,0,1-2-2V6.25a2.1,2.1,0,0,1,0-.43,2,2,0,0,1,.48-.92,2,2,0,0,1,1.48-.65H19.09a2,2,0,0,1,.64.1,2,2,0,0,1,1.36,1.79v0a.28.28,0,0,1,0,.09v3.91h-.66v-4a1.49,1.49,0,0,0-.23-.69A1.35,1.35,0,0,0,19.52,5a1.26,1.26,0,0,0-.43-.08H2.82a1.34,1.34,0,0,0-1,.44A1.49,1.49,0,0,0,1.5,6a1.5,1.5,0,0,0,0,.29V20.13a1.36,1.36,0,0,0,1.34,1.35H19.09a1.35,1.35,0,0,0,1.35-1.35V15.68h.66v4.45A2,2,0,0,1,19.09,22.14Z",
      transform: "translate(-0.81 -1)"
    }), /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M9.27,9.31a1.58,1.58,0,1,1,0-3.15,1.58,1.58,0,0,1,0,3.15Zm0-2.5a.92.92,0,1,0,.92.92A.92.92,0,0,0,9.27,6.81Z",
      transform: "translate(-0.81 -1)"
    }), /*#__PURE__*/React__default['default'].createElement("path", {
      d: "M7.11,14.67A1.58,1.58,0,1,1,8.69,13.1,1.57,1.57,0,0,1,7.11,14.67Zm0-2.49A.92.92,0,1,0,8,13.1.92.92,0,0,0,7.11,12.18Z",
      transform: "translate(-0.81 -1)"
    }), /*#__PURE__*/React__default['default'].createElement("rect", {
      x: "0.33",
      y: "11.77",
      width: "4.72",
      height: "0.66"
    }), /*#__PURE__*/React__default['default'].createElement("polygon", {
      points: "2.08 9.53 0.33 9.53 0.33 8.87 1.8 8.87 4.28 6.39 7.21 6.39 7.21 7.05 4.55 7.05 2.08 9.53"
    }), /*#__PURE__*/React__default['default'].createElement("polygon", {
      points: "8.43 17.45 4.53 17.45 2.63 15.55 0.33 15.55 0.33 14.89 2.9 14.89 4.8 16.79 8.43 16.79 8.43 17.45"
    }));
  });

  var LoadingText = (function (props) {
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: "LoadingText"
    }, props.children, /*#__PURE__*/React__default['default'].createElement("span", {
      className: "dot"
    }, "."), /*#__PURE__*/React__default['default'].createElement("span", {
      className: "dot"
    }, "."), /*#__PURE__*/React__default['default'].createElement("span", {
      className: "dot"
    }, "."));
  });

  var Footer = (function () {
    var _useContext = React.useContext(ConfigurationContext),
        currencyCode = _useContext.currencyCode,
        configuredAmount = _useContext.amount;

    var _useContext2 = React.useContext(ChangableAmountContext),
        amount = _useContext2.amount;
        _useContext2.amountsMissing;

    var _useContext3 = React.useContext(PaymentTrackingContext),
        tracking = _useContext3.tracking,
        release = _useContext3.release,
        forwardTo = _useContext3.forwardTo,
        trackingFailed = _useContext3.trackingFailed;

    var _useContext4 = React.useContext(PaymentContext),
        payment = _useContext4.payment,
        paymentState = _useContext4.paymentState,
        pay = _useContext4.pay,
        transaction = _useContext4.transaction,
        approve = _useContext4.approve,
        approvalTransaction = _useContext4.approvalTransaction;

    var _useContext5 = React.useContext(PaymentValueContext),
        paymentValue = _useContext5.paymentValue,
        paymentValueLoss = _useContext5.paymentValueLoss;

    var _useContext6 = React.useContext(reactDialogStack.NavigateStackContext);
        _useContext6.navigate;

    var _useContext7 = React.useContext(ClosableContext),
        close = _useContext7.close;

    var trackingInfo = function trackingInfo() {
      if (tracking != true) {
        return null;
      }

      if (release) {
        return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Card transparent small disabled"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardImage"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "TextCenter Opacity05"
        }, /*#__PURE__*/React__default['default'].createElement(Checkmark, {
          className: "small"
        }))), /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBody"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBodyWrapper"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Opacity05"
        }, "Payment confirmation has been stored")))));
      } else {
        if (trackingFailed) {
          return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "Card transparent small"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "CardImage"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "TextCenter"
          }, /*#__PURE__*/React__default['default'].createElement(AlertIcon, {
            className: "small"
          }))), /*#__PURE__*/React__default['default'].createElement("div", {
            className: "CardBody"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "CardBodyWrapper"
          }, /*#__PURE__*/React__default['default'].createElement("div", null, "Tracking payment failed!")))));
        } else {
          return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "Card transparent small disabled"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "CardImage"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "TextCenter"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "Loading Icon"
          }))), /*#__PURE__*/React__default['default'].createElement("div", {
            className: "CardBody"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "CardBodyWrapper"
          }, /*#__PURE__*/React__default['default'].createElement("div", {
            className: "Opacity05"
          }, "Storing payment confirmation")))));
        }
      }
    };

    var additionalPaymentInformation = function additionalPaymentInformation() {
      if (paymentState == 'paying' && transaction == undefined) {
        return /*#__PURE__*/React__default['default'].createElement("div", {
          className: "PaddingBottomS"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Card transparent disabled small"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardImage"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "TextCenter Opacity05"
        }, /*#__PURE__*/React__default['default'].createElement(DigitalWalletIcon, {
          className: "small"
        }))), /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBody"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBodyWrapper"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Opacity05"
        }, "Confirm transaction in your wallet")))));
      } else if (paymentState == 'confirmed') {
        return /*#__PURE__*/React__default['default'].createElement("div", {
          className: "PaddingBottomS"
        }, /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("a", {
          className: "Card transparent small",
          title: "Payment has been confirmed by the network",
          href: transaction === null || transaction === void 0 ? void 0 : transaction.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardImage"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "TextCenter Opacity05"
        }, /*#__PURE__*/React__default['default'].createElement(Checkmark, {
          className: "small"
        }))), /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBody"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "CardBodyWrapper"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Opacity05"
        }, "Payment has been confirmed"))))), trackingInfo());
      }
    };

    var approvalButton = function approvalButton() {
      if (payment.route == undefined || !payment.route.approvalRequired || payment.route.directTransfer) {
        return null;
      } else if (paymentState == 'initialized') {
        return /*#__PURE__*/React__default['default'].createElement("div", {
          className: "PaddingBottomS"
        }, /*#__PURE__*/React__default['default'].createElement("button", {
          className: "ButtonPrimary",
          onClick: approve,
          title: "Allow ".concat(payment.symbol, " to be used as payment")
        }, "Allow ", payment.symbol, " to be used as payment"));
      } else if (paymentState == 'approving') {
        return /*#__PURE__*/React__default['default'].createElement("div", {
          className: "PaddingBottomS"
        }, /*#__PURE__*/React__default['default'].createElement("a", {
          className: "ButtonPrimary",
          title: "Approving payment token - please wait",
          href: approvalTransaction === null || approvalTransaction === void 0 ? void 0 : approvalTransaction.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }, /*#__PURE__*/React__default['default'].createElement(LoadingText, null, "Approving")));
      }
    };

    var mainAction = function mainAction() {
      var displayedAmount;

      if (amount && (configuredAmount == undefined || configuredAmount.token != true)) {
        displayedAmount = new localCurrency.Currency({
          amount: amount.toFixed(2),
          code: currencyCode
        }).toString();
      } else if (paymentValue && paymentValue.toString().length) {
        displayedAmount = paymentValue.toString();
      } else {
        displayedAmount = "".concat(payment.symbol, " ").concat(payment.amount);
      }

      if (paymentValueLoss) {
        return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "PaddingBottomXS"
        }, /*#__PURE__*/React__default['default'].createElement("div", {
          className: "Alert"
        }, /*#__PURE__*/React__default['default'].createElement("strong", null, "Payment token would lose ", paymentValueLoss, "% of it's value!"))), /*#__PURE__*/React__default['default'].createElement("button", {
          className: "ButtonPrimary disabled",
          onClick: function onClick() {}
        }, "Pay ", displayedAmount));
      } else if ((paymentState == 'initialized' || paymentState == 'approving') && payment.route) {
        return /*#__PURE__*/React__default['default'].createElement("button", {
          className: ["ButtonPrimary", payment.route.approvalRequired && !payment.route.directTransfer ? 'disabled' : ''].join(' '),
          onClick: function onClick() {
            if (payment.route.approvalRequired && !payment.route.directTransfer) {
              return;
            }

            pay();
          }
        }, "Pay ", displayedAmount);
      } else if (paymentState == 'paying') {
        return /*#__PURE__*/React__default['default'].createElement("a", {
          className: "ButtonPrimary",
          title: "Performing the payment - please wait",
          href: transaction === null || transaction === void 0 ? void 0 : transaction.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }, /*#__PURE__*/React__default['default'].createElement(LoadingText, null, "Paying"));
      } else if (paymentState == 'confirmed') {
        if (tracking == true) {
          if (release) {
            if (forwardTo) {
              return /*#__PURE__*/React__default['default'].createElement("a", {
                className: "ButtonPrimary",
                href: forwardTo,
                rel: "noopener noreferrer"
              }, "Continue");
            } else {
              return /*#__PURE__*/React__default['default'].createElement("button", {
                className: "ButtonPrimary",
                onClick: close
              }, "Continue");
            }
          } else {
            return /*#__PURE__*/React__default['default'].createElement("button", {
              className: "ButtonPrimary disabled",
              onClick: function onClick() {}
            }, "Continue");
          }
        } else {
          return /*#__PURE__*/React__default['default'].createElement("button", {
            className: "ButtonPrimary",
            onClick: close
          }, "Close");
        }
      }
    };

    return /*#__PURE__*/React__default['default'].createElement("div", null, approvalButton(), additionalPaymentInformation(), mainAction());
  });

  var DonationOverviewDialog = (function (props) {
    var _useContext = React.useContext(ConfigurationContext),
        currencyCode = _useContext.currencyCode;

    var _useContext2 = React.useContext(ChangableAmountContext),
        amount = _useContext2.amount;

    var _useContext3 = React.useContext(PaymentContext),
        payment = _useContext3.payment,
        paymentState = _useContext3.paymentState;

    var _useContext4 = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext4.navigate;

    if (payment == undefined) {
      return /*#__PURE__*/React__default['default'].createElement(DonationOverviewSkeleton, null);
    }

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Donation")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM PaddingBottomXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
        title: paymentState == 'initialized' ? "Change amount" : undefined,
        onClick: function onClick() {
          if (paymentState != 'initialized') {
            return;
          }

          navigate('ChangeAmount');
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBodyWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("h4", {
        className: "CardTitle"
      }, "Amount"), /*#__PURE__*/React__default['default'].createElement("h2", {
        className: "CardText"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TokenAmountRow"
      }, new localCurrency.Currency({
        amount: amount.toFixed(2),
        code: currencyCode
      }).toString())))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardAction"
      }, /*#__PURE__*/React__default['default'].createElement(ChevronRight, null))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
        title: paymentState == 'initialized' ? "Change payment" : undefined,
        onClick: function onClick() {
          if (paymentState != 'initialized') {
            return;
          }

          navigate('ChangePayment');
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage",
        title: payment.name
      }, /*#__PURE__*/React__default['default'].createElement(reactTokenImage.TokenImage, {
        blockchain: payment.route.blockchain,
        address: payment.token
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBodyWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("h4", {
        className: "CardTitle"
      }, "Payment"), /*#__PURE__*/React__default['default'].createElement("h2", {
        className: "CardText"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TokenAmountRow"
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenSymbolCell"
      }, payment.symbol), /*#__PURE__*/React__default['default'].createElement("span", null, "\xA0"), /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenAmountCell"
      }, format(payment.amount)))))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardAction"
      }, /*#__PURE__*/React__default['default'].createElement(ChevronRight, null)))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement(Footer, null))
    });
  });

  var PaymentErrorDialog = (function () {
    var _useContext = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext.navigate;

    var _useContext2 = React.useContext(PaymentContext),
        transaction = _useContext2.transaction;

    var _useContext3 = React.useContext(ConfigurationContext),
        recover = _useContext3.recover;

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      stacked: recover ? false : true,
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM"
      }),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TextCenter"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "GraphicWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "Graphic",
        src: ErrorGraphic
      })), /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
      }, "Payment Failed"), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
      }, recover == undefined && /*#__PURE__*/React__default['default'].createElement("strong", {
        className: "FontSizeM"
      }, "Unfortunately executing your payment failed. You can go back and try again."), transaction && /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS"
      }, /*#__PURE__*/React__default['default'].createElement("a", {
        className: "Link",
        title: "Check your transaction on a block explorer",
        href: transaction === null || transaction === void 0 ? void 0 : transaction.url,
        target: "_blank",
        rel: "noopener noreferrer"
      }, "View on explorer")))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, recover == undefined && /*#__PURE__*/React__default['default'].createElement("button", {
        className: "ButtonPrimary",
        onClick: function onClick() {
          return navigate('back');
        }
      }, "Try again"))
    });
  });

  var ConnectGraphic = "data:image/png;base64,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";

  var WrongNetworkDialog = (function (props) {
    var _useContext = React.useContext(PaymentContext),
        payment = _useContext.payment;

    var _useContext2 = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext2.navigate;

    var blockchain = web3Blockchains.Blockchain.findByName(payment.route.blockchain);
    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      stacked: true,
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Wrong Network")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS TextCenter"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "GraphicWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "Graphic",
        src: ConnectGraphic
      })), /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
      }, "Connect to ", blockchain.label), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
      }, /*#__PURE__*/React__default['default'].createElement("strong", {
        className: "FontSizeM"
      }, "Please make sure you connect your wallet to the correct network before you try again!"))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "ButtonPrimary",
        onClick: function onClick() {
          return navigate('back');
        }
      }, "Try again"))
    });
  });

  var DonationStack = (function (props) {
    var _useContext = React.useContext(ClosableContext),
        open = _useContext.open,
        close = _useContext.close;

    var _useContext2 = React.useContext(NavigateContext),
        setNavigate = _useContext2.setNavigate;

    return /*#__PURE__*/React__default['default'].createElement(reactDialogStack.ReactDialogStack, {
      setNavigate: setNavigate,
      open: open,
      close: close,
      start: "DonationOverview",
      container: props.container,
      document: props.document,
      dialogs: {
        DonationOverview: /*#__PURE__*/React__default['default'].createElement(DonationOverviewDialog, null),
        ChangeAmount: /*#__PURE__*/React__default['default'].createElement(ChangeAmountDialog, null),
        ChangePayment: /*#__PURE__*/React__default['default'].createElement(ChangePaymentDialog, null),
        PaymentError: /*#__PURE__*/React__default['default'].createElement(PaymentErrorDialog, null),
        WrongNetwork: /*#__PURE__*/React__default['default'].createElement(WrongNetworkDialog, null)
      }
    });
  });

  var NavigateProvider = (function (props) {
    var navigator;

    var setNavigate = function setNavigate(_navigator) {
      navigator = _navigator;
    };

    var navigate = function navigate(dialog) {
      if (navigator) {
        navigator(dialog);
      }
    };

    return /*#__PURE__*/React__default['default'].createElement(NavigateContext.Provider, {
      value: {
        navigate: navigate,
        setNavigate: setNavigate
      }
    }, props.children);
  });

  var PaymentTrackingProvider = (function (props) {
    var _useContext = React.useContext(ErrorContext),
        errorCallback = _useContext.errorCallback;

    var _useContext2 = React.useContext(ConfigurationContext),
        track = _useContext2.track,
        integration = _useContext2.integration,
        type = _useContext2.type;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        transaction = _useState2[0],
        setTransaction = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        afterBlock = _useState4[0],
        setAfterBlock = _useState4[1];

    var _useState5 = React.useState(),
        _useState6 = _slicedToArray(_useState5, 2),
        paymentRoute = _useState6[0],
        setPaymentRoute = _useState6[1];

    var _useState7 = React.useState(!!(track && (track.endpoint || typeof track.method == 'function'))),
        _useState8 = _slicedToArray(_useState7, 1),
        tracking = _useState8[0];

    var _useState9 = React.useState(!!(track && track.poll && (track.poll.endpoint || typeof track.poll.method == 'function'))),
        _useState10 = _slicedToArray(_useState9, 1),
        polling = _useState10[0];

    var _useState11 = React.useState(false),
        _useState12 = _slicedToArray(_useState11, 2),
        release = _useState12[0],
        setRelease = _useState12[1];

    var _useState13 = React.useState(false),
        _useState14 = _slicedToArray(_useState13, 2),
        trackingFailed = _useState14[0],
        setTrackingFailed = _useState14[1];

    var _useState15 = React.useState(),
        _useState16 = _slicedToArray(_useState15, 2),
        forwardTo = _useState16[0],
        setForwardTo = _useState16[1];

    var _useContext3 = React.useContext(ClosableContext),
        setClosable = _useContext3.setClosable;

    var openSocket = function openSocket(transaction) {
      var socket = new WebSocket('wss://integrate.depay.fi/cable');

      socket.onopen = function (event) {
        var msg = {
          command: 'subscribe',
          identifier: JSON.stringify({
            blockchain: transaction.blockchain,
            sender: transaction.from.toLowerCase(),
            nonce: transaction.nonce,
            channel: 'PaymentChannel'
          })
        };
        socket.send(JSON.stringify(msg));
      };

      socket.onclose = function (event) {};

      socket.onmessage = function (event) {
        var item = JSON.parse(event.data);

        if (item.type === "ping") {
          return;
        }

        if (item.message && item.message.release) {
          setClosable(!item.message.forward_to);
          setForwardTo(item.message.forward_to);
          setRelease(item.message.release);
          socket.close();

          if (!!item.message.forward_to) {
            setTimeout(function () {
              props.document.location.href = item.message.forward_to;
            }, 200);
          }
        }
      };

      socket.onerror = function (error) {
        console.log('WebSocket Error: ' + error);
      };
    };

    var retryStartTracking = function retryStartTracking(transaction, afterBlock, paymentRoute, attempt) {
      attempt = parseInt(attempt || 1, 10);

      if (attempt < 3) {
        setTimeout(function () {
          startTracking(transaction, afterBlock, paymentRoute, attempt + 1);
        }, 3000);
      } else {
        console.log('PAYMENT TRACKING FAILED AFTER 3 ATTEMPTS!');
        setTrackingFailed(true);

        if (typeof errorCallback == 'function') {
          errorCallback({
            code: 'TRACKING_FAILED'
          });
        }
      }
    };

    var callTracking = function callTracking(payment) {
      if (track.endpoint) {
        return fetch(track.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payment)
        });
      } else if (track.method) {
        return track.method(payment);
      } else {
        throw 'No tracking defined!';
      }
    };

    var startTracking = function startTracking(transaction, afterBlock, paymentRoute, attempt) {
      callTracking({
        blockchain: transaction.blockchain,
        transaction: transaction.id.toLowerCase(),
        sender: transaction.from.toLowerCase(),
        nonce: transaction.nonce,
        after_block: afterBlock,
        to_token: paymentRoute.toToken.address
      }).then(function (response) {
        if (response.status != 200) {
          retryStartTracking(transaction, afterBlock, paymentRoute, attempt);
        }
      })["catch"](function (error) {
        console.log('PAYMENT TRACKING FAILED', error);
        retryStartTracking(transaction, afterBlock, paymentRoute, attempt);
      });
    };

    var pollStatus = function pollStatus(polling, transaction, afterBlock, paymentRoute, pollingInterval) {
      if (!polling || transaction == undefined || afterBlock == undefined || paymentRoute == undefined) {
        return;
      }

      var payment = {
        blockchain: transaction.blockchain,
        transaction: transaction.id.toLowerCase(),
        sender: transaction.from.toLowerCase(),
        nonce: transaction.nonce,
        after_block: afterBlock,
        to_token: paymentRoute.toToken.address
      };

      var handleResponse = function handleResponse(response) {
        if (response.status == 200) {
          response.json().then(function (data) {
            if (data && data.forward_to) {
              setForwardTo(data.forward_to);
              setTimeout(function () {
                props.document.location.href = data.forward_to;
              }, 100);
            }
          });
          clearInterval(pollingInterval);
          setRelease(true);
        }
      };

      if (track.poll.endpoint) {
        fetch(track.poll.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payment)
        }).then(handleResponse);
      } else if (track.poll.method) {
        track.poll.method(payment).then(handleResponse);
      }
    };

    React.useEffect(function () {
      if (!polling) {
        return;
      }

      var pollingInterval = setInterval(function () {
        return pollStatus(polling, transaction, afterBlock, paymentRoute, pollingInterval);
      }, 5000);
      return function () {
        clearInterval(pollingInterval);
      };
    }, [polling, transaction, afterBlock, paymentRoute]);

    var storePayment = function storePayment(transaction, afterBlock, paymentRoute, attempt) {
      if (attempt > 3) {
        return;
      }

      fetch('https://public.depay.fi/payments', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          blockchain: transaction.blockchain,
          transaction: transaction.id,
          sender: transaction.from.toLowerCase(),
          nonce: transaction.nonce,
          receiver: paymentRoute.toAddress,
          token: paymentRoute.toToken.address,
          amount: paymentRoute.fee ? ethers.ethers.utils.formatUnits(paymentRoute.transaction.params.amounts[1], paymentRoute.toDecimals) : ethers.ethers.utils.formatUnits(paymentRoute.toAmount, paymentRoute.toDecimals),
          confirmations: 1,
          after_block: afterBlock,
          uuid: transaction.id,
          payload: {
            sender_id: transaction.from.toLowerCase(),
            sender_token_id: paymentRoute.fromToken.address,
            sender_amount: ethers.ethers.utils.formatUnits(paymentRoute.fromAmount, paymentRoute.fromDecimals),
            integration: integration,
            type: type
          },
          fee_amount: paymentRoute.fee ? ethers.ethers.utils.formatUnits(paymentRoute.transaction.params.amounts[4], paymentRoute.toDecimals) : null,
          fee_receiver: paymentRoute.fee ? paymentRoute.transaction.params.addresses[1] : null
        })
      }).then(function (response) {
        if (response.status == 200 || response.status == 201) ; else {
          setTimeout(function () {
            storePayment(transaction, afterBlock, paymentRoute, attempt + 1);
          }, 3000);
        }
      })["catch"](function (error) {
        setTimeout(function () {
          storePayment(transaction, afterBlock, paymentRoute, attempt + 1);
        }, 3000);
      });
    };

    var initializeTracking = function initializeTracking(transaction, afterBlock, paymentRoute) {
      storePayment(transaction, afterBlock, paymentRoute, 1);

      if (tracking == false) {
        return;
      }

      setTransaction(transaction);
      setAfterBlock(afterBlock);
      setPaymentRoute(paymentRoute);
      openSocket(transaction);
      startTracking(transaction, afterBlock, paymentRoute);
    };

    return /*#__PURE__*/React__default['default'].createElement(PaymentTrackingContext.Provider, {
      value: {
        tracking: tracking,
        initializeTracking: initializeTracking,
        release: release,
        forwardTo: forwardTo,
        trackingFailed: trackingFailed
      }
    }, props.children);
  });

  var TransactionTrackingProvider = (function (props) {
    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        givenTransaction = _useState2[0],
        setGivenTransaction = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        foundTransaction = _useState4[0],
        setFoundTransaction = _useState4[1];

    var _useState5 = React.useState(false),
        _useState6 = _slicedToArray(_useState5, 2),
        polling = _useState6[0],
        setPolling = _useState6[1];

    var _useContext = React.useContext(ErrorContext);
        _useContext.errorCallback;

    var _useContext2 = React.useContext(ConfigurationContext),
        recover = _useContext2.recover;

    React.useEffect(function () {
      if (polling) {
        var poll = function poll() {
          fetch("https://public.depay.fi/transactions/".concat(givenTransaction.blockchain, "/").concat(givenTransaction.from.toLowerCase(), "/").concat(givenTransaction.nonce)).then(function (response) {
            if (response.status == 200) {
              response.json().then(function (data) {
                if (data.status != 'pending') {
                  setFoundTransaction({
                    id: data.external_id,
                    status: data.status
                  });
                  setPolling(false);
                }
              });
            }
          });
        };

        var pollingInterval = setInterval(poll, 5000);
        poll();
        return function () {
          clearInterval(pollingInterval);
        };
      }
    }, [polling]);

    var createTracking = function createTracking(transaction, afterBlock, attempt) {
      if (attempt > 3) {
        console.log('TRANSACTION TRACKING FAILED AFTER 3 ATTEMPTS!');
        return;
      }

      fetch('https://public.depay.fi/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: transaction.id,
          after_block: afterBlock,
          blockchain: transaction.blockchain,
          sender: transaction.from.toLowerCase(),
          nonce: transaction.nonce
        })
      }).then(function (response) {
        if (response.status == 200 || response.status == 201) {
          console.log('TRANSACTION TRACKING INITIALIZED');
        } else {
          console.log('TRANSACTION TRACKING FAILED', response);
          setTimeout(function () {
            createTracking(transaction, afterBlock, attempt + 1);
          }, 3000);
        }
      })["catch"](function (error) {
        console.log('TRANSACTION TRACKING FAILED', error);
        setTimeout(function () {
          createTracking(transaction, afterBlock, attempt + 1);
        }, 3000);
      });
    };

    var openSocket = function openSocket(transaction) {
      var socket = new WebSocket('wss://integrate.depay.fi/cable');

      socket.onopen = function (event) {
        var msg = {
          command: 'subscribe',
          identifier: JSON.stringify({
            blockchain: transaction.blockchain,
            sender: transaction.from.toLowerCase(),
            nonce: transaction.nonce,
            channel: 'TransactionChannel'
          })
        };
        socket.send(JSON.stringify(msg));
      };

      socket.onclose = function (event) {};

      socket.onmessage = function (event) {
        var item = JSON.parse(event.data);

        if (item.type === "ping") {
          return;
        }

        if (item.message && item.message.status && item.message.status != 'pending') {
          setFoundTransaction(item.message);
        }
      };

      socket.onerror = function (error) {
        console.log('WebSocket Error: ' + error);
      };
    };

    var initializeTracking = function initializeTracking(transaction, afterBlock) {
      setGivenTransaction(transaction);

      if (recover == undefined) {
        createTracking(transaction, afterBlock, 1);
      }

      openSocket(transaction);
      setPolling(true);
    };

    React.useEffect(function () {
      if (recover) {
        initializeTracking({
          blockchain: recover.blockchain,
          id: recover.transaction,
          from: recover.sender,
          nonce: recover.nonce
        }, recover.afterBlock);
      }
    }, [recover]);
    return /*#__PURE__*/React__default['default'].createElement(TransactionTrackingContext.Provider, {
      value: {
        initializeTracking: initializeTracking,
        foundTransaction: foundTransaction
      }
    }, props.children);
  });

  var WalletProvider = (function (props) {
    var _useContext = React.useContext(ConfigurationContext),
        recover = _useContext.recover;

    var _useContext2 = React.useContext(ErrorContext);
        _useContext2.setError;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        wallet = _useState2[0],
        setWallet = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        account = _useState4[0],
        setAccount = _useState4[1];

    var _useState5 = React.useState(),
        _useState6 = _slicedToArray(_useState5, 2),
        walletState = _useState6[0],
        setWalletState = _useState6[1];

    var connected = function connected(_ref) {
      var account = _ref.account,
          wallet = _ref.wallet;
      setAccount(account);
      setWallet(wallet);
      setWalletState('connected');

      if (props.connected) {
        props.connected(accounts[0]);
      }
    };

    if (walletState == 'connected' || recover != undefined) {
      return /*#__PURE__*/React__default['default'].createElement(WalletContext.Provider, {
        value: {
          account: account,
          wallet: wallet,
          walletState: walletState
        }
      }, props.children);
    } else {
      return /*#__PURE__*/React__default['default'].createElement(ConnectStack, {
        document: props.document,
        container: props.container,
        resolve: connected
      });
    }
  });

  var preflight$2 = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
      var accept;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              accept = _ref.accept;

              if (!(!(accept instanceof Array) || accept.length == 0)) {
                _context.next = 3;
                break;
              }

              throw 'You need to set the tokens you accept as donation!';

            case 3:
              accept.forEach(function (configuration) {
                if (typeof configuration.blockchain === 'undefined') {
                  throw 'You need to set the blockchain you want to receive the donation on!';
                }

                if (!['ethereum', 'bsc'].includes(configuration.blockchain)) {
                  throw 'You need to set a supported blockchain!';
                }

                if (typeof configuration.token === 'undefined') {
                  throw 'You need to set the token you want to receive as donation!';
                }

                if (typeof configuration.receiver === 'undefined') {
                  throw 'You need to set the receiver address that you want to receive the donation!';
                }
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function preflight(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var Donation = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_ref3) {
      var amount, accept, event, sent, confirmed, failed, error, critical, style, blacklist, providers, currency, connected, closed, closable, integration, document, unmount;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              amount = _ref3.amount, accept = _ref3.accept, event = _ref3.event, sent = _ref3.sent, confirmed = _ref3.confirmed, failed = _ref3.failed, error = _ref3.error, critical = _ref3.critical, style = _ref3.style, blacklist = _ref3.blacklist, providers = _ref3.providers, currency = _ref3.currency, connected = _ref3.connected, closed = _ref3.closed, closable = _ref3.closable, integration = _ref3.integration, document = _ref3.document;
              _context2.prev = 1;
              _context2.next = 4;
              return preflight$2({
                accept: accept
              });

            case 4:
              unmount = mount({
                style: style,
                document: ensureDocument(document),
                closed: closed
              }, function (unmount) {
                return function (container) {
                  return /*#__PURE__*/React__default['default'].createElement(ErrorProvider, {
                    errorCallback: error,
                    container: container,
                    unmount: unmount
                  }, /*#__PURE__*/React__default['default'].createElement(ConfigurationProvider, {
                    configuration: {
                      type: 'donation',
                      amount: amount,
                      accept: accept,
                      currency: currency,
                      event: event,
                      sent: sent,
                      confirmed: confirmed,
                      failed: failed,
                      blacklist: blacklist,
                      providers: providers,
                      integration: integration
                    }
                  }, /*#__PURE__*/React__default['default'].createElement(UpdatableProvider, null, /*#__PURE__*/React__default['default'].createElement(ClosableProvider, {
                    unmount: unmount,
                    closable: closable
                  }, /*#__PURE__*/React__default['default'].createElement(WalletProvider, {
                    container: container,
                    connected: connected,
                    unmount: unmount
                  }, /*#__PURE__*/React__default['default'].createElement(NavigateProvider, null, /*#__PURE__*/React__default['default'].createElement(ConversionRateProvider, null, /*#__PURE__*/React__default['default'].createElement(ChangableAmountProvider, {
                    accept: accept
                  }, /*#__PURE__*/React__default['default'].createElement(TransactionTrackingProvider, null, /*#__PURE__*/React__default['default'].createElement(PaymentTrackingProvider, {
                    document: ensureDocument(document)
                  }, /*#__PURE__*/React__default['default'].createElement(DonationRoutingProvider, {
                    container: container,
                    document: document
                  }, /*#__PURE__*/React__default['default'].createElement(DonationStack, {
                    document: document,
                    container: container
                  }), /*#__PURE__*/React__default['default'].createElement(PoweredBy, null))))))))))));
                };
              });
              return _context2.abrupt("return", {
                unmount: unmount
              });

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              console.log('critical error', _context2.t0);

              if (critical != undefined) {
                critical(_context2.t0);
              }

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 8]]);
    }));

    return function Donation(_x2) {
      return _ref4.apply(this, arguments);
    };
  }();

  var SignLoginDialog = (function (props) {
    var _useContext = React.useContext(ErrorContext),
        setError = _useContext.setError;

    var _useContext2 = React.useContext(ConfigurationContext),
        message = _useContext2.message,
        endpoint = _useContext2.endpoint;

    var _useContext3 = React.useContext(ConfigurationContext),
        recover = _useContext3.recover;

    var wallet = web3Wallets.getWallet();
    wallet !== null && wallet !== void 0 && wallet.name ? wallet.name : 'wallet';
    var walletLogo = wallet !== null && wallet !== void 0 && wallet.logo ? wallet.logo : undefined;

    if (typeof recover != 'function') {
      recover = function recover(_ref) {
        var message = _ref.message,
            signature = _ref.signature;
        return new Promise(function (resolve, reject) {
          fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: message,
              signature: signature
            })
          }).then(function (response) {
            if (response.status == 200) {
              response.text().then(function (account) {
                resolve(account);
              })["catch"](setError);
            } else {
              response.text().then(function (text) {
                setError(text || 'Recovering login signature failed!');
              });
            }
          });
        });
      };
    }

    var login = function login() {
      wallet.sign(message).then(function (signature) {
        recover({
          message: message,
          signature: signature
        }).then(props.resolve)["catch"](setError);
      })["catch"](function (error) {
        if (error && error.code && error.code == 4001) ; else {
          setError(error);
        }
      });
    };

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TextCenter"
      }, walletLogo && /*#__PURE__*/React__default['default'].createElement("div", {
        className: "GraphicWrapper PaddingTopS PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "Graphic",
        src: walletLogo
      })), /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL Text FontSizeL FontWeightBold PaddingTopS"
      }, "Wallet Login"), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
      }, /*#__PURE__*/React__default['default'].createElement("p", {
        className: "FontSizeM PaddingLeftM PaddingRightM"
      }, "Please click \"Log in\" and sign the message with your connected wallet."))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "ButtonPrimary",
        onClick: login
      }, "Log in"))
    });
  });

  var LoginStack = (function (props) {
    var _useContext = React.useContext(ClosableContext),
        open = _useContext.open,
        close = _useContext.close;

    var _useState = React.useState(true),
        _useState2 = _slicedToArray(_useState, 2);
        _useState2[0];
        _useState2[1];

    return /*#__PURE__*/React__default['default'].createElement(reactDialogStack.ReactDialogStack, {
      open: open,
      close: close,
      start: "SignLogin",
      container: props.container,
      document: props.document,
      dialogs: {
        SignLogin: /*#__PURE__*/React__default['default'].createElement(SignLoginDialog, {
          resolve: props.resolve,
          userClosedDialog: props.userClosedDialog
        })
      }
    });
  });

  var Login = function Login(options) {
    var style, error, document, message, endpoint, recover;

    if (_typeof(options) == 'object') {
      style = options.style;
      error = options.error;
      document = options.document;
      message = options.message;
      endpoint = options.endpoint;
      recover = options.recover;
    }

    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_resolve, reject) {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                Connect().then(function () {
                  mount({
                    style: style,
                    document: ensureDocument(document)
                  }, function (unmount) {
                    var userClosedDialog = function userClosedDialog() {
                      reject('USER_CLOSED_DIALOG');
                      unmount();
                    };

                    return function (container) {
                      return /*#__PURE__*/React__default['default'].createElement(ErrorProvider, {
                        errorCallback: error,
                        container: container,
                        unmount: unmount
                      }, /*#__PURE__*/React__default['default'].createElement(ConfigurationProvider, {
                        configuration: {
                          message: message,
                          endpoint: endpoint || '/login',
                          recover: recover
                        }
                      }, /*#__PURE__*/React__default['default'].createElement(UpdatableProvider, null, /*#__PURE__*/React__default['default'].createElement(ClosableProvider, {
                        unmount: userClosedDialog
                      }, /*#__PURE__*/React__default['default'].createElement(LoginStack, {
                        document: document,
                        container: container,
                        resolve: function resolve(account) {
                          unmount();

                          _resolve(account);
                        }
                      }), /*#__PURE__*/React__default['default'].createElement(PoweredBy, null)))));
                    };
                  });
                })["catch"](reject);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  };

  var PaymentAmountRoutingContext = /*#__PURE__*/React__default['default'].createContext();

  var PaymentAmountRoutingProvider = (function (props) {
    var _useContext = React.useContext(ChangableAmountContext),
        amountsMissing = _useContext.amountsMissing,
        acceptWithAmount = _useContext.acceptWithAmount,
        setMaxRoute = _useContext.setMaxRoute;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        accept = _useState2[0],
        setAccept = _useState2[1];

    React.useEffect(function () {
      if (amountsMissing) {
        if (acceptWithAmount) {
          setAccept(acceptWithAmount);
        }
      } else {
        setAccept(props.accept);
      }
    }, [amountsMissing, acceptWithAmount]);
    return /*#__PURE__*/React__default['default'].createElement(PaymentAmountRoutingContext.Provider, {
      value: {}
    }, /*#__PURE__*/React__default['default'].createElement(PaymentRoutingProvider, {
      accept: accept,
      whitelist: props.whitelist,
      blacklist: props.blacklist,
      event: props.event,
      setMaxRoute: setMaxRoute,
      fee: props.fee
    }, props.children));
  });

  var PaymentOverviewSkeleton = (function (props) {
    var _useContext = React.useContext(ChangableAmountContext),
        amountsMissing = _useContext.amountsMissing;

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Payment")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM PaddingBottomXS"
      }, amountsMissing && /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      }))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "ButtonPrimary Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      }))))
    });
  });

  var PaymentOverviewDialog = (function (props) {
    var _useContext = React.useContext(ConfigurationContext),
        currencyCode = _useContext.currencyCode,
        recover = _useContext.recover;

    var _useContext2 = React.useContext(PaymentContext),
        payment = _useContext2.payment,
        paymentState = _useContext2.paymentState;

    var _useContext3 = React.useContext(ChangableAmountContext),
        amount = _useContext3.amount,
        amountsMissing = _useContext3.amountsMissing;

    var _useContext4 = React.useContext(PaymentValueContext),
        paymentValue = _useContext4.paymentValue;

    var _useContext5 = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext5.navigate;

    if (payment == undefined || recover == undefined && paymentValue == undefined) {
      return /*#__PURE__*/React__default['default'].createElement(PaymentOverviewSkeleton, null);
    }

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Payment")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM PaddingBottomXS"
      }, amountsMissing && /*#__PURE__*/React__default['default'].createElement("div", {
        className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
        title: paymentState == 'initialized' ? "Change amount" : undefined,
        onClick: function onClick() {
          if (paymentState != 'initialized') {
            return;
          }

          navigate('ChangeAmount');
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBodyWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("h4", {
        className: "CardTitle"
      }, "Amount"), /*#__PURE__*/React__default['default'].createElement("h2", {
        className: "CardText"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TokenAmountRow"
      }, new localCurrency.Currency({
        amount: amount.toFixed(2),
        code: currencyCode
      }).toString())))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardAction"
      }, /*#__PURE__*/React__default['default'].createElement(ChevronRight, null))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
        title: paymentState == 'initialized' ? "Change payment" : undefined,
        onClick: function onClick() {
          if (paymentState != 'initialized') {
            return;
          }

          navigate('ChangePayment');
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage",
        title: payment.name
      }, /*#__PURE__*/React__default['default'].createElement(reactTokenImage.TokenImage, {
        blockchain: payment.blockchain,
        address: payment.token
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBodyWrapper"
      }, amountsMissing && /*#__PURE__*/React__default['default'].createElement("h4", {
        className: "CardTitle"
      }, "Payment"), /*#__PURE__*/React__default['default'].createElement("h2", {
        className: "CardText"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TokenAmountRow"
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenSymbolCell"
      }, payment.symbol), /*#__PURE__*/React__default['default'].createElement("span", null, "\xA0"), /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenAmountCell"
      }, format(payment.amount)))))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardAction"
      }, /*#__PURE__*/React__default['default'].createElement(ChevronRight, null)))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement(Footer, null))
    });
  });

  var PaymentStack = (function (props) {
    var _useContext = React.useContext(ClosableContext),
        open = _useContext.open,
        close = _useContext.close;

    var _useContext2 = React.useContext(NavigateContext),
        setNavigate = _useContext2.setNavigate;

    return /*#__PURE__*/React__default['default'].createElement(reactDialogStack.ReactDialogStack, {
      setNavigate: setNavigate,
      open: open,
      close: close,
      start: "PaymentOverview",
      container: props.container,
      document: props.document,
      dialogs: {
        PaymentOverview: /*#__PURE__*/React__default['default'].createElement(PaymentOverviewDialog, null),
        ChangeAmount: /*#__PURE__*/React__default['default'].createElement(ChangeAmountDialog, null),
        ChangePayment: /*#__PURE__*/React__default['default'].createElement(ChangePaymentDialog, null),
        PaymentError: /*#__PURE__*/React__default['default'].createElement(PaymentErrorDialog, null),
        WrongNetwork: /*#__PURE__*/React__default['default'].createElement(WrongNetworkDialog, null)
      }
    });
  });

  var preflight$1 = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
      var accept, recover;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              accept = _ref.accept, recover = _ref.recover;

              if (!recover) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              accept.forEach(function (configuration) {
                if (typeof configuration.blockchain === 'undefined') {
                  throw 'You need to set the blockchain your want to receive the payment on!';
                }

                if (!['ethereum', 'bsc'].includes(configuration.blockchain)) {
                  throw 'You need to set a supported blockchain!';
                }

                if (typeof configuration.token === 'undefined' && typeof configuration.fromToken === 'undefined' && typeof configuration.fromAmount === 'undefined' && typeof configuration.toToken === 'undefined') {
                  throw 'You need to set the token you want to receive as payment!';
                }

                if (typeof configuration.token === 'undefined' && typeof configuration.fromToken !== 'undefined' && typeof configuration.fromAmount === 'undefined' && typeof configuration.toToken === 'undefined') {
                  throw 'You need to set the fromToken, fromAmount and toToken!';
                }

                if (typeof configuration.receiver === 'undefined') {
                  throw 'You need to set the receiver address that you want to receive the payment!';
                }
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function preflight(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var Payment = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_ref3) {
      var accept, amount, event, sent, confirmed, failed, error, critical, style, whitelist, blacklist, providers, currency, connected, closed, track, fee, recover, closable, integration, document, unmount;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              accept = _ref3.accept, amount = _ref3.amount, event = _ref3.event, sent = _ref3.sent, confirmed = _ref3.confirmed, failed = _ref3.failed, error = _ref3.error, critical = _ref3.critical, style = _ref3.style, whitelist = _ref3.whitelist, blacklist = _ref3.blacklist, providers = _ref3.providers, currency = _ref3.currency, connected = _ref3.connected, closed = _ref3.closed, track = _ref3.track, fee = _ref3.fee, recover = _ref3.recover, closable = _ref3.closable, integration = _ref3.integration, document = _ref3.document;
              _context2.prev = 1;
              _context2.next = 4;
              return preflight$1({
                accept: accept,
                recover: recover
              });

            case 4:
              unmount = mount({
                style: style,
                document: ensureDocument(document),
                closed: closed
              }, function (unmount) {
                return function (container) {
                  return /*#__PURE__*/React__default['default'].createElement(ErrorProvider, {
                    errorCallback: error,
                    container: container,
                    unmount: unmount
                  }, /*#__PURE__*/React__default['default'].createElement(ConfigurationProvider, {
                    configuration: {
                      type: 'payment',
                      amount: amount,
                      accept: accept,
                      currency: currency,
                      event: event,
                      sent: sent,
                      confirmed: confirmed,
                      failed: failed,
                      whitelist: whitelist,
                      blacklist: blacklist,
                      providers: providers,
                      track: track,
                      fee: fee,
                      recover: recover,
                      integration: integration
                    }
                  }, /*#__PURE__*/React__default['default'].createElement(UpdatableProvider, null, /*#__PURE__*/React__default['default'].createElement(ClosableProvider, {
                    unmount: unmount,
                    closable: closable
                  }, /*#__PURE__*/React__default['default'].createElement(WalletProvider, {
                    document: document,
                    container: container,
                    connected: connected,
                    unmount: unmount
                  }, /*#__PURE__*/React__default['default'].createElement(NavigateProvider, null, /*#__PURE__*/React__default['default'].createElement(ConversionRateProvider, null, /*#__PURE__*/React__default['default'].createElement(ChangableAmountProvider, {
                    accept: accept
                  }, /*#__PURE__*/React__default['default'].createElement(PaymentAmountRoutingProvider, {
                    accept: accept,
                    whitelist: whitelist,
                    blacklist: blacklist,
                    event: event,
                    fee: fee
                  }, /*#__PURE__*/React__default['default'].createElement(TransactionTrackingProvider, null, /*#__PURE__*/React__default['default'].createElement(PaymentTrackingProvider, {
                    document: ensureDocument(document)
                  }, /*#__PURE__*/React__default['default'].createElement(PaymentProvider, {
                    container: container,
                    document: document
                  }, /*#__PURE__*/React__default['default'].createElement(PaymentValueProvider, null, /*#__PURE__*/React__default['default'].createElement(PaymentStack, {
                    document: document,
                    container: container
                  }), /*#__PURE__*/React__default['default'].createElement(PoweredBy, null))))))))))))));
                };
              });
              return _context2.abrupt("return", {
                unmount: unmount
              });

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              console.log('critical error', _context2.t0);

              if (critical != undefined) {
                critical(_context2.t0);
              }

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 8]]);
    }));

    return function Payment(_x2) {
      return _ref4.apply(this, arguments);
    };
  }();

  var SaleRoutingContext = /*#__PURE__*/React__default['default'].createContext();

  var ToTokenContext = /*#__PURE__*/React__default['default'].createContext();

  var ToTokenProvider = (function (props) {
    var _useContext = React.useContext(PaymentContext),
        payment = _useContext.payment;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        toToken = _useState2[0],
        setToToken = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        toTokenReadableAmount = _useState4[0],
        setToTokenReadableAmount = _useState4[1];

    React.useEffect(function () {
      if (payment) {
        Promise.all([payment.route.toToken.symbol(), payment.route.toToken.readable(payment.route.toAmount)]).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              symbol = _ref2[0],
              readableAmount = _ref2[1];

          setToToken({
            address: payment.route.toToken.address,
            symbol: symbol
          });
          setToTokenReadableAmount(readableAmount);
        });
      }
    }, [payment]);
    return /*#__PURE__*/React__default['default'].createElement(ToTokenContext.Provider, {
      value: {
        toToken: toToken,
        toTokenReadableAmount: toTokenReadableAmount
      }
    }, props.children);
  });

  var SaleRoutingProvider = (function (props) {
    var _useContext = React.useContext(ChangableAmountContext),
        acceptWithAmount = _useContext.acceptWithAmount,
        setMaxRoute = _useContext.setMaxRoute;

    var _useContext2 = React.useContext(ConfigurationContext),
        sell = _useContext2.sell;

    var _useContext3 = React.useContext(ConfigurationContext),
        blacklist = _useContext3.blacklist;

    if (blacklist == undefined) {
      blacklist = {};
    }

    for (var blockchain in sell) {
      var token = sell[blockchain];

      if (blacklist[blockchain] instanceof Array) {
        blacklist[blockchain].push(token);
      } else {
        blacklist[blockchain] = [token];
      }
    }

    return /*#__PURE__*/React__default['default'].createElement(SaleRoutingContext.Provider, {
      value: {}
    }, /*#__PURE__*/React__default['default'].createElement(PaymentRoutingProvider, {
      accept: acceptWithAmount,
      blacklist: blacklist,
      setMaxRoute: setMaxRoute
    }, /*#__PURE__*/React__default['default'].createElement(PaymentProvider, {
      container: props.container,
      document: props.document
    }, /*#__PURE__*/React__default['default'].createElement(PaymentValueProvider, null, /*#__PURE__*/React__default['default'].createElement(ToTokenProvider, null, props.children)))));
  });

  var SaleOverviewSkeleton = (function (props) {
    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Purchase")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM PaddingBottomXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton",
        style: {
          height: '100px'
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      }))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "ButtonPrimary Skeleton"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "SkeletonBackground"
      }))))
    });
  });

  var SaleOverviewDialog = (function (props) {
    var _useContext = React.useContext(ChangableAmountContext);
        _useContext.amount;

    var _useContext2 = React.useContext(ConfigurationContext),
        tokenImage = _useContext2.tokenImage,
        amountConfiguration = _useContext2.amount;

    var _useContext3 = React.useContext(PaymentValueContext),
        paymentValue = _useContext3.paymentValue;

    var _useContext4 = React.useContext(PaymentContext),
        payment = _useContext4.payment,
        paymentState = _useContext4.paymentState;

    var _useContext5 = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext5.navigate;

    var _useContext6 = React.useContext(ToTokenContext),
        toToken = _useContext6.toToken,
        toTokenReadableAmount = _useContext6.toTokenReadableAmount;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        salePerTokenValue = _useState2[0],
        setSalePerTokenValue = _useState2[1];

    React.useEffect(function () {
      if (paymentValue && (amountConfiguration == undefined || amountConfiguration.token != true)) {
        setSalePerTokenValue(new localCurrency.Currency({
          amount: (paymentValue.amount / parseFloat(toTokenReadableAmount)).toFixed(2),
          code: paymentValue.code
        }).toString());
      }
    }, [paymentValue]);

    if (toToken == undefined || toTokenReadableAmount == undefined || payment == undefined || paymentValue == undefined) {
      return /*#__PURE__*/React__default['default'].createElement(SaleOverviewSkeleton, null);
    }

    var tokenImageElement;

    if (tokenImage) {
      tokenImageElement = /*#__PURE__*/React__default['default'].createElement("img", {
        src: tokenImage
      });
    } else {
      tokenImageElement = /*#__PURE__*/React__default['default'].createElement(reactTokenImage.TokenImage, {
        blockchain: payment.route.blockchain,
        address: toToken.address
      });
    }

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Purchase")),
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingLeftM PaddingRightM PaddingBottomXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
        title: paymentState == 'initialized' ? "Change amount" : undefined,
        onClick: function onClick() {
          if (paymentState != 'initialized') {
            return;
          }

          navigate('ChangeAmount');
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage",
        title: payment.name
      }, tokenImageElement), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBodyWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("h4", {
        className: "CardTitle"
      }, "Amount"), /*#__PURE__*/React__default['default'].createElement("h2", {
        className: "CardText"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TokenAmountRow"
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenSymbolCell"
      }, toToken.symbol), /*#__PURE__*/React__default['default'].createElement("span", null, "\xA0"), /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenAmountCell"
      }, format(toTokenReadableAmount)))), salePerTokenValue && /*#__PURE__*/React__default['default'].createElement("h3", {
        className: "CardText"
      }, /*#__PURE__*/React__default['default'].createElement("small", null, salePerTokenValue, " per token")))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardAction"
      }, /*#__PURE__*/React__default['default'].createElement(ChevronRight, null))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
        title: paymentState == 'initialized' ? "Change payment" : undefined,
        onClick: function onClick() {
          if (paymentState != 'initialized') {
            return;
          }

          navigate('ChangePayment');
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage",
        title: payment.name
      }, /*#__PURE__*/React__default['default'].createElement(reactTokenImage.TokenImage, {
        blockchain: payment.route.blockchain,
        address: payment.token
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBodyWrapper"
      }, /*#__PURE__*/React__default['default'].createElement("h4", {
        className: "CardTitle"
      }, "Payment"), /*#__PURE__*/React__default['default'].createElement("h2", {
        className: "CardText"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TokenAmountRow"
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenSymbolCell"
      }, payment.symbol), /*#__PURE__*/React__default['default'].createElement("span", null, "\xA0"), /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TokenAmountCell"
      }, format(payment.amount)))))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardAction"
      }, /*#__PURE__*/React__default['default'].createElement(ChevronRight, null)))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
      }, /*#__PURE__*/React__default['default'].createElement(Footer, null))
    });
  });

  var SaleStack = (function (props) {
    var _useContext = React.useContext(ClosableContext),
        open = _useContext.open,
        close = _useContext.close;

    var _useContext2 = React.useContext(NavigateContext),
        setNavigate = _useContext2.setNavigate;

    return /*#__PURE__*/React__default['default'].createElement(reactDialogStack.ReactDialogStack, {
      setNavigate: setNavigate,
      open: open,
      close: close,
      start: "SaleOverview",
      container: props.container,
      document: props.document,
      dialogs: {
        SaleOverview: /*#__PURE__*/React__default['default'].createElement(SaleOverviewDialog, null),
        ChangeAmount: /*#__PURE__*/React__default['default'].createElement(ChangeAmountDialog, null),
        ChangePayment: /*#__PURE__*/React__default['default'].createElement(ChangePaymentDialog, null),
        NoPaymentMethodFound: /*#__PURE__*/React__default['default'].createElement(NoPaymentMethodFoundDialog, null),
        PaymentError: /*#__PURE__*/React__default['default'].createElement(PaymentErrorDialog, null),
        WrongNetwork: /*#__PURE__*/React__default['default'].createElement(WrongNetworkDialog, null)
      }
    });
  });

  var preflight = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
      var sell;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sell = _ref.sell;

              if (!(_typeof(sell) != 'object')) {
                _context.next = 3;
                break;
              }

              throw 'You need to configure at least 1 "blockchain": "token"';

            case 3:
              if (!(Object.keys(sell).length == 0)) {
                _context.next = 5;
                break;
              }

              throw 'You need to configure at least 1 "blockchain": "token"';

            case 5:
              if (!(Object.values(sell).length == 0)) {
                _context.next = 7;
                break;
              }

              throw 'You need to configure at least 1 "blockchain": "token"';

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function preflight(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var Sale = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_ref3) {
      var amount, sell, sent, confirmed, failed, error, critical, style, blacklist, providers, currency, connected, closed, tokenImage, closable, integration, document, accept, unmount;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              amount = _ref3.amount, sell = _ref3.sell, sent = _ref3.sent, confirmed = _ref3.confirmed, failed = _ref3.failed, error = _ref3.error, critical = _ref3.critical, style = _ref3.style, blacklist = _ref3.blacklist, providers = _ref3.providers, currency = _ref3.currency, connected = _ref3.connected, closed = _ref3.closed, tokenImage = _ref3.tokenImage, closable = _ref3.closable, integration = _ref3.integration, document = _ref3.document;
              _context2.prev = 1;
              _context2.next = 4;
              return preflight({
                sell: sell
              });

            case 4:
              accept = Object.keys(sell).map(function (key) {
                return {
                  blockchain: key,
                  token: sell[key]
                };
              });
              unmount = mount({
                style: style,
                document: ensureDocument(document),
                closed: closed
              }, function (unmount) {
                return function (container) {
                  return /*#__PURE__*/React__default['default'].createElement(ErrorProvider, {
                    errorCallback: error,
                    container: container,
                    unmount: unmount
                  }, /*#__PURE__*/React__default['default'].createElement(ConfigurationProvider, {
                    configuration: {
                      type: 'sale',
                      tokenImage: tokenImage,
                      amount: amount,
                      sell: sell,
                      currency: currency,
                      sent: sent,
                      confirmed: confirmed,
                      failed: failed,
                      blacklist: blacklist,
                      providers: providers,
                      integration: integration
                    }
                  }, /*#__PURE__*/React__default['default'].createElement(UpdatableProvider, null, /*#__PURE__*/React__default['default'].createElement(ClosableProvider, {
                    unmount: unmount,
                    closable: closable
                  }, /*#__PURE__*/React__default['default'].createElement(WalletProvider, {
                    container: container,
                    connected: connected,
                    unmount: unmount
                  }, /*#__PURE__*/React__default['default'].createElement(NavigateProvider, null, /*#__PURE__*/React__default['default'].createElement(ConversionRateProvider, null, /*#__PURE__*/React__default['default'].createElement(ChangableAmountProvider, {
                    accept: accept
                  }, /*#__PURE__*/React__default['default'].createElement(TransactionTrackingProvider, null, /*#__PURE__*/React__default['default'].createElement(PaymentTrackingProvider, {
                    document: ensureDocument(document)
                  }, /*#__PURE__*/React__default['default'].createElement(SaleRoutingProvider, {
                    container: container,
                    document: document
                  }, /*#__PURE__*/React__default['default'].createElement(SaleStack, {
                    document: document,
                    container: container
                  }), /*#__PURE__*/React__default['default'].createElement(PoweredBy, null))))))))))));
                };
              });
              return _context2.abrupt("return", {
                unmount: unmount
              });

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](1);
              console.log('critical error', _context2.t0);

              if (critical != undefined) {
                critical(_context2.t0);
              }

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 9]]);
    }));

    return function Sale(_x2) {
      return _ref4.apply(this, arguments);
    };
  }();

  var SelectionContext = /*#__PURE__*/React__default['default'].createContext();

  var SelectionProvider = (function (props) {
    var _useState = React.useState({}),
        _useState2 = _slicedToArray(_useState, 2),
        selection = _useState2[0],
        setSelection = _useState2[1];

    return /*#__PURE__*/React__default['default'].createElement(SelectionContext.Provider, {
      value: {
        selection: selection,
        setSelection: setSelection
      }
    }, props.children);
  });

  var msToTime = (function (ms) {
    var year, month, day, hour, minute, second;
    second = Math.floor(ms / 1000);
    minute = Math.floor(second / 60);
    second = second % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    month = Math.floor(day / 30);
    day = day % 30;
    year = Math.floor(month / 12);
    month = month % 12;
    return {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second
    };
  });

  var ConfirmTokenSelectionDialog = (function (props) {
    var _useContext = React.useContext(SelectionContext),
        selection = _useContext.selection;

    var _useContext2 = React.useContext(ClosableContext),
        setOpen = _useContext2.setOpen;

    var token = selection.token;
    var address = token.address || token.external_id;
    var logo = token.logo || token.image;
    var blockchain = web3Blockchains.Blockchain.findByName(token.blockchain);
    var age = token.first_transfer ? msToTime(new Date() - new Date(token.first_transfer)) : undefined;

    if (age) {
      age = [age.year && age.year >= 1 ? age.year >= 2 ? "".concat(age.year, " years") : "1 year" : undefined, age.month && age.month >= 1 ? age.month >= 2 ? "".concat(age.month, " months") : "1 month" : undefined, age.day && age.day >= 1 && age.month <= 1 && age.year < 1 ? age.day >= 2 ? "".concat(age.day, " days !!!") : "1 day !!!" : undefined].filter(function (n) {
        return n;
      }).join(' ');
    }

    var holders = token.unique_senders ? token.unique_senders : undefined;

    if (holders) {
      if (holders > 1000000) {
        holders = "Millions";
      } else if (holders > 100000) {
        holders = "Hundreds of Thousands";
      } else if (holders > 2000) {
        holders = "Thousands";
      } else if (holders > 100) {
        holders = "Hundreds";
      } else {
        holders = "Only a Few!!!";
      }
    }

    var onClickConfirm = function onClickConfirm() {
      setOpen(false);
      props.resolve({
        blockchain: token.blockchain,
        address: token.external_id || token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logo: token.image || token.logo
      });
      setTimeout(props.unmount, 300);
    };

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Confirm Selection"))),
      stacked: true,
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TokenImage medium TextCenter"
      }, logo && /*#__PURE__*/React__default['default'].createElement("img", {
        src: logo
      }), !logo && /*#__PURE__*/React__default['default'].createElement(reactTokenImage.TokenImage, {
        blockchain: token.blockchain,
        address: address
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS TextCenter"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Alert"
      }, /*#__PURE__*/React__default['default'].createElement("strong", null, "Please review this information"))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS"
      }, /*#__PURE__*/React__default['default'].createElement("table", {
        className: "Table TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("tbody", null, /*#__PURE__*/React__default['default'].createElement("tr", {
        className: "small TextCenter"
      }, /*#__PURE__*/React__default['default'].createElement("td", {
        colSpan: "2"
      }, /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("a", {
        className: "Link",
        href: blockchain.explorerUrlFor({
          token: address
        }),
        target: "_blank",
        rel: "noopener noreferrer"
      }, address)))), /*#__PURE__*/React__default['default'].createElement("tr", null, /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TableSubTitle"
      }, "Blockchain")), /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", null, blockchain.label))), /*#__PURE__*/React__default['default'].createElement("tr", null, /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TableSubTitle"
      }, "Symbol")), /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", null, token.symbol))), /*#__PURE__*/React__default['default'].createElement("tr", null, /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TableSubTitle"
      }, "Name")), /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", null, token.name))), age && /*#__PURE__*/React__default['default'].createElement("tr", null, /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TableSubTitle"
      }, "Age")), /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", null, age))), holders && /*#__PURE__*/React__default['default'].createElement("tr", null, /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "TableSubTitle"
      }, "Holders")), /*#__PURE__*/React__default['default'].createElement("td", null, /*#__PURE__*/React__default['default'].createElement("div", null, holders))))))),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("button", {
        className: "ButtonPrimary",
        onClick: onClickConfirm
      }, "Confirm"))
    });
  });

  var SelectBlockchainDialog = (function (props) {
    var _useContext = React.useContext(SelectionContext),
        setSelection = _useContext.setSelection;

    var _useContext2 = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext2.navigate;

    var stacked = Object.keys(props.selection).length > 1;
    var blockchains = [web3Blockchains.Blockchain.findByName('ethereum'), web3Blockchains.Blockchain.findByName('bsc')];

    var selectBlockchain = function selectBlockchain(blockchain) {
      setSelection(Object.assign(props.selection, {
        blockchain: blockchain
      }));

      if (stacked) {
        navigate('back');
      } else {
        props.resolve(blockchain);
      }
    };

    var elements = blockchains.map(function (blockchain, index) {
      return /*#__PURE__*/React__default['default'].createElement("div", {
        key: index,
        className: "Card Row",
        onClick: function onClick() {
          return selectBlockchain(blockchain);
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "transparent",
        src: blockchain.logo
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "CardText"
      }, blockchain.label)));
    });
    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Select Blockchain"))),
      stacked: stacked,
      bodyClassName: "ScrollHeight",
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS"
      }, elements),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS"
      })
    });
  });

  var SelectTokenDialog = (function (props) {
    var _useContext = React.useContext(reactDialogStack.NavigateStackContext),
        navigate = _useContext.navigate;

    var _useContext2 = React.useContext(ClosableContext),
        setOpen = _useContext2.setOpen;

    var _useContext3 = React.useContext(SelectionContext),
        setSelection = _useContext3.setSelection;

    var _useState = React.useState(),
        _useState2 = _slicedToArray(_useState, 2),
        requestController = _useState2[0],
        setRequestController = _useState2[1];

    var _useState3 = React.useState(),
        _useState4 = _slicedToArray(_useState3, 2),
        blockchain = _useState4[0],
        setBlockchain = _useState4[1];

    var _useState5 = React.useState(false),
        _useState6 = _slicedToArray(_useState5, 2),
        showAddToken = _useState6[0],
        setShowAddToken = _useState6[1];

    var _useState7 = React.useState([]),
        _useState8 = _slicedToArray(_useState7, 2),
        tokens = _useState8[0],
        setTokens = _useState8[1];

    var _useState9 = React.useState(),
        _useState10 = _slicedToArray(_useState9, 2);
        _useState10[0];
        _useState10[1];

    var searchElement = React.useRef();
    var wallet = web3Wallets.getWallet();

    var startWithBlockchain = function startWithBlockchain(name) {
      var blockchain = web3Blockchains.Blockchain.findByName(name);
      setBlockchain(blockchain);
      setSelection(Object.assign(props.selection, {
        blockchain: blockchain,
        token: undefined
      }));
      setTokens(blockchain.tokens);
    };

    React.useEffect(function () {
      if (wallet) {
        wallet.connectedTo().then(function (name) {
          var blockchain = web3Blockchains.Blockchain.findByName(name);

          if (name && name.length && blockchain && blockchain.tokens && blockchain.tokens.length) {
            startWithBlockchain(name);
          } else {
            startWithBlockchain('ethereum');
          }
        });
      } else {
        startWithBlockchain('ethereum');
      }
    }, []);
    React.useEffect(function () {
      if (props.selection.blockchain) {
        setBlockchain(props.selection.blockchain);
        setTokens(props.selection.blockchain.tokens);

        if (searchElement.current) {
          searchElement.current.value = '';
          searchElement.current.focus();
        }
      }
    }, [props.selection, props.selection.blockchain]);

    var onClickChangeBlockchain = function onClickChangeBlockchain() {
      navigate('SelectBlockchain');
    };

    var onClickAddToken = function onClickAddToken() {
      setShowAddToken(true);

      if (searchElement.current) {
        searchElement.current.value = '';
        searchElement.current.focus();
      }
    };

    var onChangeSearch = function onChangeSearch(event) {
      if (requestController) {
        requestController.abort();
      }

      var newRequestController = new AbortController();
      setRequestController(newRequestController);
      var signal = newRequestController.signal;
      var term = event.target.value;

      if (term.match(/^0x/)) {
        setTokens([]);
        var token;

        try {
          token = new web3Tokens.Token({
            blockchain: blockchain.name,
            address: term
          });
        } catch (_unused) {}

        if (token == undefined) {
          return;
        }

        Promise.all([token.name(), token.symbol(), token.decimals()]).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              name = _ref2[0],
              symbol = _ref2[1],
              decimals = _ref2[2];

          setTokens([{
            name: name,
            symbol: symbol,
            decimals: decimals,
            address: term,
            blockchain: blockchain.name
          }]);
        });
      } else if (term && term.length) {
        setTokens([]);
        fetch("https://public.depay.fi/tokens/search?blockchain=".concat(blockchain.name, "&term=").concat(term), {
          signal: signal
        }).then(function (response) {
          if (response.status == 200) {
            response.json().then(function (tokens) {
              setTokens(tokens);
            });
          }
        })["catch"](function () {});
      } else {
        setTokens(blockchain.tokens);
      }
    };

    var select = function select(token) {
      if (blockchain.tokens.find(function (majorToken) {
        return majorToken.address.toLowerCase() == (token.address || token.external_id).toLowerCase();
      })) {
        setOpen(false);
        props.resolve({
          blockchain: blockchain.name,
          address: token.address || token.external_id,
          logo: token.logo || token.image,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals
        });
        setTimeout(props.unmount, 300);
      } else {
        setSelection(Object.assign(props.selection, {
          token: token
        }));
        navigate('ConfirmTokenSelection');
      }
    };

    var elements = tokens.map(function (token, index) {
      return /*#__PURE__*/React__default['default'].createElement("div", {
        key: "".concat(index, "-").concat(token.address),
        className: "Card Row",
        onClick: function onClick() {
          return select(token);
        }
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage"
      }, token.logo && /*#__PURE__*/React__default['default'].createElement("img", {
        src: token.logo
      }), token.image && /*#__PURE__*/React__default['default'].createElement("img", {
        src: token.image
      }), !(token.logo || token.image) && /*#__PURE__*/React__default['default'].createElement(reactTokenImage.TokenImage, {
        blockchain: token.blockchain,
        address: token.external_id || token.address
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardTokenSymbol",
        title: token.symbol
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "CardText"
      }, token.symbol)), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardTokenName",
        title: token.name
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "CardText"
      }, token.name))));
    });

    if (blockchain == undefined) {
      return null;
    }

    return /*#__PURE__*/React__default['default'].createElement(Dialog$1, {
      header: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Select Token")), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingBottomXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Card small",
        onClick: onClickChangeBlockchain
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardImage small"
      }, /*#__PURE__*/React__default['default'].createElement("img", {
        className: "transparent",
        src: blockchain.logo
      })), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardBody"
      }, blockchain.label), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "CardAction"
      }, /*#__PURE__*/React__default['default'].createElement(ChevronRight, null)))), /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("input", {
        onChange: onChangeSearch,
        className: "Search",
        autoFocus: true,
        placeholder: "Search name or paste address",
        ref: searchElement
      }), showAddToken && /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingRightXS PaddingLeftXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Tooltip"
      }, /*#__PURE__*/React__default['default'].createElement("span", {
        className: "TooltipArrowUp"
      }), "Paste or enter token address here!")))),
      bodyClassName: "ScrollHeight",
      body: /*#__PURE__*/React__default['default'].createElement("div", {
        className: ""
      }, elements),
      footer: /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "PaddingTopXS PaddingBottomXS"
      }, /*#__PURE__*/React__default['default'].createElement("div", {
        className: "Link",
        onClick: onClickAddToken
      }, "Token missing? Add it.")))
    });
  });

  var SelectStack = (function (props) {
    var _useContext = React.useContext(ConfigurationContext),
        what = _useContext.what;

    var _useContext2 = React.useContext(ClosableContext),
        open = _useContext2.open,
        close = _useContext2.close;

    var _useContext3 = React.useContext(SelectionContext),
        selection = _useContext3.selection;

    var start;

    switch (what) {
      default:
        start = 'SelectToken';
    }

    return /*#__PURE__*/React__default['default'].createElement(reactDialogStack.ReactDialogStack, {
      open: open,
      close: close,
      start: start,
      container: props.container,
      document: props.document,
      dialogs: {
        SelectToken: /*#__PURE__*/React__default['default'].createElement(SelectTokenDialog, {
          selection: selection,
          resolve: props.resolve,
          unmount: props.unmount
        }),
        SelectBlockchain: /*#__PURE__*/React__default['default'].createElement(SelectBlockchainDialog, {
          selection: selection,
          resolve: props.resolve
        }),
        ConfirmTokenSelection: /*#__PURE__*/React__default['default'].createElement(ConfirmTokenSelectionDialog, {
          selection: selection,
          resolve: props.resolve,
          unmount: props.unmount
        })
      }
    });
  });

  var Select = function Select(options) {
    var style, error, document, what;

    if (_typeof(options) == 'object') {
      style = options.style;
      error = options.error;
      document = options.document;
      what = options.what;
    }

    var startupError;

    if (what == undefined) {
      startupError = '"what" needs to be configured!';
    } else if (['token'].indexOf(what) < 0) {
      startupError = "Unknown \"what\" configured: ".concat(what, "!");
    }

    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                mount({
                  style: style,
                  document: ensureDocument(document)
                }, function (unmount) {
                  var userClosedDialog = function userClosedDialog() {
                    reject('USER_CLOSED_DIALOG');
                    unmount();
                  };

                  return function (container) {
                    return /*#__PURE__*/React__default['default'].createElement(ErrorProvider, {
                      error: startupError,
                      errorCallback: error,
                      container: container,
                      unmount: unmount
                    }, /*#__PURE__*/React__default['default'].createElement(ConfigurationProvider, {
                      configuration: {
                        what: what
                      }
                    }, /*#__PURE__*/React__default['default'].createElement(UpdatableProvider, null, /*#__PURE__*/React__default['default'].createElement(ClosableProvider, {
                      unmount: userClosedDialog
                    }, /*#__PURE__*/React__default['default'].createElement(SelectionProvider, null, /*#__PURE__*/React__default['default'].createElement(SelectStack, {
                      document: document,
                      container: container,
                      unmount: unmount,
                      resolve: resolve
                    })), /*#__PURE__*/React__default['default'].createElement(PoweredBy, null)))));
                  };
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  };

  var DePayWidgets = {
    Connect: Connect,
    Donation: Donation,
    Login: Login,
    Payment: Payment,
    Sale: Sale,
    Select: Select,
    provider: web3Client.provider
  };

  return DePayWidgets;

})));
