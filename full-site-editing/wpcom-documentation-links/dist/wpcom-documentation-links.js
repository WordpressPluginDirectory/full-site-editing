/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 620:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ compile)
/* harmony export */ });
/* harmony import */ var _tannin_postfix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(412);
/* harmony import */ var _tannin_evaluate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(336);



/**
 * Given a C expression, returns a function which can be called to evaluate its
 * result.
 *
 * @example
 *
 * ```js
 * import compile from '@tannin/compile';
 *
 * const evaluate = compile( 'n > 1' );
 *
 * evaluate( { n: 2 } );
 * // ⇒ true
 * ```
 *
 * @param {string} expression C expression.
 *
 * @return {(variables?:{[variable:string]:*})=>*} Compiled evaluator.
 */
function compile( expression ) {
	var terms = (0,_tannin_postfix__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)( expression );

	return function( variables ) {
		return (0,_tannin_evaluate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)( terms, variables );
	};
}


/***/ }),

/***/ 336:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ evaluate)
/* harmony export */ });
/**
 * Operator callback functions.
 *
 * @type {Object}
 */
var OPERATORS = {
	'!': function( a ) {
		return ! a;
	},
	'*': function( a, b ) {
		return a * b;
	},
	'/': function( a, b ) {
		return a / b;
	},
	'%': function( a, b ) {
		return a % b;
	},
	'+': function( a, b ) {
		return a + b;
	},
	'-': function( a, b ) {
		return a - b;
	},
	'<': function( a, b ) {
		return a < b;
	},
	'<=': function( a, b ) {
		return a <= b;
	},
	'>': function( a, b ) {
		return a > b;
	},
	'>=': function( a, b ) {
		return a >= b;
	},
	'==': function( a, b ) {
		return a === b;
	},
	'!=': function( a, b ) {
		return a !== b;
	},
	'&&': function( a, b ) {
		return a && b;
	},
	'||': function( a, b ) {
		return a || b;
	},
	'?:': function( a, b, c ) {
		if ( a ) {
			throw b;
		}

		return c;
	},
};

/**
 * Given an array of postfix terms and operand variables, returns the result of
 * the postfix evaluation.
 *
 * @example
 *
 * ```js
 * import evaluate from '@tannin/evaluate';
 *
 * // 3 + 4 * 5 / 6 ⇒ '3 4 5 * 6 / +'
 * const terms = [ '3', '4', '5', '*', '6', '/', '+' ];
 *
 * evaluate( terms, {} );
 * // ⇒ 6.333333333333334
 * ```
 *
 * @param {string[]} postfix   Postfix terms.
 * @param {Object}   variables Operand variables.
 *
 * @return {*} Result of evaluation.
 */
function evaluate( postfix, variables ) {
	var stack = [],
		i, j, args, getOperatorResult, term, value;

	for ( i = 0; i < postfix.length; i++ ) {
		term = postfix[ i ];

		getOperatorResult = OPERATORS[ term ];
		if ( getOperatorResult ) {
			// Pop from stack by number of function arguments.
			j = getOperatorResult.length;
			args = Array( j );
			while ( j-- ) {
				args[ j ] = stack.pop();
			}

			try {
				value = getOperatorResult.apply( null, args );
			} catch ( earlyReturn ) {
				return earlyReturn;
			}
		} else if ( variables.hasOwnProperty( term ) ) {
			value = variables[ term ];
		} else {
			value = +term;
		}

		stack.push( value );
	}

	return stack[ 0 ];
}


/***/ }),

/***/ 43:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ pluralForms)
/* harmony export */ });
/* harmony import */ var _tannin_compile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(620);


/**
 * Given a C expression, returns a function which, when called with a value,
 * evaluates the result with the value assumed to be the "n" variable of the
 * expression. The result will be coerced to its numeric equivalent.
 *
 * @param {string} expression C expression.
 *
 * @return {Function} Evaluator function.
 */
function pluralForms( expression ) {
	var evaluate = (0,_tannin_compile__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)( expression );

	return function( n ) {
		return +evaluate( { n: n } );
	};
}


/***/ }),

/***/ 412:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ postfix)
/* harmony export */ });
var PRECEDENCE, OPENERS, TERMINATORS, PATTERN;

/**
 * Operator precedence mapping.
 *
 * @type {Object}
 */
PRECEDENCE = {
	'(': 9,
	'!': 8,
	'*': 7,
	'/': 7,
	'%': 7,
	'+': 6,
	'-': 6,
	'<': 5,
	'<=': 5,
	'>': 5,
	'>=': 5,
	'==': 4,
	'!=': 4,
	'&&': 3,
	'||': 2,
	'?': 1,
	'?:': 1,
};

/**
 * Characters which signal pair opening, to be terminated by terminators.
 *
 * @type {string[]}
 */
OPENERS = [ '(', '?' ];

/**
 * Characters which signal pair termination, the value an array with the
 * opener as its first member. The second member is an optional operator
 * replacement to push to the stack.
 *
 * @type {string[]}
 */
TERMINATORS = {
	')': [ '(' ],
	':': [ '?', '?:' ],
};

/**
 * Pattern matching operators and openers.
 *
 * @type {RegExp}
 */
PATTERN = /<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;

/**
 * Given a C expression, returns the equivalent postfix (Reverse Polish)
 * notation terms as an array.
 *
 * If a postfix string is desired, simply `.join( ' ' )` the result.
 *
 * @example
 *
 * ```js
 * import postfix from '@tannin/postfix';
 *
 * postfix( 'n > 1' );
 * // ⇒ [ 'n', '1', '>' ]
 * ```
 *
 * @param {string} expression C expression.
 *
 * @return {string[]} Postfix terms.
 */
function postfix( expression ) {
	var terms = [],
		stack = [],
		match, operator, term, element;

	while ( ( match = expression.match( PATTERN ) ) ) {
		operator = match[ 0 ];

		// Term is the string preceding the operator match. It may contain
		// whitespace, and may be empty (if operator is at beginning).
		term = expression.substr( 0, match.index ).trim();
		if ( term ) {
			terms.push( term );
		}

		while ( ( element = stack.pop() ) ) {
			if ( TERMINATORS[ operator ] ) {
				if ( TERMINATORS[ operator ][ 0 ] === element ) {
					// Substitution works here under assumption that because
					// the assigned operator will no longer be a terminator, it
					// will be pushed to the stack during the condition below.
					operator = TERMINATORS[ operator ][ 1 ] || operator;
					break;
				}
			} else if ( OPENERS.indexOf( element ) >= 0 || PRECEDENCE[ element ] < PRECEDENCE[ operator ] ) {
				// Push to stack if either an opener or when pop reveals an
				// element of lower precedence.
				stack.push( element );
				break;
			}

			// For each popped from stack, push to terms.
			terms.push( element );
		}

		if ( ! TERMINATORS[ operator ] ) {
			stack.push( operator );
		}

		// Slice matched fragment from expression to continue match.
		expression = expression.substr( match.index + operator.length );
	}

	// Push remainder of operand, if exists, to terms.
	expression = expression.trim();
	if ( expression ) {
		terms.push( expression );
	}

	// Pop remaining items from stack into terms.
	return terms.concat( stack.reverse() );
}


/***/ }),

