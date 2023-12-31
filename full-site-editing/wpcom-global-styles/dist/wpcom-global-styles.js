/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 6744:
/***/ (function(module) {

module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}


/***/ }),

/***/ 3421:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.parse = parse;
exports.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim()
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


/***/ }),

/***/ 5881:
/***/ (function(module) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 2699:
/***/ (function(module) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ 4495:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(212);
var assert = __webpack_require__(9561);

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};


/***/ }),

/***/ 8032:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(212);
var common = __webpack_require__(4495);
var shaCommon = __webpack_require__(713);
var assert = __webpack_require__(9561);

var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;

var BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),

/***/ 713:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(212);
var rotr32 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;


/***/ }),

/***/ 212:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var assert = __webpack_require__(9561);
var inherits = __webpack_require__(1285);

exports.inherits = inherits;

function isSurrogatePair(msg, i) {
  if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
    return false;
  }
  if (i < 0 || i + 1 >= msg.length) {
    return false;
  }
  return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
}

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      // Inspired by stringToUtf8ByteArray() in closure-library by Google
      // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
      // Apache License 2.0
      // https://github.com/google/closure-library/blob/master/LICENSE
      var p = 0;
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        if (c < 128) {
          res[p++] = c;
        } else if (c < 2048) {
          res[p++] = (c >> 6) | 192;
          res[p++] = (c & 63) | 128;
        } else if (isSurrogatePair(msg, i)) {
          c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
          res[p++] = (c >> 18) | 240;
          res[p++] = ((c >> 12) & 63) | 128;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        } else {
          res[p++] = (c >> 12) | 224;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        }
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
exports.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.shr64_lo = shr64_lo;


/***/ }),

/***/ 1285:
/***/ (function(module) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 1612:
/***/ (function() {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 2131:
/***/ (function() {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 9561:
/***/ (function(module) {

module.exports = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};


/***/ }),

/***/ 1093:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6115);
/* harmony import */ var _automattic_data_stores_src_plans__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7987);
/* harmony import */ var _automattic_data_stores_src_plans_constants__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(4703);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5609);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9196);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _image_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9731);
/* harmony import */ var _use_canvas__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9773);
/* harmony import */ var _modal_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1612);

/* global wpcomGlobalStyles */








const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__;




const GlobalStylesModal = () => {
  const isSiteEditor = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => !!select('core/edit-site'), []);
  const {
    viewCanvasPath
  } = (0,_use_canvas__WEBPACK_IMPORTED_MODULE_7__/* .useCanvas */ .$)();
  const plans = (0,_automattic_data_stores_src_plans__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)();
  const isVisible = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    if (!isSiteEditor) {
      return false;
    }
    const currentSidebar = select('core/interface').getActiveComplementaryArea('core/edit-site');
    return select('automattic/wpcom-global-styles').isModalVisible(currentSidebar, viewCanvasPath);
  }, [viewCanvasPath, isSiteEditor]);
  const {
    dismissModal
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)('automattic/wpcom-global-styles');
  const {
    set: setPreference
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)('core/preferences');

  // Hide the welcome guide modal, so it doesn't conflict with our modal.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isSiteEditor) {
      setPreference('core/edit-site', 'welcomeGuideStyles', false);
    }
  }, [setPreference, isSiteEditor]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isVisible) {
      (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__/* .recordTracksEvent */ .jN)('calypso_global_styles_gating_modal_show', {
        context: 'site-editor'
      });
    }
  }, [isVisible]);
  const closeModal = () => {
    dismissModal();
    (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__/* .recordTracksEvent */ .jN)('calypso_global_styles_gating_modal_dismiss', {
      context: 'site-editor'
    });
  };
  if (!isSiteEditor || !isVisible) {
    return null;
  }
  const description = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)( /* translators: %s is the short-form Premium plan name */
  __("Change all of your site's fonts, colors and more. Available on the %s plan.", 'full-site-editing'), plans.data?.[_automattic_data_stores_src_plans_constants__WEBPACK_IMPORTED_MODULE_10__/* .PLAN_PREMIUM */ .xf]?.productNameShort || '');
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
    className: "wpcom-global-styles-modal",
    onRequestClose: closeModal
    // set to false so that 1Password's autofill doesn't automatically close the modal
    ,
    shouldCloseOnClickOutside: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wpcom-global-styles-modal__content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wpcom-global-styles-modal__text"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", {
    className: "wpcom-global-styles-modal__heading"
  }, __('A powerful new way to style your site', 'full-site-editing')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "wpcom-global-styles-modal__description"
  }, description), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wpcom-global-styles-modal__actions"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary",
    onClick: closeModal
  }, __('Try it out', 'full-site-editing')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "primary",
    href: wpcomGlobalStyles.upgradeUrl,
    target: "_top",
    onClick: () => (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__/* .recordTracksEvent */ .jN)('calypso_global_styles_gating_modal_upgrade_click', {
      context: 'site-editor'
    })
  }, __('Upgrade plan', 'full-site-editing')))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wpcom-global-styles-modal__image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: _image_svg__WEBPACK_IMPORTED_MODULE_6__,
    alt: ""
  }))));
};
/* harmony default export */ __webpack_exports__.Z = (GlobalStylesModal);

/***/ }),

/***/ 7172:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ GlobalStylesNotices; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6115);
/* harmony import */ var _automattic_data_stores_src_plans__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7987);
/* harmony import */ var _automattic_data_stores_src_plans_constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4703);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(5830);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(7022);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5609);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _use_canvas__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9773);
/* harmony import */ var _use_global_styles_config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7210);
/* harmony import */ var _use_preview__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(807);
/* harmony import */ var _notice_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2131);

/* global wpcomGlobalStyles */








const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__;




const GLOBAL_STYLES_VIEW_NOTICE_SELECTOR = 'wpcom-global-styles-notice-container';
const trackEvent = function (eventName) {
  let isSiteEditor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__/* .recordTracksEvent */ .jN)(eventName, {
    context: isSiteEditor ? 'site-editor' : 'post-editor',
    blog_id: wpcomGlobalStyles.wpcomBlogId
  });
};
function GlobalStylesWarningNotice(_ref) {
  let {
    plans
  } = _ref;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    trackEvent('calypso_global_styles_gating_notice_view_canvas_show');
  }, []);
  const upgradeTranslation = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)( /* translators: %s is the short-form Premium plan name */
  __('Your site includes premium styles that are only visible to visitors after <a>upgrading to the %s plan or higher</a>.', 'full-site-editing'), plans.data?.[_automattic_data_stores_src_plans_constants__WEBPACK_IMPORTED_MODULE_9__/* .PLAN_PREMIUM */ .xf]?.productNameShort || '');
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Notice, {
    status: "warning",
    isDismissible: false,
    className: "wpcom-global-styles-notice"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createInterpolateElement)(upgradeTranslation, {
    a: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ExternalLink, {
      href: wpcomGlobalStyles.upgradeUrl,
      target: "_blank",
      onClick: () => trackEvent('calypso_global_styles_gating_notice_view_canvas_upgrade_click')
    })
  }));
}
function GlobalStylesViewNotice() {
  const {
    canvas
  } = (0,_use_canvas__WEBPACK_IMPORTED_MODULE_5__/* .useCanvas */ .$)();
  const [isRendered, setIsRendered] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    globalStylesInUse
  } = (0,_use_global_styles_config__WEBPACK_IMPORTED_MODULE_6__/* .useGlobalStylesConfig */ .Y)();
  const plans = (0,_automattic_data_stores_src_plans__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)();
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!globalStylesInUse) {
      document.querySelector(`.${GLOBAL_STYLES_VIEW_NOTICE_SELECTOR}`)?.remove();
      setIsRendered(false);
      return;
    }
    if (!plans?.data) {
      return;
    }
    if (isRendered) {
      return;
    }
    if (canvas !== 'view') {
      return;
    }
    const saveHub = document.querySelector('.edit-site-save-hub');
    if (!saveHub) {
      return;
    }

    // Insert the notice as a sibling of the save hub instead of as a child,
    // to prevent our notice from breaking the flex styles of the hub.
    const container = saveHub.parentNode;
    const noticeContainer = document.createElement('div');
    noticeContainer.classList.add(GLOBAL_STYLES_VIEW_NOTICE_SELECTOR);
    container.insertBefore(noticeContainer, saveHub);
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.render)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(GlobalStylesWarningNotice, {
      plans: plans
    }), noticeContainer);
    setIsRendered(true);
  }, [isRendered, canvas, plans, globalStylesInUse]);
  return null;
}
function GlobalStylesEditNotice() {
  const NOTICE_ID = 'wpcom-global-styles/gating-notice';
  const {
    globalStylesInUse,
    globalStylesId
  } = (0,_use_global_styles_config__WEBPACK_IMPORTED_MODULE_6__/* .useGlobalStylesConfig */ .Y)();
  const {
    canvas
  } = (0,_use_canvas__WEBPACK_IMPORTED_MODULE_5__/* .useCanvas */ .$)();
  const {
    isSiteEditor,
    isPostEditor
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => ({
    isSiteEditor: !!select('core/edit-site') && canvas === 'edit',
    isPostEditor: !select('core/edit-site') && !!select('core/editor').getCurrentPostId()
  }), [canvas]);
  const {
    previewPostWithoutCustomStyles,
    canPreviewPost
  } = (0,_use_preview__WEBPACK_IMPORTED_MODULE_7__/* .usePreview */ .u)();
  const plans = (0,_automattic_data_stores_src_plans__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)();
  const {
    createWarningNotice,
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)('core/notices');
  const {
    editEntityRecord
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)('core');
  const upgradePlan = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    window.open(wpcomGlobalStyles.upgradeUrl, '_blank').focus();
    trackEvent('calypso_global_styles_gating_notice_upgrade_click', isSiteEditor);
  }, [isSiteEditor]);
  const previewPost = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    previewPostWithoutCustomStyles();
    trackEvent('calypso_global_styles_gating_notice_preview_click', isSiteEditor);
  }, [isSiteEditor, previewPostWithoutCustomStyles]);
  const resetGlobalStyles = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!globalStylesId) {
      return;
    }
    editEntityRecord('root', 'globalStyles', globalStylesId, {
      styles: {},
      settings: {}
    });
    trackEvent('calypso_global_styles_gating_notice_reset_click', isSiteEditor);
  }, [editEntityRecord, globalStylesId, isSiteEditor]);
  const openResetGlobalStylesSupport = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    window.open(wpcomGlobalStyles.resetGlobalStylesSupportUrl, '_blank').focus();
    trackEvent('calypso_global_styles_gating_notice_reset_support_click', isSiteEditor);
  }, [isSiteEditor]);
  const showNotice = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const actions = [{
      label: __('Upgrade now', 'full-site-editing'),
      onClick: upgradePlan,
      variant: 'primary',
      noDefaultClasses: true,
      className: 'wpcom-global-styles-action-has-icon wpcom-global-styles-action-is-external'
    }];
    if (isPostEditor && canPreviewPost) {
      actions.push({
        label: __('Preview without premium styles', 'full-site-editing'),
        onClick: previewPost,
        variant: 'secondary',
        noDefaultClasses: true,
        className: 'wpcom-global-styles-action-has-icon wpcom-global-styles-action-is-external'
      });
    }
    actions.push({
      label: __('Remove premium styles', 'full-site-editing'),
      onClick: isSiteEditor ? resetGlobalStyles : openResetGlobalStylesSupport,
      variant: isSiteEditor ? 'secondary' : 'link',
      noDefaultClasses: true,
      className: isSiteEditor ? '' : 'wpcom-global-styles-action-has-icon wpcom-global-styles-action-is-external wpcom-global-styles-action-is-support'
    });
    createWarningNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.sprintf)( /* translators: %s is the short-form Premium plan name */
    __('Your site includes premium styles that are only visible to visitors after upgrading to the %s plan or higher.', 'full-site-editing'), plans.data?.[_automattic_data_stores_src_plans_constants__WEBPACK_IMPORTED_MODULE_9__/* .PLAN_PREMIUM */ .xf]?.productNameShort || ''), {
      id: NOTICE_ID,
      actions: actions
    });
    trackEvent('calypso_global_styles_gating_notice_show', isSiteEditor);
  }, [canPreviewPost, createWarningNotice, isPostEditor, isSiteEditor, openResetGlobalStylesSupport, plans.data, previewPost, resetGlobalStyles, upgradePlan]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isSiteEditor && !isPostEditor) {
      return;
    }
    if (globalStylesInUse) {
      showNotice();
    } else {
      removeNotice(NOTICE_ID);
    }
    return () => removeNotice(NOTICE_ID);
  }, [globalStylesInUse, isSiteEditor, isPostEditor, removeNotice, showNotice]);
  return null;
}
function GlobalStylesNotices() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_11__/* .QueryClientProvider */ .aH, {
    client: new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_12__/* .QueryClient */ .S()
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(GlobalStylesViewNotice, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(GlobalStylesEditNotice, null));
}

/***/ }),

/***/ 7915:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* exported __webpack_public_path__ */
/* global __webpack_public_path__ */

/**
 * Dynamically set WebPack's publicPath so that split assets can be found.
 * @see https://webpack.js.org/guides/public-path/#on-the-fly
 */
if (typeof window === 'object' && window.wpcomGlobalStyles?.assetsUrl) {
  // eslint-disable-next-line no-global-assign
  __webpack_require__.p = window.wpcomGlobalStyles.assetsUrl;
}

/***/ }),

/***/ 6421:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const DEFAULT_STATE = {
  isModalVisible: true
};
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.registerStore)('automattic/wpcom-global-styles', {
  reducer: function () {
    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
    let action = arguments.length > 1 ? arguments[1] : undefined;
    switch (action.type) {
      case 'DISMISS_MODAL':
        return {
          ...state,
          isModalVisible: false
        };
    }
    return state;
  },
  actions: {
    dismissModal: () => ({
      type: 'DISMISS_MODAL'
    })
  },
  selectors: {
    isModalVisible: (state, currentSidebar, viewCanvasPath) => state.isModalVisible && (currentSidebar === 'edit-site/global-styles' || viewCanvasPath === '/wp_global_styles')
  },
  persist: true
});

/***/ }),

/***/ 9773:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: function() { return /* binding */ useCanvas; }
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);


function useCanvas() {
  const [canvas, setCanvas] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const [viewCanvasPath, setViewCanvasPath] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const isSiteEditor = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => !!select('core/edit-site'), []);

  // Since Gutenberg doesn't provide a stable selector to get canvas data,
  // we need to infer it from the URL.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (!isSiteEditor) {
      return;
    }
    const unsubscribe = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.subscribe)(() => {
      const params = new URLSearchParams(window.location.search);
      const _canvas = params.get('canvas') ?? 'view';
      setCanvas(_canvas);
      setViewCanvasPath(_canvas === 'view' ? params.get('path') : undefined);
    });
    return () => unsubscribe();
  }, [isSiteEditor]);
  return {
    canvas,
    viewCanvasPath
  };
}

/***/ }),

/***/ 7210:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: function() { return /* binding */ useGlobalStylesConfig; }
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

function useGlobalStylesConfig() {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getEditedEntityRecord,
      __experimentalGetCurrentGlobalStylesId
    } = select('core');
    const _globalStylesId = __experimentalGetCurrentGlobalStylesId ? __experimentalGetCurrentGlobalStylesId() : null;
    const globalStylesRecord = getEditedEntityRecord('root', 'globalStyles', _globalStylesId);
    const globalStylesConfig = {
      styles: globalStylesRecord?.styles ?? {},
      settings: globalStylesRecord?.settings ?? {}
    };

    // Determine if the global Styles are in use on the current site.
    const globalStylesInUse = !!(Object.keys(globalStylesConfig.styles).length || Object.keys(globalStylesConfig.settings).length);
    return {
      globalStylesInUse,
      globalStylesId: _globalStylesId
    };
  }, []);
}

/***/ }),

/***/ 807:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: function() { return /* binding */ usePreview; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5609);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6483);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_4__);





const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__;

function writeInterstitialMessage(targetDocument) {
  let markup = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.renderToString)((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "editor-post-preview-button__interstitial-message"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SVG, {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 96 96"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Path, {
    className: "outer",
    d: "M48 12c19.9 0 36 16.1 36 36S67.9 84 48 84 12 67.9 12 48s16.1-36 36-36",
    fill: "none"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Path, {
    className: "inner",
    d: "M69.5 46.4c0-3.9-1.4-6.7-2.6-8.8-1.6-2.6-3.1-4.9-3.1-7.5 0-2.9 2.2-5.7 5.4-5.7h.4C63.9 19.2 56.4 16 48 16c-11.2 0-21 5.7-26.7 14.4h2.1c3.3 0 8.5-.4 8.5-.4 1.7-.1 1.9 2.4.2 2.6 0 0-1.7.2-3.7.3L40 67.5l7-20.9L42 33c-1.7-.1-3.3-.3-3.3-.3-1.7-.1-1.5-2.7.2-2.6 0 0 5.3.4 8.4.4 3.3 0 8.5-.4 8.5-.4 1.7-.1 1.9 2.4.2 2.6 0 0-1.7.2-3.7.3l11.5 34.3 3.3-10.4c1.6-4.5 2.4-7.8 2.4-10.5zM16.1 48c0 12.6 7.3 23.5 18 28.7L18.8 35c-1.7 4-2.7 8.4-2.7 13zm32.5 2.8L39 78.6c2.9.8 5.9 1.3 9 1.3 3.7 0 7.3-.6 10.6-1.8-.1-.1-.2-.3-.2-.4l-9.8-26.9zM76.2 36c0 3.2-.6 6.9-2.4 11.4L64 75.6c9.5-5.5 15.9-15.8 15.9-27.6 0-5.5-1.4-10.8-3.9-15.3.1 1 .2 2.1.2 3.3z",
    fill: "none"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, __('Generating preview…', 'full-site-editing'))));
  markup += `
		<style>
			body {
				margin: 0;
			}
			.editor-post-preview-button__interstitial-message {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100vh;
				width: 100vw;
			}
			@-webkit-keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			@-moz-keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			@-o-keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			@keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			.editor-post-preview-button__interstitial-message svg {
				width: 192px;
				height: 192px;
				stroke: #555d66;
				stroke-width: 0.75;
			}
			.editor-post-preview-button__interstitial-message svg .outer,
			.editor-post-preview-button__interstitial-message svg .inner {
				stroke-dasharray: 280;
				stroke-dashoffset: 280;
				-webkit-animation: paint 1.5s ease infinite alternate;
				-moz-animation: paint 1.5s ease infinite alternate;
				-o-animation: paint 1.5s ease infinite alternate;
				animation: paint 1.5s ease infinite alternate;
			}
			p {
				text-align: center;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
			}
		</style>
	`;
  targetDocument.write(markup);
  targetDocument.title = __('Generating preview…', 'full-site-editing');
  targetDocument.close();
}
function usePreview() {
  const {
    currentPostLink,
    isAutosaveable,
    isDraft,
    isPostEditor,
    isLocked,
    isSaveable,
    previewLink
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const {
      getCurrentPostId,
      getCurrentPostAttribute,
      getEditedPostPreviewLink,
      isEditedPostAutosaveable,
      isEditedPostSaveable,
      isPostLocked,
      getEditedPostAttribute
    } = select('core/editor');
    return {
      currentPostLink: getCurrentPostAttribute('link'),
      isAutosaveable: isEditedPostAutosaveable(),
      isDraft: ['draft', 'auto-draft'].indexOf(getEditedPostAttribute('status')) !== -1,
      isLocked: isPostLocked(),
      isPostEditor: !select('core/edit-site') && !!getCurrentPostId(),
      isSaveable: isEditedPostSaveable(),
      previewLink: getEditedPostPreviewLink()
    };
  });
  const previewWindow = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const {
    autosave,
    savePost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('core/editor');
  const previewPostWithoutCustomStyles = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!isPostEditor) {
      return;
    }
    if (!previewWindow.current || previewWindow.current.closed) {
      previewWindow.current = window.open('', '_blank');
    }
    previewWindow.current.focus();
    if (!isAutosaveable || isLocked) {
      if (previewWindow.current && !previewWindow.current.closed) {
        previewWindow.current.location = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_4__.addQueryArgs)(previewLink || currentPostLink, {
          'hide-global-styles': ''
        });
      }
      return;
    }
    if (isDraft) {
      savePost({
        isPreview: true
      });
    } else {
      autosave({
        isPreview: true
      });
    }
    writeInterstitialMessage(previewWindow.current.document);
  }, [autosave, currentPostLink, isAutosaveable, isDraft, isLocked, isPostEditor, previewLink, savePost]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isPostEditor) {
      return;
    }
    if (previewWindow.current && previewLink && !previewWindow.current.closed) {
      previewWindow.current.location = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_4__.addQueryArgs)(previewLink, {
        'hide-global-styles': true
      });
    }
  }, [isPostEditor, previewLink]);
  return {
    previewPostWithoutCustomStyles,
    canPreviewPost: isSaveable
  };
}

