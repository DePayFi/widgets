
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import React$1, { useState, useContext, useEffect } from 'react';
import { route } from 'depay-payment-routing';
import { setApiKey, getWallet } from 'depay-crypto-wallets';
import { ReactDialogStack } from 'depay-react-dialog-stack';
import { ReactShadowDOM } from 'depay-react-shadow-dom';

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

var runtime_1 = createCommonjsModule(function (module) {
  var runtime = function (exports) {

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
      define = function define(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
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
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
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
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
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
          } // Be forgiving, per 25.3.3.3.3 of the spec:
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
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
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
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
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

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
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
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

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
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
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
          var i = -1,
              next = function next() {
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
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
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
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
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

          return !!caught;
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
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
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
      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
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
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function _catch(tryLoc) {
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
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
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
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports );

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
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

var ClosableContext = /*#__PURE__*/React$1.createContext();

var ClosableProvider = (function (props) {
  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      closable = _useState2[0],
      setClosable = _useState2[1];

  return /*#__PURE__*/React$1.createElement(ClosableContext.Provider, {
    value: {
      closable: closable,
      setClosable: setClosable
    }
  }, props.children);
});

var ConfigurationContext = /*#__PURE__*/React$1.createContext();

var ConfigurationProvider = (function (props) {
  return /*#__PURE__*/React.createElement(ConfigurationContext.Provider, {
    value: props.configuration
  }, props.children);
});

var LoadingContext = /*#__PURE__*/React$1.createContext();

var LoadingProvider = (function (props) {
  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  return /*#__PURE__*/React$1.createElement(LoadingContext.Provider, {
    value: {
      loading: Object.values(loading).every(function (element) {
        return Boolean(element);
      }),
      setLoading: setLoading
    }
  }, props.children);
});

var ChevronRight = (function () {
  return /*#__PURE__*/React$1.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React$1.createElement("path", {
    stroke: "black",
    strokeWidth: "1",
    fillRule: "evenodd",
    d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
  }));
});

var CloseIcon = (function () {
  return /*#__PURE__*/React$1.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React$1.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React$1.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
});

var Dialog = (function (props) {
  var onClickClose = function onClickClose() {
    console.log('CLICK CLOSE');
  };

  return /*#__PURE__*/React$1.createElement("div", {
    className: "ReactDialogAnimation Dialog"
  }, /*#__PURE__*/React$1.createElement("div", {
    className: "DialogHeader"
  }, /*#__PURE__*/React$1.createElement("div", {
    className: "DialogHeaderInner"
  }, props.header, /*#__PURE__*/React$1.createElement("button", {
    onClick: onClickClose,
    className: "DialogCloseButton ButtonCircular"
  }, /*#__PURE__*/React$1.createElement(CloseIcon, null)))), /*#__PURE__*/React$1.createElement("div", {
    className: "DialogBody"
  }, props.body), /*#__PURE__*/React$1.createElement("div", {
    className: "DialogFooter"
  }, /*#__PURE__*/React$1.createElement("div", null, props.footer), /*#__PURE__*/React$1.createElement("a", {
    href: 'https://depay.fi?utm_source=' + window.location.hostname + '&utm_medium=widget&utm_campaign=Widget',
    rel: "noopener noreferrer",
    target: "_blank",
    className: "FooterLink"
  }, "by DePay")));
});

var PaymentOverviewSkeleton = (function (props) {
  return /*#__PURE__*/React$1.createElement(Dialog, {
    header: /*#__PURE__*/React$1.createElement("h1", {
      className: "HeaderTitle"
    }, "Payment"),
    body: /*#__PURE__*/React$1.createElement("div", null, /*#__PURE__*/React$1.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React$1.createElement("div", {
      className: "SkeletonBackground"
    }))),
    footer: /*#__PURE__*/React$1.createElement("div", null, /*#__PURE__*/React$1.createElement("div", {
      className: "ButtonPrimary Skeleton"
    }, /*#__PURE__*/React$1.createElement("div", {
      className: "SkeletonBackground"
    })))
  });
});

var PaymentOverviewDialog = (function (props) {
  var _useContext = useContext(LoadingContext),
      loading = _useContext.loading;

  if (loading) {
    return /*#__PURE__*/React$1.createElement(PaymentOverviewSkeleton, null);
  }

  return /*#__PURE__*/React$1.createElement(Dialog, {
    header: /*#__PURE__*/React$1.createElement("h1", {
      className: "HeaderTitle"
    }, "Payment"),
    body: /*#__PURE__*/React$1.createElement("div", null, /*#__PURE__*/React$1.createElement("div", {
      className: "Card",
      title: "Change Payment"
    }, /*#__PURE__*/React$1.createElement("div", {
      className: "CardImage"
    }, /*#__PURE__*/React$1.createElement("img", {
      src: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png"
    })), /*#__PURE__*/React$1.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React$1.createElement("div", null, /*#__PURE__*/React$1.createElement("h2", {
      className: "CardText"
    }, /*#__PURE__*/React$1.createElement("strong", null, "1.0 DEPAY")), /*#__PURE__*/React$1.createElement("h3", {
      className: "CardText"
    }, /*#__PURE__*/React$1.createElement("small", null, "$12.21 USD")))), /*#__PURE__*/React$1.createElement("div", {
      className: "CardAction"
    }, /*#__PURE__*/React$1.createElement(ChevronRight, null)))),
    footer: /*#__PURE__*/React$1.createElement("div", null, /*#__PURE__*/React$1.createElement("button", {
      className: "ButtonPrimary"
    }, "Pay $12.21 USD"))
  });
});

var RoutingContext = /*#__PURE__*/React$1.createContext();

var WalletContext = /*#__PURE__*/React$1.createContext();

var RoutingProvider = (function (props) {
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      allRoutes = _useState2[0],
      setAllRoutes = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedRoute = _useState4[0],
      setSelectedRoute = _useState4[1];

  var _useContext = useContext(LoadingContext),
      setLoading = _useContext.setLoading;

  var _useContext2 = useContext(ConfigurationContext),
      amount = _useContext2.amount,
      token = _useContext2.token,
      receiver = _useContext2.receiver;

  var _useContext3 = useContext(WalletContext),
      account = _useContext3.account;

  useEffect(function () {
    return setLoading({
      routing: true
    });
  }, []);
  useEffect(function () {
    if (!account) {
      return;
    }

    console.log('configuration', {
      from: account,
      to: receiver,
      blockchain: 'ethereum',
      token: token,
      amount: amount
    });
    route({
      from: account,
      to: receiver,
      blockchain: 'ethereum',
      token: token,
      amount: amount
    }).then(function (routes) {
      console.log('routes', routes); // setAllRoutes(routes)
    });
  }, [account]);
  return /*#__PURE__*/React$1.createElement(RoutingContext.Provider, {
    value: {
      selectedRoute: selectedRoute,
      setSelectedRoute: setSelectedRoute,
      allRoutes: allRoutes,
      setAllRoutes: setAllRoutes
    }
  }, props.children);
});

var WalletProvider = (function (props) {
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      wallet = _useState2[0],
      setWallet = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      account = _useState4[0],
      setAccount = _useState4[1];

  setApiKey('M5dZeHFfIp3J7h9H9fs4i4wmkUo1HjAF3EmMy32c');
  useEffect(function () {
    return setWallet(getWallet());
  }, []);
  useEffect(function () {
    if (wallet) {
      wallet.connect().then(function (accounts) {
        setAccount(accounts[0]);
      });
    }
  }, [wallet]);
  return /*#__PURE__*/React$1.createElement(WalletContext.Provider, {
    value: {
      account: account,
      wallet: wallet
    }
  }, props.children);
});

var PaymentStack = (function (props) {
  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  var close = function close() {
    setOpen(false);
    setTimeout(props.unmount, 300);
  };

  return /*#__PURE__*/React$1.createElement(LoadingProvider, null, /*#__PURE__*/React$1.createElement(ClosableProvider, null, /*#__PURE__*/React$1.createElement(ConfigurationProvider, {
    configuration: props.configuration
  }, /*#__PURE__*/React$1.createElement(WalletProvider, null, /*#__PURE__*/React$1.createElement(RoutingProvider, null, /*#__PURE__*/React$1.createElement(ReactDialogStack, {
    open: open,
    close: close,
    start: "PaymentOverview",
    container: props.container,
    document: props.document,
    dialogs: {
      PaymentOverview: /*#__PURE__*/React$1.createElement(PaymentOverviewDialog, null)
    }
  }))))));
});

var ButtonCircularStyle = (function () {
  return "\n\n    .ButtonCircular {\n      border-radius: 99rem;\n      cursor: pointer;\n      height: 34px;\n      opacity: 0.35;\n      padding: 5px 4px 4px 4px;\n      width: 34px;\n    }\n\n    .ButtonCircular:hover {\n      background: rgba(0,0,0,0.1);\n      opacity: 1;\n    }\n\n    .ButtonCircular:active {\n      background: rgba(0,0,0,0.25);\n      opacity: 1;\n    }\n  ";
});

var ButtonPrimaryStyle = (function (style) {
  return "\n\n    .ButtonPrimary {\n      background: " + style.colors.primary + ";\n      border-radius: 9999rem;\n      border: 1px solid transparent;\n      box-shadow: 0 0 10px rgba(0,0,0,0.05);\n      color: white;\n      display: inline-block;\n      font-size: 1.3rem;\n      font-weight: 400;\n      min-height: 2.96rem;\n      min-width: 13rem;\n      padding: 0.7rem 1.4rem 0.6rem;\n      text-decoration: none;\n      transition: background 0.1s;\n    }\n\n    .ButtonPrimary.circular {\n      padding: 0;\n      width: 3.4rem;\n      height: 3.4rem;\n      line-height: 3.2rem;\n    }\n\n    .ButtonPrimary.disabled {\n      background: rgb(210,210,210);\n    }\n\n    .ButtonPrimary:not(.disabled){\n      cursor: pointer;\n    }\n    .ButtonPrimary:not(.disabled):hover {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.1);\n    }\n    .ButtonPrimary:not(.disabled):active {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);\n    }\n  ";
});

var CardStyle = (function (style) {
  return "\n\n    .Card {\n      background: rgb(255,255,255);\n      border-radius: 0.8rem;\n      box-shadow: 0 0 8px rgba(0,0,0,0.03);\n      cursor: pointer;\n      display: flex;\n      flex-direction: row;\n      margin-bottom: 0.5rem;\n      min-height: 4.78rem;\n      padding: 1rem 0.6rem;\n    }\n\n    .Card:hover {\n      background: rgb(240,240,240);\n      box-shadow: 0 0 0 rgba(0,0,0,0); \n    }\n\n    .Card:active {\n      background: rgb(235,235,235);\n      box-shadow: inset 0 0 6px rgba(0,0,0,0.02); \n    }\n\n    .Card:hover .CardAction {\n      opacity: 0.4;\n    }\n\n    .CardImage, .CardBody, .CardAction {\n      align-items: center;\n      display: flex;\n      padding: 0 0.4rem;\n    }\n\n    .CardAction {\n      padding-right: 0;\n    }\n\n    .CardAction {\n      margin-left: auto;\n    }\n\n    .CardBody {\n      line-height: 1.4rem;\n      padding-left: 0.6rem;\n      text-align: left;\n    }\n\n    .CardImage img {\n      background: rgb(240,240,240);\n      border-radius: 99rem;\n      border: 1px solid white;\n      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);\n      height: 2.8rem;\n      position: relative;\n      vertical-align: middle;\n      width: 2.8rem;\n    }\n    \n    .CardText {\n      font-size: 1.3rem;\n    }\n\n    .CardText strong {\n      font-weight: 500;\n    }\n\n    .CardText small {\n      font-size: 1.1rem;\n      color: rgb(150,150,150);\n    }\n\n    .CardAction {\n      opacity: 0.2;\n    }\n\n    .Card.More {\n      display: inline-block;\n      text-align: center;\n    }\n  ";
});

var DialogStyle = (function () {
  return "\n\n    .Dialog {\n      margin: 0 auto;\n      max-width: 26rem;\n      min-width: 26rem;\n      position: relative;\n      width: 100%;\n    }\n\n    .DialogBody {\n      background: rgb(248,248,248);\n      padding: 0.8rem 1.2rem 0.2rem;\n      overflow-x: hidden;\n      overflow-y: auto;\n    }\n\n    .DialogBody.HeightAuto {\n      height: auto;\n    }\n\n    .DialogHeader {\n      background: rgb(248,248,248);\n      border-top-left-radius: 0.8rem;\n      border-top-right-radius: 0.8rem;\n      padding: 0.8rem 1.2rem 0 1.2rem;\n      position: relative;\n    }\n\n    .DialogHeaderInner {\n      position: relative;\n    }\n\n    .DialogFooter {\n      background: rgb(248,248,248);\n      border-bottom-left-radius: 0.8rem;\n      border-bottom-right-radius: 0.8rem;\n      padding: 0.2rem 1.8rem 0.2rem 1.8rem;\n      position: relative;\n      text-align: center;\n    }\n\n    .DialogCloseButton {\n      position: absolute;\n      top: 1px;\n      right: -6px;\n    }\n    \n    .DialogGoBackButton {\n      position: absolute;\n      top: 1rem;\n      left: 0.9rem;\n    }\n  ";
});

var FooterStyle = (function (style) {
  return "\n\n    .FooterLink {\n      color: rgba(0,0,0,0.2);\n      display: inline-block;\n      font-size: 1rem;\n      padding-top: 0.1rem;\n      text-decoration: none;\n    }\n\n    .FooterLink:hover, .FooterLink:active {\n      color: #cc2c65;\n    }\n  ";
});

var HeaderTitleStyle = (function () {
  return "\n\n    .HeaderTitle {\n      font-size: 1.4rem;\n      text-align: left;\n    }\n\n  ";
});

var ResetStyle = (function () {
  return "\n\n      html, body, div, span, applet, object, iframe,\n      h1, h2, h3, h4, h5, h6, p, blockquote, pre,\n      a, abbr, acronym, address, big, cite, code,\n      del, dfn, em, img, ins, kbd, q, s, samp,\n      small, strike, strong, sub, sup, tt, var,\n      b, u, i, center,\n      dl, dt, dd, ol, ul, li,\n      fieldset, form, label, legend,\n      table, caption, tbody, tfoot, thead, tr, th, td,\n      article, aside, canvas, details, embed, \n      figure, figcaption, footer, header, hgroup, \n      menu, nav, output, ruby, section, summary,\n      time, mark, audio, video {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        font-size: 100%;\n        font: inherit;\n        text-align: inherit;\n        vertical-align: baseline;\n      }\n\n      article, aside, details, figcaption, figure, \n      footer, header, hgroup, menu, nav, section {\n        display: block;\n      }\n\n      body {\n        line-height: 1;\n      }\n\n      ol, ul {\n        list-style: none;\n      }\n\n      blockquote, q {\n        quotes: none;\n      }\n\n      blockquote:before, blockquote:after,\n      q:before, q:after {\n        content: '';\n        content: none;\n      }\n      \n      table {\n        border-collapse: collapse;\n        border-spacing: 0;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n\n      button {\n        border: 0;\n        background: none;\n        outline: none;\n      }\n\n  ";
});

var SkeletonStyle = (function () {
  return "\n        \n    .Skeleton {\n      background: rgb(230,230,230) !important;\n      border: 1px solid transparent;\n      box-shadow: none !important;\n      cursor: inherit !important;\n      overflow: hidden;\n      position: relative;\n    }\n\n    @keyframes SkeletonBackgroundAnimation {\n      from {\n        left: -500px;\n      }\n      to   {\n        left: +120%;\n      }\n    }\n\n    .SkeletonBackground {\n      animation: 2s SkeletonBackgroundAnimation 0.2s ease infinite;\n      background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%);\n      height: 100%;\n      left: -140%;\n      position: absolute;\n      top: 0;\n      width: 400px;\n    }\n  ";
});

var style = (function (style) {
  style = Object.assign({
    colors: {
      primary: '#ea357a'
    }
  }, style);
  return [ResetStyle(), DialogStyle(), ButtonCircularStyle(), ButtonPrimaryStyle(style), HeaderTitleStyle(), CardStyle(), FooterStyle(), SkeletonStyle()].join('');
});

var preflight = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
    var amount, token, receiver;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            amount = _ref.amount, token = _ref.token, receiver = _ref.receiver;

            if (!(typeof amount === 'undefined')) {
              _context.next = 3;
              break;
            }

            throw 'DePayWidgets.Payment: You need to set the amount you want to receive as payment!';

          case 3:
            if (!(typeof token === 'undefined')) {
              _context.next = 5;
              break;
            }

            throw 'DePayWidgets.Payment: You need to set the token you want to receive as payment!';

          case 5:
            if (!(typeof receiver === 'undefined')) {
              _context.next = 7;
              break;
            }

            throw 'DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!';

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

var Payment = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_ref3) {
    var amount, token, receiver, document, content, _ReactShadowDOM, _unmount;

    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            amount = _ref3.amount, token = _ref3.token, receiver = _ref3.receiver, document = _ref3.document;

            if (typeof document === 'undefined') {
              document = window.document;
            }

            _context2.next = 4;
            return preflight({
              amount: amount,
              token: token,
              receiver: receiver
            });

          case 4:
            content = function content(container) {
              return /*#__PURE__*/React$1.createElement(PaymentStack, {
                configuration: {
                  amount: amount,
                  token: token,
                  receiver: receiver
                },
                unmount: function unmount() {
                  return _unmount();
                },
                document: document,
                container: container
              });
            };

            _ReactShadowDOM = ReactShadowDOM({
              document: document,
              element: document.body,
              content: content,
              insideStyle: style(),
              outsideStyle: "\n      position: fixed;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      right: 0;\n    "
            }), _unmount = _ReactShadowDOM.unmount;

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function Payment(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var DePayWidgets = {
  Payment: Payment
};

export default DePayWidgets;