/***/ 315:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ sprintf)
/* harmony export */ });
/**
 * Regular expression matching format placeholder syntax.
 *
 * The pattern for matching named arguments is a naive and incomplete matcher
 * against valid JavaScript identifier names.
 *
 * via Mathias Bynens:
 *
 * >An identifier must start with $, _, or any character in the Unicode
 * >categories “Uppercase letter (Lu)”, “Lowercase letter (Ll)”, “Titlecase
 * >letter (Lt)”, “Modifier letter (Lm)”, “Other letter (Lo)”, or “Letter
 * >number (Nl)”.
 * >
 * >The rest of the string can contain the same characters, plus any U+200C zero
 * >width non-joiner characters, U+200D zero width joiner characters, and
 * >characters in the Unicode categories “Non-spacing mark (Mn)”, “Spacing
 * >combining mark (Mc)”, “Decimal digit number (Nd)”, or “Connector
 * >punctuation (Pc)”.
 *
 * If browser support is constrained to those supporting ES2015, this could be
 * made more accurate using the `u` flag:
 *
 * ```
 * /^[$_\p{L}\p{Nl}][$_\p{L}\p{Nl}\u200C\u200D\p{Mn}\p{Mc}\p{Nd}\p{Pc}]*$/u;
 * ```
 *
 * @see http://www.pixelbeat.org/programming/gcc/format_specs.html
 * @see https://mathiasbynens.be/notes/javascript-identifiers#valid-identifier-names
 *
 * @type {RegExp}
 */
var PATTERN = /%(((\d+)\$)|(\(([$_a-zA-Z][$_a-zA-Z0-9]*)\)))?[ +0#-]*\d*(\.(\d+|\*))?(ll|[lhqL])?([cduxXefgsp%])/g;
//               ▲         ▲                    ▲       ▲  ▲            ▲           ▲ type
//               │         │                    │       │  │            └ Length (unsupported)
//               │         │                    │       │  └ Precision / max width
//               │         │                    │       └ Min width (unsupported)
//               │         │                    └ Flags (unsupported)
//               └ Index   └ Name (for named arguments)

/**
 * Given a format string, returns string with arguments interpolatation.
 * Arguments can either be provided directly via function arguments spread, or
 * with an array as the second argument.
 *
 * @see https://en.wikipedia.org/wiki/Printf_format_string
 *
 * @example
 *
 * ```js
 * import sprintf from '@tannin/sprintf';
 *
 * sprintf( 'Hello %s!', 'world' );
 * // ⇒ 'Hello world!'
 * ```
 *
 * @param {string} string printf format string
 * @param {Array}  [args] String arguments.
 *
 * @return {string} Formatted string.
 */
function sprintf( string, args ) {
	var i;

	if ( ! Array.isArray( args ) ) {
		// Construct a copy of arguments from index one, used for replace
		// function placeholder substitution.
		args = new Array( arguments.length - 1 );
		for ( i = 1; i < arguments.length; i++ ) {
			args[ i - 1 ] = arguments[ i ];
		}
	}

	i = 1;

	return string.replace( PATTERN, function() {
		var index, name, precision, type, value;

		index = arguments[ 3 ];
		name = arguments[ 5 ];
		precision = arguments[ 7 ];
		type = arguments[ 9 ];

		// There's no placeholder substitution in the explicit "%", meaning it
		// is not necessary to increment argument index.
		if ( type === '%' ) {
			return '%';
		}

		// Asterisk precision determined by peeking / shifting next argument.
		if ( precision === '*' ) {
			precision = args[ i - 1 ];
			i++;
		}

		if ( name !== undefined ) {
			// If it's a named argument, use name.
			if ( args[ 0 ] && typeof args[ 0 ] === 'object' &&
					args[ 0 ].hasOwnProperty( name ) ) {
				value = args[ 0 ][ name ];
			}
		} else {
			// If not a positional argument, use counter value.
			if ( index === undefined ) {
				index = i;
			}

			i++;

			// Positional argument.
			value = args[ index - 1 ];
		}

		// Parse as type.
		if ( type === 'f' ) {
			value = parseFloat( value ) || 0;
		} else if ( type === 'd' ) {
			value = parseInt( value ) || 0;
		}

		// Apply precision.
		if ( precision !== undefined ) {
			if ( type === 'f' ) {
				value = value.toFixed( precision );
			} else if ( type === 's' ) {
				value = value.substr( 0, precision );
			}
		}

		// To avoid "undefined" concatenation, return empty string if no
		// placeholder substitution can be performed.
		return value !== undefined && value !== null ? value : '';
	} );
}


/***/ }),

/***/ 437:
/***/ ((module) => {

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

/***/ 46:
/***/ ((module) => {

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

/***/ 191:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(461);
var assert = __webpack_require__(784);

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

/***/ 986:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(461);
var common = __webpack_require__(191);
var shaCommon = __webpack_require__(600);

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_5 = utils.sum32_5;
var ft_1 = shaCommon.ft_1;
var BlockHash = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),

/***/ 600:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(461);
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

/***/ 461:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var assert = __webpack_require__(784);
var inherits = __webpack_require__(615);

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

/***/ 615:
/***/ ((module) => {

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

/***/ 327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var events = __webpack_require__(46)
var inherits = __webpack_require__(615)

module.exports = LRU

function LRU (opts) {
  if (!(this instanceof LRU)) return new LRU(opts)
  if (typeof opts === 'number') opts = {max: opts}
  if (!opts) opts = {}
  events.EventEmitter.call(this)
  this.cache = {}
  this.head = this.tail = null
  this.length = 0
  this.max = opts.max || 1000
  this.maxAge = opts.maxAge || 0
}

inherits(LRU, events.EventEmitter)

Object.defineProperty(LRU.prototype, 'keys', {
  get: function () { return Object.keys(this.cache) }
})

LRU.prototype.clear = function () {
  this.cache = {}
  this.head = this.tail = null
  this.length = 0
}

LRU.prototype.remove = function (key) {
  if (typeof key !== 'string') key = '' + key
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]
  delete this.cache[key]
  this._unlink(key, element.prev, element.next)
  return element.value
}

LRU.prototype._unlink = function (key, prev, next) {
  this.length--

  if (this.length === 0) {
    this.head = this.tail = null
  } else {
    if (this.head === key) {
      this.head = prev
      this.cache[this.head].next = null
    } else if (this.tail === key) {
      this.tail = next
      this.cache[this.tail].prev = null
    } else {
      this.cache[prev].next = next
      this.cache[next].prev = prev
    }
  }
}

LRU.prototype.peek = function (key) {
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]

  if (!this._checkAge(key, element)) return
  return element.value
}

LRU.prototype.set = function (key, value) {
  if (typeof key !== 'string') key = '' + key

  var element

  if (this.cache.hasOwnProperty(key)) {
    element = this.cache[key]
    element.value = value
    if (this.maxAge) element.modified = Date.now()

    // If it's already the head, there's nothing more to do:
    if (key === this.head) return value
    this._unlink(key, element.prev, element.next)
  } else {
    element = {value: value, modified: 0, next: null, prev: null}
    if (this.maxAge) element.modified = Date.now()
    this.cache[key] = element

    // Eviction is only possible if the key didn't already exist:
    if (this.length === this.max) this.evict()
  }

  this.length++
  element.next = null
  element.prev = this.head

  if (this.head) this.cache[this.head].next = key
  this.head = key

  if (!this.tail) this.tail = key
  return value
}

LRU.prototype._checkAge = function (key, element) {
  if (this.maxAge && (Date.now() - element.modified) > this.maxAge) {
    this.remove(key)
    this.emit('evict', {key: key, value: element.value})
    return false
  }
  return true
}

LRU.prototype.get = function (key) {
  if (typeof key !== 'string') key = '' + key
  if (!this.cache.hasOwnProperty(key)) return

  var element = this.cache[key]

  if (!this._checkAge(key, element)) return

  if (this.head !== key) {
    if (key === this.tail) {
      this.tail = element.next
      this.cache[this.tail].prev = null
    } else {
      // Set prev.next -> element.next:
      this.cache[element.prev].next = element.next
    }

    // Set element.next.prev -> element.prev:
    this.cache[element.next].prev = element.prev

    // Element is the new head
    this.cache[this.head].next = key
    element.prev = this.head
    element.next = null
    this.head = key
  }

  return element.value
}

LRU.prototype.evict = function () {
  if (!this.tail) return
  var key = this.tail
  var value = this.remove(this.tail)
  this.emit('evict', {key: key, value: value})
}


/***/ }),

/***/ 186:
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 784:
/***/ ((module) => {

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

/***/ 714:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Tannin)
/* harmony export */ });
/* harmony import */ var _tannin_plural_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);