/***/ }),

/***/ 6115:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   jN: function() { return /* reexport safe */ _tracks__WEBPACK_IMPORTED_MODULE_7__.jN; }
/* harmony export */ });
/* harmony import */ var _utils_do_not_track__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1694);
/* harmony import */ var _utils_current_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6209);
/* harmony import */ var _page_view_params__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9377);
/* harmony import */ var _utils_get_tracking_prefs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2552);
/* harmony import */ var _utils_set_tracking_prefs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(825);
/* harmony import */ var _utils_is_country_in_gdpr_zone__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6326);
/* harmony import */ var _utils_is_region_in_ccpa_zone__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2286);
/* harmony import */ var _tracks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9792);
/* harmony import */ var _train_tracks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3722);
/**
 * Re-export
 */










/***/ }),

/***/ 9377:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony exports getPageViewParams, getMostRecentUrlPath */
// We use this module state to track url paths submitted to recordTracksPageView
// `lib/analytics/index.js` also reuses it for timing.record
let mostRecentUrlPath = null;

// pathCounter is used to keep track of the order of calypso_page_view Tracks events.
let pathCounter = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', function () {
    // throw away our URL value if the user used the back/forward buttons
    mostRecentUrlPath = null;
  });
}
function getPageViewParams(urlPath) {
  const params = {
    last_pageview_path_with_count: `${mostRecentUrlPath}(${pathCounter.toString()})`,
    this_pageview_path_with_count: `${urlPath}(${pathCounter + 1})`
  };
  // Record this path.
  mostRecentUrlPath = urlPath;
  pathCounter++;
  return params;
}

/**
 * Gets the url path which was set on the last call to getPageViewParams() and stored in module state
 * mostRecentUrlPath will be null if the page was refreshed or getPageViewParams() has not been called
 */
function getMostRecentUrlPath() {
  return mostRecentUrlPath;
}

/***/ }),

/***/ 9792:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   jN: function() { return /* binding */ recordTracksEvent; }
/* harmony export */ });
/* unused harmony exports getTracksLoadPromise, pushEventToTracksQueue, analyticsEvents, getTracksAnonymousUserId, initializeAnalytics, identifyUser, signalUserFromAnotherProduct, recordTracksPageView, recordTracksPageViewWithPageParams, getGenericSuperPropsGetter */
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2699);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_load_script__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4898);
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3421);
/* harmony import */ var _page_view_params__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9377);
/* harmony import */ var _utils_current_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6209);
/* harmony import */ var _utils_debug__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9358);
/* harmony import */ var _utils_do_not_track__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1694);
/* harmony import */ var _utils_get_tracking_prefs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2552);
/* eslint-disable @typescript-eslint/no-explicit-any */









/**
 * Tracks uses a bunch of special query params that should not be used as property name
 * See internal Nosara repo?
 */
const TRACKS_SPECIAL_PROPS_NAMES = (/* unused pure expression or super */ null && (['geo', 'message', 'request', 'geocity', 'ip']));
const EVENT_NAME_EXCEPTIONS = ['a8c_cookie_banner_ok', 'a8c_cookie_banner_view', 'a8c_ccpa_optout',
// WooCommerce Onboarding / Connection Flow.
'wcadmin_storeprofiler_create_jetpack_account', 'wcadmin_storeprofiler_connect_store', 'wcadmin_storeprofiler_login_jetpack_account', 'wcadmin_storeprofiler_payment_login', 'wcadmin_storeprofiler_payment_create_account',
// Checkout
'calypso_checkout_switch_to_p_24', 'calypso_checkout_composite_p24_submit_clicked',
// Launch Bar
'wpcom_launchbar_button_click'];
let _superProps; // Added to all Tracks events.
let _loadTracksResult = Promise.resolve(); // default value for non-BOM environments.

if (typeof document !== 'undefined') {
  _loadTracksResult = (0,_automattic_load_script__WEBPACK_IMPORTED_MODULE_1__/* .loadScript */ .ve)('//stats.wp.com/w.js?64');
}
function createRandomId() {
  let randomBytesLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
  if (typeof window === 'undefined') {
    return '';
  }
  // 9 * 4/3 = 12
  // this is to avoid getting padding of a random byte string when it is base64 encoded
  let randomBytes;
  if (window.crypto && window.crypto.getRandomValues) {
    randomBytes = new Uint8Array(randomBytesLength);
    window.crypto.getRandomValues(randomBytes);
  } else {
    randomBytes = Array(randomBytesLength).fill(0).map(() => Math.floor(Math.random() * 256));
  }
  return window.btoa(String.fromCharCode(...randomBytes));
}
function getUrlParameter(name) {
  if (typeof window === 'undefined') {
    return '';
  }
  name = name.replace(/[[]/g, '\\[').replace(/[\]]/g, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
function checkForBlockedTracks() {
  // Proceed only after the tracks script load finished and failed.
  // Calling this function from `initialize` ensures current user is set.
  // This detects stats blocking, and identifies by `getCurrentUser()`, URL, or cookie.
  return _loadTracksResult.catch(() => {
    let _ut;
    let _ui;
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.ID) {
      _ut = 'wpcom:user_id';
      _ui = currentUser.ID;
    } else {
      _ut = getUrlParameter('_ut') || 'anon';
      _ui = getUrlParameter('_ui');
      if (!_ui) {
        const cookies = cookie.parse(document.cookie);
        if (cookies.tk_ai) {
          _ui = cookies.tk_ai;
        } else {
          const randomIdLength = 18; // 18 * 4/3 = 24 (base64 encoded chars).
          _ui = createRandomId(randomIdLength);
          document.cookie = cookie.serialize('tk_ai', _ui);
        }
      }
    }
    debug('Loading /nostats.js', {
      _ut,
      _ui
    });
    return loadScript('/nostats.js?_ut=' + encodeURIComponent(_ut) + '&_ui=' + encodeURIComponent(_ui));
  });
}

/**
 * Returns a promise that marks whether and when the external Tracks script loads.
 */
function getTracksLoadPromise() {
  return _loadTracksResult;
}
function pushEventToTracksQueue(args) {
  if (typeof window !== 'undefined') {
    window._tkq = window._tkq || [];
    window._tkq.push(args);
  }
}
const analyticsEvents = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();

/**
 * Returns the anoymous id stored in the `tk_ai` cookie
 *
 * @returns The Tracks anonymous user id
 */
function getTracksAnonymousUserId() {
  const cookies = cookie.parse(document.cookie);
  return cookies.tk_ai;
}
function initializeAnalytics(currentUser, superProps) {
  // Update super props.
  if ('function' === typeof superProps) {
    debug('superProps', superProps);
    _superProps = superProps;
  }

  // Identify current user.
  if ('object' === typeof currentUser) {
    debug('identifyUser', currentUser);
    identifyUser(currentUser);
  }

  // Tracks blocked?
  debug('checkForBlockedTracks');
  return checkForBlockedTracks();
}
function identifyUser(userData) {
  // Ensure object.
  if ('object' !== typeof userData) {
    debug('Invalid userData.', userData);
    return; // Not possible.
  }

  // Set current user.
  const currentUser = setCurrentUser(userData);
  if (!currentUser) {
    debug('Insufficient userData.', userData);
    return; // Not possible.
  }

  // Tracks user identification.
  debug('Tracks identifyUser.', currentUser);
  pushEventToTracksQueue(['identifyUser', currentUser.ID, currentUser.username]);
}

/**
 * For tracking users between our products, generally passing the id via a request parameter.
 *
 * Use 'anon' for userIdType for anonymous users.
 */
function signalUserFromAnotherProduct(userId, userIdType) {
  debug('Tracks signalUserFromAnotherProduct.', userId, userIdType);
  pushEventToTracksQueue(['signalAliasUserGeneral', userId, userIdType]);
}
function recordTracksEvent(eventName, eventProperties) {
  eventProperties = eventProperties || {};
  const trackingPrefs = (0,_utils_get_tracking_prefs__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .ZP)();
  if (!trackingPrefs?.buckets.analytics) {
    (0,_utils_debug__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)('Analytics has been disabled - Ignoring event "%s" with actual props %o', eventName, eventProperties);
    return;
  }
  if (false) {}
  (0,_utils_debug__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)('Record event "%s" called with props %o', eventName, eventProperties);
  if (!eventName.startsWith('calypso_') && !eventName.startsWith('jetpack_') && !eventName.startsWith('wpcom_dsp_widget_') && !EVENT_NAME_EXCEPTIONS.includes(eventName)) {
    (0,_utils_debug__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)('- Event name must be prefixed by "calypso_", "jetpack_", or added to `EVENT_NAME_EXCEPTIONS`');
    return;
  }
  if (_superProps) {
    const superProperties = _superProps(eventProperties);
    eventProperties = {
      ...eventProperties,
      ...superProperties
    }; // assign to a new object so we don't modify the argument
  }

  // Remove properties that have an undefined value
  // This allows a caller to easily remove properties from the recorded set by setting them to undefined
  eventProperties = Object.fromEntries(Object.entries(eventProperties).filter(_ref => {
    let [, val] = _ref;
    return typeof val !== 'undefined';
  }));
  (0,_utils_debug__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)('Recording event "%s" with actual props %o', eventName, eventProperties);
  pushEventToTracksQueue(['recordEvent', eventName, eventProperties]);
  analyticsEvents.emit('record-event', eventName, eventProperties);
}
function recordTracksPageView(urlPath, params) {
  debug('Recording pageview in tracks.', urlPath, params);
  let eventProperties = {
    do_not_track: getDoNotTrack() ? 1 : 0,
    path: urlPath
  };

  // Add calypso build timestamp if set
  const build_timestamp = typeof window !== 'undefined' && window.BUILD_TIMESTAMP;
  if (build_timestamp) {
    eventProperties = Object.assign(eventProperties, {
      build_timestamp
    });
  }

  // add optional path params
  if (params) {
    eventProperties = Object.assign(eventProperties, params);
  }

  // Record all `utm` marketing parameters as event properties on the page view event
  // so we can analyze their performance with our analytics tools
  if (typeof window !== 'undefined' && window.location) {
    const urlParams = new URL(window.location.href).searchParams;
    const utmParamEntries = urlParams && Array.from(urlParams.entries()).filter(_ref2 => {
      let [key] = _ref2;
      return key.startsWith('utm_');
    });
    const utmParams = utmParamEntries ? Object.fromEntries(utmParamEntries) : {};
    eventProperties = Object.assign(eventProperties, utmParams);
  }
  recordTracksEvent('calypso_page_view', eventProperties);
}
function recordTracksPageViewWithPageParams(urlPath, params) {
  const pageViewParams = getPageViewParams(urlPath);
  recordTracksPageView(urlPath, Object.assign(params || {}, pageViewParams));
}
function getGenericSuperPropsGetter(config) {
  return () => {
    const superProps = {
      environment: "production",
      environment_id: config('env_id'),
      site_id_label: 'wpcom',
      client: config('client_slug')
    };
    if (typeof window !== 'undefined') {
      Object.assign(superProps, {
        vph: window.innerHeight,
        vpw: window.innerWidth
      });
    }
    return superProps;
  };
}

/***/ }),

/***/ 3722:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony exports recordTrainTracksRender, recordTrainTracksInteract, getNewRailcarId */
/* harmony import */ var _tracks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9792);


function recordTrainTracksRender(_ref) {
  let {
    railcarId,
    uiAlgo,
    uiPosition,
    fetchAlgo,
    fetchPosition,
    query,
    result,
    recBlogId,
    recPostId,
    recFeedId,
    recFeedItemId
  } = _ref;
  const props = {};

  // Remap and filter undefined props
  Object.entries({
    railcar: railcarId,
    ui_algo: uiAlgo,
    ui_position: uiPosition,
    fetch_algo: fetchAlgo,
    fetch_query: query,
    fetch_position: fetchPosition,
    rec_result: result,
    rec_blog_id: recBlogId,
    rec_post_id: recPostId,
    rec_feed_id: recFeedId,
    rec_feed_item_id: recFeedItemId
  }).forEach(_ref2 => {
    let [key, val] = _ref2;
    return val !== undefined && (props[key] = val);
  });
  recordTracksEvent('calypso_traintracks_render', props);
}
function recordTrainTracksInteract(_ref3) {
  let {
    railcarId,
    action
  } = _ref3;
  recordTracksEvent('calypso_traintracks_interact', {
    railcar: railcarId,
    action
  });
}
function getNewRailcarId() {
  let suffix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'recommendation';
  return `${uuid().replace(/-/g, '')}-${suffix}`;
}

/***/ }),

/***/ 6209:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony exports getCurrentUser, setCurrentUser */
/* harmony import */ var _hash_pii__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


/**
 * Module variables
 */
let _currentUser;
/**
 * Gets current user.
 *
 * @returns Current user.
 */
function getCurrentUser() {
  return _currentUser;
}

/**
 * Sets current user, (stored in javascript memory).
 *
 * @param currentUser the user data for the current user
 * @returns Current user.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setCurrentUser(currentUser) {
  if (!currentUser.ID || isNaN(parseInt(currentUser.ID, 10)) || !currentUser.username || !currentUser.email) {
    return; // Invalid user data.
  }
  _currentUser = {
    ID: parseInt(currentUser.ID, 10),
    username: currentUser.username,
    email: currentUser.email,
    hashedPii: {
      ID: hashPii(currentUser.ID),
      username: hashPii(currentUser.username.toLowerCase().replace(/\s/g, '')),
      email: hashPii(currentUser.email.toLowerCase().replace(/\s/g, ''))
    }
  };
  return _currentUser;
}

/***/ }),

/***/ 9358:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Module variables
 */
/* harmony default export */ __webpack_exports__.Z = (debug__WEBPACK_IMPORTED_MODULE_0___default()('calypso:analytics'));

/***/ }),

/***/ 1694:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9358);


/**
 * Whether Do Not Track is enabled in the user's browser.
 *
 * @returns true if Do Not Track is enabled in the user's browser.
 */
function getDoNotTrack() {
  const result = Boolean(typeof window !== 'undefined' && (
  // Internet Explorer 11 uses window.doNotTrack rather than navigator.doNotTrack.
  // Safari 7.1.3+ uses window.doNotTrack rather than navigator.doNotTrack.
  // MDN ref: https://developer.mozilla.org/en-US/docs/Web/API/navigator/doNotTrack#Browser_compatibility
  window.doNotTrack === '1' || window.navigator && window.navigator.doNotTrack === '1'));
  debug(`Do Not Track: ${result}`);
  return result;
}

/***/ }),

/***/ 2552:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: function() { return /* binding */ getTrackingPrefs; }
/* harmony export */ });
/* unused harmony exports TRACKING_PREFS_COOKIE_V1, TRACKING_PREFS_COOKIE_V2, parseTrackingPrefs */
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3421);
/* harmony import */ var _is_country_in_gdpr_zone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6326);
/* harmony import */ var _is_region_in_ccpa_zone__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2286);



const TRACKING_PREFS_COOKIE_V1 = 'sensitive_pixel_option';
const TRACKING_PREFS_COOKIE_V2 = 'sensitive_pixel_options';
const prefsDisallowAll = {
  ok: false,
  buckets: {
    essential: true,
    // essential bucket is always allowed
    analytics: false,
    advertising: false
  }
};
const prefsAllowAnalyticsGdpr = {
  ok: false,
  // false is important so the cookie banner is shown
  buckets: {
    essential: true,
    analytics: true,
    // in GDPR zone, analytics is opt-out
    advertising: false // in GDPR zone, advertising is opt-in
  }
};
const prefsAllowAll = {
  ok: true,
  buckets: {
    essential: true,
    analytics: true,
    advertising: true
  }
};
const parseTrackingPrefs = function (cookieV2, cookieV1) {
  let defaultPrefs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : prefsDisallowAll;
  const {
    ok,
    buckets
  } = cookieV2 ? JSON.parse(cookieV2) : {};
  if (typeof ok === 'boolean') {
    return {
      ok,
      buckets: {
        ...defaultPrefs.buckets,
        ...buckets
      }
    };
  } else if (cookieV1 && ['yes', 'no'].includes(cookieV1)) {
    return {
      ok: cookieV1 === 'yes',
      buckets: prefsAllowAll.buckets
    };
  }
  return defaultPrefs;
};

/**
 * Returns consents for every Cookie Jar bucket based on privacy driven approach
 *
 * WARNING: this function is meant to work on the client side. If not called
 *          from the client side then it defaults to allow all
 * @returns Whether we may track the current user
 */
function getTrackingPrefs() {
  if (typeof document === 'undefined') {
    //throw new Error( 'getTrackingPrefs() can only be called on the client side' );
    return prefsAllowAll;
  }
  const cookies = cookie__WEBPACK_IMPORTED_MODULE_0__.parse(document.cookie);
  const isCountryGdpr = (0,_is_country_in_gdpr_zone__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(cookies.country_code);
  const isCountryCcpa = (0,_is_region_in_ccpa_zone__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(cookies.country_code, cookies.region);
  if (!isCountryGdpr && !isCountryCcpa) {
    return prefsAllowAll;
  }

  // default tracking mechanism for GDPR is opt-in for marketing and opt-out for anaytics, for CCPA is opt-out:
  const defaultPrefs = isCountryGdpr ? prefsAllowAnalyticsGdpr : prefsAllowAll;
  const {
    ok,
    buckets
  } = parseTrackingPrefs(cookies[TRACKING_PREFS_COOKIE_V2], cookies[TRACKING_PREFS_COOKIE_V1], defaultPrefs);
  if (isCountryCcpa) {
    // For CCPA, only the advertising bucket is relevant, the rest are always true
    return {
      ok,
      buckets: {
        ...prefsAllowAll.buckets,
        advertising: buckets.advertising
      }
    };
  }

  // For CCPA, only the advertising bucket is relevant, the rest are always true
  return {
    ok,
    buckets
  };
}

/***/ }),

/***/ 4:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var hash_js_lib_hash_sha_256__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8032);
/* harmony import */ var hash_js_lib_hash_sha_256__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hash_js_lib_hash_sha_256__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Hashes users' Personally Identifiable Information using SHA256
 *
 * @param data Data to be hashed
 * @returns SHA256 in hex string format
 */
function hashPii(data) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sha256().update(data.toString()).digest('hex');
}

/***/ }),

/***/ 6326:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ isCountryInGdprZone; }
/* harmony export */ });
const GDPR_COUNTRIES = [
// European Member countries
'AT',
// Austria
'BE',
// Belgium
'BG',
// Bulgaria
'CY',
// Cyprus
'CZ',
// Czech Republic
'DE',
// Germany
'DK',
// Denmark
'EE',
// Estonia
'ES',
// Spain
'FI',
// Finland
'FR',
// France
'GR',
// Greece
'HR',
// Croatia
'HU',
// Hungary
'IE',
// Ireland
'IT',
// Italy
'LT',
// Lithuania
'LU',
// Luxembourg
'LV',
// Latvia
'MT',
// Malta
'NL',
// Netherlands
'PL',
// Poland
'PT',
// Portugal
'RO',
// Romania
'SE',
// Sweden
'SI',
// Slovenia
'SK',
// Slovakia
'GB',
// United Kingdom
// Single Market Countries that GDPR applies to
'CH',
// Switzerland
'IS',
// Iceland
'LI',
// Liechtenstein
'NO' // Norway
];

/**
 * Returns a boolean telling whether a country is in the GDPR zone.
 * @param countryCode The country code to look for.
 * @returns Whether the country is in the GDPR zone
 */
function isCountryInGdprZone(countryCode) {
  if ('unknown' === countryCode) {
    // Fail safe: if we don't know the countryCode, assume it's in the Gdpr zone.
    return true;
  }
  return countryCode !== undefined && GDPR_COUNTRIES.includes(countryCode);
}

/***/ }),

/***/ 2286:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ isRegionInCcpaZone; }
/* harmony export */ });
const CCPA_US_REGIONS = ['california',
// CA
'colorado',
// CO
'connecticut',
// CT
'utah',
// UT
'virginia' // VA
];

/**
 * Returns a boolean telling whether a region is in the CCPA zone.
 * @param countryCode The country code to check (it needs to be 'US' for CCPA to apply)
 * @param region The region to look for.
 * @returns Whether the region is in the GDPR zone
 */
function isRegionInCcpaZone(countryCode, region) {
  if ('US' !== countryCode) {
    return false;
  }
  if ('unknown' === region) {
    // Fail safe: if we don't know the region, assume it's in the CCPA zone.
    return true;
  }
  return region !== undefined && CCPA_US_REGIONS.includes(region.toLowerCase());
}

/***/ }),

/***/ 825:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3421);
/* harmony import */ var _get_tracking_prefs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2552);


const COOKIE_MAX_AGE = (/* unused pure expression or super */ null && (60 * 60 * 24 * (365.25 / 2))); /* six months; 365.25 -> avg days in year */

const setTrackingPrefs = newPrefs => {
  const {
    ok,
    buckets
  } = getTrackingPrefs();
  const newOptions = {
    ok: typeof newPrefs.ok === 'boolean' ? newPrefs.ok : ok,
    buckets: {
      ...buckets,
      ...newPrefs.buckets
    }
  };
  document.cookie = cookie.serialize(TRACKING_PREFS_COOKIE_V2, JSON.stringify(newOptions), {
    path: '/',
    maxAge: COOKIE_MAX_AGE
  });
  return newOptions;
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (setTrackingPrefs)));

/***/ }),

/***/ 4703:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   xf: function() { return /* binding */ PLAN_PREMIUM; }
/* harmony export */ });
/* unused harmony exports STORE_KEY, FREE_PLAN_PRODUCT_ID, TIMELESS_PLAN_FREE, TIMELESS_PLAN_PERSONAL, TIMELESS_PLAN_PREMIUM, TIMELESS_PLAN_BUSINESS, TIMELESS_PLAN_ECOMMERCE, plansSlugs, DEFAULT_PAID_PLAN, PLAN_FREE, PLAN_PERSONAL, PLAN_BUSINESS, PLAN_ECOMMERCE, PLAN_PERSONAL_MONTHLY, PLAN_PREMIUM_MONTHLY, PLAN_BUSINESS_MONTHLY, PLAN_ECOMMERCE_MONTHLY, PLAN_ECOMMERCE_TRIAL_MONTHLY, PLAN_MIGRATION_TRIAL_MONTHLY, annualSlugs, monthlySlugs, plansProductSlugs, FEATURE_IDS_THAT_REQUIRE_ANNUALLY_BILLED_PLAN, PLAN_MONTHLY_PERIOD, PLAN_ANNUAL_PERIOD, PLAN_BIENNIAL_PERIOD, PLAN_TRIENNIAL_PERIOD, PERIOD_LIST */
const STORE_KEY = 'automattic/onboard/plans';
const FREE_PLAN_PRODUCT_ID = 1;

// plans constants
const TIMELESS_PLAN_FREE = 'free';
const TIMELESS_PLAN_PERSONAL = 'personal';
const TIMELESS_PLAN_PREMIUM = 'premium';
const TIMELESS_PLAN_BUSINESS = 'business';
const TIMELESS_PLAN_ECOMMERCE = 'ecommerce';
const plansSlugs = [TIMELESS_PLAN_FREE, TIMELESS_PLAN_PERSONAL, TIMELESS_PLAN_PREMIUM, TIMELESS_PLAN_BUSINESS, TIMELESS_PLAN_ECOMMERCE];
const DEFAULT_PAID_PLAN = (/* unused pure expression or super */ null && (TIMELESS_PLAN_PREMIUM));

// plan products constants
const PLAN_FREE = 'free_plan';
const PLAN_PERSONAL = 'personal-bundle';
const PLAN_PREMIUM = 'value_bundle';
const PLAN_BUSINESS = 'business-bundle';
const PLAN_ECOMMERCE = 'ecommerce-bundle';
const PLAN_PERSONAL_MONTHLY = 'personal-bundle-monthly';
const PLAN_PREMIUM_MONTHLY = 'value_bundle_monthly';
const PLAN_BUSINESS_MONTHLY = 'business-bundle-monthly';
const PLAN_ECOMMERCE_MONTHLY = 'ecommerce-bundle-monthly';
const PLAN_ECOMMERCE_TRIAL_MONTHLY = 'ecommerce-trial-bundle-monthly';
const PLAN_MIGRATION_TRIAL_MONTHLY = 'wp_bundle_migration_trial_monthly';
const annualSlugs = [PLAN_PERSONAL, PLAN_PREMIUM, PLAN_BUSINESS, PLAN_ECOMMERCE];
const monthlySlugs = [PLAN_PERSONAL_MONTHLY, PLAN_PREMIUM_MONTHLY, PLAN_BUSINESS_MONTHLY, PLAN_ECOMMERCE_MONTHLY, PLAN_ECOMMERCE_TRIAL_MONTHLY, PLAN_MIGRATION_TRIAL_MONTHLY];
const plansProductSlugs = [PLAN_FREE, ...annualSlugs, ...monthlySlugs];
const FEATURE_IDS_THAT_REQUIRE_ANNUALLY_BILLED_PLAN = (/* unused pure expression or super */ null && (['custom-domain', 'support-live', 'priority-support']));
const PLAN_MONTHLY_PERIOD = 31;
const PLAN_ANNUAL_PERIOD = 365;
const PLAN_BIENNIAL_PERIOD = 730;
const PLAN_TRIENNIAL_PERIOD = 1095;
const PERIOD_LIST = [PLAN_MONTHLY_PERIOD, PLAN_ANNUAL_PERIOD, PLAN_BIENNIAL_PERIOD, PLAN_TRIENNIAL_PERIOD];

/***/ }),

/***/ 2897:
/***/ (function(__unused_webpack_module, __webpack_exports__) {

"use strict";
/**
 * Unpacks an intro offer from an API plan to the respective `PlanIntroductoryOffer` structure for the store.
 */
const unpackIntroOffer = plan => {
  // these aren't grouped or separated. so no introductory offer if no cost or interval
  if (!plan.introductory_offer_interval_unit && !plan.introductory_offer_interval_count) {
    return null;
  }

  /**
   * An offer is complete if:
   *   1. an expiry date is set on the plan that exceeds the offer end date, OR
   *   2. the current Date exceeds the offer end date
   */
  const isOfferComplete = 'expiry' in plan ? Boolean(plan.expiry && plan.introductory_offer_end_date && new Date(plan.expiry) > new Date(plan.introductory_offer_end_date)) : Boolean(plan.introductory_offer_end_date && new Date() > new Date(plan.introductory_offer_end_date));
  return {
    formattedPrice: plan.introductory_offer_formatted_price,
    rawPrice: plan.introductory_offer_raw_price,
    intervalUnit: plan.introductory_offer_interval_unit,
    intervalCount: plan.introductory_offer_interval_count,
    isOfferComplete
  };
};
/* harmony default export */ __webpack_exports__.Z = (unpackIntroOffer);

/***/ }),

/***/ 4025:
/***/ (function(__unused_webpack_module, __webpack_exports__) {

"use strict";
const useQueryKeysFactory = () => ({
  sitePlans: siteId => ['site-plans', siteId],
  plans: () => ['plans']
});
/* harmony default export */ __webpack_exports__.Z = (useQueryKeysFactory);

/***/ }),

/***/ 7987:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8943);
/* harmony import */ var wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8552);
/* harmony import */ var _lib_unpack_intro_offer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2897);
/* harmony import */ var _lib_use_query_keys_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4025);




/**
 * Plans from `/plans` endpoint, transformed into a map of planSlug => PlanNext
 */
function usePlans() {
  const queryKeys = (0,_lib_use_query_keys_factory__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
  return (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_1__/* .useQuery */ .a)({
    queryKey: queryKeys.plans(),
    queryFn: async () => {
      const data = await (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .ZP)({
        path: `/plans`,
        apiVersion: '1.5'
      });
      return Object.fromEntries(data.map(plan => [plan.product_slug, {
        planSlug: plan.product_slug,
        productSlug: plan.product_slug,
        productId: plan.product_id,
        introOffer: (0,_lib_unpack_intro_offer__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(plan),
        productNameShort: plan.product_name_short,
        billPeriod: plan.bill_period,
        currencyCode: plan.currency_code
      }]));
    }
  });
}
/* harmony default export */ __webpack_exports__.Z = (usePlans);

/***/ }),

/***/ 3340:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Yt: function() { return /* binding */ handleRequestError; },
/* harmony export */   _W: function() { return /* binding */ handleRequestSuccess; },
/* harmony export */   hg: function() { return /* binding */ isLoading; },
/* harmony export */   lZ: function() { return /* binding */ addScriptCallback; }
/* harmony export */ });
/* unused harmony exports getCallbacksMap, removeScriptCallback, removeScriptCallbacks, removeAllScriptCallbacks, executeCallbacks */
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);

const debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('lib/load-script/callback-handler');

/**
 * Module variables
 */
const callbacksForURLsInProgress = new Map();
function getCallbacksMap() {
  return callbacksForURLsInProgress;
}
function isLoading(url) {
  return getCallbacksMap().has(url);
}
function addScriptCallback(url, callback) {
  const callbacksMap = getCallbacksMap();
  if (isLoading(url)) {
    debug(`Adding a callback for an existing script from "${url}"`);
    callbacksMap.get(url).add(callback);
  } else {
    debug(`Adding a callback for a new script from "${url}"`);
    callbacksMap.set(url, new Set([callback]));
  }
}
function removeScriptCallback(url, callback) {
  debug(`Removing a known callback for a script from "${url}"`);
  if (!isLoading(url)) {
    return;
  }
  const callbacksMap = getCallbacksMap();
  const callbacksAtUrl = callbacksMap.get(url);
  callbacksAtUrl.delete(callback);
  if (callbacksAtUrl.size === 0) {
    callbacksMap.delete(url);
  }
}
function removeScriptCallbacks(url) {
  debug(`Removing all callbacks for a script from "${url}"`);
  getCallbacksMap().delete(url);
}
function removeAllScriptCallbacks() {
  debug('Removing all callbacks for scripts from all URLs');
  getCallbacksMap().clear();
}
function executeCallbacks(url) {
  let error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  const callbacksMap = getCallbacksMap();
  const callbacksForUrl = callbacksMap.get(url);
  if (callbacksForUrl) {
    const debugMessage = `Executing callbacks for "${url}"` + (error === null ? ' with success' : ` with error "${error}"`);
    debug(debugMessage);
    callbacksForUrl.forEach(cb => {
      if (typeof cb === 'function') {
        cb(error);
      }
    });
    callbacksMap.delete(url);
  }
}
function handleRequestSuccess() {
  const url = this.getAttribute('src');
  debug(`Handling successful request for "${url}"`);
  executeCallbacks(url);
  this.onload = null;
}
function handleRequestError() {
  const url = this.getAttribute('src');
  debug(`Handling failed request for "${url}"`);
  executeCallbacks(url, new Error(`Failed to load script "${url}"`));
  this.onerror = null;
}

/***/ }),

/***/ 5606:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: function() { return /* binding */ createScriptElement; },
/* harmony export */   k: function() { return /* binding */ attachToHead; }
/* harmony export */ });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _callback_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3340);


const debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('lib/load-script/dom-operations');
function createScriptElement(url, args) {
  debug(`Creating script element for "${url}"`);
  const script = document.createElement('script');
  script.src = url;
  script.type = 'text/javascript';
  script.onload = _callback_handler__WEBPACK_IMPORTED_MODULE_1__/* .handleRequestSuccess */ ._W;
  script.onerror = _callback_handler__WEBPACK_IMPORTED_MODULE_1__/* .handleRequestError */ .Yt;
  script.async = true;
  if (args) {
    Object.entries(args).forEach(_ref => {
      let [key, value] = _ref;
      return script[key] = value;
    });
  }
  return script;
}
function attachToHead(element) {
  debug('Attaching element to head');
  document.head.appendChild(element);
}

/***/ }),

/***/ 4898:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ve: function() { return /* binding */ loadScript; }
/* harmony export */ });
/* unused harmony exports JQUERY_URL, loadjQueryDependentScript */
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _callback_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3340);
/* harmony import */ var _dom_operations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5606);
/**
 * A little module for loading a external script
 *
 */




const debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('package/load-script');

// NOTE: This exists for compatibility.


/**
 * Module variables
 */
const JQUERY_URL = 'https://s0.wp.com/wp-includes/js/jquery/jquery.js';

//
// loadScript and loadjQueryDependentScript
//

function loadScript(url, callback, args) {
  // If this script is not currently being loaded, create a script element and attach to document head.
  const shouldLoadScript = !(0,_callback_handler__WEBPACK_IMPORTED_MODULE_1__/* .isLoading */ .hg)(url);
  if (shouldLoadScript) {
    // the onload/onerror callbacks are guaranteed to be called asynchronously, so it's ok to first
    // add the element and only then attach callbacks, as long as it happens in one event loop tick.
    (0,_dom_operations__WEBPACK_IMPORTED_MODULE_2__/* .attachToHead */ .k)((0,_dom_operations__WEBPACK_IMPORTED_MODULE_2__/* .createScriptElement */ .C)(url, args));
  }

  // if callback is provided, behave traditionally
  if (typeof callback === 'function') {
    (0,_callback_handler__WEBPACK_IMPORTED_MODULE_1__/* .addScriptCallback */ .lZ)(url, callback);
    return;
  }

  // but if not, return a Promise
  return new Promise((resolve, reject) => {
    (0,_callback_handler__WEBPACK_IMPORTED_MODULE_1__/* .addScriptCallback */ .lZ)(url, error => {
      if (error === null) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}
function loadjQueryDependentScript(url, callback, args) {
  debug(`Loading a jQuery dependent script from "${url}"`);
  if (window.jQuery) {
    debug(`jQuery found on window, skipping jQuery script loading for "${url}"`);
    return loadScript(url, callback, args);
  }
  const loadPromise = loadScript(JQUERY_URL).then(() => loadScript(url, callback, args));

  // if callback is provided, call it on resolution
  if (typeof callback === 'function') {
    loadPromise.then(() => callback(null), error => callback(error));
    return;
  }

  // if not, return the Promise
  return loadPromise;
}

/***/ }),

/***/ 8552:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony exports requestAllBlogsAccess, reloadProxy, canAccessWpcomApis */
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8767);
/* harmony import */ var wp_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2884);
/* harmony import */ var wp_error__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(wp_error__WEBPACK_IMPORTED_MODULE_1__);




/**
 * debug instance
 */
const debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('wpcom-proxy-request');

/**
 * WordPress.com REST API base endpoint.
 */
const proxyOrigin = 'https://public-api.wordpress.com';
let onStreamRecord = null;

/**
 * Detecting support for the structured clone algorithm. IE8 and 9, and Firefox
 * 6.0 and below only support strings as postMessage's message. This browsers
 * will try to use the toString method.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
 * https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm
 * https://github.com/Modernizr/Modernizr/issues/388#issuecomment-31127462
 */
const postStrings = (() => {
  let r = false;
  try {
    window.postMessage({
      toString: function () {
        r = true;
      }
    }, '*');
  } catch (e) {
    /* empty */
  }
  return r;
})();

/**
 * Test if the browser supports constructing a new `File` object. Not present on Edge and IE.
 */