/**
 * Tannin constructor options.
 *
 * @typedef {Object} TanninOptions
 *
 * @property {string}   [contextDelimiter] Joiner in string lookup with context.
 * @property {Function} [onMissingKey]     Callback to invoke when key missing.
 */

/**
 * Domain metadata.
 *
 * @typedef {Object} TanninDomainMetadata
 *
 * @property {string}            [domain]       Domain name.
 * @property {string}            [lang]         Language code.
 * @property {(string|Function)} [plural_forms] Plural forms expression or
 *                                              function evaluator.
 */

/**
 * Domain translation pair respectively representing the singular and plural
 * translation.
 *
 * @typedef {[string,string]} TanninTranslation
 */

/**
 * Locale data domain. The key is used as reference for lookup, the value an
 * array of two string entries respectively representing the singular and plural
 * translation.
 *
 * @typedef {{[key:string]:TanninDomainMetadata|TanninTranslation,'':TanninDomainMetadata|TanninTranslation}} TanninLocaleDomain
 */

/**
 * Jed-formatted locale data.
 *
 * @see http://messageformat.github.io/Jed/
 *
 * @typedef {{[domain:string]:TanninLocaleDomain}} TanninLocaleData
 */

/**
 * Default Tannin constructor options.
 *
 * @type {TanninOptions}
 */
var DEFAULT_OPTIONS = {
	contextDelimiter: '\u0004',
	onMissingKey: null,
};

/**
 * Given a specific locale data's config `plural_forms` value, returns the
 * expression.
 *
 * @example
 *
 * ```
 * getPluralExpression( 'nplurals=2; plural=(n != 1);' ) === '(n != 1)'
 * ```
 *
 * @param {string} pf Locale data plural forms.
 *
 * @return {string} Plural forms expression.
 */
function getPluralExpression( pf ) {
	var parts, i, part;

	parts = pf.split( ';' );

	for ( i = 0; i < parts.length; i++ ) {
		part = parts[ i ].trim();
		if ( part.indexOf( 'plural=' ) === 0 ) {
			return part.substr( 7 );
		}
	}
}

/**
 * Tannin constructor.
 *
 * @class
 *
 * @param {TanninLocaleData} data      Jed-formatted locale data.
 * @param {TanninOptions}    [options] Tannin options.
 */
function Tannin( data, options ) {
	var key;

	/**
	 * Jed-formatted locale data.
	 *
	 * @name Tannin#data
	 * @type {TanninLocaleData}
	 */
	this.data = data;

	/**
	 * Plural forms function cache, keyed by plural forms string.
	 *
	 * @name Tannin#pluralForms
	 * @type {Object<string,Function>}
	 */
	this.pluralForms = {};

	/**
	 * Effective options for instance, including defaults.
	 *
	 * @name Tannin#options
	 * @type {TanninOptions}
	 */
	this.options = {};

	for ( key in DEFAULT_OPTIONS ) {
		this.options[ key ] = options !== undefined && key in options
			? options[ key ]
			: DEFAULT_OPTIONS[ key ];
	}
}

/**
 * Returns the plural form index for the given domain and value.
 *
 * @param {string} domain Domain on which to calculate plural form.
 * @param {number} n      Value for which plural form is to be calculated.
 *
 * @return {number} Plural form index.
 */
Tannin.prototype.getPluralForm = function( domain, n ) {
	var getPluralForm = this.pluralForms[ domain ],
		config, plural, pf;

	if ( ! getPluralForm ) {
		config = this.data[ domain ][ '' ];

		pf = (
			config[ 'Plural-Forms' ] ||
			config[ 'plural-forms' ] ||
			// Ignore reason: As known, there's no way to document the empty
			// string property on a key to guarantee this as metadata.
			// @ts-ignore
			config.plural_forms
		);

		if ( typeof pf !== 'function' ) {
			plural = getPluralExpression(
				config[ 'Plural-Forms' ] ||
				config[ 'plural-forms' ] ||
				// Ignore reason: As known, there's no way to document the empty
				// string property on a key to guarantee this as metadata.
				// @ts-ignore
				config.plural_forms
			);

			pf = (0,_tannin_plural_forms__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)( plural );
		}

		getPluralForm = this.pluralForms[ domain ] = pf;
	}

	return getPluralForm( n );
};

/**
 * Translate a string.
 *
 * @param {string}      domain   Translation domain.
 * @param {string|void} context  Context distinguishing terms of the same name.
 * @param {string}      singular Primary key for translation lookup.
 * @param {string=}     plural   Fallback value used for non-zero plural
 *                               form index.
 * @param {number=}     n        Value to use in calculating plural form.
 *
 * @return {string} Translated string.
 */
Tannin.prototype.dcnpgettext = function( domain, context, singular, plural, n ) {
	var index, key, entry;

	if ( n === undefined ) {
		// Default to singular.
		index = 0;
	} else {
		// Find index by evaluating plural form for value.
		index = this.getPluralForm( domain, n );
	}

	key = singular;

	// If provided, context is prepended to key with delimiter.
	if ( context ) {
		key = context + this.options.contextDelimiter + singular;
	}

	entry = this.data[ domain ][ key ];

	// Verify not only that entry exists, but that the intended index is within
	// range and non-empty.
	if ( entry && entry[ index ] ) {
		return entry[ index ];
	}

	if ( this.options.onMissingKey ) {
		this.options.onMissingKey( singular, domain );
	}

	// If entry not found, fall back to singular vs. plural with zero index
	// representing the singular value.
	return index === 0 ? singular : plural;
};


/***/ }),

/***/ 776:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(355);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(619);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(186);