const supportsFileConstructor = (() => {
  try {
    // eslint-disable-next-line no-new
    new window.File(['a'], 'test.jpg', {
      type: 'image/jpeg'
    });
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * Reference to the <iframe> DOM element.
 * Gets set in the install() function.
 */
let iframe = null;

/**
 * Set to `true` upon the iframe's "load" event.
 */
let loaded = false;

/**
 * Array of buffered API requests. Added to when API requests are done before the
 * proxy <iframe> is "loaded", and fulfilled once the "load" DOM event on the
 * iframe occurs.
 */
let buffered;

/**
 * In-flight API request XMLHttpRequest dummy "proxy" instances.
 */
const requests = {};

/**
 * Performs a "proxied REST API request". This happens by calling
 * `iframe.postMessage()` on the proxy iframe instance, which from there
 * takes care of WordPress.com user authentication (via the currently
 * logged-in user's cookies).
 * @param {Object} originalParams - request parameters
 * @param {Function} [fn] - callback response
 * @returns {window.XMLHttpRequest} XMLHttpRequest instance
 */
const makeRequest = (originalParams, fn) => {
  const params = Object.assign({}, originalParams);
  debug('request(%o)', params);

  // inject the <iframe> upon the first proxied API request
  if (!iframe) {
    install();
  }

  // generate a uuid for this API request
  const id = (0,uuid__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)();
  params.callback = id;
  params.supports_args = true; // supports receiving variable amount of arguments
  params.supports_error_obj = true; // better Error object info
  params.supports_progress = true; // supports receiving XHR "progress" events

  // force uppercase "method" since that's what the <iframe> is expecting
  params.method = String(params.method || 'GET').toUpperCase();
  debug('params object: %o', params);
  const xhr = new window.XMLHttpRequest();
  xhr.params = params;

  // store the `XMLHttpRequest` instance so that "onmessage" can access it again
  requests[id] = xhr;
  if ('function' === typeof fn) {
    // a callback function was provided
    let called = false;
    const xhrOnLoad = e => {
      if (called) {
        return;
      }
      called = true;
      const body = e.response ?? xhr.response;
      debug('body: ', body);
      debug('headers: ', e.headers);
      fn(null, body, e.headers);
    };
    const xhrOnError = e => {
      if (called) {
        return;
      }
      called = true;
      const error = e.error ?? e.err ?? e;
      debug('error: ', error);
      debug('headers: ', e.headers);
      fn(error, null, e.headers);
    };
    xhr.addEventListener('load', xhrOnLoad);
    xhr.addEventListener('abort', xhrOnError);
    xhr.addEventListener('error', xhrOnError);
  }
  if ('function' === typeof params.onStreamRecord) {
    // remove onStreamRecord param, which can’t be cloned
    onStreamRecord = params.onStreamRecord;
    delete params.onStreamRecord;

    // FIXME @azabani implement stream mode processing
    // Hint: port the algorithm from wpcom-xhr-request@1.2.0 to /public.api/rest-proxy/provider-
    // v2.0.js in rWP, then plumb stream records from onmessage below to onStreamRecord (or add
    // the XMLHttpRequest#response to ondownloadprogress there, then parse the chunks here).
  }
  if (loaded) {
    submitRequest(params);
  } else {
    debug('buffering API request since proxying <iframe> is not yet loaded');
    buffered.push(params);
  }
  return xhr;
};

/**
 * Performs a "proxied REST API request". This happens by calling
 * `iframe.postMessage()` on the proxy iframe instance, which from there
 * takes care of WordPress.com user authentication (via the currently
 * logged-in user's cookies).
 *
 * If no function is specified as second parameter, a promise is returned.
 * @param {Object} originalParams - request parameters
 * @param {Function} [fn] - callback response
 * @returns {window.XMLHttpRequest|Promise} XMLHttpRequest instance or Promise
 */
const request = (originalParams, fn) => {
  // if callback is provided, behave traditionally
  if ('function' === typeof fn) {
    // request method
    return makeRequest(originalParams, fn);
  }

  // but if not, return a Promise
  return new Promise((res, rej) => {
    makeRequest(originalParams, (err, response) => {
      err ? rej(err) : res(response);
    });
  });
};

/**
 * Set proxy to "access all users' blogs" mode.
 */
function requestAllBlogsAccess() {
  return request({
    metaAPI: {
      accessAllUsersBlogs: true
    }
  });
}

/**
 * Calls the `postMessage()` function on the <iframe>.
 * @param {Object} params
 */

function submitRequest(params) {
  // Sometimes the `iframe.contentWindow` is `null` even though the `iframe` has been correctly
  // loaded. Can happen when some other buggy script removes it from the document.
  if (!iframe.contentWindow) {
    debug('proxy iframe is not present in the document');
    // Look up the issuing XHR request and make it fail
    const id = params.callback;
    const xhr = requests[id];
    delete requests[id];
    reject(xhr, wp_error__WEBPACK_IMPORTED_MODULE_1___default()({
      status_code: 500,
      error_description: 'proxy iframe element is not loaded'
    }), {});
    return;
  }
  debug('sending API request to proxy <iframe> %o', params);

  // `formData` needs to be patched if it contains `File` objects to work around
  // a Chrome bug. See `patchFileObjects` description for more details.
  if (params.formData) {
    patchFileObjects(params.formData);
  }
  iframe.contentWindow.postMessage(postStrings ? JSON.stringify(params) : params, proxyOrigin);
}

/**
 * Returns `true` if `v` is a DOM File instance, `false` otherwise.
 * @param {any} v - instance to analyze
 * @returns {boolean} `true` if `v` is a DOM File instance
 */
function isFile(v) {
  return v && Object.prototype.toString.call(v) === '[object File]';
}

/*
 * Find a `File` object in a form data value. It can be either the value itself, or
 * in a `fileContents` property of the value.
 */
function getFileValue(v) {
  if (isFile(v)) {
    return v;
  }
  if (typeof v === 'object' && isFile(v.fileContents)) {
    return v.fileContents;
  }
  return null;
}

/**
 * Finds all `File` instances in `formData` and creates a new `File` instance whose storage is
 * forced to be a `Blob` instead of being backed by a file on disk. That works around a bug in
 * Chrome where `File` instances with `has_backing_file` flag cannot be sent over a process
 * boundary when site isolation is on.
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=866805
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=631877
 * @param {Array} formData Form data to patch
 */
function patchFileObjects(formData) {
  // There are several landmines to avoid when making file uploads work on all browsers:
  // - the `new File()` constructor trick breaks file uploads on Safari 10 in a way that's
  //   impossible to detect: it will send empty files in the multipart/form-data body.
  //   Therefore we need to detect Chrome.
  // - IE11 and Edge don't support the `new File()` constructor at all. It will throw exception,
  //   so it's detectable by the `supportsFileConstructor` code.
  // - `window.chrome` exists also on Edge (!), `window.chrome.webstore` is only in Chrome and
  //   not in other Chromium based browsers (which have the site isolation bug, too).
  if (!window.chrome || !supportsFileConstructor) {
    return;
  }
  for (let i = 0; i < formData.length; i++) {
    const val = getFileValue(formData[i][1]);
    if (val) {
      formData[i][1] = new window.File([val], val.name, {
        type: val.type
      });
    }
  }
}

/**
 * Injects the proxy <iframe> instance in the <body> of the current
 * HTML page.
 */

function install() {
  debug('install()');
  if (iframe) {
    uninstall();
  }
  buffered = [];

  // listen to messages sent to `window`
  window.addEventListener('message', onmessage);

  // create the <iframe>
  iframe = document.createElement('iframe');
  const origin = window.location.origin;
  debug('using "origin": %o', origin);

  // set `src` and hide the iframe
  iframe.src = proxyOrigin + '/wp-admin/rest-proxy/?v=2.0#' + origin;
  iframe.style.display = 'none';

  // inject the <iframe> into the <body>
  document.body.appendChild(iframe);
}

/**
 * Reloads the proxy iframe.
 */
const reloadProxy = () => {
  install();
};

/**
 * Removes the <iframe> proxy instance from the <body> of the page.
 */
function uninstall() {
  debug('uninstall()');
  window.removeEventListener('message', onmessage);
  document.body.removeChild(iframe);
  loaded = false;
  iframe = null;
}

/**
 * The proxy <iframe> instance's "load" event callback function.
 */

function onload() {
  debug('proxy <iframe> "load" event');
  loaded = true;

  // flush any buffered API calls
  if (buffered) {
    for (let i = 0; i < buffered.length; i++) {
      submitRequest(buffered[i]);
    }
    buffered = null;
  }
}

/**
 * The main `window` object's "message" event callback function.
 * @param {window.Event} e
 */

function onmessage(e) {
  // If the iframe was never loaded, this message might be unrelated.
  if (!iframe?.contentWindow) {
    return;
  }
  debug('onmessage');

  // Filter out messages from different origins
  if (e.origin !== proxyOrigin) {
    debug('ignoring message... %o !== %o', e.origin, proxyOrigin);
    return;
  }

  // Filter out messages from different iframes
  if (e.source !== iframe.contentWindow) {
    debug('ignoring message... iframe elements do not match');
    return;
  }
  let {
    data
  } = e;
  if (!data) {
    return debug('no `data`, bailing');
  }

  // Once the iframe is loaded, we can start using it.
  if (data === 'ready') {
    onload();
    return;
  }
  if (postStrings && 'string' === typeof data) {
    data = JSON.parse(data);
  }

  // check if we're receiving a "progress" event
  if (data.upload || data.download) {
    return onprogress(data);
  }
  if (!data.length) {
    return debug("`e.data` doesn't appear to be an Array, bailing...");
  }

  // first get the `xhr` instance that we're interested in
  const id = data[data.length - 1];
  if (!(id in requests)) {
    return debug('bailing, no matching request with callback: %o', id);
  }
  const xhr = requests[id];

  // Build `error` and `body` object from the `data` object
  const {
    params
  } = xhr;
  const body = data[0];
  let statusCode = data[1];
  const headers = data[2];

  // We don't want to delete requests while we're processing stream messages
  if (statusCode === 207) {
    // 207 is a signal from rest-proxy. It means, "this isn't the final
    // response to the query." The proxy supports WebSocket connections
    // by invoking the original success callback for each message received.
  } else {
    // this is the final response to this query
    delete requests[id];
  }
  if (!params.metaAPI) {
    debug('got %o status code for URL: %o', statusCode, params.path);
  } else {
    statusCode = body === 'metaAPIupdated' ? 200 : 500;
  }
  if (typeof headers === 'object') {
    // add statusCode into headers object
    headers.status = statusCode;
    if (shouldProcessInStreamMode(headers['Content-Type'])) {
      if (statusCode === 207) {
        onStreamRecord(body);
        return;
      }
    }
  }
  if (statusCode && 2 === Math.floor(statusCode / 100)) {
    // 2xx status code, success
    resolve(xhr, body, headers);
  } else {
    // any other status code is a failure
    const wpe = wp_error__WEBPACK_IMPORTED_MODULE_1___default()(params, statusCode, body);
    reject(xhr, wpe, headers);
  }
}

/**
 * Returns true iff stream mode processing is required (see wpcom-xhr-request@1.2.0).
 * @param {string} contentType response Content-Type header value
 */
function shouldProcessInStreamMode(contentType) {
  return /^application[/]x-ndjson($|;)/.test(contentType);
}

/**
 * Handles a "progress" event being proxied back from the iframe page.
 * @param {Object} data
 */

function onprogress(data) {
  debug('got "progress" event: %o', data);
  const xhr = requests[data.callbackId];
  if (xhr) {
    const prog = new window.ProgressEvent('progress', data);
    const target = data.upload ? xhr.upload : xhr;
    target.dispatchEvent(prog);
  }
}

/**
 * Emits the "load" event on the `xhr`.
 * @param {window.XMLHttpRequest} xhr
 * @param {Object} body
 */

function resolve(xhr, body, headers) {
  const e = new window.ProgressEvent('load');
  e.data = e.body = e.response = body;
  e.headers = headers;
  xhr.dispatchEvent(e);
}

/**
 * Emits the "error" event on the `xhr`.
 * @param {window.XMLHttpRequest} xhr
 * @param {Error} err
 */

function reject(xhr, err, headers) {
  const e = new window.ProgressEvent('error');
  e.error = e.err = err;
  e.headers = headers;
  xhr.dispatchEvent(e);
}

// list of valid origins for wpcom requests.
// taken from wpcom-proxy-request (rest-proxy/provider-v2.0.js)
const wpcomAllowedOrigins = (/* unused pure expression or super */ null && (['https://wordpress.com', 'https://cloud.jetpack.com', 'http://wpcalypso.wordpress.com',
// for running docker on dev instances
'http://widgets.wp.com', 'https://widgets.wp.com', 'https://dev-mc.a8c.com', 'https://mc.a8c.com', 'https://dserve.a8c.com', 'http://calypso.localhost:3000', 'https://calypso.localhost:3000', 'http://jetpack.cloud.localhost:3000', 'https://jetpack.cloud.localhost:3000', 'http://calypso.localhost:3001', 'https://calypso.localhost:3001', 'https://calypso.live', 'http://127.0.0.1:41050', 'http://send.linguine.localhost:3000']));

/**
 * Shelved from rest-proxy/provider-v2.0.js.
 * This returns true for all WPCOM origins except Atomic sites.
 * @param urlOrigin
 * @returns
 */
function isAllowedOrigin(urlOrigin) {
  // sites in the allow-list and some subdomains of "calypso.live" and "wordpress.com"
  // are allowed without further check
  return wpcomAllowedOrigins.includes(urlOrigin) || /^https:\/\/[a-z0-9-]+\.calypso\.live$/.test(urlOrigin) || /^https:\/\/([a-z0-9-]+\.)+wordpress\.com$/.test(urlOrigin);
}
function canAccessWpcomApis() {
  return isAllowedOrigin(window.location.origin);
}

/**
 * Export `request` function.
 */
/* harmony default export */ __webpack_exports__.ZP = (request);


/***/ }),

/***/ 8049:
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
  let warned = false;
  return () => {
    if (!warned) {
      warned = true;
      console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
  };
})();

/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
  if (!this.useColors) {
    return;
  }
  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }
    index++;
    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
  let r;
  try {
    r = exports.storage.getItem('debug');
  } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
  }

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }
  return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
module.exports = __webpack_require__(2632)(exports);
const {
  formatters
} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};

/***/ }),

/***/ 2632:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = __webpack_require__(5881);
  createDebug.destroy = destroy;
  Object.keys(env).forEach(key => {
    createDebug[key] = env[key];
  });

  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];

  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */
  createDebug.formatters = {};

  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */
  function selectColor(namespace) {
    let hash = 0;
    for (let i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }
  createDebug.selectColor = selectColor;

  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */
  function createDebug(namespace) {
    let prevTime;
    let enableOverride = null;
    let namespacesCache;
    let enabledCache;
    function debug() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // Disabled?
      if (!debug.enabled) {
        return;
      }
      const self = debug;

      // Set `diff` timestamp
      const curr = Number(new Date());
      const ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);
      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      }

      // Apply any `formatters` transformations
      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return '%';
        }
        index++;
        const formatter = createDebug.formatters[format];
        if (typeof formatter === 'function') {
          const val = args[index];
          match = formatter.call(self, val);

          // Now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });

      // Apply env-specific formatting (colors, etc.)
      createDebug.formatArgs.call(self, args);
      const logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }
    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    Object.defineProperty(debug, 'enabled', {
      enumerable: true,
      configurable: false,
      get: () => {
        if (enableOverride !== null) {
          return enableOverride;
        }
        if (namespacesCache !== createDebug.namespaces) {
          namespacesCache = createDebug.namespaces;
          enabledCache = createDebug.enabled(namespace);
        }
        return enabledCache;
      },
      set: v => {
        enableOverride = v;
      }
    });

    // Env-specific initialization logic for debug instances
    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }
    return debug;
  }
  function extend(namespace, delimiter) {
    const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }

  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */
  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.namespaces = namespaces;
    createDebug.names = [];
    createDebug.skips = [];
    let i;
    const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    const len = split.length;
    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }

  /**
  * Disable debug output.
  *
  * @return {String} namespaces
  * @api public
  */
  function disable() {
    const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)].join(',');
    createDebug.enable('');
    return namespaces;
  }

  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */
  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }
    let i;
    let len;
    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }

  /**
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */
  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }

  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */
  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }
    return val;
  }

  /**
  * XXX DO NOT USE. This is a temporary stub function.
  * XXX It WILL be removed in the next major release.
  */
  function destroy() {
    console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
  }
  createDebug.enable(createDebug.load());
  return createDebug;
}
module.exports = setup;

/***/ }),

/***/ 3830:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var camelCase = __webpack_require__(956);

module.exports = function () {
	var cased = camelCase.apply(camelCase, arguments);
	return cased.charAt(0).toUpperCase() + cased.slice(1);
};


/***/ }),

/***/ 956:
/***/ (function(module) {

"use strict";

module.exports = function () {
	var str = [].map.call(arguments, function (str) {
		return str.trim();
	}).filter(function (str) {
		return str.length;
	}).join('-');

	if (!str.length) {
		return '';
	}

	if (str.length === 1 || !(/[_.\- ]+/).test(str) ) {
		if (str[0] === str[0].toLowerCase() && str.slice(1) !== str.slice(1).toLowerCase()) {
			return str;
		}

		return str.toLowerCase();
	}

	return str
	.replace(/^[_.\- ]+/, '')
	.toLowerCase()
	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
		return p1.toUpperCase();
	});
};


/***/ }),

/***/ 452:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var e=__webpack_require__(9196);function h(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var k="function"===typeof Object.is?Object.is:h,l=e.useState,m=e.useEffect,n=e.useLayoutEffect,p=e.useDebugValue;function q(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];n(function(){c.value=d;c.getSnapshot=b;r(c)&&g({inst:c})},[a,d,b]);m(function(){r(c)&&g({inst:c});return a(function(){r(c)&&g({inst:c})})},[a]);p(d);return d}
function r(a){var b=a.getSnapshot;a=a.value;try{var d=b();return!k(a,d)}catch(f){return!0}}function t(a,b){return b()}var u="undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement?t:q;exports.useSyncExternalStore=void 0!==e.useSyncExternalStore?e.useSyncExternalStore:u;


/***/ }),

/***/ 3100:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(452);
} else {}


/***/ }),

/***/ 2686:
/***/ (function(__unused_webpack_module, __webpack_exports__) {

"use strict";
/* harmony default export */ __webpack_exports__.Z = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ 5302:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ rng; }
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ 708:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6525);

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ __webpack_exports__.Z = (stringify);

/***/ }),

/***/ 8767:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5302);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(708);



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(rnds);
}

/* harmony default export */ __webpack_exports__.Z = (v4);

/***/ }),

/***/ 6525:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2686);


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.test(uuid);
}

/* harmony default export */ __webpack_exports__.Z = (validate);

/***/ }),

/***/ 2884:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uppercamelcase = __webpack_require__(3830);
var statusCodes = __webpack_require__(6744);

module.exports = WPError;

function WPError () {
  var self = new Error();

  for (var i = 0; i < arguments.length; i++) {
    process(self, arguments[i]);
  }

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(self, WPError);
  }

  return self;
}

function process ( self, data ) {
  if ( ! data ) { 
    return;
  }
  
  if (typeof data === 'number') {
    setStatusCode( self, data );

  } else {
    // assume it's a plain 'ol Object with some props to copy over
    if ( data.status_code ) {
      setStatusCode( self, data.status_code );
    }

    if ( data.error ) {
      self.name = toName( data.error );
    }

    if ( data.error_description ) {
      self.message = data.error_description;
    }

    var errors = data.errors;
    if ( errors ) {
      var first = errors.length ? errors[0] : errors;
      process( self, first );
    }

    for ( var i in data ) {
      self[i] = data[i];
    }

    if ( self.status && ( data.method || data.path ) ) {
      setStatusCodeMessage( self );
    }
  }
}

function setStatusCode ( self, code ) {
  self.name = toName( statusCodes[ code ] );
  self.status = self.statusCode = code;
  setStatusCodeMessage( self );
}

function setStatusCodeMessage ( self ) {
  var code = self.status;
  var method = self.method;
  var path = self.path;

  var m = code + ' status code';
  var extended = method || path;

  if ( extended ) m += ' for "';
  if ( method ) m += method;
  if ( extended ) m += ' ';
  if ( path ) m += path;
  if ( extended ) m += '"';

  self.message = m;
}

function toName ( str ) {
  return uppercamelcase( String(str).replace(/error$/i, ''), 'error' );
}


/***/ }),

/***/ 9731:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "images/image-f40c6b2b12b942b650ea.svg";

/***/ }),

/***/ 9196:
/***/ (function(module) {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ 5609:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ 9818:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ 7701:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["domReady"];

/***/ }),

/***/ 9307:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ 5736:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ 8817:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["plugins"];

/***/ }),

/***/ 6483:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["url"];

/***/ }),

/***/ 5289:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: function() { return /* binding */ focusManager; }
/* harmony export */ });
/* unused harmony export FocusManager */
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2436);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6370);



class FocusManager extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor() {
    super();

    this.setup = onFocus => {
      // addEventListener does not exist in React Native, but window does
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk && window.addEventListener) {
        const listener = () => onFocus(); // Listen to visibillitychange and focus


        window.addEventListener('visibilitychange', listener, false);
        window.addEventListener('focus', listener, false);
        return () => {
          // Be sure to unsubscribe if a new handler is set
          window.removeEventListener('visibilitychange', listener);
          window.removeEventListener('focus', listener);
        };
      }

      return;
    };
  }

  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }

  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;

      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = undefined;
    }
  }

  setEventListener(setup) {
    var _this$cleanup2;

    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup(focused => {
      if (typeof focused === 'boolean') {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }

  setFocused(focused) {
    const changed = this.focused !== focused;

    if (changed) {
      this.focused = focused;
      this.onFocus();
    }
  }

  onFocus() {
    this.listeners.forEach(({
      listener
    }) => {
      listener();
    });
  }

  isFocused() {
    if (typeof this.focused === 'boolean') {
      return this.focused;
    } // document global can be unavailable in react native


    if (typeof document === 'undefined') {
      return true;
    }

    return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
  }

}
const focusManager = new FocusManager();


//# sourceMappingURL=focusManager.mjs.map


/***/ }),

/***/ 4388:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gm: function() { return /* binding */ infiniteQueryBehavior; }
/* harmony export */ });
/* unused harmony exports getNextPageParam, getPreviousPageParam, hasNextPage, hasPreviousPage */
function infiniteQueryBehavior() {
  return {
    onFetch: context => {
      context.fetchFn = () => {
        var _context$fetchOptions, _context$fetchOptions2, _context$fetchOptions3, _context$fetchOptions4, _context$state$data, _context$state$data2;

        const refetchPage = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.refetchPage;
        const fetchMore = (_context$fetchOptions3 = context.fetchOptions) == null ? void 0 : (_context$fetchOptions4 = _context$fetchOptions3.meta) == null ? void 0 : _context$fetchOptions4.fetchMore;
        const pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
        const isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === 'forward';
        const isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === 'backward';
        const oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
        const oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
        let newPageParams = oldPageParams;
        let cancelled = false;

        const addSignalProperty = object => {
          Object.defineProperty(object, 'signal', {
            enumerable: true,
            get: () => {
              var _context$signal;

              if ((_context$signal = context.signal) != null && _context$signal.aborted) {
                cancelled = true;
              } else {
                var _context$signal2;

                (_context$signal2 = context.signal) == null ? void 0 : _context$signal2.addEventListener('abort', () => {
                  cancelled = true;
                });
              }

              return context.signal;
            }
          });
        }; // Get query function


        const queryFn = context.options.queryFn || (() => Promise.reject("Missing queryFn for queryKey '" + context.options.queryHash + "'"));

        const buildNewPages = (pages, param, page, previous) => {
          newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
          return previous ? [page, ...pages] : [...pages, page];
        }; // Create function to fetch a page


        const fetchPage = (pages, manual, param, previous) => {
          if (cancelled) {
            return Promise.reject('Cancelled');
          }

          if (typeof param === 'undefined' && !manual && pages.length) {
            return Promise.resolve(pages);
          }

          const queryFnContext = {
            queryKey: context.queryKey,
            pageParam: param,
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext);
          const queryFnResult = queryFn(queryFnContext);
          const promise = Promise.resolve(queryFnResult).then(page => buildNewPages(pages, param, page, previous));
          return promise;
        };

        let promise; // Fetch first page?

        if (!oldPages.length) {
          promise = fetchPage([]);
        } // Fetch next page?
        else if (isFetchingNextPage) {
          const manual = typeof pageParam !== 'undefined';
          const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param);
        } // Fetch previous page?
        else if (isFetchingPreviousPage) {
          const manual = typeof pageParam !== 'undefined';
          const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param, true);
        } // Refetch pages
        else {
          newPageParams = [];
          const manual = typeof context.options.getNextPageParam === 'undefined';
          const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true; // Fetch first page

          promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0])); // Fetch remaining pages

          for (let i = 1; i < oldPages.length; i++) {
            promise = promise.then(pages => {
              const shouldFetchNextPage = refetchPage && oldPages[i] ? refetchPage(oldPages[i], i, oldPages) : true;

              if (shouldFetchNextPage) {
                const param = manual ? oldPageParams[i] : getNextPageParam(context.options, pages);
                return fetchPage(pages, manual, param);
              }

              return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
            });
          }
        }

        const finalPromise = promise.then(pages => ({
          pages,
          pageParams: newPageParams
        }));
        return finalPromise;
      };
    }
  };
}
function getNextPageParam(options, pages) {
  return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
}
function getPreviousPageParam(options, pages) {
  return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
}
/**
 * Checks if there is a next page.
 * Returns `undefined` if it cannot be determined.
 */

function hasNextPage(options, pages) {
  if (options.getNextPageParam && Array.isArray(pages)) {
    const nextPageParam = getNextPageParam(options, pages);
    return typeof nextPageParam !== 'undefined' && nextPageParam !== null && nextPageParam !== false;
  }

  return;
}
/**
 * Checks if there is a previous page.
 * Returns `undefined` if it cannot be determined.
 */

function hasPreviousPage(options, pages) {
  if (options.getPreviousPageParam && Array.isArray(pages)) {
    const previousPageParam = getPreviousPageParam(options, pages);
    return typeof previousPageParam !== 'undefined' && previousPageParam !== null && previousPageParam !== false;
  }

  return;
}


//# sourceMappingURL=infiniteQueryBehavior.mjs.map


/***/ }),

/***/ 714:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: function() { return /* binding */ defaultLogger; }
/* harmony export */ });
const defaultLogger = console;


//# sourceMappingURL=logger.mjs.map


/***/ }),

/***/ 6278:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: function() { return /* binding */ Mutation; }
/* harmony export */ });
/* unused harmony export getDefaultState */
/* harmony import */ var _logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(714);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3709);
/* harmony import */ var _removable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3429);
/* harmony import */ var _retryer_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3241);





// CLASS
class Mutation extends _removable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Removable */ .F {
  constructor(config) {
    super();
    this.defaultOptions = config.defaultOptions;
    this.mutationId = config.mutationId;
    this.mutationCache = config.mutationCache;
    this.logger = config.logger || _logger_mjs__WEBPACK_IMPORTED_MODULE_1__/* .defaultLogger */ ._;
    this.observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }

  setOptions(options) {
    this.options = { ...this.defaultOptions,
      ...options
    };
    this.updateCacheTime(this.options.cacheTime);
  }

  get meta() {
    return this.options.meta;
  }

  setState(state) {
    this.dispatch({
      type: 'setState',
      state
    });
  }

  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer); // Stop the mutation from being garbage collected

      this.clearGcTimeout();
      this.mutationCache.notify({
        type: 'observerAdded',
        mutation: this,
        observer
      });
    }
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(x => x !== observer);
    this.scheduleGc();
    this.mutationCache.notify({
      type: 'observerRemoved',
      mutation: this,
      observer
    });
  }

  optionalRemove() {
    if (!this.observers.length) {
      if (this.state.status === 'loading') {
        this.scheduleGc();
      } else {
        this.mutationCache.remove(this);
      }
    }
  }

  continue() {
    var _this$retryer$continu, _this$retryer;

    return (_this$retryer$continu = (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.continue()) != null ? _this$retryer$continu : this.execute();
  }

  async execute() {
    const executeMutation = () => {
      var _this$options$retry;

      this.retryer = (0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_2__/* .createRetryer */ .Mz)({
        fn: () => {
          if (!this.options.mutationFn) {
            return Promise.reject('No mutationFn found');
          }

          return this.options.mutationFn(this.state.variables);
        },
        onFail: (failureCount, error) => {
          this.dispatch({
            type: 'failed',
            failureCount,
            error
          });
        },
        onPause: () => {
          this.dispatch({
            type: 'pause'
          });
        },
        onContinue: () => {
          this.dispatch({
            type: 'continue'
          });
        },
        retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
        retryDelay: this.options.retryDelay,
        networkMode: this.options.networkMode
      });
      return this.retryer.promise;
    };

    const restored = this.state.status === 'loading';

    try {
      var _this$mutationCache$c3, _this$mutationCache$c4, _this$options$onSucce, _this$options2, _this$mutationCache$c5, _this$mutationCache$c6, _this$options$onSettl, _this$options3;

      if (!restored) {
        var _this$mutationCache$c, _this$mutationCache$c2, _this$options$onMutat, _this$options;

        this.dispatch({
          type: 'loading',
          variables: this.options.variables
        }); // Notify cache callback

        await ((_this$mutationCache$c = (_this$mutationCache$c2 = this.mutationCache.config).onMutate) == null ? void 0 : _this$mutationCache$c.call(_this$mutationCache$c2, this.state.variables, this));
        const context = await ((_this$options$onMutat = (_this$options = this.options).onMutate) == null ? void 0 : _this$options$onMutat.call(_this$options, this.state.variables));

        if (context !== this.state.context) {
          this.dispatch({
            type: 'loading',
            context,
            variables: this.state.variables
          });
        }
      }

      const data = await executeMutation(); // Notify cache callback

      await ((_this$mutationCache$c3 = (_this$mutationCache$c4 = this.mutationCache.config).onSuccess) == null ? void 0 : _this$mutationCache$c3.call(_this$mutationCache$c4, data, this.state.variables, this.state.context, this));
      await ((_this$options$onSucce = (_this$options2 = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options2, data, this.state.variables, this.state.context)); // Notify cache callback

      await ((_this$mutationCache$c5 = (_this$mutationCache$c6 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c5.call(_this$mutationCache$c6, data, null, this.state.variables, this.state.context, this));
      await ((_this$options$onSettl = (_this$options3 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options3, data, null, this.state.variables, this.state.context));
      this.dispatch({
        type: 'success',
        data
      });
      return data;
    } catch (error) {
      try {
        var _this$mutationCache$c7, _this$mutationCache$c8, _this$options$onError, _this$options4, _this$mutationCache$c9, _this$mutationCache$c10, _this$options$onSettl2, _this$options5;

        // Notify cache callback
        await ((_this$mutationCache$c7 = (_this$mutationCache$c8 = this.mutationCache.config).onError) == null ? void 0 : _this$mutationCache$c7.call(_this$mutationCache$c8, error, this.state.variables, this.state.context, this));

        if (false) {}

        await ((_this$options$onError = (_this$options4 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options4, error, this.state.variables, this.state.context)); // Notify cache callback

        await ((_this$mutationCache$c9 = (_this$mutationCache$c10 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c9.call(_this$mutationCache$c10, undefined, error, this.state.variables, this.state.context, this));
        await ((_this$options$onSettl2 = (_this$options5 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options5, undefined, error, this.state.variables, this.state.context));
        throw error;
      } finally {
        this.dispatch({
          type: 'error',
          error: error
        });
      }
    }
  }

  dispatch(action) {
    const reducer = state => {
      switch (action.type) {
        case 'failed':
          return { ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };

        case 'pause':
          return { ...state,
            isPaused: true
          };

        case 'continue':
          return { ...state,
            isPaused: false
          };

        case 'loading':
          return { ...state,
            context: action.context,
            data: undefined,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: !(0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_2__/* .canFetch */ .Kw)(this.options.networkMode),
            status: 'loading',
            variables: action.variables
          };

        case 'success':
          return { ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: 'success',
            isPaused: false
          };

        case 'error':
          return { ...state,
            data: undefined,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: 'error'
          };

        case 'setState':
          return { ...state,
            ...action.state
          };
      }
    };

    this.state = reducer(this.state);
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.observers.forEach(observer => {
        observer.onMutationUpdate(action);
      });
      this.mutationCache.notify({
        mutation: this,
        type: 'updated',
        action
      });
    });
  }

}
function getDefaultState() {
  return {
    context: undefined,
    data: undefined,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: 'idle',
    variables: undefined
  };
}


//# sourceMappingURL=mutation.mjs.map


/***/ }),

/***/ 6072:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: function() { return /* binding */ MutationCache; }
/* harmony export */ });
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3709);
/* harmony import */ var _mutation_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6278);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6370);
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2436);





// CLASS
class MutationCache extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(config) {
    super();
    this.config = config || {};
    this.mutations = [];
    this.mutationId = 0;
  }

  build(client, options, state) {
    const mutation = new _mutation_mjs__WEBPACK_IMPORTED_MODULE_1__/* .Mutation */ .m({
      mutationCache: this,
      logger: client.getLogger(),
      mutationId: ++this.mutationId,
      options: client.defaultMutationOptions(options),
      state,
      defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : undefined
    });
    this.add(mutation);
    return mutation;
  }

  add(mutation) {
    this.mutations.push(mutation);
    this.notify({
      type: 'added',
      mutation
    });
  }

  remove(mutation) {
    this.mutations = this.mutations.filter(x => x !== mutation);
    this.notify({
      type: 'removed',
      mutation
    });
  }

  clear() {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batch(() => {
      this.mutations.forEach(mutation => {
        this.remove(mutation);
      });
    });
  }

  getAll() {
    return this.mutations;
  }

  find(filters) {
    if (typeof filters.exact === 'undefined') {
      filters.exact = true;
    }

    return this.mutations.find(mutation => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_3__/* .matchMutation */ .X7)(filters, mutation));
  }

  findAll(filters) {
    return this.mutations.filter(mutation => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_3__/* .matchMutation */ .X7)(filters, mutation));
  }

  notify(event) {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batch(() => {
      this.listeners.forEach(({
        listener
      }) => {
        listener(event);
      });
    });
  }

  resumePausedMutations() {
    var _this$resuming;

    this.resuming = ((_this$resuming = this.resuming) != null ? _this$resuming : Promise.resolve()).then(() => {
      const pausedMutations = this.mutations.filter(x => x.state.isPaused);
      return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_3__/* .noop */ .ZT)), Promise.resolve()));
    }).then(() => {
      this.resuming = undefined;
    });
    return this.resuming;
  }

}


//# sourceMappingURL=mutationCache.mjs.map


/***/ }),

/***/ 3709:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: function() { return /* binding */ notifyManager; }
/* harmony export */ });
/* unused harmony export createNotifyManager */
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6370);


function createNotifyManager() {
  let queue = [];
  let transactions = 0;

  let notifyFn = callback => {
    callback();
  };

  let batchNotifyFn = callback => {
    callback();
  };

  const batch = callback => {
    let result;
    transactions++;

    try {
      result = callback();
    } finally {
      transactions--;

      if (!transactions) {
        flush();
      }
    }

    return result;
  };

  const schedule = callback => {
    if (transactions) {
      queue.push(callback);
    } else {
      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .scheduleMicrotask */ .A4)(() => {
        notifyFn(callback);
      });
    }
  };
  /**
   * All calls to the wrapped function will be batched.
   */


  const batchCalls = callback => {
    return (...args) => {
      schedule(() => {
        callback(...args);
      });
    };
  };

  const flush = () => {
    const originalQueue = queue;
    queue = [];

    if (originalQueue.length) {
      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .scheduleMicrotask */ .A4)(() => {
        batchNotifyFn(() => {
          originalQueue.forEach(callback => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  /**
   * Use this method to set a custom notify function.
   * This can be used to for example wrap notifications with `React.act` while running tests.
   */


  const setNotifyFunction = fn => {
    notifyFn = fn;
  };
  /**
   * Use this method to set a custom function to batch notifications together into a single tick.
   * By default React Query will use the batch function provided by ReactDOM or React Native.
   */


  const setBatchNotifyFunction = fn => {
    batchNotifyFn = fn;
  };

  return {
    batch,
    batchCalls,
    schedule,
    setNotifyFunction,
    setBatchNotifyFunction
  };
} // SINGLETON

const notifyManager = createNotifyManager();


//# sourceMappingURL=notifyManager.mjs.map


/***/ }),

/***/ 3240:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: function() { return /* binding */ onlineManager; }
/* harmony export */ });
/* unused harmony export OnlineManager */
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2436);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6370);



const onlineEvents = ['online', 'offline'];
class OnlineManager extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor() {
    super();

    this.setup = onOnline => {
      // addEventListener does not exist in React Native, but window does
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk && window.addEventListener) {
        const listener = () => onOnline(); // Listen to online


        onlineEvents.forEach(event => {
          window.addEventListener(event, listener, false);
        });
        return () => {
          // Be sure to unsubscribe if a new handler is set
          onlineEvents.forEach(event => {
            window.removeEventListener(event, listener);
          });
        };
      }

      return;
    };
  }

  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }

  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;

      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = undefined;
    }
  }

  setEventListener(setup) {
    var _this$cleanup2;

    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup(online => {
      if (typeof online === 'boolean') {
        this.setOnline(online);
      } else {
        this.onOnline();
      }
    });
  }

  setOnline(online) {
    const changed = this.online !== online;

    if (changed) {
      this.online = online;
      this.onOnline();
    }
  }

  onOnline() {
    this.listeners.forEach(({
      listener
    }) => {
      listener();
    });
  }

  isOnline() {
    if (typeof this.online === 'boolean') {
      return this.online;
    }

    if (typeof navigator === 'undefined' || typeof navigator.onLine === 'undefined') {
      return true;
    }

    return navigator.onLine;
  }

}
const onlineManager = new OnlineManager();


//# sourceMappingURL=onlineManager.mjs.map


/***/ }),

/***/ 2356:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: function() { return /* binding */ Query; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6370);
/* harmony import */ var _logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(714);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3709);
/* harmony import */ var _retryer_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3241);
/* harmony import */ var _removable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3429);






// CLASS
class Query extends _removable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Removable */ .F {
  constructor(config) {
    super();
    this.abortSignalConsumed = false;
    this.defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.cache = config.cache;
    this.logger = config.logger || _logger_mjs__WEBPACK_IMPORTED_MODULE_1__/* .defaultLogger */ ._;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.initialState = config.state || getDefaultState(this.options);
    this.state = this.initialState;
    this.scheduleGc();
  }

  get meta() {
    return this.options.meta;
  }