function overrideCoreDocumentationLinksToWpcom(translation, text) {
  switch (text) {
    case 'https://wordpress.org/support/article/excerpt/':
    case 'https://wordpress.org/support/article/settings-sidebar/#excerpt':
    case 'https://wordpress.org/documentation/article/page-post-settings-sidebar/#excerpt':
      return (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__/* .localizeUrl */ .rm)('https://wordpress.com/support/excerpts/', window.wpcomDocumentationLinksLocale);
    case 'https://wordpress.org/support/article/writing-posts/#post-field-descriptions':
    case 'https://wordpress.org/support/article/settings-sidebar/#permalink':
    case 'https://wordpress.org/documentation/article/page-post-settings-sidebar/#permalink':
      return (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__/* .localizeUrl */ .rm)('https://wordpress.com/support/permalinks-and-slugs/', window.wpcomDocumentationLinksLocale);
    case 'https://wordpress.org/support/article/wordpress-editor/':
      return (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__/* .localizeUrl */ .rm)('https://wordpress.com/support/wordpress-editor/', window.wpcomDocumentationLinksLocale);
    case 'https://wordpress.org/support/article/site-editor/':
      return (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__/* .localizeUrl */ .rm)('https://wordpress.com/support/site-editor/', window.wpcomDocumentationLinksLocale);
    case 'https://wordpress.org/support/article/block-based-widgets-editor/':
      return (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__/* .localizeUrl */ .rm)('https://wordpress.com/support/widgets/', window.wpcomDocumentationLinksLocale);
    case 'https://wordpress.org/plugins/classic-widgets/':
      return (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__/* .localizeUrl */ .rm)('https://wordpress.com/plugins/classic-widgets', window.wpcomDocumentationLinksLocale);
    case 'https://wordpress.org/support/article/styles-overview/':
      return (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_2__/* .localizeUrl */ .rm)('https://wordpress.com/support/using-styles/', window.wpcomDocumentationLinksLocale);
  }
  return translation;
}
function hideSimpleSiteTranslations(translation, text) {
  switch (text) {
    case 'https://wordpress.org/plugins/classic-widgets/':
      return '';
    case 'Want to stick with the old widgets?':
      return '';
    case 'Get the Classic Widgets plugin.':
      return '';
  }
  return translation;
}
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('i18n.gettext_default', 'full-site-editing/override-core-docs-to-wpcom', overrideCoreDocumentationLinksToWpcom, 9);
if (window?._currentSiteType === 'simple') {
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('i18n.gettext_default', 'full-site-editing/override-core-docs-to-wpcom', hideSimpleSiteTranslations, 10);
}

/***/ }),

/***/ 118:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(434);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A());

/***/ }),

/***/ 434:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_interpolate_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(540);
/* harmony import */ var _tannin_sprintf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(315);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(90);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var hash_js_lib_hash_sha_1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(986);
/* harmony import */ var hash_js_lib_hash_sha_1__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hash_js_lib_hash_sha_1__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lru__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(327);
/* harmony import */ var lru__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lru__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var tannin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(714);
/* harmony import */ var _number_format__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15);









/**
 * Module variables
 */
const debug = debug__WEBPACK_IMPORTED_MODULE_1___default()('i18n-calypso');

/**
 * Constants
 */
const decimal_point_translation_key = 'number_format_decimals';
const thousands_sep_translation_key = 'number_format_thousands_sep';
const domain_key = 'messages';
const translationLookup = [
// By default don't modify the options when looking up translations.
function (options) {
  return options;
}];
const hashCache = {};

// raise a console warning
function warn() {
  if (!I18N.throwErrors) {
    return;
  }
  if ( true && window.console && window.console.warn) {
    window.console.warn.apply(window.console, arguments);
  }
}

// turns Function.arguments into an array
function simpleArguments(args) {
  return Array.prototype.slice.call(args);
}

/**
 * Coerce the possible arguments and normalize to a single object.
 * @param   {any} args - arguments passed in from `translate()`
 * @returns {Object}         - a single object describing translation needs
 */
function normalizeTranslateArguments(args) {
  const original = args[0];

  // warn about older deprecated syntax
  if (typeof original !== 'string' || args.length > 3 || args.length > 2 && typeof args[1] === 'object' && typeof args[2] === 'object') {
    warn('Deprecated Invocation: `translate()` accepts ( string, [string], [object] ). These arguments passed:', simpleArguments(args), '. See https://github.com/Automattic/i18n-calypso#translate-method');
  }
  if (args.length === 2 && typeof original === 'string' && typeof args[1] === 'string') {
    warn('Invalid Invocation: `translate()` requires an options object for plural translations, but passed:', simpleArguments(args));
  }

  // options could be in position 0, 1, or 2
  // sending options as the first object is deprecated and will raise a warning
  let options = {};
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'object') {
      options = args[i];
    }
  }

  // `original` can be passed as first parameter or as part of the options object
  // though passing original as part of the options is a deprecated approach and will be removed
  if (typeof original === 'string') {
    options.original = original;
  } else if (typeof options.original === 'object') {
    options.plural = options.original.plural;
    options.count = options.original.count;
    options.original = options.original.single;
  }
  if (typeof args[1] === 'string') {
    options.plural = args[1];
  }
  if (typeof options.original === 'undefined') {
    throw new Error('Translate called without a `string` value as first argument.');
  }
  return options;
}

/**
 * Takes translate options object and coerces to a Tannin request to retrieve translation.
 * @param   {Object} tannin  - tannin data object
 * @param   {Object} options - object describing translation
 * @returns {string}         - the returned translation from Tannin
 */
function getTranslationFromTannin(tannin, options) {
  return tannin.dcnpgettext(domain_key, options.context, options.original, options.plural, options.count);
}
function getTranslation(i18n, options) {
  for (let i = translationLookup.length - 1; i >= 0; i--) {
    const lookup = translationLookup[i](Object.assign({}, options));
    const key = lookup.context ? lookup.context + '\u0004' + lookup.original : lookup.original;

    // Only get the translation from tannin if it exists.
    if (i18n.state.locale[key]) {
      return getTranslationFromTannin(i18n.state.tannin, lookup);
    }
  }
  return null;
}
function I18N() {
  if (!(this instanceof I18N)) {
    return new I18N();
  }
  this.defaultLocaleSlug = 'en';
  // Tannin always needs a plural form definition, or it fails when dealing with plurals.
  this.defaultPluralForms = n => n === 1 ? 0 : 1;
  this.state = {
    numberFormatSettings: {},
    tannin: undefined,
    locale: undefined,
    localeSlug: undefined,
    localeVariant: undefined,
    textDirection: undefined,
    translations: lru__WEBPACK_IMPORTED_MODULE_3___default()({
      max: 100
    })
  };
  this.componentUpdateHooks = [];
  this.translateHooks = [];
  this.stateObserver = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
  // Because the higher-order component can wrap a ton of React components,
  // we need to bump the number of listeners to infinity and beyond
  // FIXME: still valid?
  this.stateObserver.setMaxListeners(0);
  // default configuration
  this.configure();
}
I18N.throwErrors = false;
I18N.prototype.on = function (...args) {
  this.stateObserver.on(...args);
};
I18N.prototype.off = function (...args) {
  this.stateObserver.off(...args);
};
I18N.prototype.emit = function (...args) {
  this.stateObserver.emit(...args);
};

/**
 * Formats numbers using locale settings and/or passed options.
 * @param   {string|number}  number to format (required)
 * @param   {number | Object}  options  Number of decimal places or options object (optional)
 * @returns {string}         Formatted number as string
 */