  setOptions(options) {
    this.options = { ...this.defaultOptions,
      ...options
    };
    this.updateCacheTime(this.options.cacheTime);
  }

  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === 'idle') {
      this.cache.remove(this);
    }
  }

  setData(newData, options) {
    const data = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .replaceData */ .oE)(this.state.data, newData, this.options); // Set data and mark it as cached

    this.dispatch({
      data,
      type: 'success',
      dataUpdatedAt: options == null ? void 0 : options.updatedAt,
      manual: options == null ? void 0 : options.manual
    });
    return data;
  }

  setState(state, setStateOptions) {
    this.dispatch({
      type: 'setState',
      state,
      setStateOptions
    });
  }

  cancel(options) {
    var _this$retryer;

    const promise = this.promise;
    (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
    return promise ? promise.then(_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .noop */ .ZT).catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .noop */ .ZT) : Promise.resolve();
  }

  destroy() {
    super.destroy();
    this.cancel({
      silent: true
    });
  }

  reset() {
    this.destroy();
    this.setState(this.initialState);
  }

  isActive() {
    return this.observers.some(observer => observer.options.enabled !== false);
  }

  isDisabled() {
    return this.getObserversCount() > 0 && !this.isActive();
  }

  isStale() {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some(observer => observer.getCurrentResult().isStale);
  }

  isStaleByTime(staleTime = 0) {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || !(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .timeUntilStale */ .Kp)(this.state.dataUpdatedAt, staleTime);
  }

  onFocus() {
    var _this$retryer2;

    const observer = this.observers.find(x => x.shouldFetchOnWindowFocus());

    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    } // Continue fetch if currently paused


    (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2.continue();
  }

  onOnline() {
    var _this$retryer3;

    const observer = this.observers.find(x => x.shouldFetchOnReconnect());

    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    } // Continue fetch if currently paused


    (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3.continue();
  }

  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer); // Stop the query from being garbage collected

      this.clearGcTimeout();
      this.cache.notify({
        type: 'observerAdded',
        query: this,
        observer
      });
    }
  }

  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter(x => x !== observer);

      if (!this.observers.length) {
        // If the transport layer does not support cancellation
        // we'll let the query continue so the result can be cached
        if (this.retryer) {
          if (this.abortSignalConsumed) {
            this.retryer.cancel({
              revert: true
            });
          } else {
            this.retryer.cancelRetry();
          }
        }

        this.scheduleGc();
      }

      this.cache.notify({
        type: 'observerRemoved',
        query: this,
        observer
      });
    }
  }

  getObserversCount() {
    return this.observers.length;
  }

  invalidate() {
    if (!this.state.isInvalidated) {
      this.dispatch({
        type: 'invalidate'
      });
    }
  }

  fetch(options, fetchOptions) {
    var _this$options$behavio, _context$fetchOptions;

    if (this.state.fetchStatus !== 'idle') {
      if (this.state.dataUpdatedAt && fetchOptions != null && fetchOptions.cancelRefetch) {
        // Silently cancel current fetch if the user wants to cancel refetches
        this.cancel({
          silent: true
        });
      } else if (this.promise) {
        var _this$retryer4;

        // make sure that retries that were potentially cancelled due to unmounts can continue
        (_this$retryer4 = this.retryer) == null ? void 0 : _this$retryer4.continueRetry(); // Return current promise if we are already fetching

        return this.promise;
      }
    } // Update config if passed, otherwise the config from the last execution is used


    if (options) {
      this.setOptions(options);
    } // Use the options from the first observer with a query function if no function is found.
    // This can happen when the query is hydrated or created with setQueryData.


    if (!this.options.queryFn) {
      const observer = this.observers.find(x => x.options.queryFn);

      if (observer) {
        this.setOptions(observer.options);
      }
    }

    if (false) {}

    const abortController = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .getAbortController */ .G9)(); // Create query function context

    const queryFnContext = {
      queryKey: this.queryKey,
      pageParam: undefined,
      meta: this.meta
    }; // Adds an enumerable signal property to the object that
    // which sets abortSignalConsumed to true when the signal
    // is read.

    const addSignalProperty = object => {
      Object.defineProperty(object, 'signal', {
        enumerable: true,
        get: () => {
          if (abortController) {
            this.abortSignalConsumed = true;
            return abortController.signal;
          }

          return undefined;
        }
      });
    };

    addSignalProperty(queryFnContext); // Create fetch function

    const fetchFn = () => {
      if (!this.options.queryFn) {
        return Promise.reject("Missing queryFn for queryKey '" + this.options.queryHash + "'");
      }

      this.abortSignalConsumed = false;
      return this.options.queryFn(queryFnContext);
    }; // Trigger behavior hook


    const context = {
      fetchOptions,
      options: this.options,
      queryKey: this.queryKey,
      state: this.state,
      fetchFn
    };
    addSignalProperty(context);
    (_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch(context); // Store state in case the current fetch needs to be reverted

    this.revertState = this.state; // Set to fetching state if not already in it

    if (this.state.fetchStatus === 'idle' || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
      var _context$fetchOptions2;

      this.dispatch({
        type: 'fetch',
        meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
      });
    }

    const onError = error => {
      // Optimistically update state if needed
      if (!((0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .isCancelledError */ .DV)(error) && error.silent)) {
        this.dispatch({
          type: 'error',
          error: error
        });
      }

      if (!(0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .isCancelledError */ .DV)(error)) {
        var _this$cache$config$on, _this$cache$config, _this$cache$config$on2, _this$cache$config2;

        // Notify cache callback
        (_this$cache$config$on = (_this$cache$config = this.cache.config).onError) == null ? void 0 : _this$cache$config$on.call(_this$cache$config, error, this);
        (_this$cache$config$on2 = (_this$cache$config2 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on2.call(_this$cache$config2, this.state.data, error, this);

        if (false) {}
      }

      if (!this.isFetchingOptimistic) {
        // Schedule query gc after fetching
        this.scheduleGc();
      }

      this.isFetchingOptimistic = false;
    }; // Try to fetch the data


    this.retryer = (0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .createRetryer */ .Mz)({
      fn: context.fetchFn,
      abort: abortController == null ? void 0 : abortController.abort.bind(abortController),
      onSuccess: data => {
        var _this$cache$config$on3, _this$cache$config3, _this$cache$config$on4, _this$cache$config4;

        if (typeof data === 'undefined') {
          if (false) {}

          onError(new Error(this.queryHash + " data is undefined"));
          return;
        }

        this.setData(data); // Notify cache callback

        (_this$cache$config$on3 = (_this$cache$config3 = this.cache.config).onSuccess) == null ? void 0 : _this$cache$config$on3.call(_this$cache$config3, data, this);
        (_this$cache$config$on4 = (_this$cache$config4 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on4.call(_this$cache$config4, data, this.state.error, this);

        if (!this.isFetchingOptimistic) {
          // Schedule query gc after fetching
          this.scheduleGc();
        }

        this.isFetchingOptimistic = false;
      },
      onError,
      onFail: (failureCount, error) => {
        this.dispatch({
          type: 'failed',
          failureCount,
          error
        });
      },
      onPause: () => {
        this.dispatch({
          type: 'pause'
        });
      },
      onContinue: () => {
        this.dispatch({
          type: 'continue'
        });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode
    });
    this.promise = this.retryer.promise;
    return this.promise;
  }

  dispatch(action) {
    const reducer = state => {
      var _action$meta, _action$dataUpdatedAt;

      switch (action.type) {
        case 'failed':
          return { ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };

        case 'pause':
          return { ...state,
            fetchStatus: 'paused'
          };

        case 'continue':
          return { ...state,
            fetchStatus: 'fetching'
          };

        case 'fetch':
          return { ...state,
            fetchFailureCount: 0,
            fetchFailureReason: null,
            fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
            fetchStatus: (0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .canFetch */ .Kw)(this.options.networkMode) ? 'fetching' : 'paused',
            ...(!state.dataUpdatedAt && {
              error: null,
              status: 'loading'
            })
          };

        case 'success':
          return { ...state,
            data: action.data,
            dataUpdateCount: state.dataUpdateCount + 1,
            dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
            error: null,
            isInvalidated: false,
            status: 'success',
            ...(!action.manual && {
              fetchStatus: 'idle',
              fetchFailureCount: 0,
              fetchFailureReason: null
            })
          };

        case 'error':
          const error = action.error;

          if ((0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .isCancelledError */ .DV)(error) && error.revert && this.revertState) {
            return { ...this.revertState,
              fetchStatus: 'idle'
            };
          }

          return { ...state,
            error: error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: 'idle',
            status: 'error'
          };

        case 'invalidate':
          return { ...state,
            isInvalidated: true
          };

        case 'setState':
          return { ...state,
            ...action.state
          };
      }
    };

    this.state = reducer(this.state);
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager */ .V.batch(() => {
      this.observers.forEach(observer => {
        observer.onQueryUpdate(action);
      });
      this.cache.notify({
        query: this,
        type: 'updated',
        action
      });
    });
  }

}

function getDefaultState(options) {
  const data = typeof options.initialData === 'function' ? options.initialData() : options.initialData;
  const hasData = typeof data !== 'undefined';
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === 'function' ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt != null ? initialDataUpdatedAt : Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? 'success' : 'loading',
    fetchStatus: 'idle'
  };
}


//# sourceMappingURL=query.mjs.map


/***/ }),

/***/ 3568:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: function() { return /* binding */ QueryCache; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6370);
/* harmony import */ var _query_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2356);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3709);
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2436);





// CLASS
class QueryCache extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(config) {
    super();
    this.config = config || {};
    this.queries = [];
    this.queriesMap = {};
  }

  build(client, options, state) {
    var _options$queryHash;

    const queryKey = options.queryKey;
    const queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .hashQueryKeyByOptions */ .Rm)(queryKey, options);
    let query = this.get(queryHash);

    if (!query) {
      query = new _query_mjs__WEBPACK_IMPORTED_MODULE_2__/* .Query */ .A({
        cache: this,
        logger: client.getLogger(),
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }

    return query;
  }

  add(query) {
    if (!this.queriesMap[query.queryHash]) {
      this.queriesMap[query.queryHash] = query;
      this.queries.push(query);
      this.notify({
        type: 'added',
        query
      });
    }
  }

  remove(query) {
    const queryInMap = this.queriesMap[query.queryHash];

    if (queryInMap) {
      query.destroy();
      this.queries = this.queries.filter(x => x !== query);

      if (queryInMap === query) {
        delete this.queriesMap[query.queryHash];
      }

      this.notify({
        type: 'removed',
        query
      });
    }
  }

  clear() {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.queries.forEach(query => {
        this.remove(query);
      });
    });
  }

  get(queryHash) {
    return this.queriesMap[queryHash];
  }

  getAll() {
    return this.queries;
  }

  find(arg1, arg2) {
    const [filters] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .parseFilterArgs */ .I6)(arg1, arg2);

    if (typeof filters.exact === 'undefined') {
      filters.exact = true;
    }

    return this.queries.find(query => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .matchQuery */ ._x)(filters, query));
  }

  findAll(arg1, arg2) {
    const [filters] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .parseFilterArgs */ .I6)(arg1, arg2);
    return Object.keys(filters).length > 0 ? this.queries.filter(query => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .matchQuery */ ._x)(filters, query)) : this.queries;
  }

  notify(event) {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.listeners.forEach(({
        listener
      }) => {
        listener(event);
      });
    });
  }

  onFocus() {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.queries.forEach(query => {
        query.onFocus();
      });
    });
  }

  onOnline() {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.queries.forEach(query => {
        query.onOnline();
      });
    });
  }

}


//# sourceMappingURL=queryCache.mjs.map


/***/ }),

/***/ 7022:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: function() { return /* binding */ QueryClient; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6370);
/* harmony import */ var _queryCache_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3568);
/* harmony import */ var _mutationCache_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6072);
/* harmony import */ var _focusManager_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5289);
/* harmony import */ var _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3240);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3709);
/* harmony import */ var _infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4388);
/* harmony import */ var _logger_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(714);









// CLASS
class QueryClient {
  constructor(config = {}) {
    this.queryCache = config.queryCache || new _queryCache_mjs__WEBPACK_IMPORTED_MODULE_0__/* .QueryCache */ .t();
    this.mutationCache = config.mutationCache || new _mutationCache_mjs__WEBPACK_IMPORTED_MODULE_1__/* .MutationCache */ .L();
    this.logger = config.logger || _logger_mjs__WEBPACK_IMPORTED_MODULE_2__/* .defaultLogger */ ._;
    this.defaultOptions = config.defaultOptions || {};
    this.queryDefaults = [];
    this.mutationDefaults = [];
    this.mountCount = 0;

    if (false) {}
  }

  mount() {
    this.mountCount++;
    if (this.mountCount !== 1) return;
    this.unsubscribeFocus = _focusManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .focusManager */ .j.subscribe(() => {
      if (_focusManager_mjs__WEBPACK_IMPORTED_MODULE_3__/* .focusManager */ .j.isFocused()) {
        this.resumePausedMutations();
        this.queryCache.onFocus();
      }
    });
    this.unsubscribeOnline = _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_4__/* .onlineManager */ .N.subscribe(() => {
      if (_onlineManager_mjs__WEBPACK_IMPORTED_MODULE_4__/* .onlineManager */ .N.isOnline()) {
        this.resumePausedMutations();
        this.queryCache.onOnline();
      }
    });
  }

  unmount() {
    var _this$unsubscribeFocu, _this$unsubscribeOnli;

    this.mountCount--;
    if (this.mountCount !== 0) return;
    (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
    this.unsubscribeFocus = undefined;
    (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
    this.unsubscribeOnline = undefined;
  }

  isFetching(arg1, arg2) {
    const [filters] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2);
    filters.fetchStatus = 'fetching';
    return this.queryCache.findAll(filters).length;
  }

  isMutating(filters) {
    return this.mutationCache.findAll({ ...filters,
      fetching: true
    }).length;
  }

  getQueryData(queryKey, filters) {
    var _this$queryCache$find;

    return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
  }

  ensureQueryData(arg1, arg2, arg3) {
    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
    const cachedData = this.getQueryData(parsedOptions.queryKey);
    return cachedData ? Promise.resolve(cachedData) : this.fetchQuery(parsedOptions);
  }

  getQueriesData(queryKeyOrFilters) {
    return this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey,
      state
    }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }

  setQueryData(queryKey, updater, options) {
    const query = this.queryCache.find(queryKey);
    const prevData = query == null ? void 0 : query.state.data;
    const data = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .functionalUpdate */ .SE)(updater, prevData);

    if (typeof data === 'undefined') {
      return undefined;
    }

    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(queryKey);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions);
    return this.queryCache.build(this, defaultedOptions).setData(data, { ...options,
      manual: true
    });
  }

  setQueriesData(queryKeyOrFilters, updater, options) {
    return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager */ .V.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey
    }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
  }

  getQueryState(queryKey, filters) {
    var _this$queryCache$find2;

    return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
  }

  removeQueries(arg1, arg2) {
    const [filters] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2);
    const queryCache = this.queryCache;
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager */ .V.batch(() => {
      queryCache.findAll(filters).forEach(query => {
        queryCache.remove(query);
      });
    });
  }

  resetQueries(arg1, arg2, arg3) {
    const [filters, options] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);
    const queryCache = this.queryCache;
    const refetchFilters = {
      type: 'active',
      ...filters
    };
    return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager */ .V.batch(() => {
      queryCache.findAll(filters).forEach(query => {
        query.reset();
      });
      return this.refetchQueries(refetchFilters, options);
    });
  }

  cancelQueries(arg1, arg2, arg3) {
    const [filters, cancelOptions = {}] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);

    if (typeof cancelOptions.revert === 'undefined') {
      cancelOptions.revert = true;
    }

    const promises = _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager */ .V.batch(() => this.queryCache.findAll(filters).map(query => query.cancel(cancelOptions)));
    return Promise.all(promises).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT).catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
  }

  invalidateQueries(arg1, arg2, arg3) {
    const [filters, options] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);
    return _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager */ .V.batch(() => {
      var _ref, _filters$refetchType;

      this.queryCache.findAll(filters).forEach(query => {
        query.invalidate();
      });

      if (filters.refetchType === 'none') {
        return Promise.resolve();
      }

      const refetchFilters = { ...filters,
        type: (_ref = (_filters$refetchType = filters.refetchType) != null ? _filters$refetchType : filters.type) != null ? _ref : 'active'
      };
      return this.refetchQueries(refetchFilters, options);
    });
  }

  refetchQueries(arg1, arg2, arg3) {
    const [filters, options] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseFilterArgs */ .I6)(arg1, arg2, arg3);
    const promises = _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager */ .V.batch(() => this.queryCache.findAll(filters).filter(query => !query.isDisabled()).map(query => {
      var _options$cancelRefetc;

      return query.fetch(undefined, { ...options,
        cancelRefetch: (_options$cancelRefetc = options == null ? void 0 : options.cancelRefetch) != null ? _options$cancelRefetc : true,
        meta: {
          refetchPage: filters.refetchPage
        }
      });
    }));
    let promise = Promise.all(promises).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);

    if (!(options != null && options.throwOnError)) {
      promise = promise.catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
    }

    return promise;
  }

  fetchQuery(arg1, arg2, arg3) {
    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions); // https://github.com/tannerlinsley/react-query/issues/652

    if (typeof defaultedOptions.retry === 'undefined') {
      defaultedOptions.retry = false;
    }

    const query = this.queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }

  prefetchQuery(arg1, arg2, arg3) {
    return this.fetchQuery(arg1, arg2, arg3).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT).catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
  }

  fetchInfiniteQuery(arg1, arg2, arg3) {
    const parsedOptions = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
    parsedOptions.behavior = (0,_infiniteQueryBehavior_mjs__WEBPACK_IMPORTED_MODULE_7__/* .infiniteQueryBehavior */ .Gm)();
    return this.fetchQuery(parsedOptions);
  }

  prefetchInfiniteQuery(arg1, arg2, arg3) {
    return this.fetchInfiniteQuery(arg1, arg2, arg3).then(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT).catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .noop */ .ZT);
  }

  resumePausedMutations() {
    return this.mutationCache.resumePausedMutations();
  }

  getQueryCache() {
    return this.queryCache;
  }

  getMutationCache() {
    return this.mutationCache;
  }

  getLogger() {
    return this.logger;
  }

  getDefaultOptions() {
    return this.defaultOptions;
  }

  setDefaultOptions(options) {
    this.defaultOptions = options;
  }

  setQueryDefaults(queryKey, options) {
    const result = this.queryDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(queryKey) === (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(x.queryKey));

    if (result) {
      result.defaultOptions = options;
    } else {
      this.queryDefaults.push({
        queryKey,
        defaultOptions: options
      });
    }
  }

  getQueryDefaults(queryKey) {
    if (!queryKey) {
      return undefined;
    } // Get the first matching defaults


    const firstMatchingDefaults = this.queryDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .partialMatchKey */ .to)(queryKey, x.queryKey)); // Additional checks and error in dev mode

    if (false) {}

    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }

  setMutationDefaults(mutationKey, options) {
    const result = this.mutationDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(mutationKey) === (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKey */ .yF)(x.mutationKey));

    if (result) {
      result.defaultOptions = options;
    } else {
      this.mutationDefaults.push({
        mutationKey,
        defaultOptions: options
      });
    }
  }

  getMutationDefaults(mutationKey) {
    if (!mutationKey) {
      return undefined;
    } // Get the first matching defaults


    const firstMatchingDefaults = this.mutationDefaults.find(x => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .partialMatchKey */ .to)(mutationKey, x.mutationKey)); // Additional checks and error in dev mode

    if (false) {}

    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }

  defaultQueryOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }

    const defaultedOptions = { ...this.defaultOptions.queries,
      ...this.getQueryDefaults(options == null ? void 0 : options.queryKey),
      ...options,
      _defaulted: true
    };

    if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
      defaultedOptions.queryHash = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_5__/* .hashQueryKeyByOptions */ .Rm)(defaultedOptions.queryKey, defaultedOptions);
    } // dependent default values


    if (typeof defaultedOptions.refetchOnReconnect === 'undefined') {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== 'always';
    }

    if (typeof defaultedOptions.useErrorBoundary === 'undefined') {
      defaultedOptions.useErrorBoundary = !!defaultedOptions.suspense;
    }

    return defaultedOptions;
  }

  defaultMutationOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }

    return { ...this.defaultOptions.mutations,
      ...this.getMutationDefaults(options == null ? void 0 : options.mutationKey),
      ...options,
      _defaulted: true
    };
  }

  clear() {
    this.queryCache.clear();
    this.mutationCache.clear();
  }

}


//# sourceMappingURL=queryClient.mjs.map


/***/ }),

/***/ 1578:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: function() { return /* binding */ QueryObserver; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6370);
/* harmony import */ var _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3709);
/* harmony import */ var _focusManager_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5289);
/* harmony import */ var _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2436);
/* harmony import */ var _retryer_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3241);






class QueryObserver extends _subscribable_mjs__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(client, options) {
    super();
    this.client = client;
    this.options = options;
    this.trackedProps = new Set();
    this.selectError = null;
    this.bindMethods();
    this.setOptions(options);
  }

  bindMethods() {
    this.remove = this.remove.bind(this);
    this.refetch = this.refetch.bind(this);
  }

  onSubscribe() {
    if (this.listeners.size === 1) {
      this.currentQuery.addObserver(this);

      if (shouldFetchOnMount(this.currentQuery, this.options)) {
        this.executeFetch();
      }

      this.updateTimers();
    }
  }

  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }

  shouldFetchOnReconnect() {
    return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnReconnect);
  }

  shouldFetchOnWindowFocus() {
    return shouldFetchOn(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
  }

  destroy() {
    this.listeners = new Set();
    this.clearStaleTimeout();
    this.clearRefetchInterval();
    this.currentQuery.removeObserver(this);
  }

  setOptions(options, notifyOptions) {
    const prevOptions = this.options;
    const prevQuery = this.currentQuery;
    this.options = this.client.defaultQueryOptions(options);

    if (false) {}

    if (!(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(prevOptions, this.options)) {
      this.client.getQueryCache().notify({
        type: 'observerOptionsUpdated',
        query: this.currentQuery,
        observer: this
      });
    }

    if (typeof this.options.enabled !== 'undefined' && typeof this.options.enabled !== 'boolean') {
      throw new Error('Expected enabled to be a boolean');
    } // Keep previous query key if the user does not supply one


    if (!this.options.queryKey) {
      this.options.queryKey = prevOptions.queryKey;
    }

    this.updateQuery();
    const mounted = this.hasListeners(); // Fetch if there are subscribers

    if (mounted && shouldFetchOptionally(this.currentQuery, prevQuery, this.options, prevOptions)) {
      this.executeFetch();
    } // Update result


    this.updateResult(notifyOptions); // Update stale interval if needed

    if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || this.options.staleTime !== prevOptions.staleTime)) {
      this.updateStaleTimeout();
    }

    const nextRefetchInterval = this.computeRefetchInterval(); // Update refetch interval if needed

    if (mounted && (this.currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || nextRefetchInterval !== this.currentRefetchInterval)) {
      this.updateRefetchInterval(nextRefetchInterval);
    }
  }

  getOptimisticResult(options) {
    const query = this.client.getQueryCache().build(this.client, options);
    const result = this.createResult(query, options);

    if (shouldAssignObserverCurrentProperties(this, result, options)) {
      // this assigns the optimistic result to the current Observer
      // because if the query function changes, useQuery will be performing
      // an effect where it would fetch again.
      // When the fetch finishes, we perform a deep data cloning in order
      // to reuse objects references. This deep data clone is performed against
      // the `observer.currentResult.data` property
      // When QueryKey changes, we refresh the query and get new `optimistic`
      // result, while we leave the `observer.currentResult`, so when new data
      // arrives, it finds the old `observer.currentResult` which is related
      // to the old QueryKey. Which means that currentResult and selectData are
      // out of sync already.
      // To solve this, we move the cursor of the currentResult everytime
      // an observer reads an optimistic value.
      // When keeping the previous data, the result doesn't change until new
      // data arrives.
      this.currentResult = result;
      this.currentResultOptions = this.options;
      this.currentResultState = this.currentQuery.state;
    }

    return result;
  }

  getCurrentResult() {
    return this.currentResult;
  }

  trackResult(result) {
    const trackedResult = {};
    Object.keys(result).forEach(key => {
      Object.defineProperty(trackedResult, key, {
        configurable: false,
        enumerable: true,
        get: () => {
          this.trackedProps.add(key);
          return result[key];
        }
      });
    });
    return trackedResult;
  }

  getCurrentQuery() {
    return this.currentQuery;
  }

  remove() {
    this.client.getQueryCache().remove(this.currentQuery);
  }

  refetch({
    refetchPage,
    ...options
  } = {}) {
    return this.fetch({ ...options,
      meta: {
        refetchPage
      }
    });
  }

  fetchOptimistic(options) {
    const defaultedOptions = this.client.defaultQueryOptions(options);
    const query = this.client.getQueryCache().build(this.client, defaultedOptions);
    query.isFetchingOptimistic = true;
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }

  fetch(fetchOptions) {
    var _fetchOptions$cancelR;

    return this.executeFetch({ ...fetchOptions,
      cancelRefetch: (_fetchOptions$cancelR = fetchOptions.cancelRefetch) != null ? _fetchOptions$cancelR : true
    }).then(() => {
      this.updateResult();
      return this.currentResult;
    });
  }

  executeFetch(fetchOptions) {
    // Make sure we reference the latest query as the current one might have been removed
    this.updateQuery(); // Fetch

    let promise = this.currentQuery.fetch(this.options, fetchOptions);

    if (!(fetchOptions != null && fetchOptions.throwOnError)) {
      promise = promise.catch(_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .noop */ .ZT);
    }

    return promise;
  }

  updateStaleTimeout() {
    this.clearStaleTimeout();

    if (_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk || this.currentResult.isStale || !(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isValidTimeout */ .PN)(this.options.staleTime)) {
      return;
    }

    const time = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .timeUntilStale */ .Kp)(this.currentResult.dataUpdatedAt, this.options.staleTime); // The timeout is sometimes triggered 1 ms before the stale time expiration.
    // To mitigate this issue we always add 1 ms to the timeout.

    const timeout = time + 1;
    this.staleTimeoutId = setTimeout(() => {
      if (!this.currentResult.isStale) {
        this.updateResult();
      }
    }, timeout);
  }

  computeRefetchInterval() {
    var _this$options$refetch;

    return typeof this.options.refetchInterval === 'function' ? this.options.refetchInterval(this.currentResult.data, this.currentQuery) : (_this$options$refetch = this.options.refetchInterval) != null ? _this$options$refetch : false;
  }

  updateRefetchInterval(nextInterval) {
    this.clearRefetchInterval();
    this.currentRefetchInterval = nextInterval;

    if (_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk || this.options.enabled === false || !(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .isValidTimeout */ .PN)(this.currentRefetchInterval) || this.currentRefetchInterval === 0) {
      return;
    }

    this.refetchIntervalId = setInterval(() => {
      if (this.options.refetchIntervalInBackground || _focusManager_mjs__WEBPACK_IMPORTED_MODULE_2__/* .focusManager */ .j.isFocused()) {
        this.executeFetch();
      }
    }, this.currentRefetchInterval);
  }

  updateTimers() {
    this.updateStaleTimeout();
    this.updateRefetchInterval(this.computeRefetchInterval());
  }

  clearStaleTimeout() {
    if (this.staleTimeoutId) {
      clearTimeout(this.staleTimeoutId);
      this.staleTimeoutId = undefined;
    }
  }

  clearRefetchInterval() {
    if (this.refetchIntervalId) {
      clearInterval(this.refetchIntervalId);
      this.refetchIntervalId = undefined;
    }
  }

  createResult(query, options) {
    const prevQuery = this.currentQuery;
    const prevOptions = this.options;
    const prevResult = this.currentResult;
    const prevResultState = this.currentResultState;
    const prevResultOptions = this.currentResultOptions;
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : this.currentQueryInitialState;
    const prevQueryResult = queryChange ? this.currentResult : this.previousQueryResult;
    const {
      state
    } = query;
    let {
      dataUpdatedAt,
      error,
      errorUpdatedAt,
      fetchStatus,
      status
    } = state;
    let isPreviousData = false;
    let isPlaceholderData = false;
    let data; // Optimistically set result in fetching state if needed

    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);

      if (fetchOnMount || fetchOptionally) {
        fetchStatus = (0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .canFetch */ .Kw)(query.options.networkMode) ? 'fetching' : 'paused';

        if (!dataUpdatedAt) {
          status = 'loading';
        }
      }

      if (options._optimisticResults === 'isRestoring') {
        fetchStatus = 'idle';
      }
    } // Keep previous data if needed


    if (options.keepPreviousData && !state.dataUpdatedAt && prevQueryResult != null && prevQueryResult.isSuccess && status !== 'error') {
      data = prevQueryResult.data;
      dataUpdatedAt = prevQueryResult.dataUpdatedAt;
      status = prevQueryResult.status;
      isPreviousData = true;
    } // Select data if needed
    else if (options.select && typeof state.data !== 'undefined') {
      // Memoize select result
      if (prevResult && state.data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === this.selectFn) {
        data = this.selectResult;
      } else {
        try {
          this.selectFn = options.select;
          data = options.select(state.data);
          data = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .replaceData */ .oE)(prevResult == null ? void 0 : prevResult.data, data, options);
          this.selectResult = data;
          this.selectError = null;
        } catch (selectError) {
          if (false) {}

          this.selectError = selectError;
        }
      }
    } // Use query data
    else {
      data = state.data;
    } // Show placeholder data if needed


    if (typeof options.placeholderData !== 'undefined' && typeof data === 'undefined' && status === 'loading') {
      let placeholderData; // Memoize placeholder data

      if (prevResult != null && prevResult.isPlaceholderData && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
      } else {
        placeholderData = typeof options.placeholderData === 'function' ? options.placeholderData() : options.placeholderData;

        if (options.select && typeof placeholderData !== 'undefined') {
          try {
            placeholderData = options.select(placeholderData);
            this.selectError = null;
          } catch (selectError) {
            if (false) {}

            this.selectError = selectError;
          }
        }
      }

      if (typeof placeholderData !== 'undefined') {
        status = 'success';
        data = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .replaceData */ .oE)(prevResult == null ? void 0 : prevResult.data, placeholderData, options);
        isPlaceholderData = true;
      }
    }

    if (this.selectError) {
      error = this.selectError;
      data = this.selectResult;
      errorUpdatedAt = Date.now();
      status = 'error';
    }

    const isFetching = fetchStatus === 'fetching';
    const isLoading = status === 'loading';
    const isError = status === 'error';
    const result = {
      status,
      fetchStatus,
      isLoading,
      isSuccess: status === 'success',
      isError,
      isInitialLoading: isLoading && isFetching,
      data,
      dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: state.fetchFailureCount,
      failureReason: state.fetchFailureReason,
      errorUpdateCount: state.errorUpdateCount,
      isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
      isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount || state.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isLoading,
      isLoadingError: isError && state.dataUpdatedAt === 0,
      isPaused: fetchStatus === 'paused',
      isPlaceholderData,
      isPreviousData,
      isRefetchError: isError && state.dataUpdatedAt !== 0,
      isStale: isStale(query, options),
      refetch: this.refetch,
      remove: this.remove
    };
    return result;
  }

  updateResult(notifyOptions) {
    const prevResult = this.currentResult;
    const nextResult = this.createResult(this.currentQuery, this.options);
    this.currentResultState = this.currentQuery.state;
    this.currentResultOptions = this.options; // Only notify and update result if something has changed

    if ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(nextResult, prevResult)) {
      return;
    }

    this.currentResult = nextResult; // Determine which callbacks to trigger

    const defaultNotifyOptions = {
      cache: true
    };

    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }

      const {
        notifyOnChangeProps
      } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === 'function' ? notifyOnChangeProps() : notifyOnChangeProps;

      if (notifyOnChangePropsValue === 'all' || !notifyOnChangePropsValue && !this.trackedProps.size) {
        return true;
      }

      const includedProps = new Set(notifyOnChangePropsValue != null ? notifyOnChangePropsValue : this.trackedProps);

      if (this.options.useErrorBoundary) {
        includedProps.add('error');
      }

      return Object.keys(this.currentResult).some(key => {
        const typedKey = key;
        const changed = this.currentResult[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };

    if ((notifyOptions == null ? void 0 : notifyOptions.listeners) !== false && shouldNotifyListeners()) {
      defaultNotifyOptions.listeners = true;
    }

    this.notify({ ...defaultNotifyOptions,
      ...notifyOptions
    });
  }

  updateQuery() {
    const query = this.client.getQueryCache().build(this.client, this.options);

    if (query === this.currentQuery) {
      return;
    }

    const prevQuery = this.currentQuery;
    this.currentQuery = query;
    this.currentQueryInitialState = query.state;
    this.previousQueryResult = this.currentResult;

    if (this.hasListeners()) {
      prevQuery == null ? void 0 : prevQuery.removeObserver(this);
      query.addObserver(this);
    }
  }

  onQueryUpdate(action) {
    const notifyOptions = {};

    if (action.type === 'success') {
      notifyOptions.onSuccess = !action.manual;
    } else if (action.type === 'error' && !(0,_retryer_mjs__WEBPACK_IMPORTED_MODULE_3__/* .isCancelledError */ .DV)(action.error)) {
      notifyOptions.onError = true;
    }

    this.updateResult(notifyOptions);

    if (this.hasListeners()) {
      this.updateTimers();
    }
  }

  notify(notifyOptions) {
    _notifyManager_mjs__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager */ .V.batch(() => {
      // First trigger the configuration callbacks
      if (notifyOptions.onSuccess) {
        var _this$options$onSucce, _this$options, _this$options$onSettl, _this$options2;

        (_this$options$onSucce = (_this$options = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options, this.currentResult.data);
        (_this$options$onSettl = (_this$options2 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options2, this.currentResult.data, null);
      } else if (notifyOptions.onError) {
        var _this$options$onError, _this$options3, _this$options$onSettl2, _this$options4;

        (_this$options$onError = (_this$options3 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options3, this.currentResult.error);
        (_this$options$onSettl2 = (_this$options4 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options4, undefined, this.currentResult.error);
      } // Then trigger the listeners


      if (notifyOptions.listeners) {
        this.listeners.forEach(({
          listener
        }) => {
          listener(this.currentResult);
        });
      } // Then the cache listeners


      if (notifyOptions.cache) {
        this.client.getQueryCache().notify({
          query: this.currentQuery,
          type: 'observerResultsUpdated'
        });
      }
    });
  }

}

function shouldLoadOnMount(query, options) {
  return options.enabled !== false && !query.state.dataUpdatedAt && !(query.state.status === 'error' && options.retryOnMount === false);
}

function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.dataUpdatedAt > 0 && shouldFetchOn(query, options, options.refetchOnMount);
}

function shouldFetchOn(query, options, field) {
  if (options.enabled !== false) {
    const value = typeof field === 'function' ? field(query) : field;
    return value === 'always' || value !== false && isStale(query, options);
  }

  return false;
}

function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return options.enabled !== false && (query !== prevQuery || prevOptions.enabled === false) && (!options.suspense || query.state.status !== 'error') && isStale(query, options);
}

function isStale(query, options) {
  return query.isStaleByTime(options.staleTime);
} // this function would decide if we will update the observer's 'current'
// properties after an optimistic reading via getOptimisticResult


function shouldAssignObserverCurrentProperties(observer, optimisticResult, options) {
  // it is important to keep this condition like this for three reasons:
  // 1. It will get removed in the v5
  // 2. it reads: don't update the properties if we want to keep the previous
  // data.
  // 3. The opposite condition (!options.keepPreviousData) would fallthrough
  // and will result in a bad decision
  if (options.keepPreviousData) {
    return false;
  } // this means we want to put some placeholder data when pending and queryKey
  // changed.


  if (options.placeholderData !== undefined) {
    // re-assign properties only if current data is placeholder data
    // which means that data did not arrive yet, so, if there is some cached data
    // we need to "prepare" to receive it
    return optimisticResult.isPlaceholderData;
  } // if the newly created result isn't what the observer is holding as current,
  // then we'll need to update the properties as well


  if (!(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(observer.getCurrentResult(), optimisticResult)) {
    return true;
  } // basically, just keep previous properties if nothing changed


  return false;
}


//# sourceMappingURL=queryObserver.mjs.map


/***/ }),

/***/ 3429:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: function() { return /* binding */ Removable; }
/* harmony export */ });
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6370);


class Removable {
  destroy() {
    this.clearGcTimeout();
  }

  scheduleGc() {
    this.clearGcTimeout();

    if ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isValidTimeout */ .PN)(this.cacheTime)) {
      this.gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.cacheTime);
    }
  }

  updateCacheTime(newCacheTime) {
    // Default to 5 minutes (Infinity for server-side) if no cache time is set
    this.cacheTime = Math.max(this.cacheTime || 0, newCacheTime != null ? newCacheTime : _utils_mjs__WEBPACK_IMPORTED_MODULE_0__/* .isServer */ .sk ? Infinity : 5 * 60 * 1000);
  }

  clearGcTimeout() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = undefined;
    }
  }

}


//# sourceMappingURL=removable.mjs.map


/***/ }),

/***/ 3241:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DV: function() { return /* binding */ isCancelledError; },
/* harmony export */   Kw: function() { return /* binding */ canFetch; },
/* harmony export */   Mz: function() { return /* binding */ createRetryer; }
/* harmony export */ });
/* unused harmony export CancelledError */
/* harmony import */ var _focusManager_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5289);
/* harmony import */ var _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3240);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6370);




function defaultRetryDelay(failureCount) {
  return Math.min(1000 * 2 ** failureCount, 30000);
}

function canFetch(networkMode) {
  return (networkMode != null ? networkMode : 'online') === 'online' ? _onlineManager_mjs__WEBPACK_IMPORTED_MODULE_0__/* .onlineManager */ .N.isOnline() : true;
}
class CancelledError {
  constructor(options) {
    this.revert = options == null ? void 0 : options.revert;
    this.silent = options == null ? void 0 : options.silent;
  }

}
function isCancelledError(value) {
  return value instanceof CancelledError;
}
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let isResolved = false;
  let continueFn;
  let promiseResolve;
  let promiseReject;
  const promise = new Promise((outerResolve, outerReject) => {
    promiseResolve = outerResolve;
    promiseReject = outerReject;
  });

  const cancel = cancelOptions => {
    if (!isResolved) {
      reject(new CancelledError(cancelOptions));
      config.abort == null ? void 0 : config.abort();
    }
  };

  const cancelRetry = () => {
    isRetryCancelled = true;
  };

  const continueRetry = () => {
    isRetryCancelled = false;
  };

  const shouldPause = () => !_focusManager_mjs__WEBPACK_IMPORTED_MODULE_1__/* .focusManager */ .j.isFocused() || config.networkMode !== 'always' && !_onlineManager_mjs__WEBPACK_IMPORTED_MODULE_0__/* .onlineManager */ .N.isOnline();

  const resolve = value => {
    if (!isResolved) {
      isResolved = true;
      config.onSuccess == null ? void 0 : config.onSuccess(value);
      continueFn == null ? void 0 : continueFn();
      promiseResolve(value);
    }
  };

  const reject = value => {
    if (!isResolved) {
      isResolved = true;
      config.onError == null ? void 0 : config.onError(value);
      continueFn == null ? void 0 : continueFn();
      promiseReject(value);
    }
  };

  const pause = () => {
    return new Promise(continueResolve => {
      continueFn = value => {
        const canContinue = isResolved || !shouldPause();

        if (canContinue) {
          continueResolve(value);
        }

        return canContinue;
      };

      config.onPause == null ? void 0 : config.onPause();
    }).then(() => {
      continueFn = undefined;

      if (!isResolved) {
        config.onContinue == null ? void 0 : config.onContinue();
      }
    });
  }; // Create loop function


  const run = () => {
    // Do nothing if already resolved
    if (isResolved) {
      return;
    }

    let promiseOrValue; // Execute query

    try {
      promiseOrValue = config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }

    Promise.resolve(promiseOrValue).then(resolve).catch(error => {
      var _config$retry, _config$retryDelay;

      // Stop if the fetch is already resolved
      if (isResolved) {
        return;
      } // Do we need to retry the request?


      const retry = (_config$retry = config.retry) != null ? _config$retry : 3;
      const retryDelay = (_config$retryDelay = config.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
      const delay = typeof retryDelay === 'function' ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === 'number' && failureCount < retry || typeof retry === 'function' && retry(failureCount, error);

      if (isRetryCancelled || !shouldRetry) {
        // We are done if the query does not need to be retried
        reject(error);
        return;
      }

      failureCount++; // Notify on fail

      config.onFail == null ? void 0 : config.onFail(failureCount, error); // Delay

      (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__/* .sleep */ .Gh)(delay) // Pause if the document is not visible or when the device is offline
      .then(() => {
        if (shouldPause()) {
          return pause();
        }

        return;
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  }; // Start loop


  if (canFetch(config.networkMode)) {
    run();
  } else {
    pause().then(run);
  }

  return {
    promise,
    cancel,
    continue: () => {
      const didContinue = continueFn == null ? void 0 : continueFn();
      return didContinue ? promise : Promise.resolve();
    },
    cancelRetry,
    continueRetry
  };
}


//# sourceMappingURL=retryer.mjs.map


/***/ }),

/***/ 2436:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: function() { return /* binding */ Subscribable; }
/* harmony export */ });
class Subscribable {
  constructor() {
    this.listeners = new Set();
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener) {
    const identity = {
      listener
    };
    this.listeners.add(identity);
    this.onSubscribe();
    return () => {
      this.listeners.delete(identity);
      this.onUnsubscribe();
    };
  }