I18N.prototype.numberFormat = function (number, options = {}) {
  const decimals = typeof options === 'number' ? options : options.decimals || 0;
  const decPoint = options.decPoint || this.state.numberFormatSettings.decimal_point || '.';
  const thousandsSep = options.thousandsSep || this.state.numberFormatSettings.thousands_sep || ',';
  return (0,_number_format__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A)(number, decimals, decPoint, thousandsSep);
};
I18N.prototype.configure = function (options) {
  Object.assign(this, options || {});
  this.setLocale();
};
I18N.prototype.setLocale = function (localeData) {
  if (localeData && localeData[''] && localeData['']['key-hash']) {
    const keyHash = localeData['']['key-hash'];
    const transform = function (string, hashLength) {
      const lookupPrefix = hashLength === false ? '' : String(hashLength);
      if (typeof hashCache[lookupPrefix + string] !== 'undefined') {
        return hashCache[lookupPrefix + string];
      }
      const hash = hash_js_lib_hash_sha_1__WEBPACK_IMPORTED_MODULE_2___default()().update(string).digest('hex');
      if (hashLength) {
        return hashCache[lookupPrefix + string] = hash.substr(0, hashLength);
      }
      return hashCache[lookupPrefix + string] = hash;
    };
    const generateLookup = function (hashLength) {
      return function (options) {
        if (options.context) {
          options.original = transform(options.context + String.fromCharCode(4) + options.original, hashLength);
          delete options.context;
        } else {
          options.original = transform(options.original, hashLength);
        }
        return options;
      };
    };
    if (keyHash.substr(0, 4) === 'sha1') {
      if (keyHash.length === 4) {
        translationLookup.push(generateLookup(false));
      } else {
        const variableHashLengthPos = keyHash.substr(5).indexOf('-');
        if (variableHashLengthPos < 0) {
          const hashLength = Number(keyHash.substr(5));
          translationLookup.push(generateLookup(hashLength));
        } else {
          const minHashLength = Number(keyHash.substr(5, variableHashLengthPos));
          const maxHashLength = Number(keyHash.substr(6 + variableHashLengthPos));
          for (let hashLength = minHashLength; hashLength <= maxHashLength; hashLength++) {
            translationLookup.push(generateLookup(hashLength));
          }
        }
      }
    }
  }

  // if localeData is not given, assumes default locale and reset
  if (!localeData || !localeData[''].localeSlug) {
    this.state.locale = {
      '': {
        localeSlug: this.defaultLocaleSlug,
        plural_forms: this.defaultPluralForms
      }
    };
  } else if (localeData[''].localeSlug === this.state.localeSlug) {
    // Exit if same data as current (comparing references only)
    if (localeData === this.state.locale) {
      return;
    }

    // merge new data into existing one
    Object.assign(this.state.locale, localeData);
  } else {
    this.state.locale = Object.assign({}, localeData);
  }
  this.state.localeSlug = this.state.locale[''].localeSlug;
  this.state.localeVariant = this.state.locale[''].localeVariant;

  // extract the `textDirection` info (LTR or RTL) from either:
  // - the translation for the special string "ltr" (standard in Core, not present in Calypso)
  // - or the `momentjs_locale.textDirection` property present in Calypso translation files
  this.state.textDirection = this.state.locale['text direction\u0004ltr']?.[0] || this.state.locale['']?.momentjs_locale?.textDirection;
  this.state.tannin = new tannin__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A({
    [domain_key]: this.state.locale
  });

  // Updates numberFormat preferences with settings from translations
  this.state.numberFormatSettings.decimal_point = getTranslationFromTannin(this.state.tannin, normalizeTranslateArguments([decimal_point_translation_key]));
  this.state.numberFormatSettings.thousands_sep = getTranslationFromTannin(this.state.tannin, normalizeTranslateArguments([thousands_sep_translation_key]));

  // If translation isn't set, define defaults.
  if (this.state.numberFormatSettings.decimal_point === decimal_point_translation_key) {
    this.state.numberFormatSettings.decimal_point = '.';
  }
  if (this.state.numberFormatSettings.thousands_sep === thousands_sep_translation_key) {
    this.state.numberFormatSettings.thousands_sep = ',';
  }
  this.stateObserver.emit('change');
};
I18N.prototype.getLocale = function () {
  return this.state.locale;
};

/**
 * Get the current locale slug.
 * @returns {string} The string representing the currently loaded locale
 */
I18N.prototype.getLocaleSlug = function () {
  return this.state.localeSlug;
};

/**
 * Get the current locale variant. That's set for some special locales that don't have a
 * standard ISO code, like `de_formal` or `sr_latin`.
 * @returns {string|undefined} The string representing the currently loaded locale's variant
 */
I18N.prototype.getLocaleVariant = function () {
  return this.state.localeVariant;
};

/**
 * Get the current text direction, left-to-right (LTR) or right-to-left (RTL).
 * @returns {boolean} `true` in case the current locale has RTL text direction
 */
I18N.prototype.isRtl = function () {
  return this.state.textDirection === 'rtl';
};

/**
 * Adds new translations to the locale data, overwriting any existing translations with a matching key.
 * @param {Object} localeData Locale data
 */
I18N.prototype.addTranslations = function (localeData) {
  for (const prop in localeData) {
    if (prop !== '') {
      this.state.tannin.data.messages[prop] = localeData[prop];
    }
  }
  this.stateObserver.emit('change');
};

/**
 * Checks whether the given original has a translation.
 * @returns {boolean} whether a translation exists
 */
I18N.prototype.hasTranslation = function () {
  return !!getTranslation(this, normalizeTranslateArguments(arguments));
};

/**
 * Exposes single translation method.
 * See sibling README
 * @returns {string | Object | undefined} translated text or an object containing React children that can be inserted into a parent component
 */
I18N.prototype.translate = function () {
  const options = normalizeTranslateArguments(arguments);
  let translation = getTranslation(this, options);
  if (!translation) {
    // This purposefully calls tannin for a case where there is no translation,
    // so that tannin gives us the expected object with English text.
    translation = getTranslationFromTannin(this.state.tannin, options);
  }

  // handle any string substitution
  if (options.args) {
    const sprintfArgs = Array.isArray(options.args) ? options.args.slice(0) : [options.args];
    sprintfArgs.unshift(translation);
    try {
      translation = (0,_tannin_sprintf__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(...sprintfArgs);
    } catch (error) {
      if (!window || !window.console) {
        return;
      }
      const errorMethod = this.throwErrors ? 'error' : 'warn';
      if (typeof error !== 'string') {
        window.console[errorMethod](error);
      } else {
        window.console[errorMethod]('i18n sprintf error:', sprintfArgs);
      }
    }
  }

  // interpolate any components
  if (options.components) {
    translation = (0,_automattic_interpolate_components__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)({
      mixedString: translation,
      components: options.components,
      throwErrors: this.throwErrors
    });
  }

  // run any necessary hooks
  this.translateHooks.forEach(function (hook) {
    translation = hook(translation, options);
  });
  return translation;
};

/**
 * Causes i18n to re-render all translations.
 *
 * This can be necessary if an extension makes changes that i18n is unaware of
 * and needs those changes manifested immediately (e.g. adding an important
 * translation hook, or modifying the behaviour of an existing hook).
 *
 * If at all possible, react components should try to use the more local
 * updateTranslation() function inherited from the mixin.
 */
I18N.prototype.reRenderTranslations = function () {
  debug('Re-rendering all translations due to external request');
  this.stateObserver.emit('change');
};
I18N.prototype.registerComponentUpdateHook = function (callback) {
  this.componentUpdateHooks.push(callback);
};
I18N.prototype.registerTranslateHook = function (callback) {
  this.translateHooks.push(callback);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (I18N);

/***/ }),

/***/ 744:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   yb: () => (/* binding */ getLocaleSlug)
/* harmony export */ });
/* unused harmony exports numberFormat, translate, configure, setLocale, getLocale, getLocaleVariant, isRtl, addTranslations, reRenderTranslations, registerComponentUpdateHook, registerTranslateHook, state, stateObserver, on, off, emit */
/* harmony import */ var _default_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(118);







/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (i18n)));