  hasListeners() {
    return this.listeners.size > 0;
  }

  onSubscribe() {// Do nothing
  }

  onUnsubscribe() {// Do nothing
  }

}


//# sourceMappingURL=subscribable.mjs.map


/***/ }),

/***/ 6370:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A4: function() { return /* binding */ scheduleMicrotask; },
/* harmony export */   G9: function() { return /* binding */ getAbortController; },
/* harmony export */   Gh: function() { return /* binding */ sleep; },
/* harmony export */   I6: function() { return /* binding */ parseFilterArgs; },
/* harmony export */   Kp: function() { return /* binding */ timeUntilStale; },
/* harmony export */   PN: function() { return /* binding */ isValidTimeout; },
/* harmony export */   Rm: function() { return /* binding */ hashQueryKeyByOptions; },
/* harmony export */   SE: function() { return /* binding */ functionalUpdate; },
/* harmony export */   VS: function() { return /* binding */ shallowEqualObjects; },
/* harmony export */   X7: function() { return /* binding */ matchMutation; },
/* harmony export */   ZT: function() { return /* binding */ noop; },
/* harmony export */   _v: function() { return /* binding */ parseQueryArgs; },
/* harmony export */   _x: function() { return /* binding */ matchQuery; },
/* harmony export */   oE: function() { return /* binding */ replaceData; },
/* harmony export */   sk: function() { return /* binding */ isServer; },
/* harmony export */   to: function() { return /* binding */ partialMatchKey; },
/* harmony export */   yF: function() { return /* binding */ hashQueryKey; }
/* harmony export */ });
/* unused harmony exports difference, isError, isPlainArray, isPlainObject, isQueryKey, parseMutationArgs, parseMutationFilterArgs, partialDeepEqual, replaceAt, replaceEqualDeep */
// TYPES
// UTILS
const isServer = typeof window === 'undefined' || 'Deno' in window;
function noop() {
  return undefined;
}
function functionalUpdate(updater, input) {
  return typeof updater === 'function' ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === 'number' && value >= 0 && value !== Infinity;
}
function difference(array1, array2) {
  return array1.filter(x => !array2.includes(x));
}
function replaceAt(array, index, value) {
  const copy = array.slice(0);
  copy[index] = value;
  return copy;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function parseQueryArgs(arg1, arg2, arg3) {
  if (!isQueryKey(arg1)) {
    return arg1;
  }

  if (typeof arg2 === 'function') {
    return { ...arg3,
      queryKey: arg1,
      queryFn: arg2
    };
  }

  return { ...arg2,
    queryKey: arg1
  };
}
function parseMutationArgs(arg1, arg2, arg3) {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === 'function') {
      return { ...arg3,
        mutationKey: arg1,
        mutationFn: arg2
      };
    }

    return { ...arg2,
      mutationKey: arg1
    };
  }

  if (typeof arg1 === 'function') {
    return { ...arg2,
      mutationFn: arg1
    };
  }

  return { ...arg1
  };
}
function parseFilterArgs(arg1, arg2, arg3) {
  return isQueryKey(arg1) ? [{ ...arg2,
    queryKey: arg1
  }, arg3] : [arg1 || {}, arg2];
}
function parseMutationFilterArgs(arg1, arg2, arg3) {
  return isQueryKey(arg1) ? [{ ...arg2,
    mutationKey: arg1
  }, arg3] : [arg1 || {}, arg2];
}
function matchQuery(filters, query) {
  const {
    type = 'all',
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;

  if (isQueryKey(queryKey)) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }

  if (type !== 'all') {
    const isActive = query.isActive();

    if (type === 'active' && !isActive) {
      return false;
    }

    if (type === 'inactive' && isActive) {
      return false;
    }
  }

  if (typeof stale === 'boolean' && query.isStale() !== stale) {
    return false;
  }

  if (typeof fetchStatus !== 'undefined' && fetchStatus !== query.state.fetchStatus) {
    return false;
  }

  if (predicate && !predicate(query)) {
    return false;
  }

  return true;
}
function matchMutation(filters, mutation) {
  const {
    exact,
    fetching,
    predicate,
    mutationKey
  } = filters;

  if (isQueryKey(mutationKey)) {
    if (!mutation.options.mutationKey) {
      return false;
    }

    if (exact) {
      if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }

  if (typeof fetching === 'boolean' && mutation.state.status === 'loading' !== fetching) {
    return false;
  }

  if (predicate && !predicate(mutation)) {
    return false;
  }

  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
  return hashFn(queryKey);
}
/**
 * Default query keys hash function.
 * Hashes the value into a stable hash.
 */

function hashQueryKey(queryKey) {
  return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
}
/**
 * Checks if key `b` partially matches with key `a`.
 */

function partialMatchKey(a, b) {
  return partialDeepEqual(a, b);
}
/**
 * Checks if `b` partially matches with `a`.
 */

function partialDeepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some(key => !partialDeepEqual(a[key], b[key]));
  }

  return false;
}
/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */

function replaceEqualDeep(a, b) {
  if (a === b) {
    return a;
  }

  const array = isPlainArray(a) && isPlainArray(b);

  if (array || isPlainObject(a) && isPlainObject(b)) {
    const aSize = array ? a.length : Object.keys(a).length;
    const bItems = array ? b : Object.keys(b);
    const bSize = bItems.length;
    const copy = array ? [] : {};
    let equalItems = 0;

    for (let i = 0; i < bSize; i++) {
      const key = array ? i : bItems[i];
      copy[key] = replaceEqualDeep(a[key], b[key]);

      if (copy[key] === a[key]) {
        equalItems++;
      }
    }

    return aSize === bSize && equalItems === aSize ? a : copy;
  }

  return b;
}
/**
 * Shallow compare objects. Only works with objects that always have the same properties.
 */

function shallowEqualObjects(a, b) {
  if (a && !b || b && !a) {
    return false;
  }

  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
} // Copied from: https://github.com/jonschlinkert/is-plain-object

function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  } // If has modified constructor


  const ctor = o.constructor;

  if (typeof ctor === 'undefined') {
    return true;
  } // If has modified prototype


  const prot = ctor.prototype;

  if (!hasObjectPrototype(prot)) {
    return false;
  } // If constructor does not have an Object-specific method


  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  } // Most likely a plain Object


  return true;
}

function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isQueryKey(value) {
  return Array.isArray(value);
}
function isError(value) {
  return value instanceof Error;
}
function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
/**
 * Schedules a microtask.
 * This can be useful to schedule state updates after rendering.
 */

function scheduleMicrotask(callback) {
  sleep(0).then(callback);
}
function getAbortController() {
  if (typeof AbortController === 'function') {
    return new AbortController();
  }

  return;
}
function replaceData(prevData, data, options) {
  // Use prev data if an isDataEqual function is defined and returns `true`
  if (options.isDataEqual != null && options.isDataEqual(prevData, data)) {
    return prevData;
  } else if (typeof options.structuralSharing === 'function') {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    // Structurally share data between prev and new data if needed
    return replaceEqualDeep(prevData, data);
  }

  return data;
}


//# sourceMappingURL=utils.mjs.map


/***/ }),

/***/ 5830:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NL: function() { return /* binding */ useQueryClient; },
/* harmony export */   aH: function() { return /* binding */ QueryClientProvider; }
/* harmony export */ });
/* unused harmony export defaultContext */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
'use client';


const defaultContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(undefined);
const QueryClientSharingContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(false); // If we are given a context, we will use it.
// Otherwise, if contextSharing is on, we share the first and at least one
// instance of the context across the window
// to ensure that if React Query is used across
// different bundles or microfrontends they will
// all use the same **instance** of context, regardless
// of module scoping.

function getQueryClientContext(context, contextSharing) {
  if (context) {
    return context;
  }

  if (contextSharing && typeof window !== 'undefined') {
    if (!window.ReactQueryClientContext) {
      window.ReactQueryClientContext = defaultContext;
    }

    return window.ReactQueryClientContext;
  }

  return defaultContext;
}

const useQueryClient = ({
  context
} = {}) => {
  const queryClient = react__WEBPACK_IMPORTED_MODULE_0__.useContext(getQueryClientContext(context, react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryClientSharingContext)));

  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one');
  }

  return queryClient;
};
const QueryClientProvider = ({
  client,
  children,
  context,
  contextSharing = false
}) => {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);

  if (false) {}

  const Context = getQueryClientContext(context, contextSharing);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(QueryClientSharingContext.Provider, {
    value: !context && contextSharing
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Context.Provider, {
    value: client
  }, children));
};


//# sourceMappingURL=QueryClientProvider.mjs.map


/***/ }),

/***/ 2985:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: function() { return /* binding */ useQueryErrorResetBoundary; }
/* harmony export */ });
/* unused harmony export QueryErrorResetBoundary */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
'use client';


function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}

const QueryErrorResetBoundaryContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(createValue()); // HOOK

const useQueryErrorResetBoundary = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryErrorResetBoundaryContext); // COMPONENT

const QueryErrorResetBoundary = ({
  children
}) => {
  const [value] = React.useState(() => createValue());
  return /*#__PURE__*/React.createElement(QueryErrorResetBoundaryContext.Provider, {
    value: value
  }, typeof children === 'function' ? children(value) : children);
};


//# sourceMappingURL=QueryErrorResetBoundary.mjs.map


/***/ }),

/***/ 8879:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JN: function() { return /* binding */ useClearResetErrorBoundary; },
/* harmony export */   KJ: function() { return /* binding */ getHasError; },
/* harmony export */   pf: function() { return /* binding */ ensurePreventErrorBoundaryRetry; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9189);
'use client';



const ensurePreventErrorBoundaryRetry = (options, errorResetBoundary) => {
  if (options.suspense || options.useErrorBoundary) {
    // Prevent retrying failed query if the error boundary has not been reset yet
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
const useClearResetErrorBoundary = errorResetBoundary => {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
const getHasError = ({
  result,
  errorResetBoundary,
  useErrorBoundary,
  query
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_1__/* .shouldThrowError */ .L)(useErrorBoundary, [result.error, query]);
};


//# sourceMappingURL=errorBoundaryUtils.mjs.map


/***/ }),

/***/ 2257:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: function() { return /* binding */ useIsRestoring; }
/* harmony export */ });
/* unused harmony export IsRestoringProvider */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
'use client';


const IsRestoringContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(false);
const useIsRestoring = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(IsRestoringContext);
const IsRestoringProvider = IsRestoringContext.Provider;


//# sourceMappingURL=isRestoring.mjs.map


/***/ }),

/***/ 7167:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fb: function() { return /* binding */ ensureStaleTime; },
/* harmony export */   SB: function() { return /* binding */ shouldSuspend; },
/* harmony export */   j8: function() { return /* binding */ fetchOptimistic; }
/* harmony export */ });
/* unused harmony export willFetch */
const ensureStaleTime = defaultedOptions => {
  if (defaultedOptions.suspense) {
    // Always set stale time when using suspense to prevent
    // fetching again when directly mounting after suspending
    if (typeof defaultedOptions.staleTime !== 'number') {
      defaultedOptions.staleTime = 1000;
    }
  }
};
const willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
const shouldSuspend = (defaultedOptions, result, isRestoring) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && willFetch(result, isRestoring);
const fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).then(({
  data
}) => {
  defaultedOptions.onSuccess == null ? void 0 : defaultedOptions.onSuccess(data);
  defaultedOptions.onSettled == null ? void 0 : defaultedOptions.onSettled(data, null);
}).catch(error => {
  errorResetBoundary.clearReset();
  defaultedOptions.onError == null ? void 0 : defaultedOptions.onError(error);
  defaultedOptions.onSettled == null ? void 0 : defaultedOptions.onSettled(undefined, error);
});


//# sourceMappingURL=suspense.mjs.map


/***/ }),

/***/ 8281:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: function() { return /* binding */ useBaseQuery; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3709);
/* harmony import */ var _useSyncExternalStore_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9930);
/* harmony import */ var _QueryErrorResetBoundary_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2985);
/* harmony import */ var _QueryClientProvider_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5830);
/* harmony import */ var _isRestoring_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2257);
/* harmony import */ var _errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8879);
/* harmony import */ var _suspense_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7167);
'use client';









function useBaseQuery(options, Observer) {
  const queryClient = (0,_QueryClientProvider_mjs__WEBPACK_IMPORTED_MODULE_1__/* .useQueryClient */ .NL)({
    context: options.context
  });
  const isRestoring = (0,_isRestoring_mjs__WEBPACK_IMPORTED_MODULE_2__/* .useIsRestoring */ .S)();
  const errorResetBoundary = (0,_QueryErrorResetBoundary_mjs__WEBPACK_IMPORTED_MODULE_3__/* .useQueryErrorResetBoundary */ ._)();
  const defaultedOptions = queryClient.defaultQueryOptions(options); // Make sure results are optimistically set in fetching state before subscribing or updating options

  defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic'; // Include callbacks in batch renders

  if (defaultedOptions.onError) {
    defaultedOptions.onError = _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager */ .V.batchCalls(defaultedOptions.onError);
  }

  if (defaultedOptions.onSuccess) {
    defaultedOptions.onSuccess = _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager */ .V.batchCalls(defaultedOptions.onSuccess);
  }

  if (defaultedOptions.onSettled) {
    defaultedOptions.onSettled = _tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager */ .V.batchCalls(defaultedOptions.onSettled);
  }

  (0,_suspense_mjs__WEBPACK_IMPORTED_MODULE_5__/* .ensureStaleTime */ .Fb)(defaultedOptions);
  (0,_errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__/* .ensurePreventErrorBoundaryRetry */ .pf)(defaultedOptions, errorResetBoundary);
  (0,_errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__/* .useClearResetErrorBoundary */ .JN)(errorResetBoundary);
  const [observer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new Observer(queryClient, defaultedOptions));
  const result = observer.getOptimisticResult(defaultedOptions);
  (0,_useSyncExternalStore_mjs__WEBPACK_IMPORTED_MODULE_7__/* .useSyncExternalStore */ .$)(react__WEBPACK_IMPORTED_MODULE_0__.useCallback(onStoreChange => {
    const unsubscribe = isRestoring ? () => undefined : observer.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager */ .V.batchCalls(onStoreChange)); // Update result to make sure we did not miss any query updates
    // between creating the observer and subscribing to it.

    observer.updateResult();
    return unsubscribe;
  }, [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    // Do not notify on updates because of changes in the options because
    // these changes should already be reflected in the optimistic result.
    observer.setOptions(defaultedOptions, {
      listeners: false
    });
  }, [defaultedOptions, observer]); // Handle suspense

  if ((0,_suspense_mjs__WEBPACK_IMPORTED_MODULE_5__/* .shouldSuspend */ .SB)(defaultedOptions, result, isRestoring)) {
    throw (0,_suspense_mjs__WEBPACK_IMPORTED_MODULE_5__/* .fetchOptimistic */ .j8)(defaultedOptions, observer, errorResetBoundary);
  } // Handle error boundary


  if ((0,_errorBoundaryUtils_mjs__WEBPACK_IMPORTED_MODULE_6__/* .getHasError */ .KJ)({
    result,
    errorResetBoundary,
    useErrorBoundary: defaultedOptions.useErrorBoundary,
    query: observer.getCurrentQuery()
  })) {
    throw result.error;
  } // Handle result property usage tracking


  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}


//# sourceMappingURL=useBaseQuery.mjs.map


/***/ }),

/***/ 8943:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: function() { return /* binding */ useQuery; }
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6370);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1578);
/* harmony import */ var _useBaseQuery_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8281);
'use client';



function useQuery(arg1, arg2, arg3) {
  const parsedOptions = (0,_tanstack_query_core__WEBPACK_IMPORTED_MODULE_0__/* .parseQueryArgs */ ._v)(arg1, arg2, arg3);
  return (0,_useBaseQuery_mjs__WEBPACK_IMPORTED_MODULE_1__/* .useBaseQuery */ .r)(parsedOptions, _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__/* .QueryObserver */ .z);
}


//# sourceMappingURL=useQuery.mjs.map


/***/ }),

/***/ 9930:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: function() { return /* binding */ useSyncExternalStore; }
/* harmony export */ });
/* harmony import */ var use_sync_external_store_shim_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3100);
'use client';


const useSyncExternalStore = use_sync_external_store_shim_index_js__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore;


//# sourceMappingURL=useSyncExternalStore.mjs.map


/***/ }),

/***/ 9189:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: function() { return /* binding */ shouldThrowError; }
/* harmony export */ });
function shouldThrowError(_useErrorBoundary, params) {
  // Allow useErrorBoundary function to override throwing behavior on a per-error basis
  if (typeof _useErrorBoundary === 'function') {
    return _useErrorBoundary(...params);
  }

  return !!_useErrorBoundary;
}


//# sourceMappingURL=utils.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7915);
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_public_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5830);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7022);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7701);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8817);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1093);
/* harmony import */ var _notices__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7172);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6421);

/*** THIS MUST BE THE FIRST THING EVALUATED IN THIS SCRIPT *****/







const showGlobalStylesComponents = () => {
  (0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_3__.registerPlugin)('wpcom-global-styles', {
    render: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_7__/* .QueryClientProvider */ .aH, {
      client: new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_8__/* .QueryClient */ .S()
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_modal__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_notices__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, null))
  });
};
_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_2___default()(() => {
  showGlobalStylesComponents();
});
}();
window.EditingToolkit = __webpack_exports__;
/******/ })()
;