// Export the default instance's properties and bound methods for convenience
// These should be deprecated eventually, exposing only the default `i18n` instance
const numberFormat = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.numberFormat.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const translate = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.translate.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const configure = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.configure.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const setLocale = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.setLocale.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const getLocale = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.getLocale.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const getLocaleSlug = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.getLocaleSlug.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const getLocaleVariant = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.getLocaleVariant.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const isRtl = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.isRtl.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const addTranslations = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.addTranslations.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const reRenderTranslations = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.reRenderTranslations.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const registerComponentUpdateHook = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.registerComponentUpdateHook.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const registerTranslateHook = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.registerTranslateHook.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const state = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.state;
const stateObserver = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.stateObserver;
const on = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.on.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const off = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.off.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
const emit = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.emit.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);

/***/ }),

/***/ 15:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ number_format)
/* harmony export */ });
/*
 * Exposes number format capability
 *
 * @copyright Copyright (c) 2013 Kevin van Zonneveld (http://kvz.io) and Contributors (http://phpjs.org/authors).
 * @license See CREDITS.md
 * @see https://github.com/kvz/phpjs/blob/ffe1356af23a6f2512c84c954dd4e828e92579fa/functions/strings/number_format.js
 */
function toFixedFix(n, prec) {
  const k = Math.pow(10, prec);
  return '' + (Math.round(n * k) / k).toFixed(prec);
}
function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
  const dec = typeof dec_point === 'undefined' ? '.' : dec_point;
  let s = '';
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

/***/ }),

/***/ 706:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ym: () => (/* binding */ useLocale)
/* harmony export */ });
/* unused harmony exports localeContext, LocaleProvider, withLocale, useIsEnglishLocale, useHasEnTranslation */
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(491);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(723);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(609);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);






const localeContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_3__.createContext)(null);
const LocaleProvider = ({
  children,
  localeSlug
}) => createElement(localeContext.Provider, {
  value: localeSlug
}, children);

/**
 * Returns locale slug
 * @param {string} locale locale to be converted e.g. "en_US".
 * @returns locale string e.g. "en"
 */
function mapWpI18nLangToLocaleSlug(locale = '') {
  if (!locale) {
    return '';
  }
  const TARGET_LOCALES = ['pt_br', 'pt-br', 'zh_tw', 'zh-tw', 'zh_cn', 'zh-cn', 'zh_sg', 'zh-sg'];
  const lowerCaseLocale = locale.toLowerCase();
  const formattedLocale = TARGET_LOCALES.includes(lowerCaseLocale) ? lowerCaseLocale.replace('_', '-') : lowerCaseLocale.replace(/([-_].*)$/i, '');
  return formattedLocale || 'en';
}

/**
 * Get the current locale slug from the @wordpress/i18n locale data
 */
function getWpI18nLocaleSlug() {
  const language = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.getLocaleData ? _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.getLocaleData()?.['']?.language : '';
  return mapWpI18nLangToLocaleSlug(language);
}

/**
 * React hook providing the current locale slug. If `<LocaleProvider>` hasn't
 * been defined in the component tree then it will fall back to using the
 * data from `@wordpress/i18n` to determine the current locale slug.
 * @example
 *
 * import { useLocale } from '@automattic/i18n-utils';
 * function MyComponent() {
 *   const locale = useLocale();
 *   return <div>The current locale is: { locale }</div>;
 * }
 */
function useLocale() {
  const fromProvider = (0,react__WEBPACK_IMPORTED_MODULE_3__.useContext)(localeContext);
  const providerHasLocale = !!fromProvider;
  const [fromWpI18n, setWpLocale] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(getWpI18nLocaleSlug());
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    // If the <LocaleProvider> has been used further up the component tree
    // then we don't want to subscribe to any defaultI18n changes.
    if (providerHasLocale) {
      return;
    }
    setWpLocale(getWpI18nLocaleSlug());
    return _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.subscribe(() => {
      setWpLocale(getWpI18nLocaleSlug());
    });
  }, [providerHasLocale]);
  return fromProvider || fromWpI18n ||  true && window._currentUserLocale || 'en';
}

/**
 * HoC providing the current locale slug supplied to `<LocaleProvider>`.
 * @param InnerComponent Component that will receive `locale` as a prop
 * @returns Component enhanced with locale
 * @example
 *
 * import { withLocale } from '@automattic/i18n-utils';
 * function MyComponent( { locale } ) {
 *   return <div>The current locale is: { locale }</div>;
 * }
 * export default withLocale( MyComponent );
 */
const withLocale = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.createHigherOrderComponent)(InnerComponent => {
  return props => {
    const locale = useLocale();
    const innerProps = {
      ...props,
      locale
    };
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerComponent, innerProps);
  };
}, 'withLocale');

/**
 * React hook providing whether the current locale slug belongs to English or not
 * @example
 *
 * import { useIsEnglishLocale } from '@automattic/i18n-utils';
 * function MyComponent() {
 *   const isEnglishLocale = useIsEnglishLocale();
 *   return <div>The current locale is English: { isEnglishLocale }</div>;
 * }
 */
function useIsEnglishLocale() {
  const locale = useLocale();
  return englishLocales.includes(locale);
}
function useHasEnTranslation() {
  const isEnglishLocale = useIsEnglishLocale();
  return useCallback((...args) => isEnglishLocale || i18n.hasTranslation(...args), [isEnglishLocale]);
}

/***/ }),

/***/ 903:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BS: () => (/* binding */ forumLocales),
/* harmony export */   Cx: () => (/* binding */ localesWithGoBlog),
/* harmony export */   K8: () => (/* binding */ localesWithCookiePolicy),
/* harmony export */   S9: () => (/* binding */ localesWithPrivacyPolicy),
/* harmony export */   Sc: () => (/* binding */ localesWithBlog),
/* harmony export */   Sj: () => (/* binding */ localesToSubdomains),
/* harmony export */   Ws: () => (/* binding */ localesForPricePlans),
/* harmony export */   _J: () => (/* binding */ supportSiteLocales),
/* harmony export */   lW: () => (/* binding */ magnificentNonEnLocales),
/* harmony export */   mt: () => (/* binding */ localesWithLearn),
/* harmony export */   rh: () => (/* binding */ jetpackComLocales)
/* harmony export */ });
/* unused harmony exports i18nDefaultLocaleSlug, englishLocales, livechatSupportLocales */
/**
 * The locale sets here map roughly to those found in locales.php
 *
 * todo: move these into @automattic/languages as another downloaded resource
 * todo: cleanup _shared.json - replace references to the below config options with imports from here
 */

const i18nDefaultLocaleSlug = 'en';
const localesWithBlog = ['en', 'ja', 'es', 'pt', 'fr', 'pt-br'];
const localesWithGoBlog = ['en', 'pt-br', 'de', 'es', 'fr', 'it'];
const localesWithPrivacyPolicy = ['en', 'fr', 'de', 'es'];
const localesWithCookiePolicy = ['en', 'fr', 'de', 'es'];
const localesWithLearn = ['en', 'es'];
const localesForPricePlans = ['ar', 'de', 'el', 'es', 'fr', 'he', 'id', 'it', 'ja', 'ko', 'nl', 'pt-br', 'ro', 'ru', 'sv', 'tr', 'zh-cn', 'zh-tw'];
const localesToSubdomains = {
  'pt-br': 'br',
  br: 'bre',
  zh: 'zh-cn',
  'zh-hk': 'zh-tw',
  'zh-sg': 'zh-cn',
  kr: 'ko'
};

// replaces config( 'english_locales' )
const englishLocales = (/* unused pure expression or super */ null && (['en', 'en-gb']));

// replaces config( 'livechat_support_locales' )
const livechatSupportLocales = (/* unused pure expression or super */ null && (['en']));

// replaces config( 'support_site_locales' )
const supportSiteLocales = ['ar', 'de', 'en', 'es', 'fr', 'he', 'id', 'it', 'ja', 'ko', 'nl', 'pt-br', 'ru', 'sv', 'tr', 'zh-cn', 'zh-tw'];

// replaces config( 'forum_locales')
const forumLocales = ['ar', 'de', 'el', 'en', 'es', 'fa', 'fi', 'fr', 'id', 'it', 'ja', 'nl', 'pt', 'pt-br', 'ru', 'sv', 'th', 'tl', 'tr'];

// replaces config( 'magnificent_non_en_locales')
const magnificentNonEnLocales = ['es', 'pt-br', 'de', 'fr', 'he', 'ja', 'it', 'nl', 'ru', 'tr', 'id', 'zh-cn', 'zh-tw', 'ko', 'ar', 'sv'];

// replaces config( 'jetpack_com_locales')
const jetpackComLocales = ['en', 'ar', 'de', 'es', 'fr', 'he', 'id', 'it', 'ja', 'ko', 'nl', 'pt-br', 'ro', 'ru', 'sv', 'tr', 'zh-cn', 'zh-tw'];

/***/ }),

/***/ 355:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rm: () => (/* binding */ localizeUrl)
/* harmony export */ });
/* unused harmony exports urlLocalizationMapping, useLocalizeUrl, withLocalizeUrl */
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(491);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var i18n_calypso__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(744);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(609);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _locale_context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(706);
/* harmony import */ var _locales__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(903);






const INVALID_URL = `http://__domain__.invalid`;
function getDefaultLocale() {
  return (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_3__/* .getLocaleSlug */ .yb)?.() ?? 'en';
}
const setLocalizedUrlHost = (hostname, validLocales = []) => (url, locale) => {
  if (validLocales.includes(locale) && locale !== 'en') {
    // Avoid changing the hostname when the locale is set via the path.
    if (url.pathname.substr(0, locale.length + 2) !== '/' + locale + '/') {
      url.host = `${_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesToSubdomains */ .Sj[locale] || locale}.${hostname}`;
    }
  }
  return url;
};
const setLocalizedWpComPath = (prefix, validLocales = [], limitPathMatch = null) => (url, localeSlug) => {
  url.host = 'wordpress.com';
  if (typeof limitPathMatch === 'object' && limitPathMatch instanceof RegExp && !limitPathMatch.test(url.pathname)) {
    validLocales = []; // only rewrite to English.
  }
  url.pathname = prefix + url.pathname;
  if (validLocales.includes(localeSlug) && localeSlug !== 'en') {
    url.pathname = localeSlug + url.pathname;
  }
  return url;
};
const prefixOrSuffixLocalizedUrlPath = (validLocales = [], limitPathMatch = null, prefixOrSuffix) => (url, localeSlug) => {
  if (typeof limitPathMatch === 'object' && limitPathMatch instanceof RegExp) {
    if (!limitPathMatch.test(url.pathname)) {
      return url; // No rewriting if not matches the path.
    }
  }
  if (!validLocales.includes(localeSlug) || localeSlug === 'en') {
    return url;
  }
  if (prefixOrSuffix === 'prefix') {
    url.pathname = localeSlug + url.pathname;
  } else if (prefixOrSuffix === 'suffix') {
    // Make sure there's a slash between the path and the locale. Plus, if
    // the path has a trailing slash, add one after the suffix too.
    if (url.pathname.endsWith('/')) {
      url.pathname += localeSlug + '/';
    } else {
      url.pathname += '/' + localeSlug;
    }
  }
  return url;
};
const prefixLocalizedUrlPath = (validLocales = [], limitPathMatch = null) => (url, localeSlug) => {
  return prefixOrSuffixLocalizedUrlPath(validLocales, limitPathMatch, 'prefix')(url, localeSlug);
};
const suffixLocalizedUrlPath = (validLocales = [], limitPathMatch = null) => (url, localeSlug) => {
  return prefixOrSuffixLocalizedUrlPath(validLocales, limitPathMatch, 'suffix')(url, localeSlug);
};
const urlLocalizationMapping = {
  'wordpress.com/support/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .supportSiteLocales */ ._J),
  'wordpress.com/forums/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .forumLocales */ .BS),
  'wordpress.com/blog/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithBlog */ .Sc, /^\/blog\/?$/),
  'wordpress.com/go/': (url, localeSlug) => {
    // Rewrite non-home URLs (e.g. posts) only for Spanish, because that's
    // the only language into which we're currently translating content.
    const isHome = ['/go/', '/go'].includes(url.pathname);
    if (!isHome && 'es' !== localeSlug) {
      return url;
    }
    return prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithGoBlog */ .Cx)(url, localeSlug);
  },
  'wordpress.com/pricing/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesForPricePlans */ .Ws),
  'wordpress.com/tos/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW),
  'wordpress.com/wp-admin/': setLocalizedUrlHost('wordpress.com', _locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW),
  'wordpress.com/wp-login.php': setLocalizedUrlHost('wordpress.com', _locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW),
  'jetpack.com': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .jetpackComLocales */ .rh),
  'cloud.jetpack.com': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .jetpackComLocales */ .rh),
  'en.support.wordpress.com': setLocalizedWpComPath('/support', _locales__WEBPACK_IMPORTED_MODULE_4__/* .supportSiteLocales */ ._J),
  'en.blog.wordpress.com': setLocalizedWpComPath('/blog', _locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithBlog */ .Sc, /^\/$/),
  'apps.wordpress.com': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW),
  'en.forums.wordpress.com': setLocalizedWpComPath('/forums', _locales__WEBPACK_IMPORTED_MODULE_4__/* .forumLocales */ .BS),
  'automattic.com/privacy/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithPrivacyPolicy */ .S9),
  'automattic.com/cookies/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithCookiePolicy */ .K8),
  'wordpress.com/help/contact/': (url, localeSlug, isLoggedIn) => {
    if (isLoggedIn) {
      return url;
    }
    url.pathname = url.pathname.replace(/\/help\//, '/support/');
    return prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .supportSiteLocales */ ._J)(url, localeSlug);
  },
  'wordpress.com': (url, localeSlug) => {
    // Don't rewrite checkout and me URLs.
    if (/^\/(checkout|me)(\/|$)/.test(url.pathname)) {
      return url;
    }
    // Don't rewrite Calypso URLs that have the URL at the end.
    if (/\/([a-z0-9-]+\.)+[a-z]{2,}\/?$/.test(url.pathname)) {
      return url;
    }
    return prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW)(url, localeSlug);
  },
  'wordpress.com/theme/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW)(url, localeSlug);
  },
  'wordpress.com/themes/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW)(url, localeSlug);
  },
  'wordpress.com/plugins/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW)(url, localeSlug);
  },
  'wordpress.com/log-in/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : suffixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW)(url, localeSlug);
  },
  'wordpress.com/start/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : suffixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW)(url, localeSlug);
  },
  'wordpress.com/learn/': (url, localeSlug) => {
    const webinars = url.pathname.includes('/learn/webinars/');
    if (webinars && 'es' === localeSlug) {
      url.pathname = url.pathname.replace('/learn/webinars/', '/learn/es/webinars/');
      return url;
    }
    return suffixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithLearn */ .mt)(url, localeSlug);
  },
  'wordpress.com/plans/': (url, localeSlug, isLoggedIn) => {
    // if logged in, or url.pathname contains characters after `/plans/`, don't rewrite
    return isLoggedIn || url.pathname !== '/plans/' ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesForPricePlans */ .Ws)(url, localeSlug);
  },
  'wordpress.com/setup/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : suffixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .lW)(url, localeSlug);
  }
};
function hasTrailingSlash(urlString) {
  try {
    const url = new URL(String(urlString), INVALID_URL);
    return url.pathname.endsWith('/');
  } catch (e) {
    return false;
  }
}
function localizeUrl(fullUrl, locale = getDefaultLocale(), isLoggedIn = true, preserveTrailingSlashVariation = false) {
  let url;
  try {
    url = new URL(String(fullUrl), INVALID_URL);
  } catch (e) {
    return fullUrl;
  }

  // Ignore and passthrough /relative/urls that have no host specified
  if (url.origin === INVALID_URL) {
    return fullUrl;
  }

  // Let's unify the URL.
  url.protocol = 'https:';
  if (!url.pathname.endsWith('.php')) {
    // Essentially a trailingslashit.
    // We need to do this because the matching list is standardised to use
    // trailing slashes everywhere.
    // However, if the `preserveTrailingSlashVariation` option is enabled, we
    // remove the trailing slash at the end again, when appropriate.
    url.pathname = (url.pathname + '/').replace(/\/+$/, '/');
  }
  const firstPathSegment = url.pathname.substr(0, 1 + url.pathname.indexOf('/', 1));
  if ('en.wordpress.com' === url.host) {
    url.host = 'wordpress.com';
  }
  if ('/' + locale + '/' === firstPathSegment) {
    return fullUrl;
  }

  // Lookup is checked back to front.
  const lookup = [url.host, url.host + firstPathSegment, url.host + url.pathname];
  for (let i = lookup.length - 1; i >= 0; i--) {
    if (lookup[i] in urlLocalizationMapping) {
      const mapped = urlLocalizationMapping[lookup[i]](url, locale, isLoggedIn).href;
      if (!preserveTrailingSlashVariation) {
        return mapped;
      }
      try {
        const mappedUrl = new URL(mapped);
        if (!hasTrailingSlash(fullUrl)) {
          mappedUrl.pathname = mappedUrl.pathname.replace(/\/+$/, '');
        }
        return mappedUrl.href;
      } catch {
        return mapped;
      }
    }
  }

  // Nothing needed to be changed, just return it unmodified.
  return fullUrl;
}
function useLocalizeUrl() {
  const providerLocale = (0,_locale_context__WEBPACK_IMPORTED_MODULE_5__/* .useLocale */ .Ym)();
  return (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((fullUrl, locale, isLoggedIn, preserveTrailingSlashVariation) => {
    if (locale) {
      return localizeUrl(fullUrl, locale, isLoggedIn, preserveTrailingSlashVariation);
    }
    return localizeUrl(fullUrl, providerLocale, isLoggedIn, preserveTrailingSlashVariation);
  }, [providerLocale]);
}
const withLocalizeUrl = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.createHigherOrderComponent)(InnerComponent => {
  return props => {
    const localizeUrl = useLocalizeUrl();
    const innerProps = {
      ...props,
      localizeUrl
    };
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerComponent, innerProps);
  };
}, 'withLocalizeUrl');

/***/ }),

/***/ 540:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ interpolate)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(609);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tokenize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(935);


function getCloseIndex(openIndex, tokens) {
  const openToken = tokens[openIndex];
  let nestLevel = 0;
  for (let i = openIndex + 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.value === openToken.value) {
      if (token.type === 'componentOpen') {
        nestLevel++;
        continue;
      }
      if (token.type === 'componentClose') {
        if (nestLevel === 0) {
          return i;
        }
        nestLevel--;
      }
    }
  }
  // if we get this far, there was no matching close token
  throw new Error('Missing closing component token `' + openToken.value + '`');
}
function buildChildren(tokens, components) {
  let children = [];
  let openComponent;
  let openIndex;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'string') {
      children.push(token.value);
      continue;
    }
    // component node should at least be set
    if (components[token.value] === undefined) {
      throw new Error(`Invalid interpolation, missing component node: \`${token.value}\``);
    }
    // should be either ReactElement or null (both type "object"), all other types deprecated
    if (typeof components[token.value] !== 'object') {
      throw new Error(`Invalid interpolation, component node must be a ReactElement or null: \`${token.value}\``);
    }
    // we should never see a componentClose token in this loop
    if (token.type === 'componentClose') {
      throw new Error(`Missing opening component token: \`${token.value}\``);
    }
    if (token.type === 'componentOpen') {
      openComponent = components[token.value];
      openIndex = i;
      break;
    }
    // componentSelfClosing token
    children.push(components[token.value]);
    continue;
  }
  if (openComponent) {
    const closeIndex = getCloseIndex(openIndex, tokens);
    const grandChildTokens = tokens.slice(openIndex + 1, closeIndex);
    const grandChildren = buildChildren(grandChildTokens, components);
    const clonedOpenComponent = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(openComponent, {}, grandChildren);
    children.push(clonedOpenComponent);
    if (closeIndex < tokens.length - 1) {
      const siblingTokens = tokens.slice(closeIndex + 1);
      const siblings = buildChildren(siblingTokens, components);
      children = children.concat(siblings);
    }
  }
  children = children.filter(Boolean);
  if (children.length === 0) {
    return null;
  }
  if (children.length === 1) {
    return children[0];
  }
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, ...children);
}
function interpolate(options) {
  const {
    mixedString,
    components,
    throwErrors
  } = options;
  if (!components) {
    return mixedString;
  }
  if (typeof components !== 'object') {
    if (throwErrors) {
      throw new Error(`Interpolation Error: unable to process \`${mixedString}\` because components is not an object`);
    }
    return mixedString;
  }
  const tokens = (0,_tokenize__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(mixedString);
  try {
    return buildChildren(tokens, components);
  } catch (error) {
    if (throwErrors) {
      throw new Error(`Interpolation Error: unable to process \`${mixedString}\` because of error \`${error.message}\``);
    }
    return mixedString;
  }
}

/***/ }),

/***/ 935:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ tokenize)
/* harmony export */ });
function identifyToken(item) {
  // {{/example}}
  if (item.startsWith('{{/')) {
    return {
      type: 'componentClose',
      value: item.replace(/\W/g, '')
    };
  }
  // {{example /}}
  if (item.endsWith('/}}')) {
    return {
      type: 'componentSelfClosing',
      value: item.replace(/\W/g, '')
    };
  }
  // {{example}}
  if (item.startsWith('{{')) {
    return {
      type: 'componentOpen',
      value: item.replace(/\W/g, '')
    };
  }
  return {
    type: 'string',
    value: item
  };
}
function tokenize(mixedString) {
  const tokenStrings = mixedString.split(/(\{\{\/?\s*\w+\s*\/?\}\})/g); // split to components and strings
  return tokenStrings.map(identifyToken);
}

/***/ }),

/***/ 90:
/***/ ((module, exports, __webpack_require__) => {

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
  if ( true && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
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
   true && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
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
module.exports = __webpack_require__(869)(exports);
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

/***/ 869:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
  createDebug.humanize = __webpack_require__(437);
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
    function debug(...args) {
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

/***/ 609:
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ 491:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ 619:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ 723:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

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
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(776);

})();

window.EditingToolkit = __webpack_exports__;
/******/ })()
;