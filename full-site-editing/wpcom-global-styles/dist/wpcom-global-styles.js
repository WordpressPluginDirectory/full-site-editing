/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7266:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ compile)
/* harmony export */ });
/* harmony import */ var _tannin_postfix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5854);
/* harmony import */ var _tannin_evaluate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(730);



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
	var terms = (0,_tannin_postfix__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)( expression );

	return function( variables ) {
		return (0,_tannin_evaluate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)( terms, variables );
	};
}


/***/ }),

/***/ 730:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ evaluate)
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

/***/ 1184:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ pluralForms)
/* harmony export */ });
/* harmony import */ var _tannin_compile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7266);


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
	var evaluate = (0,_tannin_compile__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)( expression );

	return function( n ) {
		return +evaluate( { n: n } );
	};
}


/***/ }),

/***/ 5854:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ postfix)
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

/***/ 6668:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ sprintf)
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

/***/ 6744:
/***/ ((module) => {

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
/***/ ((__unused_webpack_module, exports) => {

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

/***/ 2699:
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

/***/ 4495:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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

/***/ 5079:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(212);
var common = __webpack_require__(4495);
var shaCommon = __webpack_require__(713);

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

/***/ 8032:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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

/***/ 7839:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var events = __webpack_require__(2699)
var inherits = __webpack_require__(1285)

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

/***/ 1612:
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 2131:
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 9561:
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

/***/ 9830:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Tannin)
/* harmony export */ });
/* harmony import */ var _tannin_plural_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1184);


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

			pf = (0,_tannin_plural_forms__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)( plural );
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

/***/ 1093:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6115);
/* harmony import */ var _automattic_data_stores__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7987);
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
  const plans = _automattic_data_stores__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z({
    coupon: undefined
  });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GlobalStylesModal);

/***/ }),

/***/ 7172:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ GlobalStylesNotices)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6115);
/* harmony import */ var _automattic_data_stores__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7987);
/* harmony import */ var _automattic_data_stores_src_plans_constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4703);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(4010);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(372);
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
const trackEvent = (eventName, isSiteEditor = true) => (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__/* .recordTracksEvent */ .jN)(eventName, {
  context: isSiteEditor ? 'site-editor' : 'post-editor',
  blog_id: wpcomGlobalStyles.wpcomBlogId
});
function GlobalStylesWarningNotice({
  plans
}) {
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
  const plans = _automattic_data_stores__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z({
    coupon: undefined
  });
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
  const plans = _automattic_data_stores__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z({
    coupon: undefined
  });
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
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/* exported __webpack_public_path__ */
/* global __webpack_public_path__ */

/**
 * Dynamically set WebPack's publicPath so that split assets can be found.
 * @see https://webpack.js.org/guides/public-path/#on-the-fly
 */
if ( true && window.wpcomGlobalStyles?.assetsUrl) {
  // eslint-disable-next-line no-global-assign
  __webpack_require__.p = window.wpcomGlobalStyles.assetsUrl;
}

/***/ }),

/***/ 6421:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const DEFAULT_STATE = {
  isModalVisible: true
};
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.registerStore)('automattic/wpcom-global-styles', {
  reducer: (state = DEFAULT_STATE, action) => {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ useCanvas)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ useGlobalStylesConfig)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ usePreview)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   jN: () => (/* reexport safe */ _tracks__WEBPACK_IMPORTED_MODULE_7__.jN)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports getPageViewParams, getMostRecentUrlPath */
// We use this module state to track url paths submitted to recordTracksPageView
// `lib/analytics/index.js` also reuses it for timing.record
let mostRecentUrlPath = null;

// pathCounter is used to keep track of the order of calypso_page_view Tracks events.
let pathCounter = 0;
if (true) {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   jN: () => (/* binding */ recordTracksEvent)
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
function createRandomId(randomBytesLength = 9) {
  if (false) {}
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
  if (false) {}
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
  if (true) {
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
  eventProperties = Object.fromEntries(Object.entries(eventProperties).filter(([, val]) => typeof val !== 'undefined'));
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
  const build_timestamp =  true && window.BUILD_TIMESTAMP;
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
  if ( true && window.location) {
    const urlParams = new URL(window.location.href).searchParams;
    const utmParamEntries = urlParams && Array.from(urlParams.entries()).filter(([key]) => key.startsWith('utm_'));
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
    if (true) {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports recordTrainTracksRender, recordTrainTracksInteract, getNewRailcarId */
/* harmony import */ var _tracks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9792);


function recordTrainTracksRender({
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
}) {
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
  }).forEach(([key, val]) => val !== undefined && (props[key] = val));
  recordTracksEvent('calypso_traintracks_render', props);
}
function recordTrainTracksInteract({
  railcarId,
  action
}) {
  recordTracksEvent('calypso_traintracks_interact', {
    railcar: railcarId,
    action
  });
}
function getNewRailcarId(suffix = 'recommendation') {
  return `${uuid().replace(/-/g, '')}-${suffix}`;
}

/***/ }),

/***/ 6209:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Module variables
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debug__WEBPACK_IMPORTED_MODULE_0___default()('calypso:analytics'));

/***/ }),

/***/ 1694:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony export default */
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9358);


/**
 * Whether Do Not Track is enabled in the user's browser.
 *
 * @returns true if Do Not Track is enabled in the user's browser.
 */
function getDoNotTrack() {
  const result = Boolean( true && (
  // Internet Explorer 11 uses window.doNotTrack rather than navigator.doNotTrack.
  // Safari 7.1.3+ uses window.doNotTrack rather than navigator.doNotTrack.
  // MDN ref: https://developer.mozilla.org/en-US/docs/Web/API/navigator/doNotTrack#Browser_compatibility
  window.doNotTrack === '1' || window.navigator && window.navigator.doNotTrack === '1'));
  debug(`Do Not Track: ${result}`);
  return result;
}

/***/ }),

/***/ 2552:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: () => (/* binding */ getTrackingPrefs)
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
const parseTrackingPrefs = (cookieV2, cookieV1, defaultPrefs = prefsDisallowAll) => {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ isCountryInGdprZone)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ isRegionInCcpaZone)
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
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

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

/***/ 9770:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// TODO: Revisit whether it is useful for the Desktop app to override the following properties:
// signup_url, login_url, logout_url and discover_logged_out_redirect_url

const config = {
  env: 'production',
  env_id: 'desktop',
  client_slug: 'desktop',
  readerFollowingSource: 'desktop',
  boom_analytics_key: 'desktop',
  google_recaptcha_site_key: '6LdoXcAUAAAAAM61KvdgP8xwnC19YuzAiOWn5Wtn'
};
const features = {
  desktop: true,
  'desktop-promo': false,
  'login/social-first': false,
  'sign-in-with-apple': false,
  // Note: there is also a sign-in-with-apple/redirect flag
  // that may/may not be relevant to override for the Desktop app.
  'signup/social': false,
  'signup/social-first': false,
  'login/magic-login': false,
  'bilmur-script': false
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data => {
  data = Object.assign(data, config);
  if (data.features) {
    data.features = Object.assign(data.features, features);
  }
  if (window.electron && window.electron.features) {
    data.features = Object.assign(data.features ?? {}, window.electron.features);
  }
  return data;
});

/***/ }),

/***/ 899:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _k: () => (/* binding */ isEnabled)
/* harmony export */ });
/* unused harmony exports isCalypsoLive, enabledFeatures, enable, disable */
/* harmony import */ var _automattic_create_calypso_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(544);
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3421);
/* harmony import */ var _desktop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9770);



/**
 * Manages config flags for various deployment builds
 *
 * @module config/index
 */
if (false) {}
if (!window.configData) {
  if (false) {}
  window.configData = {};
}
const isDesktop = window.electron !== undefined;
let configData;
if (isDesktop) {
  configData = (0,_desktop__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(window.configData);
} else {
  configData = window.configData;
}

// calypso.live matches
// hash-abcd1234.calypso.live matches
// calypso.live.com doesn't match
const CALYPSO_LIVE_REGEX = /^([a-zA-Z0-9-]+\.)?calypso\.live$/;

// check if the current browser location is *.calypso.live
function isCalypsoLive() {
  return  true && CALYPSO_LIVE_REGEX.test(window.location.host);
}
function applyFlags(flagsString, modificationMethod) {
  const flags = flagsString.split(',');
  flags.forEach(flagRaw => {
    const flag = flagRaw.replace(/^[-+]/, '');
    const enabled = !/^-/.test(flagRaw);
    if (configData.features) {
      configData.features[flag] = enabled;
      // eslint-disable-next-line no-console
      console.log('%cConfig flag %s via %s: %s', 'font-weight: bold;', enabled ? 'enabled' : 'disabled', modificationMethod, flag);
    }
  });
}
const flagEnvironments = ['wpcalypso', 'horizon', 'stage', 'jetpack-cloud-stage'];
if ( false || flagEnvironments.includes(configData.env_id) || isCalypsoLive()) {
  const cookies = cookie__WEBPACK_IMPORTED_MODULE_1__.parse(document.cookie);
  if (cookies.flags) {
    applyFlags(cookies.flags, 'cookie');
  }
  try {
    const session = window.sessionStorage.getItem('flags');
    if (session) {
      applyFlags(session, 'sessionStorage');
    }
  } catch (e) {
    // in private context, accessing session storage can throw
  }
  const match = document.location.search && document.location.search.match(/[?&]flags=([^&]+)(&|$)/);
  if (match) {
    applyFlags(decodeURIComponent(match[1]), 'URL');
  }
}
const configApi = (0,_automattic_create_calypso_config__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(configData);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (configApi)));
const isEnabled = configApi.isEnabled;
const enabledFeatures = configApi.enabledFeatures;
const enable = configApi.enable;
const disable = configApi.disable;

/***/ }),

/***/ 2006:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $N: () => (/* binding */ FEATURE_CANCELLATION_JETPACK_ESSENTIALS),
/* harmony export */   BS: () => (/* binding */ FEATURE_CANCELLATION_SFTP_AND_DATABASE),
/* harmony export */   E9: () => (/* binding */ FEATURE_CANCELLATION_PREMIUM_THEMES),
/* harmony export */   KG: () => (/* binding */ FEATURE_CANCELLATION_MANAGED_HOSTINGS),
/* harmony export */   NV: () => (/* binding */ FEATURE_CANCELLATION_SEO_TOOLS),
/* harmony export */   Ox: () => (/* binding */ FEATURE_CANCELLATION_EMAIL_SUPPORT),
/* harmony export */   ST: () => (/* binding */ FEATURE_CANCELLATION_SHIPPING_CARRIERS),
/* harmony export */   ZJ: () => (/* binding */ FEATURE_CANCELLATION_BACKUPS_AND_RESTORE),
/* harmony export */   Zs: () => (/* binding */ FEATURE_CANCELLATION_SECURITY_AND_SPAM),
/* harmony export */   _o: () => (/* binding */ FEATURE_CANCELLATION_SEO_AND_SOCIAL),
/* harmony export */   bh: () => (/* binding */ FEATURE_CANCELLATION_ACCEPT_PAYMENTS),
/* harmony export */   ec: () => (/* binding */ FEATURE_CANCELLATION_PREMIUM_DESIGN),
/* harmony export */   j_: () => (/* binding */ FEATURE_CANCELLATION_COLLECT_PAYMENTS),
/* harmony export */   kK: () => (/* binding */ FEATURE_CANCELLATION_LIVE_CHAT),
/* harmony export */   pF: () => (/* binding */ FEATURE_CANCELLATION_HIGH_QUALITY_VIDEOS),
/* harmony export */   pG: () => (/* binding */ FEATURE_CANCELLATION_EARN_AD_REVENUE),
/* harmony export */   qK: () => (/* binding */ FEATURE_CANCELLATION_GOOGLE_ANALYTICS),
/* harmony export */   vD: () => (/* binding */ FEATURE_CANCELLATION_AD_FREE_SITE),
/* harmony export */   yc: () => (/* binding */ FEATURE_CANCELLATION_PLUGINS)
/* harmony export */ });
/* unused harmony exports FEATURE_CANCELLATION_BACKUPS, FEATURE_CANCELLATION_UNLIMITED_TRAFFIC */
// Cancellation flow related features
const FEATURE_CANCELLATION_ACCEPT_PAYMENTS = 'cancellation-accept-payments';
const FEATURE_CANCELLATION_AD_FREE_SITE = 'cancellation-ad-free';
const FEATURE_CANCELLATION_BACKUPS = 'cancellation-backups';
const FEATURE_CANCELLATION_BACKUPS_AND_RESTORE = 'cancellation-backups-restore';
const FEATURE_CANCELLATION_COLLECT_PAYMENTS = 'cancellation-collect-payments';
const FEATURE_CANCELLATION_EARN_AD_REVENUE = 'cancellation-ad-revenue';
const FEATURE_CANCELLATION_EMAIL_SUPPORT = 'cancellation-email-support';
const FEATURE_CANCELLATION_GOOGLE_ANALYTICS = 'cancellation-google-analytics';
const FEATURE_CANCELLATION_HIGH_QUALITY_VIDEOS = 'cancellation-hq-videos';
const FEATURE_CANCELLATION_JETPACK_ESSENTIALS = 'cancellation-jetpack-essentials';
const FEATURE_CANCELLATION_LIVE_CHAT = 'cancellation-live-chat';
const FEATURE_CANCELLATION_MANAGED_HOSTINGS = 'cancellation-managed-hostings';
const FEATURE_CANCELLATION_PLUGINS = 'cancellation-plugins';
const FEATURE_CANCELLATION_PREMIUM_DESIGN = 'cancellation-premium-design';
const FEATURE_CANCELLATION_PREMIUM_THEMES = 'cancellation-premium-themes';
const FEATURE_CANCELLATION_SECURITY_AND_SPAM = 'cancellation-security-and-spam';
const FEATURE_CANCELLATION_SEO_TOOLS = 'cancellation-seo-tools';
const FEATURE_CANCELLATION_SEO_AND_SOCIAL = 'cancellation-seo-social';
const FEATURE_CANCELLATION_SFTP_AND_DATABASE = 'cancellation-sfpt-database';
const FEATURE_CANCELLATION_SHIPPING_CARRIERS = 'cancellation-shipping-carriers';
const FEATURE_CANCELLATION_UNLIMITED_TRAFFIC = 'cancellation-unlimited-traffic';

/***/ }),

/***/ 1862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $23: () => (/* binding */ FEATURE_SHIPPING_CARRIERS),
/* harmony export */   $4: () => (/* binding */ FEATURE_COLLECT_PAYMENTS_V2),
/* harmony export */   $G1: () => (/* binding */ FEATURE_CLOUDFLARE_ANALYTICS),
/* harmony export */   $NZ: () => (/* binding */ FEATURE_BLANK),
/* harmony export */   $PM: () => (/* binding */ FEATURE_BACKUP_STORAGE_SPACE_UNLIMITED),
/* harmony export */   $QL: () => (/* binding */ FEATURE_EASY_SITE_MIGRATION),
/* harmony export */   $iz: () => (/* binding */ FEATURE_AUTOMATED_SALES_TAXES),
/* harmony export */   $mN: () => (/* binding */ FEATURE_P2_3GB_STORAGE),
/* harmony export */   $pY: () => (/* binding */ FEATURE_JETPACK_BACKUP_T1_YEARLY),
/* harmony export */   $vg: () => (/* binding */ FEATURE_PREMIUM_CUSTOMIZABE_THEMES),
/* harmony export */   $xY: () => (/* binding */ FEATURE_ACCEPT_PAYMENTS),
/* harmony export */   AH6: () => (/* binding */ FEATURE_LIST_UNLIMITED_PRODUCTS),
/* harmony export */   ALM: () => (/* binding */ FEATURE_FREE_WORDPRESS_THEMES),
/* harmony export */   AQq: () => (/* binding */ FEATURE_MULTI_SITE),
/* harmony export */   ARL: () => (/* binding */ FEATURE_SYNC_WITH_PINTEREST),
/* harmony export */   AXh: () => (/* binding */ FEATURE_WOOCOMMERCE_MOBILE_APP),
/* harmony export */   Ai8: () => (/* binding */ FEATURE_BLOG_DOMAIN),
/* harmony export */   AvT: () => (/* binding */ FEATURE_JETPACK_SOCIAL_BASIC),
/* harmony export */   Ayy: () => (/* binding */ FEATURE_JETPACK_BOOST),
/* harmony export */   Azg: () => (/* binding */ FEATURE_JETPACK_BACKUP_T0_YEARLY),
/* harmony export */   B2h: () => (/* binding */ FEATURE_ADVANCED_SEO),
/* harmony export */   B4: () => (/* binding */ FEATURE_PLUGIN_AUTOUPDATE_JP),
/* harmony export */   BEQ: () => (/* binding */ FEATURE_GLOBAL_EDGE_CACHING),
/* harmony export */   BPG: () => (/* binding */ FEATURE_CDN),
/* harmony export */   Ce5: () => (/* binding */ FEATURE_OFFER_BULK_DISCOUNTS),
/* harmony export */   Cr_: () => (/* binding */ FEATURE_CART_ABANDONMENT_EMAILS),
/* harmony export */   Crh: () => (/* binding */ FEATURE_CUSTOM_MARKETING_AUTOMATION),
/* harmony export */   CtJ: () => (/* binding */ FEATURE_ANTISPAM_V2),
/* harmony export */   DEy: () => (/* binding */ WPCOM_FEATURES_BACKUPS),
/* harmony export */   DJ3: () => (/* binding */ FEATURE_JETPACK_CRM_MONTHLY),
/* harmony export */   DJK: () => (/* binding */ FEATURE_FREE_SSL_CERTIFICATE),
/* harmony export */   DU6: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_8),
/* harmony export */   DUl: () => (/* binding */ FEATURE_COMMISSION_FEE_STANDARD_FEATURES),
/* harmony export */   Do2: () => (/* binding */ FEATURE_ECOMMERCE_MARKETING),
/* harmony export */   DtS: () => (/* binding */ FEATURE_JETPACK_30_DAY_ARCHIVE_ACTIVITY_LOG),
/* harmony export */   DwI: () => (/* binding */ FEATURE_BACKUP_DAILY_V2),
/* harmony export */   E30: () => (/* binding */ FEATURE_ONE_CLICK_THREAT_RESOLUTION),
/* harmony export */   E5t: () => (/* binding */ FEATURE_13GB_STORAGE),
/* harmony export */   EBu: () => (/* binding */ FEATURE_MEMBERSHIPS),
/* harmony export */   EDT: () => (/* binding */ FEATURE_PREMIUM_CONTENT_BLOCK),
/* harmony export */   EZ7: () => (/* binding */ FEATURE_SECURITY_BRUTE_FORCE),
/* harmony export */   E_W: () => (/* binding */ FEATURE_INTERNATIONAL_PAYMENTS),
/* harmony export */   Eb2: () => (/* binding */ FEATURE_CUSTOM_DOMAIN),
/* harmony export */   Ej: () => (/* binding */ FEATURE_WORDADS_INSTANT),
/* harmony export */   F$l: () => (/* binding */ FEATURE_TRAFFIC_TOOLS),
/* harmony export */   FKL: () => (/* binding */ FEATURE_EXTENSIONS),
/* harmony export */   FNU: () => (/* binding */ WPCOM_FEATURES_ATOMIC),
/* harmony export */   FR0: () => (/* binding */ FEATURE_JETPACK_SCAN_DAILY_MONTHLY),
/* harmony export */   FZm: () => (/* binding */ FEATURE_SMART_REDIRECTS),
/* harmony export */   FiJ: () => (/* binding */ FEATURE_MANAGED_HOSTING),
/* harmony export */   GWM: () => (/* binding */ FEATURE_CUSTOM_STORE),
/* harmony export */   GwK: () => (/* binding */ FEATURE_JETPACK_VIDEOPRESS),
/* harmony export */   HBO: () => (/* binding */ FEATURE_UNLTD_SOCIAL_MEDIA_JP),
/* harmony export */   HPg: () => (/* binding */ FEATURE_EMAIL_FORWARDING_EXTENDED_LIMIT),
/* harmony export */   HXS: () => (/* binding */ FEATURE_RECURRING_PAYMENTS),
/* harmony export */   H_y: () => (/* binding */ FEATURE_CPUS),
/* harmony export */   Hdl: () => (/* binding */ FEATURE_BANDWIDTH),
/* harmony export */   HpB: () => (/* binding */ FEATURE_PRODUCT_BACKUP_REALTIME_V2),
/* harmony export */   Hrz: () => (/* binding */ FEATURE_REAL_TIME_ANALYTICS),
/* harmony export */   IhT: () => (/* binding */ FEATURE_EMAIL_LIVE_CHAT_SUPPORT_ALL_DAYS),
/* harmony export */   IxF: () => (/* binding */ FEATURE_STREAMLINED_CHECKOUT),
/* harmony export */   J8D: () => (/* binding */ FEATURE_PREMIUM_SUPPORT),
/* harmony export */   JQK: () => (/* binding */ FEATURE_WORDPRESS_CMS),
/* harmony export */   JRF: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_0_WOO),
/* harmony export */   JT_: () => (/* binding */ FEATURE_JETPACK_BOOST_BI_YEARLY),
/* harmony export */   JU8: () => (/* binding */ FEATURE_SELL_INTERNATIONALLY),
/* harmony export */   JqD: () => (/* binding */ FEATURE_P2_UNLIMITED_USERS),
/* harmony export */   KgS: () => (/* binding */ FEATURE_AUTOMATED_EMAIL_TRIGGERS),
/* harmony export */   KlX: () => (/* binding */ FEATURE_3GB_STORAGE),
/* harmony export */   L2R: () => (/* binding */ FEATURE_JETPACK_BACKUP_T2_MONTHLY),
/* harmony export */   L2_: () => (/* binding */ FEATURE_BACKUP_ARCHIVE_UNLIMITED),
/* harmony export */   LiS: () => (/* binding */ FEATURE_EMAIL_LIVE_CHAT_SUPPORT),
/* harmony export */   Ly9: () => (/* binding */ WPCOM_FEATURES_ANTISPAM),
/* harmony export */   MA1: () => (/* binding */ FEATURE_PREMIUM_THEMES_V2),
/* harmony export */   MBA: () => (/* binding */ FEATURE_STATS_JP),
/* harmony export */   MCU: () => (/* binding */ FEATURE_FREE_DOMAIN),
/* harmony export */   MRS: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_4),
/* harmony export */   MpJ: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_0),
/* harmony export */   Mrh: () => (/* binding */ FEATURE_JETPACK_SEARCH_BI_YEARLY),
/* harmony export */   N5t: () => (/* binding */ FEATURE_LIVE_CHAT_SUPPORT_BUSINESS_DAYS),
/* harmony export */   N64: () => (/* binding */ FEATURE_DISPLAY_PRODUCTS_BRAND),
/* harmony export */   NHK: () => (/* binding */ FEATURE_WOOCOMMERCE_STORE),
/* harmony export */   NtL: () => (/* binding */ FEATURE_SITE_ACTIVITY_LOG_JP),
/* harmony export */   NxG: () => (/* binding */ FEATURE_PRODUCT_ADD_ONS),
/* harmony export */   O05: () => (/* binding */ FEATURE_WOOCOMMERCE),
/* harmony export */   OFy: () => (/* binding */ FEATURE_NEWSLETTER_IMPORT_SUBSCRIBERS_FREE),
/* harmony export */   OJ1: () => (/* binding */ FEATURE_JETPACK_BACKUP_T0_MONTHLY),
/* harmony export */   OMq: () => (/* binding */ FEATURE_UNLIMITED_PRODUCTS),
/* harmony export */   PE6: () => (/* binding */ FEATURE_CHECKOUT),
/* harmony export */   PSd: () => (/* binding */ FEATURE_LIVE_SHIPPING_RATES),
/* harmony export */   PUy: () => (/* binding */ FEATURE_ALL_PREMIUM_FEATURES_JETPACK),
/* harmony export */   Pm5: () => (/* binding */ FEATURE_PREMIUM_STORE_THEMES),
/* harmony export */   Pnf: () => (/* binding */ FEATURE_SHIPPING_INTEGRATIONS),
/* harmony export */   Q1W: () => (/* binding */ FEATURE_FREE_BLOG_DOMAIN),
/* harmony export */   Q3C: () => (/* binding */ FEATURE_NO_BRANDING),
/* harmony export */   QNW: () => (/* binding */ FEATURE_VIDEO_UPLOADS_JETPACK_PRO),
/* harmony export */   QWL: () => (/* binding */ FEATURE_PROMOTE_ON_TIKTOK),
/* harmony export */   Q_7: () => (/* binding */ FEATURE_LTD_SOCIAL_MEDIA_JP),
/* harmony export */   QfP: () => (/* binding */ FEATURE_PREMIUM_THEMES),
/* harmony export */   R2o: () => (/* binding */ FEATURE_FREE_THEMES_SIGNUP),
/* harmony export */   R9R: () => (/* binding */ FEATURE_ISOLATED_INFRA),
/* harmony export */   RF_: () => (/* binding */ FEATURE_PAYPAL_JP),
/* harmony export */   Rp9: () => (/* binding */ FEATURE_AUTOMATED_RESTORES),
/* harmony export */   S9g: () => (/* binding */ FEATURE_MARKETING_AUTOMATION),
/* harmony export */   SH3: () => (/* binding */ FEATURE_JETPACK_SOCIAL_ADVANCED_BI_YEARLY),
/* harmony export */   SLH: () => (/* binding */ FEATURE_50GB_STORAGE),
/* harmony export */   SMt: () => (/* binding */ FEATURE_UPTIME_MONITOR_JP),
/* harmony export */   SZ6: () => (/* binding */ FEATURE_MONETISE),
/* harmony export */   S_M: () => (/* binding */ FEATURE_P2_13GB_STORAGE),
/* harmony export */   SoP: () => (/* binding */ FEATURE_EMAIL_MARKETING),
/* harmony export */   SsD: () => (/* binding */ FEATURE_UNLIMITED_ADMINS),
/* harmony export */   T$h: () => (/* binding */ FEATURE_JETPACK_ANTI_SPAM_MONTHLY),
/* harmony export */   T3v: () => (/* binding */ FEATURE_100GB_STORAGE_ADD_ON),
/* harmony export */   TBQ: () => (/* binding */ FEATURE_JETPACK_BACKUP_DAILY_MONTHLY),
/* harmony export */   TFL: () => (/* binding */ FEATURE_SHARES_SOCIAL_MEDIA_JP),
/* harmony export */   TNr: () => (/* binding */ FEATURE_STORE_DESIGN),
/* harmony export */   TZT: () => (/* binding */ FEATURE_JETPACK_BACKUP_REALTIME_MONTHLY),
/* harmony export */   TaL: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_0_ALL),
/* harmony export */   Tez: () => (/* binding */ FEATURE_LIVE_CHAT_SUPPORT),
/* harmony export */   Tmz: () => (/* binding */ FEATURE_UPLOAD_THEMES),
/* harmony export */   Tsj: () => (/* binding */ FEATURE_FAST_DNS),
/* harmony export */   Tx8: () => (/* binding */ FEATURE_EARN_AD),
/* harmony export */   UAg: () => (/* binding */ FEATURE_BURST),
/* harmony export */   UQo: () => (/* binding */ FEATURE_SELL_60_COUNTRIES),
/* harmony export */   U_2: () => (/* binding */ FEATURE_COMMUNITY_SUPPORT),
/* harmony export */   Uwp: () => (/* binding */ FEATURE_ALL_FREE_FEATURES),
/* harmony export */   V09: () => (/* binding */ FEATURE_INSTALL_PLUGINS),
/* harmony export */   V1I: () => (/* binding */ FEATURE_JETPACK_SCAN_DAILY),
/* harmony export */   V1k: () => (/* binding */ FEATURE_JETPACK_BACKUP_DAILY),
/* harmony export */   V37: () => (/* binding */ FEATURE_SPAM_AKISMET_PLUS),
/* harmony export */   VOS: () => (/* binding */ FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY),
/* harmony export */   VUF: () => (/* binding */ FEATURE_INVENTORY_MGMT),
/* harmony export */   VWq: () => (/* binding */ FEATURE_BULK_DISCOUNTS),
/* harmony export */   VZW: () => (/* binding */ FEATURE_JETPACK_PRODUCT_BACKUP),
/* harmony export */   Vhs: () => (/* binding */ FEATURE_UNLIMITED_EMAILS),
/* harmony export */   Vml: () => (/* binding */ FEATURE_SIMPLE_PAYMENTS),
/* harmony export */   Vms: () => (/* binding */ FEATURE_GOOGLE_ANALYTICS),
/* harmony export */   VyO: () => (/* binding */ FEATURE_ALL_PERSONAL_FEATURES),
/* harmony export */   W4b: () => (/* binding */ FEATURE_6GB_STORAGE),
/* harmony export */   Wa6: () => (/* binding */ FEATURE_STOCK_NOTIFS),
/* harmony export */   Ws3: () => (/* binding */ FEATURE_DISCOUNTED_SHIPPING),
/* harmony export */   Wxo: () => (/* binding */ FEATURE_WAF_V2),
/* harmony export */   X2I: () => (/* binding */ FEATURE_PLAN_SECURITY_DAILY),
/* harmony export */   XMd: () => (/* binding */ FEATURE_AUDIO_UPLOADS),
/* harmony export */   XZZ: () => (/* binding */ FEATURE_P2_SIMPLE_SEARCH),
/* harmony export */   XgZ: () => (/* binding */ FEATURE_PRODUCT_SCAN_REALTIME_V2),
/* harmony export */   Xif: () => (/* binding */ FEATURE_UNLIMITED_PRODUCTS_SERVICES),
/* harmony export */   Xk_: () => (/* binding */ FEATURE_NO_ADS),
/* harmony export */   XzA: () => (/* binding */ FEATURE_COMMISSION_FEE_WOO_FEATURES),
/* harmony export */   YPm: () => (/* binding */ FEATURE_DEV_TOOLS),
/* harmony export */   Yg_: () => (/* binding */ FEATURE_ABANDONED_CART_RECOVERY),
/* harmony export */   YmK: () => (/* binding */ FEATURE_WAF),
/* harmony export */   Z5U: () => (/* binding */ FEATURE_ALL_PREMIUM_FEATURES),
/* harmony export */   ZTn: () => (/* binding */ FEATURE_STATS_PAID),
/* harmony export */   ZY2: () => (/* binding */ FEATURE_JETPACK_1_YEAR_ARCHIVE_ACTIVITY_LOG),
/* harmony export */   ZaE: () => (/* binding */ FEATURE_GROUP_PAYMENT_TRANSACTION_FEES),
/* harmony export */   Zaf: () => (/* binding */ FEATURE_1GB_STORAGE),
/* harmony export */   Zjz: () => (/* binding */ FEATURE_REPUBLICIZE),
/* harmony export */   _3A: () => (/* binding */ FEATURE_SITE_BACKUPS_AND_RESTORE),
/* harmony export */   _Ms: () => (/* binding */ FEATURE_SITE_STAGING_SITES),
/* harmony export */   _U0: () => (/* binding */ FEATURE_MARKETPLACE_SYNC_SOCIAL_MEDIA_INTEGRATION),
/* harmony export */   _Z$: () => (/* binding */ FEATURE_50GB_STORAGE_ADD_ON),
/* harmony export */   _lW: () => (/* binding */ FEATURE_GOOGLE_ANALYTICS_V3),
/* harmony export */   _po: () => (/* binding */ FEATURE_DATACENTRE_FAILOVER),
/* harmony export */   _sL: () => (/* binding */ FEATURE_OFFSITE_BACKUP_VAULTPRESS_REALTIME),
/* harmony export */   _sk: () => (/* binding */ FEATURE_JETPACK_BACKUP_T1_BI_YEARLY),
/* harmony export */   _vQ: () => (/* binding */ FEATURE_CLOUD_CRITICAL_CSS),
/* harmony export */   a9c: () => (/* binding */ FEATURE_PAGES),
/* harmony export */   aWA: () => (/* binding */ FEATURE_MIN_MAX_QTY),
/* harmony export */   afj: () => (/* binding */ FEATURE_PRODUCT_BACKUP_DAILY_V2),
/* harmony export */   alN: () => (/* binding */ FEATURE_STYLE_CUSTOMIZATION),
/* harmony export */   alZ: () => (/* binding */ FEATURE_PLUGINS_THEMES),
/* harmony export */   bA$: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_2),
/* harmony export */   bHF: () => (/* binding */ FEATURE_P2_UNLIMITED_POSTS_PAGES),
/* harmony export */   bJv: () => (/* binding */ FEATURE_P2_PRIORITY_CHAT_EMAIL_SUPPORT),
/* harmony export */   bcr: () => (/* binding */ FEATURE_WP_UPDATES),
/* harmony export */   bp9: () => (/* binding */ FEATURE_WORDPRESS_MOBILE_APP),
/* harmony export */   bsv: () => (/* binding */ FEATURE_JETPACK_BOOST_MONTHLY),
/* harmony export */   c$s: () => (/* binding */ FEATURE_LIST_PRODUCTS_BY_BRAND),
/* harmony export */   c74: () => (/* binding */ FEATURE_JETPACK_ADVANCED),
/* harmony export */   cFx: () => (/* binding */ FEATURE_REALTIME_BACKUPS_JP),
/* harmony export */   cMD: () => (/* binding */ FEATURE_COLLECT_PAYMENTS_LINK_IN_BIO),
/* harmony export */   cTd: () => (/* binding */ FEATURE_PRODUCT_RECOMMENDATIONS),
/* harmony export */   cWM: () => (/* binding */ FEATURE_SFTP_DATABASE),
/* harmony export */   c__: () => (/* binding */ FEATURE_UNLIMITED_TRAFFIC),
/* harmony export */   cdC: () => (/* binding */ FEATURE_PRODUCT_BUNDLES),
/* harmony export */   csF: () => (/* binding */ FEATURE_BACKUP_REALTIME_V2),
/* harmony export */   dXP: () => (/* binding */ FEATURE_BEAUTIFUL_THEMES),
/* harmony export */   dZ$: () => (/* binding */ FEATURE_PRODUCT_SEARCH_V2),
/* harmony export */   dmM: () => (/* binding */ FEATURE_EMAIL_LIVE_CHAT_SUPPORT_BUSINESS_DAYS),
/* harmony export */   eqi: () => (/* binding */ FEATURE_ES_SEARCH_JP),
/* harmony export */   ewW: () => (/* binding */ FEATURE_JETPACK_SEARCH_MONTHLY),
/* harmony export */   fDA: () => (/* binding */ FEATURE_TITAN_EMAIL),
/* harmony export */   fgK: () => (/* binding */ FEATURE_BACK_IN_STOCK_NOTIFICATIONS),
/* harmony export */   fhe: () => (/* binding */ FEATURE_EMAIL_SUPPORT_SIGNUP),
/* harmony export */   fp6: () => (/* binding */ PREMIUM_DESIGN_FOR_STORES),
/* harmony export */   gI6: () => (/* binding */ FEATURE_200GB_STORAGE),
/* harmony export */   gRD: () => (/* binding */ FEATURE_MANAGE),
/* harmony export */   gRh: () => (/* binding */ FEATURE_CONNECT_WITH_FACEBOOK),
/* harmony export */   ggN: () => (/* binding */ FEATURE_GOOGLE_MY_BUSINESS),
/* harmony export */   ghB: () => (/* binding */ FEATURE_DONATIONS_AND_TIPS_JP),
/* harmony export */   gqo: () => (/* binding */ FEATURE_JETPACK_ESSENTIAL),
/* harmony export */   hH1: () => (/* binding */ FEATURE_SOCIAL_MEDIA_TOOLS),
/* harmony export */   hOf: () => (/* binding */ FEATURE_INTEGRATED_SHIPMENT_TRACKING),
/* harmony export */   hSm: () => (/* binding */ FEATURE_CONTACT_FORM_JP),
/* harmony export */   hsL: () => (/* binding */ FEATURE_PRINT_SHIPPING_LABELS),
/* harmony export */   i9T: () => (/* binding */ FEATURE_ADVERTISE_ON_GOOGLE),
/* harmony export */   iC0: () => (/* binding */ FEATURE_P2_VIDEO_SHARING),
/* harmony export */   iC1: () => (/* binding */ FEATURE_JETPACK_SOCIAL_BASIC_MONTHLY),
/* harmony export */   iRs: () => (/* binding */ FEATURE_USERS),
/* harmony export */   iTE: () => (/* binding */ FEATURE_VIDEO_UPLOADS),
/* harmony export */   iW8: () => (/* binding */ FEATURE_PREMIUM_CONTENT_JP),
/* harmony export */   igx: () => (/* binding */ FEATURE_ALL_FREE_FEATURES_JETPACK),
/* harmony export */   ikw: () => (/* binding */ WPCOM_FEATURES_SCAN),
/* harmony export */   ixG: () => (/* binding */ FEATURE_RECOMMEND_ADD_ONS),
/* harmony export */   j8V: () => (/* binding */ FEATURE_PAID_SUBSCRIBERS_JP),
/* harmony export */   jDM: () => (/* binding */ FEATURE_FREE_THEMES),
/* harmony export */   jY: () => (/* binding */ FEATURE_ASSEMBLED_KITS),
/* harmony export */   jby: () => (/* binding */ FEATURE_SUPPORT_EMAIL),
/* harmony export */   kI: () => (/* binding */ FEATURE_ALL_BUSINESS_FEATURES),
/* harmony export */   lRt: () => (/* binding */ FEATURE_WORDADS),
/* harmony export */   lYf: () => (/* binding */ FEATURE_JETPACK_ALL_BACKUP_SECURITY_FEATURES),
/* harmony export */   liF: () => (/* binding */ FEATURE_JETPACK_CRM),
/* harmony export */   ljn: () => (/* binding */ FEATURE_ADVANCED_SEO_TOOLS),
/* harmony export */   lv3: () => (/* binding */ FEATURE_JETPACK_SEARCH),
/* harmony export */   m1c: () => (/* binding */ FEATURE_AUTOMATIC_SECURITY_FIXES),
/* harmony export */   mFq: () => (/* binding */ FEATURE_CUSTOM_ORDER_EMAILS),
/* harmony export */   mX4: () => (/* binding */ FEATURE_JETPACK_BACKUP_T1_MONTHLY),
/* harmony export */   n$d: () => (/* binding */ FEATURE_ACTIVITY_LOG_1_YEAR_V2),
/* harmony export */   n26: () => (/* binding */ WPCOM_FEATURES_INSTALL_PURCHASED_PLUGINS),
/* harmony export */   n2c: () => (/* binding */ FEATURE_JETPACK_SOCIAL_BASIC_BI_YEARLY),
/* harmony export */   nCh: () => (/* binding */ FEATURE_ONE_CLICK_RESTORE_V2),
/* harmony export */   nIy: () => (/* binding */ FEATURE_INVENTORY),
/* harmony export */   nLo: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_2_REGULAR),
/* harmony export */   nWg: () => (/* binding */ FEATURE_SELL_EGIFTS_AND_VOUCHERS),
/* harmony export */   nXV: () => (/* binding */ FEATURE_VIDEOPRESS_JP),
/* harmony export */   n_S: () => (/* binding */ FEATURE_EMAIL_SUPPORT),
/* harmony export */   nl4: () => (/* binding */ FEATURE_UNLIMITED_SUBSCRIBERS),
/* harmony export */   nsi: () => (/* binding */ FEATURE_BACKUP_ARCHIVE_30),
/* harmony export */   oIe: () => (/* binding */ FEATURE_PRODUCT_SCAN_DAILY_V2),
/* harmony export */   oTu: () => (/* binding */ FEATURE_SELL_SHIP),
/* harmony export */   okS: () => (/* binding */ FEATURE_SEO_PREVIEW_TOOLS),
/* harmony export */   ops: () => (/* binding */ FEATURE_P2_ACTIVITY_OVERVIEW),
/* harmony export */   p1e: () => (/* binding */ FEATURE_PAYMENT_BUTTONS_JP),
/* harmony export */   p8y: () => (/* binding */ FEATURE_AUTOMATIC_SALES_TAX),
/* harmony export */   pOV: () => (/* binding */ FEATURE_AD_FREE_EXPERIENCE),
/* harmony export */   pgw: () => (/* binding */ FEATURE_DYNAMIC_UPSELLS),
/* harmony export */   puh: () => (/* binding */ FEATURE_JETPACK_1TB_BACKUP_STORAGE),
/* harmony export */   q4V: () => (/* binding */ FEATURE_HOSTING),
/* harmony export */   q6z: () => (/* binding */ FEATURE_SPAM_JP),
/* harmony export */   qC: () => (/* binding */ FEATURE_SEO_JP),
/* harmony export */   qbT: () => (/* binding */ FEATURE_SECURITY_MALWARE),
/* harmony export */   qpv: () => (/* binding */ FEATURE_MIN_MAX_ORDER_QUANTITY),
/* harmony export */   r$c: () => (/* binding */ FEATURE_INTEGRATED_PAYMENTS),
/* harmony export */   rDn: () => (/* binding */ FEATURE_CRM_V2),
/* harmony export */   rV5: () => (/* binding */ FEATURE_JETPACK_VIDEOPRESS_BI_YEARLY),
/* harmony export */   rdd: () => (/* binding */ FEATURE_P2_MORE_FILE_TYPES),
/* harmony export */   rlg: () => (/* binding */ FEATURE_SITE_STATS),
/* harmony export */   rli: () => (/* binding */ FEATURE_ADVANCED_DESIGN_CUSTOMIZATION),
/* harmony export */   s$V: () => (/* binding */ FEATURE_PAYMENT_TRANSACTION_FEES_10),
/* harmony export */   s1f: () => (/* binding */ FEATURE_OFFSITE_BACKUP_VAULTPRESS_DAILY),
/* harmony export */   s2V: () => (/* binding */ FEATURE_THE_READER),
/* harmony export */   s4b: () => (/* binding */ FEATURE_JETPACK_BACKUP_REALTIME),
/* harmony export */   sGT: () => (/* binding */ FEATURE_JETPACK_SOCIAL_ADVANCED),
/* harmony export */   sHn: () => (/* binding */ FEATURE_SECURITY_DDOS),
/* harmony export */   sKk: () => (/* binding */ FEATURE_GIFT_CARDS),
/* harmony export */   sQp: () => (/* binding */ FEATURE_JETPACK_PRODUCT_VIDEOPRESS),
/* harmony export */   sTW: () => (/* binding */ FEATURE_JETPACK_SOCIAL_ADVANCED_MONTHLY),
/* harmony export */   sYz: () => (/* binding */ FEATURE_WP_SUBDOMAIN_SIGNUP),
/* harmony export */   tP7: () => (/* binding */ FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN),
/* harmony export */   tS0: () => (/* binding */ FEATURE_JETPACK_BACKUP_T2_YEARLY),
/* harmony export */   uT1: () => (/* binding */ FEATURE_NEWSLETTERS_RSS),
/* harmony export */   vEX: () => (/* binding */ FEATURE_UPLOAD_THEMES_PLUGINS),
/* harmony export */   vQ$: () => (/* binding */ FEATURE_MALWARE_SCANNING_DAILY_AND_ON_DEMAND),
/* harmony export */   vcd: () => (/* binding */ FEATURE_POST_EDITS_HISTORY),
/* harmony export */   vje: () => (/* binding */ FEATURE_P2_CUSTOMIZATION_OPTIONS),
/* harmony export */   vkU: () => (/* binding */ FEATURE_LIVE_CHAT_SUPPORT_ALL_DAYS),
/* harmony export */   vqo: () => (/* binding */ FEATURE_ADVANCED_SEO_EXPANDED_ABBR),
/* harmony export */   w6W: () => (/* binding */ FEATURE_JETPACK_VIDEOPRESS_MONTHLY),
/* harmony export */   w7L: () => (/* binding */ FEATURE_SCAN_V2),
/* harmony export */   wJ_: () => (/* binding */ FEATURE_WP_SUBDOMAIN),
/* harmony export */   wUt: () => (/* binding */ FEATURE_ACTIVITY_LOG),
/* harmony export */   wwD: () => (/* binding */ FEATURE_STANDARD_SECURITY_TOOLS),
/* harmony export */   x_7: () => (/* binding */ FEATURE_PAYMENT_BLOCKS),
/* harmony export */   xjj: () => (/* binding */ FEATURE_UPLOAD_PLUGINS),
/* harmony export */   xlk: () => (/* binding */ FEATURE_JETPACK_REAL_TIME_MALWARE_SCANNING),
/* harmony export */   xrd: () => (/* binding */ FEATURE_LOYALTY_PROG),
/* harmony export */   y03: () => (/* binding */ FEATURE_ACCEPT_PAYMENTS_V2),
/* harmony export */   y4L: () => (/* binding */ FEATURE_ADD_UNLIMITED_LINKS),
/* harmony export */   y8T: () => (/* binding */ FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION),
/* harmony export */   yjN: () => (/* binding */ FEATURE_P2_ADVANCED_SEARCH),
/* harmony export */   yjx: () => (/* binding */ FEATURE_ACCEPT_LOCAL_PAYMENTS),
/* harmony export */   zB_: () => (/* binding */ FEATURE_ALWAYS_ONLINE),
/* harmony export */   zQV: () => (/* binding */ FEATURE_MALWARE_SCANNING_DAILY),
/* harmony export */   zh5: () => (/* binding */ FEATURE_SALES_REPORTS),
/* harmony export */   zrQ: () => (/* binding */ FEATURE_JETPACK_ANTI_SPAM)
/* harmony export */ });
/* unused harmony exports FEATURE_SET_PRIMARY_CUSTOM_DOMAIN, FEATURE_LEGACY_STORAGE_200GB, FEATURE_UNLIMITED_STORAGE, FEATURE_SFTP, FEATURE_SSH, FEATURE_VIDEO_UPLOADS_JETPACK_PREMIUM, FEATURE_INSTALL_THEMES, FEATURE_PERFORMANCE, FEATURE_ALL_PERSONAL_FEATURES_JETPACK, FEATURE_DONATIONS, FEATURE_PREMIUM_CONTENT_CONTAINER, FEATURE_SECURITY_SETTINGS, FEATURE_WOOP, FEATURE_PERSONAL_THEMES, FEATURE_STATS_FREE, FEATURE_SEARCH, FEATURE_SEARCH_V2, FEATURE_VIDEO_HOSTING_V2, FEATURE_CRM_INTEGRATED_WITH_WORDPRESS, FEATURE_CRM_LEADS_AND_FUNNEL, FEATURE_CRM_PROPOSALS_AND_INVOICES, FEATURE_CRM_TRACK_TRANSACTIONS, FEATURE_CRM_NO_CONTACT_LIMITS, FEATURE_SECURE_STORAGE_V2, FEATURE_ONE_CLICK_FIX_V2, FEATURE_INSTANT_EMAIL_V2, FEATURE_AKISMET_V2, FEATURE_SPAM_BLOCK_V2, FEATURE_SPAM_10K_PER_MONTH, FEATURE_FILTERING_V2, FEATURE_LANGUAGE_SUPPORT_V2, FEATURE_SPELLING_CORRECTION_V2, FEATURE_SUPPORTS_WOOCOMMERCE_V2, FEATURE_JETPACK_SCAN_BI_YEARLY, FEATURE_JETPACK_VIDEOPRESS_EDITOR, FEATURE_JETPACK_VIDEOPRESS_STORAGE, FEATURE_JETPACK_VIDEOPRESS_UNBRANDED, FEATURE_SOCIAL_SHARES_1000, FEATURE_SOCIAL_ENHANCED_PUBLISHING, FEATURE_SOCIAL_MASTODON_CONNECTION, FEATURE_SOCIAL_INSTAGRAM_CONNECTION, FEATURE_SOCIAL_NEXTDOOR_CONNECTION, FEATURE_JETPACK_MONITOR_MONTHLY, FEATURE_JETPACK_MONITOR_YEARLY, FEATURE_MONITOR_1_MINUTE_CHECK_INTERVAL, FEATURE_MONITOR_MULTIPLE_EMAIL_RECIPIENTS, FEATURE_MONITOR_SMS_NOTIFICATIONS, FEATURE_JETPACK_1GB_BACKUP_STORAGE, FEATURE_JETPACK_10GB_BACKUP_STORAGE, FEATURE_JETPACK_REAL_TIME_CLOUD_BACKUPS, FEATURE_UNLIMITED_USERS, FEATURE_UNLIMITED_POSTS_PAGES, FEATURE_ADDITIONAL_SITES, WPCOM_FEATURES_AI_ASSISTANT, WPCOM_FEATURES_AKISMET, WPCOM_FEATURES_BACKUPS_RESTORE, WPCOM_FEATURES_CDN, WPCOM_FEATURES_CLASSIC_SEARCH, WPCOM_FEATURES_CLOUDFLARE_CDN, WPCOM_FEATURES_COPY_SITE, WPCOM_FEATURES_FULL_ACTIVITY_LOG, WPCOM_FEATURES_INSTALL_PLUGINS, WPCOM_FEATURES_INSTANT_SEARCH, WPCOM_FEATURES_LIVE_SUPPORT, WPCOM_FEATURES_MANAGE_PLUGINS, WPCOM_FEATURES_NO_ADVERTS, WPCOM_FEATURES_NO_WPCOM_BRANDING, WPCOM_FEATURES_PREMIUM_THEMES, WPCOM_FEATURES_PRIORITY_SUPPORT, WPCOM_FEATURES_REAL_TIME_BACKUPS, WPCOM_FEATURES_SEO_PREVIEW_TOOLS, WPCOM_FEATURES_SUBSCRIPTION_GIFTING, WPCOM_FEATURES_LOCKED_MODE, WPCOM_FEATURES_LEGACY_CONTACT, WPCOM_FEATURES_UPLOAD_AUDIO_FILES, WPCOM_FEATURES_UPLOAD_PLUGINS, WPCOM_FEATURES_UPLOAD_VIDEO_FILES, WPCOM_FEATURES_VAULTPRESS_BACKUPS, WPCOM_FEATURES_VIDEOPRESS, WPCOM_FEATURES_VIDEOPRESS_UNLIMITED_STORAGE, WPCOM_FEATURES_VIDEO_HOSTING, WPCOM_FEATURES_WORDADS, WPCOM_FEATURES_CUSTOM_DESIGN, WPCOM_FEATURES_GLOBAL_STYLES, WPCOM_FEATURES_SITE_PREVIEW_LINKS, FEATURE_IMPORT_SUBSCRIBERS, FEATURE_ADD_MULTIPLE_PAGES_NEWSLETTER, FEATURE_COLLECT_PAYMENTS_NEWSLETTER, FEATURE_POST_BY_EMAIL, FEATURE_GOOGLE_ANALYTICS_V2, FEATURE_CUSTOMIZE_THEMES_BUTTONS_COLORS, FEATURE_TRACK_VIEWS_CLICKS, FEATURE_DESIGN_TOOLS, FEATURE_REFERRAL_PROGRAMS, FEATURE_CUSTOMER_BIRTHDAY_EMAILS, FEATURE_LOYALTY_POINTS_PROGRAMS, FEATURE_ASSEMBLED_PRODUCTS_AND_KITS, FEATURE_BRUTE_PROTECT_JP, FEATURE_AUTOMATTIC_DATACENTER_FAILOVER, WPCOM_STORAGE_ADD_ONS, FEATURE_CUSTOM_PRODUCT_KITS */
/* harmony import */ var _jetpack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(892);

const FEATURE_WP_SUBDOMAIN = 'wordpress-subdomain';
const FEATURE_BLOG_DOMAIN = 'blog-domain';
const FEATURE_CUSTOM_DOMAIN = 'custom-domain';
const FEATURE_SET_PRIMARY_CUSTOM_DOMAIN = 'set-primary-custom-domain';
const FEATURE_JETPACK_ESSENTIAL = 'jetpack-essential';
const FEATURE_JETPACK_ADVANCED = 'jetpack-advanced';
const FEATURE_FREE_THEMES = 'free-themes';
const FEATURE_1GB_STORAGE = '1gb-storage';
const FEATURE_3GB_STORAGE = '3gb-storage';
const FEATURE_6GB_STORAGE = '6gb-storage';
const FEATURE_13GB_STORAGE = '13gb-storage';
const FEATURE_50GB_STORAGE = '50gb-storage';
const FEATURE_200GB_STORAGE = '200gb-storage';
const FEATURE_LEGACY_STORAGE_200GB = 'upload-space-200gb';
const FEATURE_UNLIMITED_STORAGE = 'unlimited-storage';
const FEATURE_COMMUNITY_SUPPORT = 'community-support';
const FEATURE_EMAIL_SUPPORT = 'email-support';
const FEATURE_EMAIL_LIVE_CHAT_SUPPORT = 'email-live-chat-support';
const FEATURE_EMAIL_LIVE_CHAT_SUPPORT_BUSINESS_DAYS = 'email-live-chat-support-business-days';
const FEATURE_EMAIL_LIVE_CHAT_SUPPORT_ALL_DAYS = 'email-live-chat-support-all-days';
const FEATURE_LIVE_CHAT_SUPPORT_ALL_DAYS = 'live-chat-support-all-days';
const FEATURE_LIVE_CHAT_SUPPORT_BUSINESS_DAYS = 'live-chat-support-business-days';
const FEATURE_EMAIL_FORWARDING_EXTENDED_LIMIT = 'email-forwarding-extended-limit';
const FEATURE_PREMIUM_SUPPORT = 'priority-support';
const FEATURE_GOOGLE_ANALYTICS = 'google-analytics';
const FEATURE_CLOUDFLARE_ANALYTICS = 'cloudflare-analytics';
const FEATURE_GOOGLE_MY_BUSINESS = 'google-my-business';
const FEATURE_SFTP = 'sftp';
const FEATURE_SSH = 'ssh';
const FEATURE_SITE_STAGING_SITES = 'staging-sites';
const FEATURE_LIVE_CHAT_SUPPORT = 'live-chat-support';
const FEATURE_NO_ADS = 'no-adverts';
const FEATURE_VIDEO_UPLOADS = 'video-upload';
const FEATURE_VIDEO_UPLOADS_JETPACK_PREMIUM = 'video-upload-jetpack-premium';
const FEATURE_VIDEO_UPLOADS_JETPACK_PRO = 'video-upload-jetpack-pro';
const FEATURE_AUDIO_UPLOADS = 'audio-upload';
const FEATURE_WORDADS_INSTANT = 'wordads-instant';
const FEATURE_NO_BRANDING = 'no-wp-branding';
const FEATURE_ADVANCED_SEO = 'advanced-seo';
const FEATURE_UPLOAD_PLUGINS = 'upload-plugins';
const FEATURE_INSTALL_PLUGINS = 'install-plugins';
const FEATURE_INSTALL_THEMES = 'install-themes';
const FEATURE_UPLOAD_THEMES = 'upload-themes';
const FEATURE_PERFORMANCE = 'performance';
const FEATURE_REPUBLICIZE = 'republicize';
const FEATURE_SIMPLE_PAYMENTS = 'simple-payments';
const FEATURE_ALL_FREE_FEATURES = 'all-free-features';
const FEATURE_ALL_FREE_FEATURES_JETPACK = 'all-free-features-jetpack';
const FEATURE_ALL_PERSONAL_FEATURES = 'all-personal-features';
const FEATURE_ALL_PERSONAL_FEATURES_JETPACK = 'all-personal-features-jetpack';
const FEATURE_ALL_PREMIUM_FEATURES = 'all-premium-features';
const FEATURE_ALL_PREMIUM_FEATURES_JETPACK = 'all-premium-features-jetpack';
const FEATURE_ADVANCED_DESIGN_CUSTOMIZATION = 'advanced-design-customization';
const FEATURE_UPLOAD_THEMES_PLUGINS = 'upload-themes-and-plugins';
const FEATURE_FREE_DOMAIN = 'free-custom-domain';
const FEATURE_FREE_BLOG_DOMAIN = 'free-blog-domain';
const FEATURE_EMAIL_SUPPORT_SIGNUP = 'email-support-signup';
const FEATURE_MONETISE = 'monetise-your-site';
const FEATURE_EARN_AD = 'earn-ad-revenue';
const FEATURE_WP_SUBDOMAIN_SIGNUP = 'wordpress-subdomain-signup';
const FEATURE_ADVANCED_SEO_TOOLS = 'advanced-seo-tools';
const FEATURE_ADVANCED_SEO_EXPANDED_ABBR = 'advanced-seo-expanded-abbreviation';
const FEATURE_FREE_THEMES_SIGNUP = 'free-themes-signup';
const FEATURE_MEMBERSHIPS = 'memberships';
const FEATURE_DONATIONS = 'donations';
const FEATURE_RECURRING_PAYMENTS = 'recurring-payments';
// This is a legacy alias, FEATURE_PREMIUM_CONTENT_CONTAINER should be used instead.
const FEATURE_PREMIUM_CONTENT_BLOCK = 'premium-content-block';
const FEATURE_PREMIUM_CONTENT_CONTAINER = 'premium-content/container';
const FEATURE_HOSTING = 'hosting';
const PREMIUM_DESIGN_FOR_STORES = 'premium-design-for-stores';
const FEATURE_SFTP_DATABASE = 'sftp-and-database-access';
const FEATURE_SITE_BACKUPS_AND_RESTORE = 'site-backups-and-restore';
const FEATURE_SECURITY_SETTINGS = 'security-settings';
const FEATURE_WOOP = 'woop';
const FEATURE_PREMIUM_THEMES = 'unlimited-premium-themes';
const FEATURE_PERSONAL_THEMES = 'personal-themes';
const FEATURE_STATS_PAID = 'stats-paid';
const FEATURE_STATS_FREE = 'stats-free';

// Jetpack features constants
const FEATURE_BLANK = 'blank-feature';
const FEATURE_STANDARD_SECURITY_TOOLS = 'standard-security-tools';
const FEATURE_SITE_STATS = 'site-stats';
const FEATURE_TRAFFIC_TOOLS = 'traffic-tools';
const FEATURE_MANAGE = 'jetpack-manage';
const FEATURE_SPAM_AKISMET_PLUS = 'spam-akismet-plus';
const FEATURE_OFFSITE_BACKUP_VAULTPRESS_DAILY = 'offsite-backup-vaultpress-daily';
const FEATURE_OFFSITE_BACKUP_VAULTPRESS_REALTIME = 'offsite-backup-vaultpress-realtime';
const FEATURE_BACKUP_ARCHIVE_30 = 'backup-archive-30';
const FEATURE_BACKUP_ARCHIVE_UNLIMITED = 'backup-archive-unlimited';
const FEATURE_BACKUP_STORAGE_SPACE_UNLIMITED = 'backup-storage-space-unlimited';
const FEATURE_AUTOMATED_RESTORES = 'automated-restores';
const FEATURE_EASY_SITE_MIGRATION = 'easy-site-migration';
const FEATURE_MALWARE_SCANNING_DAILY = 'malware-scanning-daily';
const FEATURE_MALWARE_SCANNING_DAILY_AND_ON_DEMAND = 'malware-scanning-daily-and-on-demand';
const FEATURE_ONE_CLICK_THREAT_RESOLUTION = 'one-click-threat-resolution';
const FEATURE_AUTOMATIC_SECURITY_FIXES = 'automatic-security-fixes';
const FEATURE_ACTIVITY_LOG = 'site-activity-log';
const FEATURE_FREE_WORDPRESS_THEMES = 'free-wordpress-themes';
const FEATURE_SEO_PREVIEW_TOOLS = 'seo-preview-tools';
const FEATURE_SEARCH = 'search';
const FEATURE_ACCEPT_PAYMENTS = 'accept-payments';
const FEATURE_SHIPPING_CARRIERS = 'shipping-carriers';
const FEATURE_UNLIMITED_PRODUCTS_SERVICES = 'unlimited-products-service';
const FEATURE_ECOMMERCE_MARKETING = 'ecommerce-marketing';
const FEATURE_PREMIUM_CUSTOMIZABE_THEMES = 'premium-customizable-themes';
const FEATURE_ALL_BUSINESS_FEATURES = 'all-business-features';
const FEATURE_BACKUP_DAILY_V2 = 'backup-daily-v2';
const FEATURE_BACKUP_REALTIME_V2 = 'backup-realtime-v2';
const FEATURE_PRODUCT_BACKUP_DAILY_V2 = 'product-backup-daily-v2';
const FEATURE_PRODUCT_BACKUP_REALTIME_V2 = 'product-backup-realtime-v2';
const FEATURE_SCAN_V2 = 'scan-v2';
const FEATURE_PRODUCT_SCAN_DAILY_V2 = 'product-scan-daily-v2';
const FEATURE_PRODUCT_SCAN_REALTIME_V2 = 'product-scan-realtime-v2';
const FEATURE_ANTISPAM_V2 = 'antispam-v2';
const FEATURE_WAF = 'waf';
const FEATURE_ACTIVITY_LOG_1_YEAR_V2 = 'activity-log-1-year-v2';
const FEATURE_SEARCH_V2 = 'search-v2';
const FEATURE_PRODUCT_SEARCH_V2 = 'product-search-v2';
const FEATURE_PLAN_SECURITY_DAILY = 'security-daily';
const FEATURE_VIDEO_HOSTING_V2 = 'video-hosting-v2';
const FEATURE_CRM_V2 = 'crm-v2';
const FEATURE_CRM_INTEGRATED_WITH_WORDPRESS = 'crm-integrated-with-wordpress';
const FEATURE_CRM_LEADS_AND_FUNNEL = 'crm-leads-and-funnel';
const FEATURE_CRM_PROPOSALS_AND_INVOICES = 'crm-proposals-and-invoices';
const FEATURE_CRM_TRACK_TRANSACTIONS = 'crm-track-transactions';
const FEATURE_CRM_NO_CONTACT_LIMITS = 'crm-no-contact-limits';
const FEATURE_COLLECT_PAYMENTS_V2 = 'collect-payments-v2';
const FEATURE_SECURE_STORAGE_V2 = 'secure-storage-v2';
const FEATURE_ONE_CLICK_RESTORE_V2 = 'one-click-restore-v2';
const FEATURE_ONE_CLICK_FIX_V2 = 'one-click-fix-v2';
const FEATURE_INSTANT_EMAIL_V2 = 'instant-email-v2';
const FEATURE_AKISMET_V2 = 'akismet-v2';
const FEATURE_SPAM_BLOCK_V2 = 'spam-block-v2';
const FEATURE_SPAM_10K_PER_MONTH = 'spam-block-10k';
const FEATURE_FILTERING_V2 = 'filtering-v2';
const FEATURE_LANGUAGE_SUPPORT_V2 = 'language-support-v2';
const FEATURE_SPELLING_CORRECTION_V2 = 'spelling-correction-v2';
const FEATURE_SUPPORTS_WOOCOMMERCE_V2 = 'supports-woocommerce-v2';
const FEATURE_JETPACK_BACKUP_DAILY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_DAILY */ .K$;
const FEATURE_JETPACK_BACKUP_DAILY_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY */ .Sj;
const FEATURE_JETPACK_BACKUP_REALTIME = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_REALTIME */ .JD;
const FEATURE_JETPACK_BACKUP_REALTIME_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY */ .AY;
const FEATURE_JETPACK_BACKUP_T0_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_T0_YEARLY */ .OH;
const FEATURE_JETPACK_BACKUP_T0_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_T0_MONTHLY */ .Tp;
const FEATURE_JETPACK_BACKUP_T1_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_T1_YEARLY */ .oe;
const FEATURE_JETPACK_BACKUP_T1_BI_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_T1_BI_YEARLY */ .QZ;
const FEATURE_JETPACK_BACKUP_T1_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_T1_MONTHLY */ .rx;
const FEATURE_JETPACK_BACKUP_T2_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_T2_YEARLY */ .EI;
const FEATURE_JETPACK_BACKUP_T2_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BACKUP_T2_MONTHLY */ .uL;
const FEATURE_JETPACK_SCAN_BI_YEARLY = (/* unused pure expression or super */ null && (PRODUCT_JETPACK_SCAN_BI_YEARLY));
const FEATURE_JETPACK_SCAN_DAILY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SCAN */ .pE;
const FEATURE_JETPACK_SCAN_DAILY_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SCAN_MONTHLY */ .sY;
const FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_ANTI_SPAM_BI_YEARLY */ .aG;
const FEATURE_JETPACK_ANTI_SPAM = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_ANTI_SPAM */ .Sm;
const FEATURE_JETPACK_ANTI_SPAM_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_ANTI_SPAM_MONTHLY */ .PF;
const FEATURE_JETPACK_SEARCH_BI_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SEARCH_BI_YEARLY */ .Eh;
const FEATURE_JETPACK_SEARCH = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SEARCH */ .DH;
const FEATURE_JETPACK_SEARCH_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SEARCH_MONTHLY */ .XG;
const FEATURE_JETPACK_VIDEOPRESS_BI_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_VIDEOPRESS_BI_YEARLY */ .vT;
const FEATURE_JETPACK_VIDEOPRESS = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_VIDEOPRESS */ .nN;
const FEATURE_JETPACK_VIDEOPRESS_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_VIDEOPRESS_MONTHLY */ .qH;
const FEATURE_JETPACK_VIDEOPRESS_EDITOR = 'jetpack-videopress-editor';
const FEATURE_JETPACK_VIDEOPRESS_STORAGE = 'jetpack-videopress-storage';
const FEATURE_JETPACK_VIDEOPRESS_UNBRANDED = 'jetpack-videopress-unbranded';
const FEATURE_JETPACK_CRM = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_CRM */ .Ve;
const FEATURE_JETPACK_CRM_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_CRM_MONTHLY */ .vM;
const FEATURE_JETPACK_BOOST_BI_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BOOST_BI_YEARLY */ .sA;
const FEATURE_JETPACK_BOOST = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BOOST */ .GA;
const FEATURE_JETPACK_BOOST_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_BOOST_MONTHLY */ .SZ;
const FEATURE_CLOUD_CRITICAL_CSS = 'cloud-critical-css';
const FEATURE_JETPACK_SOCIAL_ADVANCED_BI_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY */ .XP;
const FEATURE_JETPACK_SOCIAL_ADVANCED = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SOCIAL_ADVANCED */ .Im;
const FEATURE_JETPACK_SOCIAL_ADVANCED_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY */ .EV;
const FEATURE_JETPACK_SOCIAL_BASIC_BI_YEARLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY */ .Td;
const FEATURE_JETPACK_SOCIAL_BASIC = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SOCIAL_BASIC */ .cc;
const FEATURE_JETPACK_SOCIAL_BASIC_MONTHLY = _jetpack__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY */ .E9;
const FEATURE_SOCIAL_SHARES_1000 = 'social-shares-1000';
const FEATURE_SOCIAL_ENHANCED_PUBLISHING = 'social-enhanced-publishing';
const FEATURE_SOCIAL_MASTODON_CONNECTION = 'social-mastodon-connection';
const FEATURE_SOCIAL_INSTAGRAM_CONNECTION = 'social-instagram-connection';
const FEATURE_SOCIAL_NEXTDOOR_CONNECTION = 'social-nextdoor-connection';
const FEATURE_JETPACK_MONITOR_MONTHLY = (/* unused pure expression or super */ null && (PRODUCT_JETPACK_MONITOR_MONTHLY));
const FEATURE_JETPACK_MONITOR_YEARLY = (/* unused pure expression or super */ null && (PRODUCT_JETPACK_MONITOR_YEARLY));
const FEATURE_MONITOR_1_MINUTE_CHECK_INTERVAL = 'monitor-1-minute-check-interval';
const FEATURE_MONITOR_MULTIPLE_EMAIL_RECIPIENTS = 'monitor-multiple-email-recipients';
const FEATURE_MONITOR_SMS_NOTIFICATIONS = 'monitor-sms-notifications';

// Jetpack tiered product features
const FEATURE_JETPACK_1GB_BACKUP_STORAGE = 'jetpack-1gb-backup-storage';
const FEATURE_JETPACK_10GB_BACKUP_STORAGE = 'jetpack-10gb-backup-storage';
const FEATURE_JETPACK_1TB_BACKUP_STORAGE = 'jetpack-1tb-backup-storage';
const FEATURE_JETPACK_1_YEAR_ARCHIVE_ACTIVITY_LOG = 'jetpack-1-year-archive-activity-log';
const FEATURE_JETPACK_30_DAY_ARCHIVE_ACTIVITY_LOG = 'jetpack-30-day-archive-activity-log';
const FEATURE_JETPACK_REAL_TIME_CLOUD_BACKUPS = 'jetpack-real-time-cloud-backups';
const FEATURE_JETPACK_REAL_TIME_MALWARE_SCANNING = 'jetpack-real-time-malware-scanning';
const FEATURE_JETPACK_PRODUCT_BACKUP = 'jetpack-product-backup';
const FEATURE_JETPACK_PRODUCT_VIDEOPRESS = 'jetpack-product-videopress';
const FEATURE_JETPACK_ALL_BACKUP_SECURITY_FEATURES = 'jetpack-all-backup-security-features';

// P2 project features
const FEATURE_P2_3GB_STORAGE = 'p2-3gb-storage';
const FEATURE_P2_UNLIMITED_USERS = 'p2-unlimited-users';
const FEATURE_P2_UNLIMITED_POSTS_PAGES = 'p2-unlimited-posts-pages';
const FEATURE_P2_SIMPLE_SEARCH = 'p2-simple-search';
const FEATURE_P2_CUSTOMIZATION_OPTIONS = 'p2-customization-options';
const FEATURE_P2_13GB_STORAGE = 'p2-13gb-storage';
const FEATURE_P2_ADVANCED_SEARCH = 'p2-advanced-search';
const FEATURE_P2_VIDEO_SHARING = 'p2-video-sharing';
const FEATURE_P2_MORE_FILE_TYPES = 'p2-more-file-types';
const FEATURE_P2_PRIORITY_CHAT_EMAIL_SUPPORT = 'p2-priority-chat-email-support';
const FEATURE_P2_ACTIVITY_OVERVIEW = 'p2-activity-overview';

// New features Flexible and Pro plans introduced.
const FEATURE_MANAGED_HOSTING = 'managed-hosting';
const FEATURE_UNLIMITED_TRAFFIC = 'unlimited-traffic';
const FEATURE_UNLIMITED_USERS = 'unlimited-users';
const FEATURE_UNLIMITED_POSTS_PAGES = 'unlimited-posts-pages';
const FEATURE_PAYMENT_BLOCKS = 'payment-blocks';
const FEATURE_TITAN_EMAIL = 'titan-email';
const FEATURE_UNLIMITED_ADMINS = 'unlimited-admins';
const FEATURE_ADDITIONAL_SITES = 'additional-sites';
const FEATURE_WOOCOMMERCE = 'woocommerce';
const FEATURE_SOCIAL_MEDIA_TOOLS = 'social-media-tools';

// From class-wpcom-features.php in WPCOM
const WPCOM_FEATURES_AI_ASSISTANT = 'ai-assistant';
const WPCOM_FEATURES_AKISMET = 'akismet';
const WPCOM_FEATURES_ANTISPAM = 'antispam';
const WPCOM_FEATURES_ATOMIC = 'atomic';
const WPCOM_FEATURES_BACKUPS = 'backups';
const WPCOM_FEATURES_BACKUPS_RESTORE = 'restore';
const WPCOM_FEATURES_CDN = 'cdn';
const WPCOM_FEATURES_CLASSIC_SEARCH = 'search';
const WPCOM_FEATURES_CLOUDFLARE_CDN = 'cloudflare-cdn';
const WPCOM_FEATURES_COPY_SITE = 'copy-site';
const WPCOM_FEATURES_FULL_ACTIVITY_LOG = 'full-activity-log';
const WPCOM_FEATURES_INSTALL_PLUGINS = 'install-plugins';
const WPCOM_FEATURES_INSTALL_PURCHASED_PLUGINS = 'install-purchased-plugins';
const WPCOM_FEATURES_INSTANT_SEARCH = 'instant-search';
const WPCOM_FEATURES_LIVE_SUPPORT = 'live_support';
const WPCOM_FEATURES_MANAGE_PLUGINS = 'manage-plugins';
const WPCOM_FEATURES_NO_ADVERTS = 'no-adverts/no-adverts.php';
const WPCOM_FEATURES_NO_WPCOM_BRANDING = 'no-wpcom-branding';
const WPCOM_FEATURES_PREMIUM_THEMES = 'premium-themes';
const WPCOM_FEATURES_PRIORITY_SUPPORT = 'priority_support';
const WPCOM_FEATURES_REAL_TIME_BACKUPS = 'real-time-backups';
const WPCOM_FEATURES_SCAN = 'scan';
const WPCOM_FEATURES_SEO_PREVIEW_TOOLS = 'seo-preview-tools';
const WPCOM_FEATURES_SUBSCRIPTION_GIFTING = 'subscription-gifting';
const WPCOM_FEATURES_LOCKED_MODE = 'locked-mode';
const WPCOM_FEATURES_LEGACY_CONTACT = 'legacy-contact';
const WPCOM_FEATURES_UPLOAD_AUDIO_FILES = 'upload-audio-files';
const WPCOM_FEATURES_UPLOAD_PLUGINS = 'upload-plugins';
const WPCOM_FEATURES_UPLOAD_VIDEO_FILES = 'upload-video-files';
const WPCOM_FEATURES_VAULTPRESS_BACKUPS = 'vaultpress-backups';
const WPCOM_FEATURES_VIDEOPRESS = 'videopress';
const WPCOM_FEATURES_VIDEOPRESS_UNLIMITED_STORAGE = 'videopress-unlimited-storage';
const WPCOM_FEATURES_VIDEO_HOSTING = 'video-hosting';
const WPCOM_FEATURES_WORDADS = 'wordads';
const WPCOM_FEATURES_CUSTOM_DESIGN = 'custom-design';
const WPCOM_FEATURES_GLOBAL_STYLES = 'global-styles';
const WPCOM_FEATURES_SITE_PREVIEW_LINKS = 'site-preview-links';

// Signup flow related features
const FEATURE_UNLIMITED_EMAILS = 'unlimited-emails';
const FEATURE_UNLIMITED_SUBSCRIBERS = 'unlimited-subscribers';
const FEATURE_IMPORT_SUBSCRIBERS = 'import-subscribers';
const FEATURE_ADD_MULTIPLE_PAGES_NEWSLETTER = 'add-multiple-pages-newsletter';
const FEATURE_AD_FREE_EXPERIENCE = 'ad-free-experience';
const FEATURE_COLLECT_PAYMENTS_NEWSLETTER = 'collect-payments-newsletter';
const FEATURE_POST_BY_EMAIL = 'post-by-email';
const FEATURE_REAL_TIME_ANALYTICS = 'real-time-analytics';
const FEATURE_GOOGLE_ANALYTICS_V2 = 'google-analytics-v2';
const FEATURE_ADD_UNLIMITED_LINKS = 'add-unlimited-links';
const FEATURE_CUSTOMIZE_THEMES_BUTTONS_COLORS = 'customize-themes-buttons-colors';
const FEATURE_TRACK_VIEWS_CLICKS = 'track-views-clicks';
const FEATURE_COLLECT_PAYMENTS_LINK_IN_BIO = 'collect-payments-link-in-bio';
const FEATURE_NEWSLETTER_IMPORT_SUBSCRIBERS_FREE = 'newsletter-import-subscribers-free';
const FEATURE_PAYMENT_TRANSACTION_FEES_10 = 'payment-transaction-fees-10';
const FEATURE_PAYMENT_TRANSACTION_FEES_8 = 'payment-transaction-fees-8';
const FEATURE_PAYMENT_TRANSACTION_FEES_4 = 'payment-transaction-fees-4';
const FEATURE_PAYMENT_TRANSACTION_FEES_2 = 'payment-transaction-fees-2';
const FEATURE_PAYMENT_TRANSACTION_FEES_0 = 'payment-transaction-fees-0';
const FEATURE_PAYMENT_TRANSACTION_FEES_0_WOO = 'payment-transaction-fees-0-woo';
const FEATURE_PAYMENT_TRANSACTION_FEES_0_ALL = 'payment-transaction-fees-0-all';
const FEATURE_PAYMENT_TRANSACTION_FEES_2_REGULAR = 'payment-transaction-fees-2-regular';
const FEATURE_GROUP_PAYMENT_TRANSACTION_FEES = 'payment-transaction-fees-group';
const FEATURE_COMMISSION_FEE_STANDARD_FEATURES = 'payment-commission-fee-standard';
const FEATURE_COMMISSION_FEE_WOO_FEATURES = 'payment-commission-fee-woo';
const FEATURE_THE_READER = 'the-reader';

// Pricing Grid 2023 Features
const FEATURE_BEAUTIFUL_THEMES = 'beautiful-themes';
const FEATURE_PAGES = 'pages-v1';
const FEATURE_USERS = 'users-v1';
const FEATURE_NEWSLETTERS_RSS = 'newsletter-rss';
const FEATURE_POST_EDITS_HISTORY = 'post-edits-history';
const FEATURE_SECURITY_BRUTE_FORCE = 'security-brute-force';
const FEATURE_SMART_REDIRECTS = 'smart-redirects';
const FEATURE_ALWAYS_ONLINE = 'always-online';
const FEATURE_FAST_DNS = 'fast-dns';
const FEATURE_STYLE_CUSTOMIZATION = 'style-customization';
const FEATURE_SUPPORT_EMAIL = 'support-email-v1';
const FEATURE_DESIGN_TOOLS = 'design-tools';
const FEATURE_PREMIUM_THEMES_V2 = 'premium-themes-v2';
const FEATURE_WORDADS = 'wordads-v2';
const FEATURE_PLUGINS_THEMES = 'plugins-themes-v1';
const FEATURE_BANDWIDTH = 'bandwidth-v1';
const FEATURE_BURST = 'burst-v1';
const FEATURE_WAF_V2 = 'waf-v2';
const FEATURE_CDN = 'cdn-v1';
const FEATURE_CPUS = 'cpus-v1';
const FEATURE_DATACENTRE_FAILOVER = 'datacentre-failover';
const FEATURE_ISOLATED_INFRA = 'isolated-infra';
const FEATURE_SECURITY_MALWARE = 'security-malware';
const FEATURE_SECURITY_DDOS = 'security-ddos';
const FEATURE_DEV_TOOLS = 'dev-tools';
const FEATURE_WP_UPDATES = 'wp-updates';
const FEATURE_MULTI_SITE = 'multi-site';
const FEATURE_SELL_SHIP = 'sell-ship';
const FEATURE_SELL_INTERNATIONALLY = 'sell-internationally';
const FEATURE_AUTOMATIC_SALES_TAX = 'automatic-sales-tax';
const FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN = 'automated-backups-security-scan';
const FEATURE_INTEGRATED_SHIPMENT_TRACKING = 'integrated-shipment-tracking';
const FEATURE_SELL_EGIFTS_AND_VOUCHERS = 'sell-e-gifts-and-vouchers';
const FEATURE_EMAIL_MARKETING = 'email-marketing';
const FEATURE_MARKETPLACE_SYNC_SOCIAL_MEDIA_INTEGRATION = 'marketplace-sync-social-media-integration';
const FEATURE_BACK_IN_STOCK_NOTIFICATIONS = 'back-in-stock-notifications';
const FEATURE_MARKETING_AUTOMATION = 'marketing-automation';
const FEATURE_AUTOMATED_EMAIL_TRIGGERS = 'automated-email-triggers';
const FEATURE_CART_ABANDONMENT_EMAILS = 'cart-abandonment-emails';
const FEATURE_REFERRAL_PROGRAMS = 'referral-programs';
const FEATURE_CUSTOMER_BIRTHDAY_EMAILS = 'customer-birthday-emails';
const FEATURE_LOYALTY_POINTS_PROGRAMS = 'loyalty-points-programs';
const FEATURE_OFFER_BULK_DISCOUNTS = 'offer-bulk-discounts';
const FEATURE_RECOMMEND_ADD_ONS = 'recommend-add-ons';
const FEATURE_ASSEMBLED_PRODUCTS_AND_KITS = 'assembled-products-and-kits';
const FEATURE_MIN_MAX_ORDER_QUANTITY = 'min-max-order-quantity';
const FEATURE_CUSTOM_STORE = 'custom-store';
const FEATURE_INVENTORY = 'inventory';
const FEATURE_CHECKOUT = 'checkout-v1';
const FEATURE_ACCEPT_PAYMENTS_V2 = 'accept-payments-v2';
const FEATURE_SALES_REPORTS = 'sales-reports';
const FEATURE_EXTENSIONS = 'extensions-v1';
const FEATURE_STATS_JP = 'stats-jp';
const FEATURE_SPAM_JP = 'spam-jp';
const FEATURE_LTD_SOCIAL_MEDIA_JP = 'ltd-social-media-jp';
const FEATURE_SHARES_SOCIAL_MEDIA_JP = 'shares-social-media-jp';
const FEATURE_CONTACT_FORM_JP = 'contact-form-jp';
const FEATURE_PAID_SUBSCRIBERS_JP = 'paid-subscribers-jp';
const FEATURE_VIDEOPRESS_JP = 'videopress-jp';
const FEATURE_UNLTD_SOCIAL_MEDIA_JP = 'unltd-social-media-jp';
const FEATURE_SEO_JP = 'seo-jp';
const FEATURE_BRUTE_PROTECT_JP = 'brute-protect-jp';
const FEATURE_REALTIME_BACKUPS_JP = 'realtime-backups-jp';
const FEATURE_UPTIME_MONITOR_JP = 'uptime-monitor-jp';
const FEATURE_GLOBAL_EDGE_CACHING = 'global-edge-caching';
const FEATURE_ES_SEARCH_JP = 'es-search-jp';
const FEATURE_PLUGIN_AUTOUPDATE_JP = 'plugin-autoupdate-jp';
const FEATURE_PREMIUM_CONTENT_JP = 'premium-content-jp';
const FEATURE_SITE_ACTIVITY_LOG_JP = 'site-activity-log-jp';
const FEATURE_DONATIONS_AND_TIPS_JP = 'donations-and-tips-jp';
const FEATURE_PAYPAL_JP = 'payments-paypal-jp';
const FEATURE_PAYMENT_BUTTONS_JP = 'payment-buttons-jp';
const FEATURE_AUTOMATTIC_DATACENTER_FAILOVER = 'automattic-datacenter-fail-over';
const FEATURE_PREMIUM_STORE_THEMES = 'premium-store-themes';
const FEATURE_STORE_DESIGN = 'store-design';
const FEATURE_UNLIMITED_PRODUCTS = 'unlimited-products';
const FEATURE_DISPLAY_PRODUCTS_BRAND = 'display-products-brand';
const FEATURE_PRODUCT_ADD_ONS = 'product-add-ons';
const FEATURE_ASSEMBLED_KITS = 'assembled-kits';
const FEATURE_MIN_MAX_QTY = 'min-max-qty';
const FEATURE_STOCK_NOTIFS = 'stock-notifs';
const FEATURE_DYNAMIC_UPSELLS = 'dynamic-upsells';
const FEATURE_LOYALTY_PROG = 'loyalty-prog';
const FEATURE_CUSTOM_MARKETING_AUTOMATION = 'custom-marketing-automation';
const FEATURE_BULK_DISCOUNTS = 'bulk-discounts';
const FEATURE_INVENTORY_MGMT = 'inventory-mgmt';
const FEATURE_STREAMLINED_CHECKOUT = 'streamlined-checkout';
const FEATURE_SELL_60_COUNTRIES = 'sell-60-countries';
const FEATURE_SHIPPING_INTEGRATIONS = 'shipping-integrations';
const FEATURE_50GB_STORAGE_ADD_ON = '50gb-storage-add-on';
const FEATURE_100GB_STORAGE_ADD_ON = '100gb-storage-add-on';
const WPCOM_STORAGE_ADD_ONS = [FEATURE_50GB_STORAGE_ADD_ON, FEATURE_100GB_STORAGE_ADD_ON];

// Woo Express Features
const FEATURE_WOOCOMMERCE_STORE = 'woocommerce-store'; // WooCommerce store
const FEATURE_WOOCOMMERCE_MOBILE_APP = 'woocommerce-mobile-app'; // WooCommerce mobile app
const FEATURE_WORDPRESS_CMS = 'wordpress-cms'; // WordPress CMS
const FEATURE_WORDPRESS_MOBILE_APP = 'wordpress-mobile-app'; // WordPress mobile app
const FEATURE_FREE_SSL_CERTIFICATE = 'free-ssl-certificate'; // Free SSL certificate
const FEATURE_GOOGLE_ANALYTICS_V3 = 'google-analytics-v3'; // Google Analytics
const FEATURE_LIST_UNLIMITED_PRODUCTS = 'list-unlimited-products'; // List unlimited products
const FEATURE_GIFT_CARDS = 'gift-cards'; // Gift cards
const FEATURE_PRODUCT_BUNDLES = 'product-bundles'; // Product bundles
const FEATURE_CUSTOM_PRODUCT_KITS = 'custom-product-kits'; // Custom product kits
const FEATURE_LIST_PRODUCTS_BY_BRAND = 'list-products-by-brand'; // List products by brand
const FEATURE_PRODUCT_RECOMMENDATIONS = 'product-recommendations'; // Product recommendations
const FEATURE_INTEGRATED_PAYMENTS = 'integrated-payments'; // Integrated payments
const FEATURE_INTERNATIONAL_PAYMENTS = 'international-payments'; // International payments
const FEATURE_AUTOMATED_SALES_TAXES = 'automated-sales-taxes'; // Automated sales taxes
const FEATURE_ACCEPT_LOCAL_PAYMENTS = 'accept-local-payments'; // Accept local payments
const FEATURE_PROMOTE_ON_TIKTOK = 'promote-on-tiktok'; // Promote on TikTok
const FEATURE_SYNC_WITH_PINTEREST = 'sync-with-pinterest'; // Sync with Pinterest
const FEATURE_CONNECT_WITH_FACEBOOK = 'connect-with-facebook'; // Connect with Facebook
const FEATURE_ABANDONED_CART_RECOVERY = 'abandoned-cart-recovery'; // Abandoned cart recovery
const FEATURE_ADVERTISE_ON_GOOGLE = 'advertise-on-google'; // Advertise on Google
const FEATURE_CUSTOM_ORDER_EMAILS = 'custom-order-emails'; // Custom order emails
const FEATURE_LIVE_SHIPPING_RATES = 'live-shipping-rates'; // Live shipping rates
const FEATURE_DISCOUNTED_SHIPPING = 'discounted-shipping'; // Discounted shipping
const FEATURE_PRINT_SHIPPING_LABELS = 'print-shipping-labels'; // Print shipping labels
const FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION = 'ai-assisted-product-descriptions'; // AI-assisted product descriptions

/***/ }),

/***/ 892:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $U: () => (/* binding */ JETPACK_LEGACY_PLANS),
/* harmony export */   AY: () => (/* binding */ PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY),
/* harmony export */   Cg: () => (/* binding */ JETPACK_TAG_FOR_MEMBERSHIP_SITES),
/* harmony export */   DH: () => (/* binding */ PRODUCT_JETPACK_SEARCH),
/* harmony export */   Dl: () => (/* binding */ PLAN_JETPACK_SECURITY_DAILY_MONTHLY),
/* harmony export */   E9: () => (/* binding */ PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY),
/* harmony export */   EI: () => (/* binding */ PRODUCT_JETPACK_BACKUP_T2_YEARLY),
/* harmony export */   EV: () => (/* binding */ PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY),
/* harmony export */   Eh: () => (/* binding */ PRODUCT_JETPACK_SEARCH_BI_YEARLY),
/* harmony export */   Et: () => (/* binding */ PLAN_JETPACK_SECURITY_T1_YEARLY),
/* harmony export */   G$: () => (/* binding */ PLAN_JETPACK_SECURITY_REALTIME_MONTHLY),
/* harmony export */   GA: () => (/* binding */ PRODUCT_JETPACK_BOOST),
/* harmony export */   Im: () => (/* binding */ PRODUCT_JETPACK_SOCIAL_ADVANCED),
/* harmony export */   JD: () => (/* binding */ PRODUCT_JETPACK_BACKUP_REALTIME),
/* harmony export */   JX: () => (/* binding */ PLAN_JETPACK_COMPLETE_MONTHLY),
/* harmony export */   K$: () => (/* binding */ PRODUCT_JETPACK_BACKUP_DAILY),
/* harmony export */   KW: () => (/* binding */ JETPACK_TAG_FOR_SMALL_SITES),
/* harmony export */   NJ: () => (/* binding */ PLAN_JETPACK_BUSINESS),
/* harmony export */   OH: () => (/* binding */ PRODUCT_JETPACK_BACKUP_T0_YEARLY),
/* harmony export */   P5: () => (/* binding */ PLAN_JETPACK_SECURITY_T1_BI_YEARLY),
/* harmony export */   PF: () => (/* binding */ PRODUCT_JETPACK_ANTI_SPAM_MONTHLY),
/* harmony export */   QZ: () => (/* binding */ PRODUCT_JETPACK_BACKUP_T1_BI_YEARLY),
/* harmony export */   Rw: () => (/* binding */ PLAN_JETPACK_STARTER_MONTHLY),
/* harmony export */   SZ: () => (/* binding */ PRODUCT_JETPACK_BOOST_MONTHLY),
/* harmony export */   Sj: () => (/* binding */ PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY),
/* harmony export */   Sm: () => (/* binding */ PRODUCT_JETPACK_ANTI_SPAM),
/* harmony export */   Td: () => (/* binding */ PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY),
/* harmony export */   Tp: () => (/* binding */ PRODUCT_JETPACK_BACKUP_T0_MONTHLY),
/* harmony export */   V$: () => (/* binding */ PRODUCT_JETPACK_CREATOR_BI_YEARLY),
/* harmony export */   Ve: () => (/* binding */ PRODUCT_JETPACK_CRM),
/* harmony export */   Vl: () => (/* binding */ PLAN_JETPACK_SECURITY_DAILY),
/* harmony export */   Wn: () => (/* binding */ JETPACK_TAG_FOR_WOOCOMMERCE_STORES),
/* harmony export */   XG: () => (/* binding */ PRODUCT_JETPACK_SEARCH_MONTHLY),
/* harmony export */   XP: () => (/* binding */ PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY),
/* harmony export */   Xz: () => (/* binding */ PLAN_JETPACK_PREMIUM),
/* harmony export */   YU: () => (/* binding */ PRODUCT_JETPACK_SCAN_BI_YEARLY),
/* harmony export */   Zo: () => (/* binding */ PRODUCT_JETPACK_STATS_BI_YEARLY),
/* harmony export */   aG: () => (/* binding */ PRODUCT_JETPACK_ANTI_SPAM_BI_YEARLY),
/* harmony export */   aS: () => (/* binding */ PLAN_JETPACK_SECURITY_T2_MONTHLY),
/* harmony export */   ap: () => (/* binding */ PLAN_JETPACK_PERSONAL),
/* harmony export */   cc: () => (/* binding */ PRODUCT_JETPACK_SOCIAL_BASIC),
/* harmony export */   dX: () => (/* binding */ PRODUCT_JETPACK_STATS_MONTHLY),
/* harmony export */   eV: () => (/* binding */ PRODUCT_JETPACK_CREATOR_MONTHLY),
/* harmony export */   iP: () => (/* binding */ PLAN_JETPACK_COMPLETE_BI_YEARLY),
/* harmony export */   jI: () => (/* binding */ PLAN_JETPACK_SECURITY_REALTIME),
/* harmony export */   jj: () => (/* binding */ JETPACK_SECURITY_PLANS),
/* harmony export */   kY: () => (/* binding */ PRODUCT_JETPACK_STATS_YEARLY),
/* harmony export */   ki: () => (/* binding */ PLAN_JETPACK_STARTER_YEARLY),
/* harmony export */   l3: () => (/* binding */ JETPACK_TAG_FOR_BLOGS),
/* harmony export */   lb: () => (/* binding */ PRODUCT_JETPACK_CREATOR_YEARLY),
/* harmony export */   lj: () => (/* binding */ PLAN_JETPACK_FREE),
/* harmony export */   mk: () => (/* binding */ GROUP_JETPACK),
/* harmony export */   nN: () => (/* binding */ PRODUCT_JETPACK_VIDEOPRESS),
/* harmony export */   ns: () => (/* binding */ PLAN_JETPACK_PERSONAL_MONTHLY),
/* harmony export */   oe: () => (/* binding */ PRODUCT_JETPACK_BACKUP_T1_YEARLY),
/* harmony export */   p2: () => (/* binding */ PLAN_JETPACK_PREMIUM_MONTHLY),
/* harmony export */   pE: () => (/* binding */ PRODUCT_JETPACK_SCAN),
/* harmony export */   qH: () => (/* binding */ PRODUCT_JETPACK_VIDEOPRESS_MONTHLY),
/* harmony export */   rx: () => (/* binding */ PRODUCT_JETPACK_BACKUP_T1_MONTHLY),
/* harmony export */   s1: () => (/* binding */ PLAN_JETPACK_SECURITY_T2_YEARLY),
/* harmony export */   sA: () => (/* binding */ PRODUCT_JETPACK_BOOST_BI_YEARLY),
/* harmony export */   sY: () => (/* binding */ PRODUCT_JETPACK_SCAN_MONTHLY),
/* harmony export */   sc: () => (/* binding */ PLAN_JETPACK_GOLDEN_TOKEN),
/* harmony export */   th: () => (/* binding */ PLAN_JETPACK_COMPLETE),
/* harmony export */   uL: () => (/* binding */ PRODUCT_JETPACK_BACKUP_T2_MONTHLY),
/* harmony export */   vE: () => (/* binding */ JETPACK_TAG_FOR_NEWS_ORGANISATIONS),
/* harmony export */   vM: () => (/* binding */ PRODUCT_JETPACK_CRM_MONTHLY),
/* harmony export */   vT: () => (/* binding */ PRODUCT_JETPACK_VIDEOPRESS_BI_YEARLY),
/* harmony export */   w2: () => (/* binding */ PLAN_JETPACK_SECURITY_T1_MONTHLY),
/* harmony export */   yY: () => (/* binding */ PLAN_JETPACK_BUSINESS_MONTHLY)
/* harmony export */ });
/* unused harmony exports PRODUCT_JETPACK_AI_BI_YEARLY, PRODUCT_JETPACK_AI_MONTHLY, PRODUCT_JETPACK_AI_YEARLY, PRODUCT_JETPACK_BACKUP, PRODUCT_JETPACK_SCAN_REALTIME, PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY, PRODUCT_JETPACK_SEARCH_FREE, PRODUCT_JETPACK_CRM_FREE, PRODUCT_JETPACK_CRM_FREE_MONTHLY, PRODUCT_JETPACK_STATS_PWYW_YEARLY, PRODUCT_JETPACK_STATS_FREE, PRODUCT_JETPACK_MONITOR_YEARLY, PRODUCT_JETPACK_MONITOR_MONTHLY, PRODUCT_JETPACK_MONITOR, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_10GB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_100GB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_1TB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_3TB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_5TB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_10GB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_100GB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_1TB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_3TB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_5TB_YEARLY, PRODUCT_WOOCOMMERCE_BOOKINGS, PRODUCT_WOOCOMMERCE_SUBSCRIPTIONS, PRODUCT_WOOCOMMERCE_PRODUCT_BUNDLES, PRODUCT_WOOCOMMERCE_PRODUCT_ADD_ONS, PRODUCT_WOOCOMMERCE_MINMAX_QUANTITIES, PRODUCT_WOOCOMMERCE_AUTOMATEWOO, JETPACK_BACKUP_PRODUCTS_YEARLY, JETPACK_BACKUP_PRODUCTS_MONTHLY, JETPACK_BACKUP_PRODUCTS, JETPACK_BACKUP_ADDON_MONTHLY, JETPACK_BACKUP_ADDON_YEARLY, JETPACK_BACKUP_ADDON_PRODUCTS, JETPACK_BACKUP_T0_PRODUCTS, JETPACK_BACKUP_T1_PRODUCTS, JETPACK_BACKUP_T2_PRODUCTS, JETPACK_BOOST_PRODUCTS, JETPACK_SCAN_PRODUCTS, JETPACK_SOCIAL_BASIC_PRODUCTS, JETPACK_SOCIAL_ADVANCED_PRODUCTS, JETPACK_SOCIAL_PRODUCTS, JETPACK_STATS_PRODUCTS, JETPACK_ANTI_SPAM_PRODUCTS, JETPACK_SEARCH_PRODUCTS, JETPACK_CRM_PRODUCTS, JETPACK_CRM_FREE_PRODUCTS, JETPACK_VIDEOPRESS_PRODUCTS, JETPACK_MONITOR_PRODUCTS, JETPACK_AI_PRODUCTS, JETPACK_CREATOR_PRODUCTS, WOOCOMMERCE_PRODUCTS, JETPACK_PRODUCTS_LIST, JETPACK_PRODUCTS_BY_TERM, JETPACK_PRODUCT_PRICE_MATRIX, JETPACK_PRODUCT_UPGRADE_MAP, JETPACK_LEGACY_PLANS_MAX_PLUGIN_VERSION, JETPACK_SECURITY_T1_PLANS, JETPACK_SECURITY_T2_PLANS, JETPACK_COMPLETE_PLANS, JETPACK_STARTER_PLANS, JETPACK_MONTHLY_PLANS, JETPACK_RESET_PLANS, JETPACK_RESET_PLANS_BY_TERM, JETPACK_PLANS, JETPACK_PLANS_BY_TERM, BEST_VALUE_PLANS, JETPACK_PLAN_UPGRADE_MAP, JETPACK_STARTER_UPGRADE_MAP, JETPACK_SECURITY_CATEGORY, JETPACK_PERFORMANCE_CATEGORY, JETPACK_GROWTH_CATEGORY, JETPACK_PRODUCT_CATEGORIES, JETPACK_BACKUP_PRODUCT_LANDING_PAGE_URL, JETPACK_SEARCH_PRODUCT_LANDING_PAGE_URL, JETPACK_STATS_PRODUCT_LANDING_PAGE_URL, JETPACK_SCAN_PRODUCT_LANDING_PAGE_URL, JETPACK_ANTI_SPAM_PRODUCT_LANDING_PAGE_URL, JETPACK_BOOST_PRODUCT_LANDING_PAGE_URL, JETPACK_SOCIAL_PRODUCT_LANDING_PAGE_URL, JETPACK_VIDEOPRESS_PRODUCT_LANDING_PAGE_URL, JETPACK_CRM_PRODUCT_LANDING_PAGE_URL, JETPACK_REDIRECT_CHECKOUT_TO_WPADMIN, JETPACK_REDIRECT_URL, JETPACK_RELATED_PRODUCTS_MAP, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_VIDEOGRAPHERS, JETPACK_TAG_FOR_EDUCATORS, JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_ALL_SITES, JETPACK_PRODUCT_RECCOMENDATION_MAP */
/* harmony import */ var _wpcom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7904);

const GROUP_JETPACK = 'GROUP_JETPACK';

// Products
const PRODUCT_JETPACK_AI_BI_YEARLY = 'jetpack_ai_bi_yearly';
const PRODUCT_JETPACK_AI_MONTHLY = 'jetpack_ai_monthly';
const PRODUCT_JETPACK_AI_YEARLY = 'jetpack_ai_yearly';
const PRODUCT_JETPACK_BOOST_BI_YEARLY = 'jetpack_boost_bi_yearly';
const PRODUCT_JETPACK_BOOST = 'jetpack_boost_yearly';
const PRODUCT_JETPACK_BOOST_MONTHLY = 'jetpack_boost_monthly';
const PRODUCT_JETPACK_BACKUP = 'jetpack_backup';
const PRODUCT_JETPACK_BACKUP_T0_YEARLY = 'jetpack_backup_t0_yearly';
const PRODUCT_JETPACK_BACKUP_T0_MONTHLY = 'jetpack_backup_t0_monthly';
const PRODUCT_JETPACK_BACKUP_T1_YEARLY = 'jetpack_backup_t1_yearly';
const PRODUCT_JETPACK_BACKUP_T1_BI_YEARLY = 'jetpack_backup_t1_bi_yearly';
const PRODUCT_JETPACK_BACKUP_T1_MONTHLY = 'jetpack_backup_t1_monthly';
const PRODUCT_JETPACK_BACKUP_T2_YEARLY = 'jetpack_backup_t2_yearly';
const PRODUCT_JETPACK_BACKUP_T2_MONTHLY = 'jetpack_backup_t2_monthly';
const PRODUCT_JETPACK_SCAN_BI_YEARLY = 'jetpack_scan_bi_yearly';
const PRODUCT_JETPACK_SCAN = 'jetpack_scan';
const PRODUCT_JETPACK_SCAN_MONTHLY = 'jetpack_scan_monthly';
const PRODUCT_JETPACK_SCAN_REALTIME = 'jetpack_scan_realtime';
const PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY = 'jetpack_scan_realtime_monthly';
const PRODUCT_JETPACK_ANTI_SPAM_BI_YEARLY = 'jetpack_anti_spam_bi_yearly';
const PRODUCT_JETPACK_ANTI_SPAM = 'jetpack_anti_spam';
const PRODUCT_JETPACK_ANTI_SPAM_MONTHLY = 'jetpack_anti_spam_monthly';
const PRODUCT_JETPACK_SEARCH_BI_YEARLY = 'jetpack_search_bi_yearly';
const PRODUCT_JETPACK_SEARCH = 'jetpack_search';
const PRODUCT_JETPACK_SEARCH_FREE = 'jetpack_search_free';
const PRODUCT_JETPACK_SEARCH_MONTHLY = 'jetpack_search_monthly';
const PRODUCT_JETPACK_CRM = 'jetpack_crm';
const PRODUCT_JETPACK_CRM_MONTHLY = 'jetpack_crm_monthly';
const PRODUCT_JETPACK_CRM_FREE = 'jetpack_crm_free';
const PRODUCT_JETPACK_CRM_FREE_MONTHLY = 'jetpack_crm_free_monthly';
const PRODUCT_JETPACK_VIDEOPRESS_BI_YEARLY = 'jetpack_videopress_bi_yearly';
const PRODUCT_JETPACK_VIDEOPRESS = 'jetpack_videopress';
const PRODUCT_JETPACK_VIDEOPRESS_MONTHLY = 'jetpack_videopress_monthly';
const PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY = 'jetpack_social_basic_bi_yearly';
const PRODUCT_JETPACK_SOCIAL_BASIC = 'jetpack_social_basic_yearly';
const PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY = 'jetpack_social_basic_monthly';
const PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY = 'jetpack_social_advanced_bi_yearly';
const PRODUCT_JETPACK_SOCIAL_ADVANCED = 'jetpack_social_advanced_yearly';
const PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY = 'jetpack_social_advanced_monthly';
const PRODUCT_JETPACK_STATS_MONTHLY = 'jetpack_stats_monthly';
const PRODUCT_JETPACK_STATS_YEARLY = 'jetpack_stats_yearly';
const PRODUCT_JETPACK_STATS_BI_YEARLY = 'jetpack_stats_bi_yearly';
const PRODUCT_JETPACK_STATS_PWYW_YEARLY = 'jetpack_stats_pwyw_yearly';
const PRODUCT_JETPACK_STATS_FREE = 'jetpack_stats_free_yearly';
const PRODUCT_JETPACK_MONITOR_YEARLY = 'jetpack_monitor_yearly';
const PRODUCT_JETPACK_MONITOR_MONTHLY = 'jetpack_monitor_monthly';
const PRODUCT_JETPACK_MONITOR = (/* unused pure expression or super */ null && (PRODUCT_JETPACK_MONITOR_YEARLY));
const PRODUCT_JETPACK_CREATOR_BI_YEARLY = 'jetpack_creator_bi_yearly';
const PRODUCT_JETPACK_CREATOR_YEARLY = 'jetpack_creator_yearly';
const PRODUCT_JETPACK_CREATOR_MONTHLY = 'jetpack_creator_monthly';

//add-on products
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_10GB_MONTHLY = 'jetpack_backup_addon_storage_10gb_monthly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_100GB_MONTHLY = 'jetpack_backup_addon_storage_100gb_monthly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_1TB_MONTHLY = 'jetpack_backup_addon_storage_1tb_monthly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_3TB_MONTHLY = 'jetpack_backup_addon_storage_3tb_monthly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_5TB_MONTHLY = 'jetpack_backup_addon_storage_5tb_monthly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_10GB_YEARLY = 'jetpack_backup_addon_storage_10gb_yearly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_100GB_YEARLY = 'jetpack_backup_addon_storage_100gb_yearly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_1TB_YEARLY = 'jetpack_backup_addon_storage_1tb_yearly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_3TB_YEARLY = 'jetpack_backup_addon_storage_3tb_yearly';
const PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_5TB_YEARLY = 'jetpack_backup_addon_storage_5tb_yearly';

// Legacy Products
const PRODUCT_JETPACK_BACKUP_DAILY = 'jetpack_backup_daily';
const PRODUCT_JETPACK_BACKUP_REALTIME = 'jetpack_backup_realtime';
const PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY = 'jetpack_backup_daily_monthly';
const PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY = 'jetpack_backup_realtime_monthly';

// Woo Extensions
const PRODUCT_WOOCOMMERCE_BOOKINGS = 'woocommerce_bookings_yearly';
const PRODUCT_WOOCOMMERCE_SUBSCRIPTIONS = 'woocommerce_subscriptions_yearly';
const PRODUCT_WOOCOMMERCE_PRODUCT_BUNDLES = 'woocommerce_product_bundles_yearly';
const PRODUCT_WOOCOMMERCE_PRODUCT_ADD_ONS = 'woocommerce_product_add_ons_yearly';
const PRODUCT_WOOCOMMERCE_MINMAX_QUANTITIES = 'woocommerce_minmax_quantities_yearly';
const PRODUCT_WOOCOMMERCE_AUTOMATEWOO = 'woocommerce_automatewoo_yearly';

// Backup
const JETPACK_BACKUP_PRODUCTS_YEARLY = [PRODUCT_JETPACK_BACKUP_DAILY, PRODUCT_JETPACK_BACKUP_REALTIME, PRODUCT_JETPACK_BACKUP_T0_YEARLY, PRODUCT_JETPACK_BACKUP_T1_YEARLY, PRODUCT_JETPACK_BACKUP_T2_YEARLY];
const JETPACK_BACKUP_PRODUCTS_MONTHLY = [PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY, PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY, PRODUCT_JETPACK_BACKUP_T0_MONTHLY, PRODUCT_JETPACK_BACKUP_T1_MONTHLY, PRODUCT_JETPACK_BACKUP_T2_MONTHLY];
const JETPACK_BACKUP_PRODUCTS = [PRODUCT_JETPACK_BACKUP_T1_BI_YEARLY, ...JETPACK_BACKUP_PRODUCTS_YEARLY, ...JETPACK_BACKUP_PRODUCTS_MONTHLY];
const JETPACK_BACKUP_ADDON_MONTHLY = [PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_10GB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_100GB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_1TB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_3TB_MONTHLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_5TB_MONTHLY];
const JETPACK_BACKUP_ADDON_YEARLY = [PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_10GB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_100GB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_1TB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_3TB_YEARLY, PRODUCT_JETPACK_BACKUP_ADDON_STORAGE_5TB_YEARLY];
const JETPACK_BACKUP_ADDON_PRODUCTS = [...JETPACK_BACKUP_ADDON_MONTHLY, ...JETPACK_BACKUP_ADDON_YEARLY];
const JETPACK_BACKUP_T0_PRODUCTS = [PRODUCT_JETPACK_BACKUP_T0_MONTHLY, PRODUCT_JETPACK_BACKUP_T0_YEARLY];
const JETPACK_BACKUP_T1_PRODUCTS = [PRODUCT_JETPACK_BACKUP_T1_BI_YEARLY, PRODUCT_JETPACK_BACKUP_T1_MONTHLY, PRODUCT_JETPACK_BACKUP_T1_YEARLY];
const JETPACK_BACKUP_T2_PRODUCTS = [PRODUCT_JETPACK_BACKUP_T2_MONTHLY, PRODUCT_JETPACK_BACKUP_T2_YEARLY];
// Boost
const JETPACK_BOOST_PRODUCTS = [PRODUCT_JETPACK_BOOST_BI_YEARLY, PRODUCT_JETPACK_BOOST, PRODUCT_JETPACK_BOOST_MONTHLY];

// Scan
const JETPACK_SCAN_PRODUCTS = [PRODUCT_JETPACK_SCAN_BI_YEARLY, PRODUCT_JETPACK_SCAN, PRODUCT_JETPACK_SCAN_MONTHLY, PRODUCT_JETPACK_SCAN_REALTIME, PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY];

// Social Basic
const JETPACK_SOCIAL_BASIC_PRODUCTS = [PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY, PRODUCT_JETPACK_SOCIAL_BASIC, PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY];

// Social Advanced
const JETPACK_SOCIAL_ADVANCED_PRODUCTS = [PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY, PRODUCT_JETPACK_SOCIAL_ADVANCED, PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY];

// Social
const JETPACK_SOCIAL_PRODUCTS = [...JETPACK_SOCIAL_BASIC_PRODUCTS, ...JETPACK_SOCIAL_ADVANCED_PRODUCTS];

// Stats
const JETPACK_STATS_PRODUCTS = [PRODUCT_JETPACK_STATS_BI_YEARLY, PRODUCT_JETPACK_STATS_YEARLY, PRODUCT_JETPACK_STATS_MONTHLY, PRODUCT_JETPACK_STATS_PWYW_YEARLY, PRODUCT_JETPACK_STATS_FREE];

// Anti-spam
const JETPACK_ANTI_SPAM_PRODUCTS = [PRODUCT_JETPACK_ANTI_SPAM_BI_YEARLY, PRODUCT_JETPACK_ANTI_SPAM, PRODUCT_JETPACK_ANTI_SPAM_MONTHLY];

// Search
const JETPACK_SEARCH_PRODUCTS = [PRODUCT_JETPACK_SEARCH_BI_YEARLY, PRODUCT_JETPACK_SEARCH, PRODUCT_JETPACK_SEARCH_MONTHLY, _wpcom__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_WPCOM_SEARCH */ .AY, _wpcom__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_WPCOM_SEARCH_MONTHLY */ .MY];

// CRM
const JETPACK_CRM_PRODUCTS = [PRODUCT_JETPACK_CRM, PRODUCT_JETPACK_CRM_MONTHLY];
const JETPACK_CRM_FREE_PRODUCTS = [PRODUCT_JETPACK_CRM_FREE, PRODUCT_JETPACK_CRM_FREE_MONTHLY];

// VideoPress
const JETPACK_VIDEOPRESS_PRODUCTS = [PRODUCT_JETPACK_VIDEOPRESS_BI_YEARLY, PRODUCT_JETPACK_VIDEOPRESS, PRODUCT_JETPACK_VIDEOPRESS_MONTHLY];

// Monitor
const JETPACK_MONITOR_PRODUCTS = [PRODUCT_JETPACK_MONITOR_YEARLY, PRODUCT_JETPACK_MONITOR_MONTHLY];
const JETPACK_AI_PRODUCTS = [PRODUCT_JETPACK_AI_BI_YEARLY, PRODUCT_JETPACK_AI_MONTHLY, PRODUCT_JETPACK_AI_YEARLY];

// Creator
const JETPACK_CREATOR_PRODUCTS = [PRODUCT_JETPACK_CREATOR_BI_YEARLY, PRODUCT_JETPACK_CREATOR_YEARLY, PRODUCT_JETPACK_CREATOR_MONTHLY];

// WooCommerce Products
const WOOCOMMERCE_PRODUCTS = [PRODUCT_WOOCOMMERCE_BOOKINGS, PRODUCT_WOOCOMMERCE_SUBSCRIPTIONS, PRODUCT_WOOCOMMERCE_PRODUCT_BUNDLES, PRODUCT_WOOCOMMERCE_PRODUCT_ADD_ONS, PRODUCT_WOOCOMMERCE_MINMAX_QUANTITIES, PRODUCT_WOOCOMMERCE_AUTOMATEWOO];
const JETPACK_PRODUCTS_LIST = [...JETPACK_BACKUP_PRODUCTS, ...JETPACK_BOOST_PRODUCTS, ...JETPACK_SCAN_PRODUCTS, ...JETPACK_ANTI_SPAM_PRODUCTS, ...JETPACK_SEARCH_PRODUCTS, ...JETPACK_VIDEOPRESS_PRODUCTS, ...JETPACK_SOCIAL_PRODUCTS, ...JETPACK_BACKUP_ADDON_PRODUCTS, ...JETPACK_AI_PRODUCTS, ...JETPACK_STATS_PRODUCTS, ...JETPACK_MONITOR_PRODUCTS, ...JETPACK_CREATOR_PRODUCTS];
const JETPACK_PRODUCTS_BY_TERM = [{
  yearly: PRODUCT_JETPACK_BACKUP_DAILY,
  monthly: PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY
}, {
  yearly: PRODUCT_JETPACK_BACKUP_REALTIME,
  monthly: PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_SEARCH_BI_YEARLY,
  yearly: PRODUCT_JETPACK_SEARCH,
  monthly: PRODUCT_JETPACK_SEARCH_MONTHLY
}, {
  yearly: _wpcom__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_WPCOM_SEARCH */ .AY,
  monthly: _wpcom__WEBPACK_IMPORTED_MODULE_0__/* .PRODUCT_WPCOM_SEARCH_MONTHLY */ .MY
}, {
  biYearly: PRODUCT_JETPACK_SCAN_BI_YEARLY,
  yearly: PRODUCT_JETPACK_SCAN,
  monthly: PRODUCT_JETPACK_SCAN_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_ANTI_SPAM_BI_YEARLY,
  yearly: PRODUCT_JETPACK_ANTI_SPAM,
  monthly: PRODUCT_JETPACK_ANTI_SPAM_MONTHLY
}, {
  yearly: PRODUCT_JETPACK_CRM,
  monthly: PRODUCT_JETPACK_CRM_MONTHLY
}, {
  yearly: PRODUCT_JETPACK_CRM_FREE,
  monthly: PRODUCT_JETPACK_CRM_FREE_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_BACKUP_T1_BI_YEARLY,
  yearly: PRODUCT_JETPACK_BACKUP_T1_YEARLY,
  monthly: PRODUCT_JETPACK_BACKUP_T1_MONTHLY
}, {
  yearly: PRODUCT_JETPACK_BACKUP_T2_YEARLY,
  monthly: PRODUCT_JETPACK_BACKUP_T2_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_VIDEOPRESS_BI_YEARLY,
  yearly: PRODUCT_JETPACK_VIDEOPRESS,
  monthly: PRODUCT_JETPACK_VIDEOPRESS_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_BOOST_BI_YEARLY,
  yearly: PRODUCT_JETPACK_BOOST,
  monthly: PRODUCT_JETPACK_BOOST_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY,
  yearly: PRODUCT_JETPACK_SOCIAL_BASIC,
  monthly: PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY,
  yearly: PRODUCT_JETPACK_SOCIAL_ADVANCED,
  monthly: PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_STATS_BI_YEARLY,
  yearly: PRODUCT_JETPACK_STATS_YEARLY,
  monthly: PRODUCT_JETPACK_STATS_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_AI_BI_YEARLY,
  yearly: PRODUCT_JETPACK_AI_YEARLY,
  monthly: PRODUCT_JETPACK_AI_MONTHLY
}, {
  yearly: PRODUCT_JETPACK_MONITOR_YEARLY,
  monthly: PRODUCT_JETPACK_MONITOR_MONTHLY
}, {
  biYearly: PRODUCT_JETPACK_CREATOR_BI_YEARLY,
  yearly: PRODUCT_JETPACK_CREATOR_YEARLY,
  monthly: PRODUCT_JETPACK_CREATOR_MONTHLY
}];
const JETPACK_PRODUCT_PRICE_MATRIX = {
  [PRODUCT_JETPACK_BACKUP_DAILY]: {
    relatedProduct: PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_BACKUP_REALTIME]: {
    relatedProduct: PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_BACKUP_T1_YEARLY]: {
    relatedProduct: PRODUCT_JETPACK_BACKUP_T1_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_BACKUP_T2_YEARLY]: {
    relatedProduct: PRODUCT_JETPACK_BACKUP_T2_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_BOOST]: {
    relatedProduct: PRODUCT_JETPACK_BOOST_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_SOCIAL_BASIC]: {
    relatedProduct: PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_SOCIAL_ADVANCED]: {
    relatedProduct: PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_SEARCH]: {
    relatedProduct: PRODUCT_JETPACK_SEARCH_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_SCAN]: {
    relatedProduct: PRODUCT_JETPACK_SCAN_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_ANTI_SPAM]: {
    relatedProduct: PRODUCT_JETPACK_ANTI_SPAM_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_VIDEOPRESS]: {
    relatedProduct: PRODUCT_JETPACK_VIDEOPRESS_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_MONITOR_YEARLY]: {
    relatedProduct: PRODUCT_JETPACK_MONITOR_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_STATS_YEARLY]: {
    relatedProduct: PRODUCT_JETPACK_STATS_MONTHLY,
    ratio: 12
  },
  [PRODUCT_JETPACK_CREATOR_YEARLY]: {
    relatedProduct: PRODUCT_JETPACK_CREATOR_MONTHLY,
    ratio: 12
  }
};
// Key/value: Superseding product/Products superseded (yearly terms)
const JETPACK_PRODUCT_UPGRADE_MAP = {
  [PRODUCT_JETPACK_BACKUP_T2_YEARLY]: [PRODUCT_JETPACK_BACKUP_T1_YEARLY],
  [PRODUCT_JETPACK_BACKUP_REALTIME]: [PRODUCT_JETPACK_BACKUP_DAILY]
};

// Plans
const PLAN_JETPACK_FREE = 'jetpack_free';
const PLAN_JETPACK_PERSONAL = 'jetpack_personal';
const PLAN_JETPACK_PERSONAL_MONTHLY = 'jetpack_personal_monthly';
const PLAN_JETPACK_PREMIUM = 'jetpack_premium';
const PLAN_JETPACK_PREMIUM_MONTHLY = 'jetpack_premium_monthly';
const PLAN_JETPACK_BUSINESS = 'jetpack_business';
const PLAN_JETPACK_BUSINESS_MONTHLY = 'jetpack_business_monthly';
const PLAN_JETPACK_SECURITY_T1_YEARLY = 'jetpack_security_t1_yearly';
const PLAN_JETPACK_SECURITY_T1_MONTHLY = 'jetpack_security_t1_monthly';
const PLAN_JETPACK_SECURITY_T1_BI_YEARLY = 'jetpack_security_t1_bi_yearly';
const PLAN_JETPACK_SECURITY_T2_YEARLY = 'jetpack_security_t2_yearly';
const PLAN_JETPACK_SECURITY_T2_MONTHLY = 'jetpack_security_t2_monthly';
const PLAN_JETPACK_COMPLETE_BI_YEARLY = 'jetpack_complete_bi_yearly';
const PLAN_JETPACK_COMPLETE = 'jetpack_complete';
const PLAN_JETPACK_COMPLETE_MONTHLY = 'jetpack_complete_monthly';
const PLAN_JETPACK_STARTER_YEARLY = 'jetpack_starter_yearly';
const PLAN_JETPACK_STARTER_MONTHLY = 'jetpack_starter_monthly';
const PLAN_JETPACK_GOLDEN_TOKEN = 'jetpack_golden_token_lifetime';

// Legacy Security Plans
const PLAN_JETPACK_SECURITY_DAILY = 'jetpack_security_daily';
const PLAN_JETPACK_SECURITY_DAILY_MONTHLY = 'jetpack_security_daily_monthly';
const PLAN_JETPACK_SECURITY_REALTIME = 'jetpack_security_realtime';
const PLAN_JETPACK_SECURITY_REALTIME_MONTHLY = 'jetpack_security_realtime_monthly';

// Legacy (before offer reset)
const JETPACK_LEGACY_PLANS = [PLAN_JETPACK_PERSONAL, PLAN_JETPACK_PERSONAL_MONTHLY, PLAN_JETPACK_BUSINESS, PLAN_JETPACK_BUSINESS_MONTHLY, PLAN_JETPACK_PREMIUM, PLAN_JETPACK_PREMIUM_MONTHLY];
const JETPACK_LEGACY_PLANS_MAX_PLUGIN_VERSION = '8.9.1'; // Jetpack versions prior to this one are not fully compatible with new plans

// Security
const JETPACK_SECURITY_PLANS = [PLAN_JETPACK_SECURITY_DAILY, PLAN_JETPACK_SECURITY_DAILY_MONTHLY, PLAN_JETPACK_SECURITY_REALTIME, PLAN_JETPACK_SECURITY_REALTIME_MONTHLY, PLAN_JETPACK_SECURITY_T1_YEARLY, PLAN_JETPACK_SECURITY_T1_MONTHLY, PLAN_JETPACK_SECURITY_T1_BI_YEARLY, PLAN_JETPACK_SECURITY_T2_YEARLY, PLAN_JETPACK_SECURITY_T2_MONTHLY];
const JETPACK_SECURITY_T1_PLANS = [PLAN_JETPACK_SECURITY_T1_MONTHLY, PLAN_JETPACK_SECURITY_T1_YEARLY, PLAN_JETPACK_SECURITY_T1_BI_YEARLY];
const JETPACK_SECURITY_T2_PLANS = [PLAN_JETPACK_SECURITY_T2_MONTHLY, PLAN_JETPACK_SECURITY_T2_YEARLY];

// Complete
const JETPACK_COMPLETE_PLANS = [PLAN_JETPACK_COMPLETE_BI_YEARLY, PLAN_JETPACK_COMPLETE, PLAN_JETPACK_COMPLETE_MONTHLY];

// Starter
const JETPACK_STARTER_PLANS = [PLAN_JETPACK_STARTER_YEARLY, PLAN_JETPACK_STARTER_MONTHLY];
const JETPACK_MONTHLY_PLANS = [PLAN_JETPACK_PREMIUM_MONTHLY, PLAN_JETPACK_BUSINESS_MONTHLY, PLAN_JETPACK_PERSONAL_MONTHLY, PLAN_JETPACK_SECURITY_DAILY_MONTHLY, PLAN_JETPACK_SECURITY_REALTIME_MONTHLY, PLAN_JETPACK_SECURITY_T1_MONTHLY, PLAN_JETPACK_SECURITY_T2_MONTHLY, PLAN_JETPACK_COMPLETE_MONTHLY];
const JETPACK_RESET_PLANS = [...JETPACK_STARTER_PLANS, ...JETPACK_SECURITY_PLANS, ...JETPACK_COMPLETE_PLANS, PLAN_JETPACK_GOLDEN_TOKEN];
const JETPACK_RESET_PLANS_BY_TERM = [{
  biYearly: PLAN_JETPACK_COMPLETE_BI_YEARLY,
  yearly: PLAN_JETPACK_COMPLETE,
  monthly: PLAN_JETPACK_COMPLETE_MONTHLY
}, {
  yearly: PLAN_JETPACK_SECURITY_DAILY,
  monthly: PLAN_JETPACK_SECURITY_DAILY_MONTHLY
}, {
  yearly: PLAN_JETPACK_SECURITY_REALTIME,
  monthly: PLAN_JETPACK_SECURITY_REALTIME_MONTHLY
}, {
  biYearly: PLAN_JETPACK_SECURITY_T1_BI_YEARLY,
  yearly: PLAN_JETPACK_SECURITY_T1_YEARLY,
  monthly: PLAN_JETPACK_SECURITY_T1_MONTHLY
}, {
  yearly: PLAN_JETPACK_SECURITY_T2_YEARLY,
  monthly: PLAN_JETPACK_SECURITY_T2_MONTHLY
}, {
  yearly: PLAN_JETPACK_STARTER_YEARLY,
  monthly: PLAN_JETPACK_STARTER_MONTHLY
}];
const JETPACK_PLANS = [PLAN_JETPACK_FREE, ...JETPACK_LEGACY_PLANS, ...JETPACK_RESET_PLANS];
const JETPACK_PLANS_BY_TERM = [{
  yearly: PLAN_JETPACK_BUSINESS,
  monthly: PLAN_JETPACK_BUSINESS_MONTHLY
}, {
  yearly: PLAN_JETPACK_PERSONAL,
  monthly: PLAN_JETPACK_PERSONAL_MONTHLY
}, {
  yearly: PLAN_JETPACK_PREMIUM,
  monthly: PLAN_JETPACK_PREMIUM_MONTHLY
}, ...JETPACK_RESET_PLANS_BY_TERM];
const BEST_VALUE_PLANS = [PLAN_JETPACK_PREMIUM, PLAN_JETPACK_PREMIUM_MONTHLY];
// Key/value: Superseding plan/Plans superseded (yearly terms)
const JETPACK_PLAN_UPGRADE_MAP = {
  [PLAN_JETPACK_SECURITY_T2_YEARLY]: [PLAN_JETPACK_SECURITY_T1_YEARLY, PLAN_JETPACK_STARTER_YEARLY],
  [PLAN_JETPACK_SECURITY_T1_YEARLY]: [PLAN_JETPACK_STARTER_YEARLY],
  [PLAN_JETPACK_SECURITY_REALTIME]: [PLAN_JETPACK_SECURITY_DAILY],
  [PLAN_JETPACK_COMPLETE]: [PLAN_JETPACK_SECURITY_REALTIME, PLAN_JETPACK_SECURITY_DAILY, PLAN_JETPACK_SECURITY_T2_YEARLY, PLAN_JETPACK_SECURITY_T1_YEARLY, PLAN_JETPACK_STARTER_YEARLY]
};
const JETPACK_STARTER_UPGRADE_MAP = {
  [PLAN_JETPACK_STARTER_YEARLY]: PLAN_JETPACK_SECURITY_T1_YEARLY,
  [PLAN_JETPACK_STARTER_MONTHLY]: PLAN_JETPACK_SECURITY_T1_MONTHLY
};

// Categories
const JETPACK_SECURITY_CATEGORY = 'jetpack_security_category';
const JETPACK_PERFORMANCE_CATEGORY = 'jetpack_performance_category';
const JETPACK_GROWTH_CATEGORY = 'jetpack_growth_category';
const JETPACK_PRODUCT_CATEGORIES = [JETPACK_SECURITY_CATEGORY, JETPACK_PERFORMANCE_CATEGORY, JETPACK_GROWTH_CATEGORY];

// URL
const JETPACK_BACKUP_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/upgrade/backup/';
const JETPACK_SEARCH_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/upgrade/search/';
const JETPACK_STATS_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/stats/';
const JETPACK_SCAN_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/upgrade/scan/';
const JETPACK_ANTI_SPAM_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/upgrade/anti-spam/';
const JETPACK_BOOST_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/boost/';
const JETPACK_SOCIAL_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/social/';
const JETPACK_VIDEOPRESS_PRODUCT_LANDING_PAGE_URL = 'https://jetpack.com/videopress/';
const JETPACK_CRM_PRODUCT_LANDING_PAGE_URL = 'https://jetpackcrm.com/';
// If JETPACK_CLOUD_REDIRECT_CHECKOUT_TO_WPADMIN is true, checkout will redirect to the site's wp-admin,
// otherwise it will redirect to the JETPACK_REDIRECT_URL. Checkout references these constants in:
// client/my-sites/checkout/src/hooks/use-get-thank-you-url/get-thank-you-page-url.ts
const JETPACK_REDIRECT_CHECKOUT_TO_WPADMIN = true;
const JETPACK_REDIRECT_URL = 'https://jetpack.com/redirect/?source=jetpack-checkout-thankyou';

// Key/value maps related products to a given one
const JETPACK_RELATED_PRODUCTS_MAP = {
  [PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY]: [PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY, PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY],
  [PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY]: [PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY, PRODUCT_JETPACK_SOCIAL_BASIC_BI_YEARLY],
  [PRODUCT_JETPACK_SOCIAL_BASIC]: [PRODUCT_JETPACK_SOCIAL_ADVANCED, PRODUCT_JETPACK_SOCIAL_BASIC],
  [PRODUCT_JETPACK_SOCIAL_ADVANCED]: [PRODUCT_JETPACK_SOCIAL_ADVANCED, PRODUCT_JETPACK_SOCIAL_BASIC],
  [PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY]: [PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY, PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY],
  [PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY]: [PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY, PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY]
};

// Tags, 'Recommended for'
const JETPACK_TAG_FOR_WOOCOMMERCE_STORES = 'jetpack_tag_for_woocommerce_stores';
const JETPACK_TAG_FOR_NEWS_ORGANISATIONS = 'jetpack_tag_for_news_organisations';
const JETPACK_TAG_FOR_MEMBERSHIP_SITES = 'jetpack_tag_for_membership_sites';
const JETPACK_TAG_FOR_ONLINE_FORUMS = 'jetpack_tag_for_online_forums';
const JETPACK_TAG_FOR_BLOGS = 'jetpack_tag_for_blogs';
const JETPACK_TAG_FOR_VIDEOGRAPHERS = 'jetpack_tag_for_videographers';
const JETPACK_TAG_FOR_EDUCATORS = 'jetpack_tag_for_educators';
const JETPACK_TAG_FOR_BLOGGERS = 'jetpack_tag_for_bloggers';
const JETPACK_TAG_FOR_ALL_SITES = 'jetpack_tag_for_all_sites';
const JETPACK_TAG_FOR_SMALL_SITES = 'jetpack_tag_for_small_sites';

// Maps products to 'Recommended for' tags
const JETPACK_PRODUCT_RECCOMENDATION_MAP = {
  [PRODUCT_JETPACK_BACKUP_DAILY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BACKUP_REALTIME]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BACKUP_T1_YEARLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BACKUP_T1_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BACKUP_T2_YEARLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BACKUP_T2_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_VIDEOPRESS]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_VIDEOGRAPHERS, JETPACK_TAG_FOR_EDUCATORS, JETPACK_TAG_FOR_BLOGS],
  [PRODUCT_JETPACK_VIDEOPRESS_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_VIDEOGRAPHERS, JETPACK_TAG_FOR_EDUCATORS, JETPACK_TAG_FOR_BLOGS],
  [PRODUCT_JETPACK_ANTI_SPAM]: [JETPACK_TAG_FOR_BLOGS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_ANTI_SPAM_MONTHLY]: [JETPACK_TAG_FOR_BLOGS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_SCAN]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_SCAN_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_SCAN_REALTIME]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_SEARCH]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_SEARCH_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS],
  [PRODUCT_JETPACK_BOOST]: [JETPACK_TAG_FOR_ALL_SITES],
  [PRODUCT_JETPACK_BOOST_MONTHLY]: [JETPACK_TAG_FOR_ALL_SITES],
  [PRODUCT_JETPACK_SOCIAL_BASIC]: [JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_SOCIAL_BASIC_MONTHLY]: [JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_SOCIAL_ADVANCED]: [JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY]: [JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_STATS_YEARLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES],
  [PRODUCT_JETPACK_STATS_MONTHLY]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES],
  [PRODUCT_JETPACK_AI_MONTHLY]: [JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_AI_YEARLY]: [JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_NEWS_ORGANISATIONS, JETPACK_TAG_FOR_MEMBERSHIP_SITES, JETPACK_TAG_FOR_ONLINE_FORUMS, JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_JETPACK_CREATOR_YEARLY]: [JETPACK_TAG_FOR_EDUCATORS, JETPACK_TAG_FOR_BLOGGERS, JETPACK_TAG_FOR_VIDEOGRAPHERS, JETPACK_TAG_FOR_MEMBERSHIP_SITES],
  // WooCommerce Extensions
  [PRODUCT_WOOCOMMERCE_BOOKINGS]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_WOOCOMMERCE_SUBSCRIPTIONS]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_WOOCOMMERCE_PRODUCT_BUNDLES]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_WOOCOMMERCE_PRODUCT_ADD_ONS]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_WOOCOMMERCE_MINMAX_QUANTITIES]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES],
  [PRODUCT_WOOCOMMERCE_AUTOMATEWOO]: [JETPACK_TAG_FOR_WOOCOMMERCE_STORES]
};

/***/ }),

/***/ 3239:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F$: () => (/* binding */ TERM_CENTENNIALLY),
/* harmony export */   GP: () => (/* binding */ TERM_NOVENNIALLY),
/* harmony export */   I$: () => (/* binding */ TERM_DECENNIALLY),
/* harmony export */   IL: () => (/* binding */ TERM_TRIENNIALLY),
/* harmony export */   SU: () => (/* binding */ TERM_BIENNIALLY),
/* harmony export */   TN: () => (/* binding */ TERM_SEPTENNIALLY),
/* harmony export */   Zc: () => (/* binding */ TERM_QUINQUENNIALLY),
/* harmony export */   k1: () => (/* binding */ TERM_SEXENNIALLY),
/* harmony export */   ob: () => (/* binding */ TERM_MONTHLY),
/* harmony export */   pK: () => (/* binding */ TERM_QUADRENNIALLY),
/* harmony export */   tb: () => (/* binding */ TERM_OCTENNIALLY),
/* harmony export */   w$: () => (/* binding */ TERM_ANNUALLY)
/* harmony export */ });
/* unused harmony exports TERMS_LIST, URL_FRIENDLY_TERMS_MAPPING, PLAN_MONTHLY_PERIOD, PLAN_ANNUAL_PERIOD, PLAN_BIENNIAL_PERIOD, PLAN_TRIENNIAL_PERIOD, PLAN_QUADRENNIAL_PERIOD, PLAN_QUINQUENNIAL_PERIOD, PLAN_SEXENNIAL_PERIOD, PLAN_SEPTENNIAL_PERIOD, PLAN_OCTENNIAL_PERIOD, PLAN_NOVENNIAL_PERIOD, PLAN_DECENNIAL_PERIOD, PLAN_CENTENNIAL_PERIOD, PERIOD_LIST */
const TERM_MONTHLY = 'TERM_MONTHLY';
const TERM_ANNUALLY = 'TERM_ANNUALLY';
const TERM_BIENNIALLY = 'TERM_BIENNIALLY'; //2y
const TERM_TRIENNIALLY = 'TERM_TRIENNIALLY'; //3y
const TERM_QUADRENNIALLY = 'TERM_QUADRENNIALLY'; //4y
const TERM_QUINQUENNIALLY = 'TERM_QUINQUENNIALLY'; //5y
const TERM_SEXENNIALLY = 'TERM_SEXENNIALLY'; //6y
const TERM_SEPTENNIALLY = 'TERM_SEPTENNIALLY'; //7y
const TERM_OCTENNIALLY = 'TERM_OCTENNIALLY'; //8y
const TERM_NOVENNIALLY = 'TERM_NOVENNIALLY'; //9y
const TERM_DECENNIALLY = 'TERM_DECENNIALLY'; //10y
const TERM_CENTENNIALLY = 'TERM_CENTENNIALLY'; //100y

const TERMS_LIST = [TERM_MONTHLY, TERM_ANNUALLY, TERM_BIENNIALLY, TERM_TRIENNIALLY, TERM_QUADRENNIALLY, TERM_QUINQUENNIALLY, TERM_SEXENNIALLY, TERM_SEPTENNIALLY, TERM_OCTENNIALLY, TERM_NOVENNIALLY, TERM_DECENNIALLY, TERM_CENTENNIALLY];
const URL_FRIENDLY_TERMS_MAPPING = {
  monthly: TERM_MONTHLY,
  yearly: TERM_ANNUALLY,
  '2yearly': TERM_BIENNIALLY,
  '3yearly': TERM_TRIENNIALLY,
  '4yearly': TERM_QUADRENNIALLY,
  '5yearly': TERM_QUINQUENNIALLY,
  '6yearly': TERM_SEXENNIALLY,
  '7yearly': TERM_SEPTENNIALLY,
  '8yearly': TERM_OCTENNIALLY,
  '9yearly': TERM_NOVENNIALLY,
  '10yearly': TERM_DECENNIALLY,
  '100yearly': TERM_CENTENNIALLY
};
const PLAN_MONTHLY_PERIOD = 31;
const PLAN_ANNUAL_PERIOD = 365;
const PLAN_BIENNIAL_PERIOD = 730;
const PLAN_TRIENNIAL_PERIOD = 1095;
const PLAN_QUADRENNIAL_PERIOD = 1460;
const PLAN_QUINQUENNIAL_PERIOD = 1825;
const PLAN_SEXENNIAL_PERIOD = 2190;
const PLAN_SEPTENNIAL_PERIOD = 2555;
const PLAN_OCTENNIAL_PERIOD = 2920;
const PLAN_NOVENNIAL_PERIOD = 3285;
const PLAN_DECENNIAL_PERIOD = 3650;
const PLAN_CENTENNIAL_PERIOD = 36500;
const PERIOD_LIST = [PLAN_MONTHLY_PERIOD, PLAN_ANNUAL_PERIOD, PLAN_BIENNIAL_PERIOD, PLAN_TRIENNIAL_PERIOD, PLAN_QUADRENNIAL_PERIOD, PLAN_QUINQUENNIAL_PERIOD, PLAN_SEXENNIAL_PERIOD, PLAN_SEPTENNIAL_PERIOD, PLAN_OCTENNIAL_PERIOD, PLAN_NOVENNIAL_PERIOD, PLAN_DECENNIAL_PERIOD, PLAN_CENTENNIAL_PERIOD];

/***/ }),

/***/ 5085:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $h: () => (/* binding */ TYPE_SECURITY_T2),
/* harmony export */   Kb: () => (/* binding */ TYPE_PREMIUM),
/* harmony export */   L7: () => (/* binding */ TYPE_ALL),
/* harmony export */   M6: () => (/* binding */ TYPE_BLOGGER),
/* harmony export */   QI: () => (/* binding */ TYPE_P2_PLUS),
/* harmony export */   Qj: () => (/* binding */ TYPE_BUSINESS),
/* harmony export */   SW: () => (/* binding */ TYPE_JETPACK_STARTER),
/* harmony export */   T$: () => (/* binding */ TYPE_WOOEXPRESS_SMALL),
/* harmony export */   UH: () => (/* binding */ TYPE_FREE),
/* harmony export */   VH: () => (/* binding */ TYPE_SECURITY_DAILY),
/* harmony export */   VP: () => (/* binding */ TYPE_SECURITY_REALTIME),
/* harmony export */   cF: () => (/* binding */ TYPE_100_YEAR),
/* harmony export */   ci: () => (/* binding */ TYPE_ENTERPRISE_GRID_WPCOM),
/* harmony export */   h7: () => (/* binding */ TYPE_ECOMMERCE),
/* harmony export */   iN: () => (/* binding */ TYPE_WOOEXPRESS_MEDIUM),
/* harmony export */   l8: () => (/* binding */ TYPE_GOLDEN_TOKEN),
/* harmony export */   lY: () => (/* binding */ TYPE_PRO),
/* harmony export */   mV: () => (/* binding */ TYPE_PERSONAL),
/* harmony export */   nk: () => (/* binding */ TYPE_WOO_EXPRESS_PLUS),
/* harmony export */   qC: () => (/* binding */ TYPE_FLEXIBLE),
/* harmony export */   w: () => (/* binding */ TYPE_SECURITY_T1),
/* harmony export */   xg: () => (/* binding */ TYPE_STARTER)
/* harmony export */ });
/* unused harmony export TYPES_LIST */
const TYPE_FREE = 'TYPE_FREE';
const TYPE_BLOGGER = 'TYPE_BLOGGER';
const TYPE_PERSONAL = 'TYPE_PERSONAL';
const TYPE_PREMIUM = 'TYPE_PREMIUM';
const TYPE_BUSINESS = 'TYPE_BUSINESS';
const TYPE_100_YEAR = 'TYPE_100_YEAR';
const TYPE_ECOMMERCE = 'TYPE_ECOMMERCE';
const TYPE_ENTERPRISE_GRID_WPCOM = 'TYPE_ENTERPRISE_GRID_WPCOM';
const TYPE_WOOEXPRESS_SMALL = 'TYPE_WOOEXPRESS_SMALL';
const TYPE_WOOEXPRESS_MEDIUM = 'TYPE_WOOEXPRESS_MEDIUM';
const TYPE_WOO_EXPRESS_PLUS = 'TYPE_WOO_EXPRESS_PLUS';
const TYPE_SECURITY_DAILY = 'TYPE_SECURITY_DAILY';
const TYPE_SECURITY_REALTIME = 'TYPE_SECURITY_REALTIME';
const TYPE_SECURITY_T1 = 'TYPE_SECURITY_T1';
const TYPE_SECURITY_T2 = 'TYPE_SECURITY_T2';
const TYPE_JETPACK_STARTER = 'TYPE_JETPACK_STARTER';
const TYPE_ALL = 'TYPE_ALL';
const TYPE_P2_PLUS = 'TYPE_P2_PLUS';
const TYPE_FLEXIBLE = 'TYPE_FLEXIBLE';
const TYPE_PRO = 'TYPE_PRO';
const TYPE_STARTER = 'TYPE_STARTER';
const TYPE_GOLDEN_TOKEN = 'TYPE_GOLDEN_TOKEN';
const TYPES_LIST = [TYPE_FREE, TYPE_BLOGGER, TYPE_PERSONAL, TYPE_PREMIUM, TYPE_BUSINESS, TYPE_100_YEAR, TYPE_ECOMMERCE, TYPE_ENTERPRISE_GRID_WPCOM, TYPE_WOOEXPRESS_SMALL, TYPE_WOOEXPRESS_MEDIUM, TYPE_WOO_EXPRESS_PLUS, TYPE_SECURITY_DAILY, TYPE_SECURITY_REALTIME, TYPE_ALL, TYPE_P2_PLUS, TYPE_FLEXIBLE, TYPE_PRO, TYPE_STARTER, TYPE_GOLDEN_TOKEN, TYPE_JETPACK_STARTER, TYPE_SECURITY_T1, TYPE_SECURITY_T2];

/***/ }),

/***/ 7904:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A2: () => (/* binding */ PLAN_P2_FREE),
/* harmony export */   A3: () => (/* binding */ PLAN_ECOMMERCE_3_YEARS),
/* harmony export */   AY: () => (/* binding */ PRODUCT_WPCOM_SEARCH),
/* harmony export */   Cq: () => (/* binding */ PLAN_WPCOM_FLEXIBLE),
/* harmony export */   DN: () => (/* binding */ PLAN_WOOEXPRESS_MEDIUM),
/* harmony export */   FC: () => (/* binding */ PLAN_ECOMMERCE_TRIAL_MONTHLY),
/* harmony export */   G6: () => (/* binding */ PLAN_PREMIUM_2_YEARS),
/* harmony export */   Id: () => (/* binding */ PLAN_WPCOM_STARTER),
/* harmony export */   JA: () => (/* binding */ PLAN_ECOMMERCE),
/* harmony export */   Je: () => (/* binding */ PLAN_WOOEXPRESS_MEDIUM_MONTHLY),
/* harmony export */   MY: () => (/* binding */ PRODUCT_WPCOM_SEARCH_MONTHLY),
/* harmony export */   Ml: () => (/* binding */ PLAN_P2_PLUS),
/* harmony export */   OE: () => (/* binding */ PLAN_PREMIUM_MONTHLY),
/* harmony export */   Qm: () => (/* binding */ PLAN_PERSONAL_2_YEARS),
/* harmony export */   Rl: () => (/* binding */ PLAN_HOSTING_TRIAL_MONTHLY),
/* harmony export */   T$: () => (/* binding */ PLAN_MIGRATION_TRIAL_MONTHLY),
/* harmony export */   TI: () => (/* binding */ PLAN_PERSONAL_3_YEARS),
/* harmony export */   TW: () => (/* binding */ PLAN_BLOGGER),
/* harmony export */   Wg: () => (/* binding */ PLAN_BUSINESS_MONTHLY),
/* harmony export */   _$: () => (/* binding */ PLAN_WOOEXPRESS_SMALL),
/* harmony export */   _B: () => (/* binding */ PLAN_PREMIUM_3_YEARS),
/* harmony export */   _d: () => (/* binding */ PLAN_FREE),
/* harmony export */   _s: () => (/* binding */ PLAN_WPCOM_PRO),
/* harmony export */   dU: () => (/* binding */ PLAN_WPCOM_PRO_MONTHLY),
/* harmony export */   f3: () => (/* binding */ PLAN_ECOMMERCE_2_YEARS),
/* harmony export */   fD: () => (/* binding */ PLAN_100_YEARS),
/* harmony export */   gt: () => (/* binding */ PLAN_ENTERPRISE_GRID_WPCOM),
/* harmony export */   hh: () => (/* binding */ PLAN_BUSINESS_3_YEARS),
/* harmony export */   hq: () => (/* binding */ PLAN_WOOEXPRESS_PLUS),
/* harmony export */   j2: () => (/* binding */ PLAN_BUSINESS_2_YEARS),
/* harmony export */   jG: () => (/* binding */ PLAN_WOOEXPRESS_SMALL_MONTHLY),
/* harmony export */   ln: () => (/* binding */ PLAN_WPCOM_PRO_2_YEARS),
/* harmony export */   lv: () => (/* binding */ PLAN_ECOMMERCE_MONTHLY),
/* harmony export */   mi: () => (/* binding */ GROUP_P2),
/* harmony export */   p7: () => (/* binding */ PLAN_BUSINESS),
/* harmony export */   sy: () => (/* binding */ PLAN_PERSONAL),
/* harmony export */   uS: () => (/* binding */ PLAN_BLOGGER_2_YEARS),
/* harmony export */   w9: () => (/* binding */ GROUP_WPCOM),
/* harmony export */   wm: () => (/* binding */ PLAN_PERSONAL_MONTHLY),
/* harmony export */   xf: () => (/* binding */ PLAN_PREMIUM)
/* harmony export */ });
/* unused harmony exports PRODUCT_NO_ADS, PRODUCT_WPCOM_UNLIMITED_THEMES, PRODUCT_1GB_SPACE, PRODUCT_WPCOM_CUSTOM_DESIGN, WPCOM_SEARCH_PRODUCTS, WPCOM_PRODUCTS, PLAN_HOST_BUNDLE, PLAN_WPCOM_ENTERPRISE, PLAN_CHARGEBACK, PLAN_VIP, WPCOM_PLANS, WPCOM_MONTHLY_PLANS, WOO_EXPRESS_PLANS, WPCOM_PREMIUM_PLANS, WPCOM_DIFM_LITE, PLAN_BUSINESS_ONBOARDING_EXPIRE, PLAN_BUSINESS_2Y_ONBOARDING_EXPIRE */
const GROUP_WPCOM = 'GROUP_WPCOM';
const GROUP_P2 = 'GROUP_P2';

// Products
const PRODUCT_NO_ADS = 'no-adverts/no-adverts.php';
const PRODUCT_WPCOM_SEARCH = 'wpcom_search';
const PRODUCT_WPCOM_SEARCH_MONTHLY = 'wpcom_search_monthly';
const PRODUCT_WPCOM_UNLIMITED_THEMES = 'unlimited_themes';
const PRODUCT_1GB_SPACE = 'wordpress_com_1gb_space_addon_yearly';
const PRODUCT_WPCOM_CUSTOM_DESIGN = 'custom-design';
const WPCOM_SEARCH_PRODUCTS = [PRODUCT_WPCOM_SEARCH, PRODUCT_WPCOM_SEARCH_MONTHLY];
const WPCOM_PRODUCTS = [...WPCOM_SEARCH_PRODUCTS];

// Plans
const PLAN_BUSINESS_MONTHLY = 'business-bundle-monthly';
const PLAN_BUSINESS = 'business-bundle';
const PLAN_BUSINESS_2_YEARS = 'business-bundle-2y';
const PLAN_BUSINESS_3_YEARS = 'business-bundle-3y';
const PLAN_100_YEARS = 'wp_com_hundred_year_bundle_centennially';
const PLAN_PREMIUM_MONTHLY = 'value_bundle_monthly';
const PLAN_PREMIUM = 'value_bundle';
const PLAN_PREMIUM_2_YEARS = 'value_bundle-2y';
const PLAN_PREMIUM_3_YEARS = 'value_bundle-3y';
const PLAN_PERSONAL_MONTHLY = 'personal-bundle-monthly';
const PLAN_PERSONAL = 'personal-bundle';
const PLAN_PERSONAL_2_YEARS = 'personal-bundle-2y';
const PLAN_PERSONAL_3_YEARS = 'personal-bundle-3y';
const PLAN_BLOGGER = 'blogger-bundle';
const PLAN_BLOGGER_2_YEARS = 'blogger-bundle-2y';
const PLAN_ECOMMERCE_MONTHLY = 'ecommerce-bundle-monthly';
const PLAN_ECOMMERCE = 'ecommerce-bundle';
const PLAN_ECOMMERCE_2_YEARS = 'ecommerce-bundle-2y';
const PLAN_ECOMMERCE_TRIAL_MONTHLY = 'ecommerce-trial-bundle-monthly';
const PLAN_WOOEXPRESS_SMALL = 'wooexpress-small-bundle-yearly';
const PLAN_WOOEXPRESS_SMALL_MONTHLY = 'wooexpress-small-bundle-monthly';
const PLAN_WOOEXPRESS_MEDIUM = 'wooexpress-medium-bundle-yearly';
const PLAN_WOOEXPRESS_MEDIUM_MONTHLY = 'wooexpress-medium-bundle-monthly';
const PLAN_WOOEXPRESS_PLUS = 'wooexpress-plus'; // Not a real plan;
const PLAN_ECOMMERCE_3_YEARS = 'ecommerce-bundle-3y';
const PLAN_FREE = 'free_plan';
const PLAN_HOST_BUNDLE = 'host-bundle';
const PLAN_WPCOM_ENTERPRISE = 'wpcom-enterprise';
const PLAN_CHARGEBACK = 'chargeback';
const PLAN_VIP = 'vip';
const PLAN_P2_PLUS = 'wp_p2_plus_monthly';
const PLAN_P2_FREE = 'p2_free_plan'; // Not a real plan; it's a renamed WP.com Free for the P2 project.
const PLAN_WPCOM_FLEXIBLE = 'wpcom-flexible'; // Not a real plan; it's a renamed WP.com Free for the plans overhaul.
const PLAN_WPCOM_PRO = 'pro-plan';
const PLAN_WPCOM_PRO_MONTHLY = 'pro-plan-monthly';
const PLAN_WPCOM_PRO_2_YEARS = 'pro-plan-2y';
const PLAN_WPCOM_STARTER = 'starter-plan';
const PLAN_ENTERPRISE_GRID_WPCOM = 'plan-enterprise-grid-wpcom'; // Not a real plan; we show the VIP section in the plans grid as part of pdgrnI-1Qp-p2.
const PLAN_MIGRATION_TRIAL_MONTHLY = 'wp_bundle_migration_trial_monthly';
const PLAN_HOSTING_TRIAL_MONTHLY = 'wp_bundle_hosting_trial_monthly';
const WPCOM_PLANS = [PLAN_BUSINESS_MONTHLY, PLAN_BUSINESS, PLAN_BUSINESS_2_YEARS, PLAN_BUSINESS_3_YEARS, PLAN_100_YEARS, PLAN_PREMIUM_MONTHLY, PLAN_PREMIUM, PLAN_PREMIUM_2_YEARS, PLAN_PREMIUM_3_YEARS, PLAN_PERSONAL_MONTHLY, PLAN_PERSONAL, PLAN_PERSONAL_2_YEARS, PLAN_PERSONAL_3_YEARS, PLAN_BLOGGER, PLAN_BLOGGER_2_YEARS, PLAN_ECOMMERCE_MONTHLY, PLAN_ECOMMERCE, PLAN_ECOMMERCE_2_YEARS, PLAN_ECOMMERCE_3_YEARS, PLAN_ECOMMERCE_TRIAL_MONTHLY, PLAN_MIGRATION_TRIAL_MONTHLY, PLAN_HOSTING_TRIAL_MONTHLY, PLAN_FREE, PLAN_HOST_BUNDLE, PLAN_WPCOM_ENTERPRISE, PLAN_CHARGEBACK, PLAN_VIP, PLAN_P2_PLUS, PLAN_P2_FREE, PLAN_WPCOM_FLEXIBLE, PLAN_WPCOM_PRO, PLAN_WPCOM_PRO_MONTHLY, PLAN_WPCOM_PRO_2_YEARS, PLAN_WPCOM_STARTER, PLAN_ENTERPRISE_GRID_WPCOM, PLAN_WOOEXPRESS_MEDIUM, PLAN_WOOEXPRESS_MEDIUM_MONTHLY, PLAN_WOOEXPRESS_SMALL, PLAN_WOOEXPRESS_SMALL_MONTHLY, PLAN_WOOEXPRESS_PLUS];
const WPCOM_MONTHLY_PLANS = [PLAN_BUSINESS_MONTHLY, PLAN_PREMIUM_MONTHLY, PLAN_PERSONAL_MONTHLY, PLAN_ECOMMERCE_MONTHLY, PLAN_ECOMMERCE_TRIAL_MONTHLY, PLAN_MIGRATION_TRIAL_MONTHLY, PLAN_HOSTING_TRIAL_MONTHLY, PLAN_WOOEXPRESS_MEDIUM_MONTHLY, PLAN_WOOEXPRESS_SMALL_MONTHLY, PLAN_WOOEXPRESS_PLUS, PLAN_WPCOM_PRO_MONTHLY, PLAN_ENTERPRISE_GRID_WPCOM, PLAN_FREE];
const WOO_EXPRESS_PLANS = [PLAN_WOOEXPRESS_MEDIUM, PLAN_WOOEXPRESS_MEDIUM_MONTHLY, PLAN_WOOEXPRESS_SMALL, PLAN_WOOEXPRESS_SMALL_MONTHLY, PLAN_WOOEXPRESS_PLUS];
const WPCOM_PREMIUM_PLANS = [PLAN_PREMIUM_MONTHLY, PLAN_PREMIUM, PLAN_PREMIUM_2_YEARS, PLAN_PREMIUM_3_YEARS];
const WPCOM_DIFM_LITE = 'wp_difm_lite';
const PLAN_BUSINESS_ONBOARDING_EXPIRE = '2021-07-31T00:00:00+00:00';
const PLAN_BUSINESS_2Y_ONBOARDING_EXPIRE = '2022-07-31T00:00:00+00:00';

/***/ }),

/***/ 4112:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Sl: () => (/* binding */ calculateMonthlyPriceForPlan)
/* harmony export */ });
/* unused harmony exports getPlans, getPlanFeaturesGrouped, getWooExpressFeaturesGrouped, getPlansSlugs, getPlan, getPlanByPathSlug, getPlanPath, getPlanClass, planHasFeature, planHasAtLeastOneFeature, getAllFeaturesForPlan, planHasSuperiorFeature, shouldFetchSitePlans, getMonthlyPlanByYearly, getYearlyPlanByMonthly, getBiennialPlan, getTriennialPlan, planLevelsMatch, isEcommercePlan, isProPlan, isBusinessPlan, isPremiumPlan, isPersonalPlan, isBloggerPlan, isFreePlan, isFreeHostingTrial, isBusinessTrial, is100YearPlan, isWpcomEnterpriseGridPlan, isWooExpressPlusPlan, isWooExpressMediumPlan, isWooExpressSmallPlan, isWooExpressPlan, isFlexiblePlan, isStarterPlan, isJetpackStarterPlan, isSecurityDailyPlan, isSecurityRealTimePlan, isSecurityT1Plan, isSecurityT2Plan, isCompletePlan, isWpComPlan, isWpComBusinessPlan, isWpComEcommercePlan, isWpComProPlan, isWpComPremiumPlan, isWpComPersonalPlan, isWpComBloggerPlan, isWpComFreePlan, isWpComAnnualPlan, isWpComBiennialPlan, isWpComTriennialPlan, isWpComMonthlyPlan, isJetpackBusinessPlan, isJetpackPremiumPlan, isJetpackPersonalPlan, isJetpackFreePlan, isJetpackOfferResetPlan, isP2FreePlan, isP2PlusPlan, findFirstSimilarPlanKey, findSimilarPlansKeys, findPlansKeys, planMatches, calculateMonthlyPrice, getBillingMonthsForTerm, getBillingYearsForTerm, getBillingTermForMonths, plansLink, applyTestFiltersToPlansList, applyTestFiltersToProductsList, getPlanTermLabel, getPopularPlanSpec, chooseDefaultCustomerType, planHasJetpackSearch, planHasJetpackClassicSearch */
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3239);
/* harmony import */ var _plans_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5192);




function getPlans() {
  return PLANS_LIST;
}
function getPlanFeaturesGrouped() {
  return featureGroups;
}
function getWooExpressFeaturesGrouped() {
  return wooExpressFeatureGroups;
}
function getPlansSlugs() {
  return Object.keys(getPlans());
}
function getPlan(planKey) {
  if (typeof planKey !== 'string') {
    if (Object.values(_plans_list__WEBPACK_IMPORTED_MODULE_0__/* .PLANS_LIST */ .E).includes(planKey)) {
      return planKey;
    }
    return undefined;
  }
  return _plans_list__WEBPACK_IMPORTED_MODULE_0__/* .PLANS_LIST */ .E[planKey];
}
function getPlanByPathSlug(pathSlug, group) {
  let plans = Object.values(PLANS_LIST);
  plans = plans.filter(p => group ? p.group === group : true);
  return plans.find(p => typeof p.getPathSlug === 'function' && p.getPathSlug() === pathSlug);
}
function getPlanPath(plan) {
  const retrievedPlan = getPlan(plan);
  const slug = retrievedPlan?.getPathSlug || (() => undefined);
  return slug();
}
function getPlanClass(planKey) {
  if (isFreePlan(planKey)) {
    return 'is-free-plan';
  }
  if (isFlexiblePlan(planKey)) {
    return 'is-flexible-plan';
  }
  if (isBloggerPlan(planKey)) {
    return 'is-blogger-plan';
  }
  if (isPersonalPlan(planKey)) {
    return 'is-personal-plan';
  }
  if (isPremiumPlan(planKey)) {
    return 'is-premium-plan';
  }
  if (isBusinessPlan(planKey)) {
    return 'is-business-plan';
  }
  if (isWooExpressPlusPlan(planKey)) {
    return 'is-wooexpress-plus-plan';
  }
  if (isWooExpressMediumPlan(planKey)) {
    return 'is-wooexpress-medium-plan';
  }
  if (isWooExpressSmallPlan(planKey)) {
    return 'is-wooexpress-small-plan';
  }
  if (isEcommercePlan(planKey)) {
    return 'is-ecommerce-plan';
  }
  if (isWpcomEnterpriseGridPlan(planKey)) {
    return 'is-wpcom-enterprise-grid-plan';
  }
  if (isProPlan(planKey)) {
    return 'is-pro-plan';
  }
  if (isSecurityDailyPlan(planKey)) {
    return 'is-daily-security-plan';
  }
  if (isSecurityRealTimePlan(planKey)) {
    return 'is-realtime-security-plan';
  }
  if (isSecurityT1Plan(planKey)) {
    return 'is-security-t1';
  }
  if (isSecurityT2Plan(planKey)) {
    return 'is-security-t2';
  }
  if (isCompletePlan(planKey)) {
    return 'is-complete-plan';
  }
  if (isFreeHostingTrial(planKey)) {
    return 'is-free-hosting-trial';
  }
  if (isP2PlusPlan(planKey)) {
    return 'is-p2-plus-plan';
  }
  return '';
}

/**
 * Determines if a plan has a specific feature.
 *
 * Collects features for a plan by calling all possible feature methods for the plan.
 */
function planHasFeature(plan, feature) {
  const allFeatures = getAllFeaturesForPlan(plan);
  return allFeatures.includes(feature);
}

/**
 * Determine if a plan has at least one of several features.
 */
function planHasAtLeastOneFeature(plan, features) {
  const allFeatures = getAllFeaturesForPlan(plan);
  return features.some(feature => allFeatures.includes(feature));
}

/**
 * Get all features for a plan
 *
 * Collects features for a plan by calling all possible feature methods for the plan.
 *
 * Returns an array of all the plan features (may have duplicates)
 */
function getAllFeaturesForPlan(plan) {
  const planObj = getPlan(plan);
  if (!planObj) {
    return [];
  }
  return [...('getPlanCompareFeatures' in planObj && planObj.getPlanCompareFeatures ? planObj.getPlanCompareFeatures() : []), ...('getPromotedFeatures' in planObj && planObj.getPromotedFeatures ? planObj.getPromotedFeatures() : []), ...('getSignupFeatures' in planObj && planObj.getSignupFeatures ? planObj.getSignupFeatures() : []), ...('getSignupCompareAvailableFeatures' in planObj && planObj.getSignupCompareAvailableFeatures ? planObj.getSignupCompareAvailableFeatures() : []), ...('getBlogSignupFeatures' in planObj && planObj.getBlogSignupFeatures ? planObj.getBlogSignupFeatures() : []), ...('getPortfolioSignupFeatures' in planObj && planObj.getPortfolioSignupFeatures ? planObj.getPortfolioSignupFeatures() : []), ...('getIncludedFeatures' in planObj && planObj.getIncludedFeatures ? planObj.getIncludedFeatures() : [])];
}

/**
 * Determines if a plan has a superior version of a specific feature.
 */
function planHasSuperiorFeature(plan, feature) {
  const planConstantObj = getPlan(plan);
  const features = planConstantObj?.getInferiorFeatures?.() ?? [];
  return features.includes(feature);
}
function shouldFetchSitePlans(sitePlans) {
  return !sitePlans.hasLoadedFromServer && !sitePlans.isRequesting;
}

/**
 * Returns the monthly slug which corresponds to the provided yearly slug or "" if the slug is
 * not a recognized or cannot be converted.
 */
function getMonthlyPlanByYearly(planSlug) {
  const plan = getPlan(planSlug);
  if (plan && 'getMonthlySlug' in plan && plan.getMonthlySlug) {
    return plan.getMonthlySlug();
  }
  return findFirstSimilarPlanKey(planSlug, {
    term: TERM_MONTHLY
  }) || '';
}

/**
 * Returns the yearly slug which corresponds to the provided monthly slug or "" if the slug is
 * not a recognized or cannot be converted.
 */
function getYearlyPlanByMonthly(planSlug) {
  const plan = getPlan(planSlug);
  if (plan && 'getAnnualSlug' in plan && plan.getAnnualSlug) {
    return plan.getAnnualSlug();
  }
  return findFirstSimilarPlanKey(planSlug, {
    term: TERM_ANNUALLY
  }) || '';
}

/**
 * Returns the biennial slug which corresponds to the provided slug or "" if the slug is
 * not a recognized or cannot be converted.
 */
function getBiennialPlan(planSlug) {
  return findFirstSimilarPlanKey(planSlug, {
    term: TERM_BIENNIALLY
  }) || '';
}

/**
 * Returns the triennial slug which corresponds to the provided slug or "" if the slug is
 * not recognized or cannot be converted.
 */
function getTriennialPlan(planSlug) {
  return findFirstSimilarPlanKey(planSlug, {
    term: TERM_TRIENNIALLY
  }) || '';
}

/**
 * Returns true if plan "types" match regardless of their interval.
 *
 * For example (fake plans):
 *     planLevelsMatch( PRO_YEARLY, PRO_YEARLY ) => true
 *     planLevelsMatch( PRO_YEARLY, PRO_MONTHLY ) => true
 *     planLevelsMatch( PRO_YEARLY, PERSONAL_YEARLY ) => false
 */
function planLevelsMatch(planSlugA, planSlugB) {
  const planA = getPlan(planSlugA);
  const planB = getPlan(planSlugB);
  return Boolean(planA && planB && planA.type === planB.type && planA.group === planB.group);
}
function isEcommercePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_ECOMMERCE
  });
}
function isProPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PRO
  });
}
function isBusinessPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_BUSINESS
  });
}
function isPremiumPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PREMIUM
  });
}
function isPersonalPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PERSONAL
  });
}
function isBloggerPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_BLOGGER
  });
}
function isFreePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_FREE
  });
}
function isFreeHostingTrial(planSlug) {
  return planSlug === PLAN_HOSTING_TRIAL_MONTHLY;
}
function isBusinessTrial(planSlug) {
  return planSlug === PLAN_HOSTING_TRIAL_MONTHLY || planSlug === PLAN_MIGRATION_TRIAL_MONTHLY;
}
function is100YearPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_100_YEAR
  });
}

// Checks if it is an Enterprise plan (a.k.a VIP), introduced as part of pdgrnI-1Qp-p2.
// This is not a real plan, but added to display Enterprise in the pricing grid.
function isWpcomEnterpriseGridPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_ENTERPRISE_GRID_WPCOM,
    group: GROUP_WPCOM
  });
}
function isWooExpressPlusPlan(planSlug) {
  return PLAN_WOOEXPRESS_PLUS === planSlug;
}
function isWooExpressMediumPlan(planSlug) {
  return [PLAN_WOOEXPRESS_MEDIUM, PLAN_WOOEXPRESS_MEDIUM_MONTHLY].includes(planSlug);
}
function isWooExpressSmallPlan(planSlug) {
  return [PLAN_WOOEXPRESS_SMALL, PLAN_WOOEXPRESS_SMALL_MONTHLY].includes(planSlug);
}
function isWooExpressPlan(planSlug) {
  return WOO_EXPRESS_PLANS.includes(planSlug);
}
function isFlexiblePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_FLEXIBLE
  });
}
function isStarterPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_STARTER
  });
}
function isJetpackStarterPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_JETPACK_STARTER
  });
}
function isSecurityDailyPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_SECURITY_DAILY
  });
}
function isSecurityRealTimePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_SECURITY_REALTIME
  });
}
function isSecurityT1Plan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_SECURITY_T1
  });
}
function isSecurityT2Plan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_SECURITY_T2
  });
}
function isCompletePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_ALL
  });
}
function isWpComPlan(planSlug) {
  return planMatches(planSlug, {
    group: GROUP_WPCOM
  });
}
function isWpComBusinessPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_BUSINESS,
    group: GROUP_WPCOM
  });
}
function isWpComEcommercePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_ECOMMERCE,
    group: GROUP_WPCOM
  });
}
function isWpComProPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PRO,
    group: GROUP_WPCOM
  });
}
function isWpComPremiumPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PREMIUM,
    group: GROUP_WPCOM
  });
}
function isWpComPersonalPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PERSONAL,
    group: GROUP_WPCOM
  });
}
function isWpComBloggerPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_BLOGGER,
    group: GROUP_WPCOM
  });
}
function isWpComFreePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_FREE,
    group: GROUP_WPCOM
  });
}
function isWpComAnnualPlan(planSlug) {
  return planMatches(planSlug, {
    term: TERM_ANNUALLY,
    group: GROUP_WPCOM
  });
}
function isWpComBiennialPlan(planSlug) {
  return planMatches(planSlug, {
    term: TERM_BIENNIALLY,
    group: GROUP_WPCOM
  });
}
function isWpComTriennialPlan(planSlug) {
  return planMatches(planSlug, {
    term: TERM_TRIENNIALLY,
    group: GROUP_WPCOM
  });
}
function isWpComMonthlyPlan(planSlug) {
  return planMatches(planSlug, {
    term: TERM_MONTHLY,
    group: GROUP_WPCOM
  });
}
function isJetpackBusinessPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_BUSINESS,
    group: GROUP_JETPACK
  });
}
function isJetpackPremiumPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PREMIUM,
    group: GROUP_JETPACK
  });
}
function isJetpackPersonalPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_PERSONAL,
    group: GROUP_JETPACK
  });
}
function isJetpackFreePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_FREE,
    group: GROUP_JETPACK
  });
}
function isJetpackOfferResetPlan(planSlug) {
  return JETPACK_RESET_PLANS.includes(planSlug);
}
function isP2FreePlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_FREE,
    group: GROUP_P2
  });
}
function isP2PlusPlan(planSlug) {
  return planMatches(planSlug, {
    type: TYPE_P2_PLUS
  });
}
function findFirstSimilarPlanKey(planKey, diff) {
  return findSimilarPlansKeys(planKey, diff)[0];
}

/**
 * A similar plan is one that has the same `type`, `group`, and `term` as first
 * argument, except for differences specified in the second argument.
 *
 * For example:
 *
 * > findSimilarPlansKeys( TYPE_BUSINESS, { term: TERM_BIENNIALLY } );
 * [PLAN_BUSINESS_2_YEARS]
 * > findSimilarPlansKeys( TYPE_JETPACK_BUSINESS_MONTHLY, { type: TYPE_ANNUALLY } );
 * [TYPE_JETPACK_BUSINESS]
 */
function findSimilarPlansKeys(planKey, diff = {}) {
  const plan = getPlan(planKey);
  // @TODO: make getPlan() throw an error on failure. This is going to be a larger change with a separate PR.
  if (!plan) {
    return [];
  }
  return findPlansKeys({
    type: plan.type,
    group: plan.group,
    term: plan.term,
    ...diff
  });
}

/**
 * Finds all keys of plans matching a query
 *
 * For example:
 *
 * > findPlansKeys( { term: TERM_BIENNIALLY } );
 * [PLAN_PERSONAL_2_YEARS, PLAN_PREMIUM_2_YEARS, PLAN_BUSINESS_2_YEARS]
 */
function findPlansKeys(query = {}) {
  const plans = getPlans();
  return Object.keys(plans).filter(k => planMatches(plans[k], query));
}

/**
 * Matches plan specified by `planKey` against `query`.
 * Only compares `type`, `group`, and `term` properties.
 *
 * For example:
 *
 * > planMatches( TYPE_BUSINESS, { term: TERM_ANNUALLY, group: GROUP_WPCOM, type: TYPE_BUSINESS } );
 * true
 *
 * > planMatches( TYPE_BUSINESS, { term: TERM_BIENNIALLY } );
 * false
 */
function planMatches(planKey, query = {}) {
  const acceptedKeys = ['type', 'group', 'term'];
  const unknownKeys = Object.keys(query).filter(key => !acceptedKeys.includes(key));
  if (unknownKeys.length) {
    throw new Error(`planMatches can only match against ${acceptedKeys.join(',')}, ` + `but unknown keys ${unknownKeys.join(',')} were passed.`);
  }

  // @TODO: make getPlan() throw an error on failure. This is going to be a larger change with a separate PR.
  const plan = getPlan(planKey);
  if (!plan) {
    return false;
  }
  if ((!('type' in query) || plan.type === query.type) && (!('group' in query) || plan.group === query.group) && (!('term' in query) || plan.term === query.term)) {
    return true;
  }
  return false;
}
function calculateMonthlyPriceForPlan(planSlug, termPrice) {
  const plan = getPlan(planSlug);
  if (!plan) {
    throw new Error(`Unknown plan: ${planSlug}`);
  }
  return calculateMonthlyPrice(plan.term, termPrice);
}
function calculateMonthlyPrice(term, termPrice) {
  const divisor = getBillingMonthsForTerm(term);
  return parseFloat((termPrice / divisor).toFixed(2));
}
function getBillingMonthsForTerm(term) {
  if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_MONTHLY */ .ob) {
    return 1;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_ANNUALLY */ .w$) {
    return 12;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_BIENNIALLY */ .SU) {
    return 24;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_TRIENNIALLY */ .IL) {
    return 36;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_QUADRENNIALLY */ .pK) {
    return 48;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_QUINQUENNIALLY */ .Zc) {
    return 60;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_SEXENNIALLY */ .k1) {
    return 72;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_SEPTENNIALLY */ .TN) {
    return 84;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_OCTENNIALLY */ .tb) {
    return 96;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_NOVENNIALLY */ .GP) {
    return 108;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_DECENNIALLY */ .I$) {
    return 120;
  } else if (term === _constants__WEBPACK_IMPORTED_MODULE_1__/* .TERM_CENTENNIALLY */ .F$) {
    return 1200;
  }
  throw new Error(`Unknown term: ${term}`);
}
function getBillingYearsForTerm(term) {
  if (term === TERM_MONTHLY) {
    return 0;
  } else if (term === TERM_ANNUALLY) {
    return 1;
  } else if (term === TERM_BIENNIALLY) {
    return 2;
  } else if (term === TERM_TRIENNIALLY) {
    return 3;
  } else if (term === TERM_CENTENNIALLY) {
    return 100;
  }
  throw new Error(`Unknown term: ${term}`);
}
function getBillingTermForMonths(term) {
  if (term === 1) {
    return TERM_MONTHLY;
  } else if (term === 12) {
    return TERM_ANNUALLY;
  } else if (term === 24) {
    return TERM_BIENNIALLY;
  } else if (term === 36) {
    return TERM_TRIENNIALLY;
  } else if (term === 48) {
    return TERM_QUADRENNIALLY;
  } else if (term === 60) {
    return TERM_QUINQUENNIALLY;
  } else if (term === 72) {
    return TERM_SEXENNIALLY;
  } else if (term === 84) {
    return TERM_SEPTENNIALLY;
  } else if (term === 96) {
    return TERM_OCTENNIALLY;
  } else if (term === 108) {
    return TERM_NOVENNIALLY;
  } else if (term === 120) {
    return TERM_DECENNIALLY;
  } else if (term === 1200) {
    return TERM_CENTENNIALLY;
  }
  throw new Error(`Unknown term: ${term}`);
}
function plansLink(urlString, siteSlug, intervalType, forceIntervalType = false) {
  const url = new URL(urlString, window.location.origin);
  if ('monthly' === intervalType || forceIntervalType) {
    url.pathname += '/' + intervalType;
  }
  if (siteSlug) {
    url.pathname += '/' + siteSlug;
  }
  if (urlString.startsWith('/')) {
    return url.pathname + url.search;
  }
  return url.toString();
}
function applyTestFiltersToPlansList(planName, abtest, extraArgs = {}) {
  const plan = getPlan(planName);
  if (!plan) {
    throw new Error(`Unknown plan: ${planName}`);
  }
  const filteredPlanConstantObj = {
    ...plan
  };
  const filteredPlanFeaturesConstantList = 'getPlanCompareFeatures' in plan && plan.getPlanCompareFeatures ? plan.getPlanCompareFeatures(abtest, extraArgs) : [];

  /* eslint-disable @typescript-eslint/no-empty-function */

  // these becomes no-ops when we removed some of the abtest overrides, but
  // we're leaving the code in place for future tests
  const removeDisabledFeatures = () => {};
  const updatePlanDescriptions = () => {};
  const updatePlanFeatures = () => {};

  /* eslint-enable */

  removeDisabledFeatures();
  updatePlanDescriptions();
  updatePlanFeatures();
  return {
    ...filteredPlanConstantObj,
    getPlanCompareFeatures: () => filteredPlanFeaturesConstantList
  };
}
function applyTestFiltersToProductsList(productName) {
  const product = getProductFromSlug(productName);
  if (typeof product === 'string') {
    throw new Error(`Unknown product ${productName} `);
  }
  const filteredProductConstantObj = {
    ...product
  };

  /* eslint-disable @typescript-eslint/no-empty-function */

  // these becomes no-ops when we removed some of the abtest overrides, but
  // we're leaving the code in place for future tests
  const removeDisabledFeatures = () => {};
  const updatePlanDescriptions = () => {};
  const updatePlanFeatures = () => {};

  /* eslint-enable */

  removeDisabledFeatures();
  updatePlanDescriptions();
  updatePlanFeatures();
  return {
    ...filteredProductConstantObj,
    getPlanCompareFeatures: () => []
  };
}
function getPlanTermLabel(planName, translate) {
  const plan = getPlan(planName);
  if (!plan || !plan.term) {
    return;
  }
  switch (plan.term) {
    case TERM_MONTHLY:
      return translate('Monthly subscription');
    case TERM_ANNUALLY:
      return translate('Annual subscription');
    case TERM_BIENNIALLY:
      return translate('Two year subscription');
    case TERM_TRIENNIALLY:
      return translate('Three year subscription');
    case TERM_CENTENNIALLY:
      return translate('Hundred year subscription');
  }
}
const getPopularPlanSpec = ({
  flowName,
  customerType,
  isJetpack,
  availablePlans
}) => {
  // Jetpack doesn't currently highlight "Popular" plans
  if (isJetpack) {
    return false;
  }
  if (availablePlans.length === 0) {
    return false;
  }
  const defaultPlan = getPlan(availablePlans[0]);
  if (!defaultPlan) {
    return false;
  }
  const group = GROUP_WPCOM;
  if (flowName === 'hosting') {
    return {
      type: TYPE_BUSINESS,
      group
    };
  }
  if (flowName === 'link-in-bio' || flowName === 'link-in-bio-tld') {
    return {
      type: TYPE_PERSONAL,
      group
    };
  }
  if (customerType === 'personal') {
    if (availablePlans.findIndex(isPremiumPlan) !== -1) {
      return {
        type: TYPE_PREMIUM,
        group
      };
    }
    // when customerType is not personal, default to business
  } else if (availablePlans.findIndex(isBusinessPlan) !== -1) {
    return {
      type: TYPE_BUSINESS,
      group
    };
  }

  // finally, just return the default one.
  return {
    type: defaultPlan.type,
    group
  };
};
function isValueTruthy(value) {
  return !!value;
}
const chooseDefaultCustomerType = ({
  currentCustomerType,
  selectedPlan,
  currentPlan
}) => {
  if (currentCustomerType) {
    return currentCustomerType;
  }
  const group = GROUP_WPCOM;
  const businessPlanSlugs = [findPlansKeys({
    group,
    term: TERM_ANNUALLY,
    type: TYPE_PREMIUM
  })[0], findPlansKeys({
    group,
    term: TERM_BIENNIALLY,
    type: TYPE_PREMIUM
  })[0], findPlansKeys({
    group,
    term: TERM_TRIENNIALLY,
    type: TYPE_PREMIUM
  })[0], findPlansKeys({
    group,
    term: TERM_ANNUALLY,
    type: TYPE_BUSINESS
  })[0], findPlansKeys({
    group,
    term: TERM_BIENNIALLY,
    type: TYPE_BUSINESS
  })[0], findPlansKeys({
    group,
    term: TERM_TRIENNIALLY,
    type: TYPE_BUSINESS
  })[0], findPlansKeys({
    group,
    term: TERM_ANNUALLY,
    type: TYPE_ECOMMERCE
  })[0], findPlansKeys({
    group,
    term: TERM_BIENNIALLY,
    type: TYPE_ECOMMERCE
  })[0], findPlansKeys({
    group,
    term: TERM_TRIENNIALLY,
    type: TYPE_ECOMMERCE
  })[0], findPlansKeys({
    group,
    term: TERM_ANNUALLY,
    type: TYPE_PRO
  })[0], findPlansKeys({
    group,
    term: TERM_BIENNIALLY,
    type: TYPE_PRO
  })[0]].map(planKey => getPlan(planKey)).filter(isValueTruthy).map(plan => plan.getStoreSlug());
  if (selectedPlan) {
    return businessPlanSlugs.includes(selectedPlan) ? 'business' : 'personal';
  } else if (currentPlan) {
    const isPlanInBusinessGroup = businessPlanSlugs.indexOf(currentPlan.productSlug) !== -1;
    return isPlanInBusinessGroup ? 'business' : 'personal';
  }
  return 'personal';
};

/**
 * Determines if a plan includes Jetpack Search by looking at the plan's features.
 */
const planHasJetpackSearch = planSlug => planHasFeature(planSlug, FEATURE_JETPACK_SEARCH) || planHasFeature(planSlug, FEATURE_JETPACK_SEARCH_MONTHLY);

/**
 * Determines if a plan includes Jetpack Search Classic by checking available plans.
 */
function planHasJetpackClassicSearch(plan) {
  return plan && (isJetpackBusiness(plan) || isBusiness(plan) || isEnterprise(plan) || isEcommerce(plan) || isPro(plan) || isVipPlan(plan));
}

/***/ }),

/***/ 5192:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E: () => (/* binding */ PLANS_LIST)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(899);
/* harmony import */ var i18n_calypso__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1481);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3239);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(892);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1862);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7904);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5085);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2006);




function isValueTruthy(value) {
  return !!value;
}
function compact(elements) {
  return elements.filter(isValueTruthy);
}
const WPComGetBillingTimeframe = () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('per month, billed annually');
const WPComGetBiennialBillingTimeframe = () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('/month, billed every two years');
const WPComGetTriennialBillingTimeframe = () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('/month, billed every three years');
const getBiAnnualTimeframe = () => ({
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_BIENNIALLY */ .SU,
  getBillingTimeFrame: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('per 2 years')
});
const getAnnualTimeframe = () => ({
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
  getBillingTimeFrame: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('per year')
});
const getMonthlyTimeframe = () => ({
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_MONTHLY */ .ob,
  getBillingTimeFrame: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('per month, billed monthly')
});
const getJetpackCommonPlanDetails = () => ({
  getRecommendedFor: () => [{
    tag: _constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_TAG_FOR_WOOCOMMERCE_STORES */ .Wn,
    label: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('WooCommerce stores')
  }, {
    tag: _constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_TAG_FOR_NEWS_ORGANISATIONS */ .vE,
    label: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('News organizations')
  }, {
    tag: _constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_TAG_FOR_MEMBERSHIP_SITES */ .Cg,
    label: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Membership sites')
  }]
});
const getDotcomPlanDetails = () => ({
  // Features only available for annual plans
  getAnnualPlansOnlyFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_DOMAIN */ .MCU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_LIVE_CHAT_SUPPORT_ALL_DAYS */ .IhT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_LIVE_CHAT_SUPPORT_BUSINESS_DAYS */ .dmM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_BUSINESS_DAYS */ .N5t, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_ALL_DAYS */ .vkU]
});

/* eslint-disable wpcalypso/jsx-classname-namespace */
const plansDescriptionHeadingComponent = {
  components: {
    strong: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", {
      className: "plans__features plan-features__targeted-description-heading"
    })
  }
};
/* eslint-enable */

const getPlanFreeDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_FREE */ .UH,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Free'),
  getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for students'),
  getBlogAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for students'),
  getPortfolioAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for students'),
  getStoreAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for students'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Get a taste of the world’s most popular CMS & blogging software.'),
  getNewsletterTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Start fresh or make the switch, bringing your first 100 readers with you.'),
  getLinkInBioTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Get started for free with unlimited links and keep track of how many visits you get.'),
  getBlogOnboardingTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Not a trial – blog free for as long as you like.'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Get a free website and be on your way to publishing your ' + 'first post in less than five minutes.'),
  getPlanCompareFeatures: () => [
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_SUBDOMAIN */ .wJ_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ESSENTIAL */ .gqo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMUNITY_SUPPORT */ .U_2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES */ .jDM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_3GB_STORAGE */ .KlX],
  getSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMUNITY_SUPPORT */ .U_2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_SUBDOMAIN_SIGNUP */ .sYz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES_SIGNUP */ .R2o],
  getBlogSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMUNITY_SUPPORT */ .U_2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_SUBDOMAIN_SIGNUP */ .sYz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES_SIGNUP */ .R2o],
  getPortfolioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMUNITY_SUPPORT */ .U_2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_SUBDOMAIN_SIGNUP */ .sYz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES_SIGNUP */ .R2o],
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BEAUTIFUL_THEMES */ .dXP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAGES */ .a9c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_USERS */ .iRs, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_POST_EDITS_HISTORY */ .vcd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NEWSLETTERS_RSS */ .uT1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_BRUTE_FORCE */ .EZ7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SMART_REDIRECTS */ .FZm, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALWAYS_ONLINE */ .zB_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_10 */ .s$V],
  get2023PlanComparisonFeatureOverride: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BEAUTIFUL_THEMES */ .dXP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAGES */ .a9c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_USERS */ .iRs, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_POST_EDITS_HISTORY */ .vcd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NEWSLETTERS_RSS */ .uT1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_BRUTE_FORCE */ .EZ7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SMART_REDIRECTS */ .FZm, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALWAYS_ONLINE */ .zB_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BANDWIDTH */ .Hdl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FAST_DNS */ .Tsj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GLOBAL_EDGE_CACHING */ .BEQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CDN */ .BPG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DATACENTRE_FAILOVER */ ._po, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_UPDATES */ .bcr, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MULTI_SITE */ .AQq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_MALWARE */ .qbT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_DDOS */ .sHn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_10 */ .s$V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GROUP_PAYMENT_TRANSACTION_FEES */ .ZaE],
  get2023PricingGridSignupJetpackFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAID_SUBSCRIBERS_JP */ .j8V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_JP */ .iW8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DONATIONS_AND_TIPS_JP */ .ghB, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_BUTTONS_JP */ .p1e, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_JP */ .MBA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_JP */ .q6z, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LTD_SOCIAL_MEDIA_JP */ .Q_7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CONTACT_FORM_JP */ .hSm],
  get2023PlanComparisonJetpackFeatureOverride: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAID_SUBSCRIBERS_JP */ .j8V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DONATIONS_AND_TIPS_JP */ .ghB, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_JP */ .iW8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_BUTTONS_JP */ .p1e, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_JP */ .MBA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_JP */ .q6z, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CONTACT_FORM_JP */ .hSm, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_ACTIVITY_LOG_JP */ .NtL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHARES_SOCIAL_MEDIA_JP */ .TFL],
  get2023PricingGridSignupStorageOptions: () => {
    return [{
      slug: _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_1GB_STORAGE */ .Zaf,
      isAddOn: false
    }];
  },
  get2023PlanComparisonConditionalFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHARES_SOCIAL_MEDIA_JP */ .TFL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMISSION_FEE_STANDARD_FEATURES */ .DUl],
  getNewsletterSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NEWSLETTER_IMPORT_SUBSCRIBERS_FREE */ .OFy, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_JP */ .iW8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NEWSLETTERS_RSS */ .uT1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_EMAILS */ .Vhs, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_JP */ .MBA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BANDWIDTH */ .Hdl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LTD_SOCIAL_MEDIA_JP */ .Q_7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_10 */ .s$V],
  getLinkInBioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BEAUTIFUL_THEMES */ .dXP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAGES */ .a9c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADD_UNLIMITED_LINKS */ .y4L, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_JP */ .MBA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALWAYS_ONLINE */ .zB_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CONTACT_FORM_JP */ .hSm, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LTD_SOCIAL_MEDIA_JP */ .Q_7],
  getBlogOnboardingSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BEAUTIFUL_THEMES */ .dXP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAGES */ .a9c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_USERS */ .iRs, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_POST_EDITS_HISTORY */ .vcd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_BRUTE_FORCE */ .EZ7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALWAYS_ONLINE */ .zB_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_THE_READER */ .s2V],
  getBlogOnboardingSignupJetpackFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NEWSLETTER_IMPORT_SUBSCRIBERS_FREE */ .OFy, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_EMAILS */ .Vhs, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NEWSLETTERS_RSS */ .uT1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_JP */ .MBA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LTD_SOCIAL_MEDIA_JP */ .Q_7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_JP */ .q6z],
  getIncludedFeatures: () => [],
  getInferiorFeatures: () => [],
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_MANAGED_HOSTINGS */ .KG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_AND_SOCIAL */ ._o, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SECURITY_AND_SPAM */ .Zs, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_JETPACK_ESSENTIALS */ .$N],
      andMore: true
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_MANAGED_HOSTINGS */ .KG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_AND_SOCIAL */ ._o, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SECURITY_AND_SPAM */ .Zs, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_JETPACK_ESSENTIALS */ .$N],
      andMore: true
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_MANAGED_HOSTINGS */ .KG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_AND_SOCIAL */ ._o, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SECURITY_AND_SPAM */ .Zs],
      andMore: true
    }
  })
});
const getPlanBloggerDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_BLOGGER */ .M6,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Blogger'),
  // @TODO not updating copy for now, we need to update it after the first round of design {{{
  getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for bloggers'),
  getBlogAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for bloggers'),
  getPortfolioAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for bloggers'),
  getStoreAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for bloggers'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for bloggers:{{/strong}} Brand your blog with a custom .blog domain name, and remove all WordPress.com advertising. Receive additional storage space and customer support via email.', plansDescriptionHeadingComponent),
  getShortDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Brand your blog with a custom .blog domain name, and remove all WordPress.com advertising. Receive additional storage space and customer support via email.'),
  // }}}
  getPlanCompareFeatures: () => [
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BLOG_DOMAIN */ .Ai8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ESSENTIAL */ .gqo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT */ .n_S, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES */ .jDM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_6GB_STORAGE */ .W4b, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MEMBERSHIPS */ .EBu, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_BLOCK */ .EDT],
  getSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BLOG_DOMAIN */ .Ai8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_FREE_FEATURES */ .Uwp],
  getBlogSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_BLOG_DOMAIN */ .Q1W, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_FREE_FEATURES */ .Uwp],
  getPortfolioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_BLOG_DOMAIN */ .Q1W, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_FREE_FEATURES */ .Uwp],
  // Features not displayed but used for checking plan abilities
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUDIO_UPLOADS */ .XMd],
  getInferiorFeatures: () => [],
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: false
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: false
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: false
    }
  })
});
const getPlanPersonalDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_PERSONAL */ .mV,
  getTitle: () =>
  // translators: Starter is a plan name
  i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Starter'),
  getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for personal use'),
  getBlogAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for personal use'),
  getPortfolioAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for personal use'),
  getStoreAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for personal use'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Create your home on the web with a custom domain name.'),
  getNewsletterTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Monetize your writing, go ad-free, and expand your media content.'),
  getLinkInBioTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Take Link In Bio to the next level with gated content, paid subscribers, and an ad-free site.'),
  getBlogOnboardingTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Take the next step with gated content, paid subscribers, and an ad-free site.'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for personal use:{{/strong}} Boost your' + ' website with a custom domain name, and remove all WordPress.com advertising. ' + 'Unlock unlimited, expert customer support via email.', plansDescriptionHeadingComponent),
  getShortDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Boost your website with a custom domain name, and remove all WordPress.com advertising. ' + 'Unlock unlimited, expert customer support via email.'),
  getPlanCompareFeatures: () => compact([
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ESSENTIAL */ .gqo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT */ .n_S, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES */ .jDM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_6GB_STORAGE */ .W4b, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MEMBERSHIPS */ .EBu, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_BLOCK */ .EDT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_8 */ .DU6]),
  getSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_DOMAIN */ .MCU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES */ .jDM],
  getBlogSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_DOMAIN */ .MCU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_FREE_FEATURES */ .Uwp],
  getPortfolioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_DOMAIN */ .MCU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_FREE_FEATURES */ .Uwp],
  getSignupCompareAvailableFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COLLECT_PAYMENTS_V2 */ .$4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe],
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FAST_DNS */ .Tsj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SUPPORT_EMAIL */ .jby, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_8 */ .DU6],
  get2023PlanComparisonFeatureOverride: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FAST_DNS */ .Tsj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SUPPORT_EMAIL */ .jby, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_8 */ .DU6],
  get2023PricingGridSignupStorageOptions: () => {
    return [{
      slug: _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_6GB_STORAGE */ .W4b,
      isAddOn: false
    }];
  },
  get2023PlanComparisonConditionalFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHARES_SOCIAL_MEDIA_JP */ .TFL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMISSION_FEE_STANDARD_FEATURES */ .DUl],
  getNewsletterDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Jumpstart your Newsletter with a custom domain, ad-free experience, and the ability to sell subscriptions, take payments, and collect donations from day one. Backed with email support to help get everything just right.'),
  getNewsletterSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_SUBSCRIBERS */ .nl4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SUPPORT_EMAIL */ .jby, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_8 */ .DU6],
  getNewsletterHighlightedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_EMAILS */ .Vhs, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV],
  getLinkInBioDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Stand out and unlock earnings with an ad-free site, custom domain, and the ability to sell subscriptions, take payments, and collect donations. Backed with email support to help get your site just right.'),
  getLinkInBioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SUPPORT_EMAIL */ .jby, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COLLECT_PAYMENTS_LINK_IN_BIO */ .cMD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAID_SUBSCRIBERS_JP */ .j8V],
  getLinkInBioHighlightedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2],
  getBlogOnboardingSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FAST_DNS */ .Tsj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SUPPORT_EMAIL */ .jby, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_8 */ .DU6],
  getBlogOnboardingHighlightedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2],
  getBlogOnboardingSignupJetpackFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_SUBSCRIBERS */ .nl4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_JP */ .iW8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAID_SUBSCRIBERS_JP */ .j8V],
  getCheckoutFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SUPPORT_EMAIL */ .jby, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FAST_DNS */ .Tsj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAID_SUBSCRIBERS_JP */ .j8V],
  // Features not displayed but used for checking plan abilities
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUDIO_UPLOADS */ .XMd],
  getInferiorFeatures: () => [],
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: false
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: false
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: false
    }
  })
});
const getPlanEcommerceDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_ECOMMERCE */ .h7,
  getTitle: () =>
  // translators: Entrepreneur is a plan name
  i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Entrepreneur'),
  getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for online stores'),
  getBlogAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for online stores'),
  getPortfolioAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for online stores'),
  getStoreAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for online stores'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Create a powerful online store with built-in premium extensions.'),
  getDescription: () => {
    return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for online stores:{{/strong}} Sell products or services with this powerful, ' + 'all-in-one online store experience. This plan includes premium integrations and is extendable, ' + 'so it’ll grow with you as your business grows.', plansDescriptionHeadingComponent);
  },
  getShortDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Sell products or services with this powerful, ' + 'all-in-one online store experience. This plan includes premium integrations and is extendable, ' + 'so it’ll grow with you as your business grows.'),
  getTagline: function () {
    return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Learn more about everything included with %(planName)s and take advantage of its powerful marketplace features.', {
      args: {
        planName: this.getTitle()
      }
    });
  },
  getPlanCompareFeatures: (_, {
    isLoggedInMonthlyPricing
  } = {}) => compact([
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ADVANCED */ .c74, isLoggedInMonthlyPricing && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT */ .n_S, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MEMBERSHIPS */ .EBu, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_BLOCK */ .EDT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, isLoggedInMonthlyPricing && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_ALL_DAYS */ .vkU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS */ .iTE, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_PLUGINS */ .xjj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES */ .Tmz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SFTP_DATABASE */ .cWM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_BRANDING */ .Q3C, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_PAYMENTS */ .$xY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_CARRIERS */ .$23, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_PRODUCTS_SERVICES */ .Xif, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ECOMMERCE_MARKETING */ .Do2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CUSTOMIZABE_THEMES */ .$vg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_0 */ .MpJ]),
  getPromotedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli],
  getSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_PAYMENTS */ .$xY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_CARRIERS */ .$23, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_BUSINESS_FEATURES */ .kI],
  getBlogSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_PAYMENTS */ .$xY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_CARRIERS */ .$23, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_BUSINESS_FEATURES */ .kI],
  getPortfolioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_PAYMENTS */ .$xY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_CARRIERS */ .$23, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_BUSINESS_FEATURES */ .kI],
  getSignupCompareAvailableFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COLLECT_PAYMENTS_V2 */ .$4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_ALL_DAYS */ .vkU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EARN_AD */ .Tx8, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INSTALL_PLUGINS */ .V09, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_EXPANDED_ABBR */ .vqo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_BACKUPS_AND_RESTORE */ ._3A, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SFTP_DATABASE */ .cWM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_PAYMENTS */ .$xY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_CARRIERS */ .$23, _constants__WEBPACK_IMPORTED_MODULE_5__/* .PREMIUM_DESIGN_FOR_STORES */ .fp6].filter(isValueTruthy),
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_STORE_THEMES */ .Pm5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STORE_DESIGN */ .TNr, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_PRODUCTS */ .OMq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DISPLAY_PRODUCTS_BRAND */ .N64, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_ADD_ONS */ .NxG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ASSEMBLED_KITS */ .jY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MIN_MAX_QTY */ .aWA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STOCK_NOTIFS */ .Wa6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DYNAMIC_UPSELLS */ .pgw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LOYALTY_PROG */ .xrd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_MARKETING_AUTOMATION */ .Crh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BULK_DISCOUNTS */ .VWq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INVENTORY_MGMT */ .VUF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STREAMLINED_CHECKOUT */ .IxF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SELL_60_COUNTRIES */ .UQo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_INTEGRATIONS */ .Pnf, i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .ZP.hasTranslation('%(commission)d%% transaction fee for all payment features') || ['en', 'en-gb'].includes((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .getLocaleSlug */ .Yj)() || '') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_0_ALL */ .TaL : _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_0 */ .MpJ],
  getCheckoutFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLUGINS_THEMES */ .alZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_PAYMENTS */ .$xY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_CARRIERS */ .$23, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_PRODUCTS_SERVICES */ .Xif, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LOYALTY_PROG */ .xrd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INVENTORY */ .nIy, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_MARKETING_AUTOMATION */ .Crh],
  get2023PricingGridSignupJetpackFeatures: () => [],
  get2023PricingGridSignupStorageOptions: (showLegacyStorageFeature, isCurrentPlan) => {
    let storageOptionSlugs = [];
    const storageAddOns = [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE_ADD_ON */ ._Z$, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_100GB_STORAGE_ADD_ON */ .T3v];
    if (showLegacyStorageFeature && isCurrentPlan) {
      storageOptionSlugs = [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6];
    } else {
      storageOptionSlugs = (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('plans/updated-storage-labels') ? [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE */ .SLH, ...storageAddOns] : [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6];
    }
    return storageOptionSlugs.map(slug => {
      return {
        slug: slug,
        isAddOn: storageAddOns.includes(slug)
      };
    });
  },
  get2023PlanComparisonConditionalFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHARES_SOCIAL_MEDIA_JP */ .TFL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMISSION_FEE_STANDARD_FEATURES */ .DUl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMISSION_FEE_WOO_FEATURES */ .XzA],
  getHostingSignupFeatures: term => () => compact([term !== _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_MONTHLY */ .ob && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SELL_SHIP */ .oTu, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_STORE */ .GWM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INVENTORY */ .nIy, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CHECKOUT */ .PE6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_PAYMENTS_V2 */ .y03, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SALES_REPORTS */ .zh5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_CARRIERS */ .$23, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EXTENSIONS */ .FKL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BANDWIDTH */ .Hdl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GLOBAL_EDGE_CACHING */ .BEQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BURST */ .UAg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WAF_V2 */ .Wxo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CDN */ .BPG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CPUS */ .H_y, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DATACENTRE_FAILOVER */ ._po, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_MALWARE */ .qbT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_DDOS */ .sHn]),
  // Features not displayed but used for checking plan abilities
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUDIO_UPLOADS */ .XMd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_MY_BUSINESS */ .ggN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CLOUDFLARE_ANALYTICS */ .$G1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_INSTALL_PURCHASED_PLUGINS */ .n26, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES_PLUGINS */ .vEX, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_FORWARDING_EXTENDED_LIMIT */ .HPg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ATOMIC */ .FNU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getInferiorFeatures: () => [],
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_ACCEPT_PAYMENTS */ .bh, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SHIPPING_CARRIERS */ .ST, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_DESIGN */ .ec, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_TOOLS */ .NV],
      andMore: true
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_ACCEPT_PAYMENTS */ .bh, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SHIPPING_CARRIERS */ .ST, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_DESIGN */ .ec, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_TOOLS */ .NV],
      andMore: true
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_ACCEPT_PAYMENTS */ .bh, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SHIPPING_CARRIERS */ .ST, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_DESIGN */ .ec, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SELL_INTERNATIONALLY */ .JU8],
      andMore: true
    }
  })
});
const getWooExpressMediumPlanCompareFeatures = () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WOOCOMMERCE_STORE */ .NHK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WOOCOMMERCE_MOBILE_APP */ .AXh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDPRESS_CMS */ .JQK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDPRESS_MOBILE_APP */ .bp9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_SSL_CERTIFICATE */ .DJK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN */ .tP7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_ADMINS */ .SsD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT */ .n_S, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES_V2 */ .MA1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SALES_REPORTS */ .zh5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS_V3 */ ._lW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIST_UNLIMITED_PRODUCTS */ .AH6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GIFT_CARDS */ .sKk, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MIN_MAX_ORDER_QUANTITY */ .qpv, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_BUNDLES */ .cdC, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIST_PRODUCTS_BY_BRAND */ .c$s, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_RECOMMENDATIONS */ .cTd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INTEGRATED_PAYMENTS */ .r$c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INTERNATIONAL_PAYMENTS */ .E_W, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_SALES_TAXES */ .$iz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_LOCAL_PAYMENTS */ .yjx, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_RECURRING_PAYMENTS */ .HXS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MIN_MAX_ORDER_QUANTITY */ .qpv, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PROMOTE_ON_TIKTOK */ .QWL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SYNC_WITH_PINTEREST */ .ARL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CONNECT_WITH_FACEBOOK */ .gRh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACK_IN_STOCK_NOTIFICATIONS */ .fgK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MARKETING_AUTOMATION */ .S9g, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ABANDONED_CART_RECOVERY */ .Yg_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_TOOLS */ .ljn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVERTISE_ON_GOOGLE */ .i9T, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_ORDER_EMAILS */ .mFq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INTEGRATED_SHIPMENT_TRACKING */ .hOf, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_SHIPPING_RATES */ .PSd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DISCOUNTED_SHIPPING */ .Ws3, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRINT_SHIPPING_LABELS */ .hsL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION */ .y8T];
const getWooExpressSmallPlanCompareFeatures = () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WOOCOMMERCE_STORE */ .NHK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WOOCOMMERCE_MOBILE_APP */ .AXh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDPRESS_CMS */ .JQK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDPRESS_MOBILE_APP */ .bp9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_SSL_CERTIFICATE */ .DJK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN */ .tP7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_ADMINS */ .SsD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT */ .n_S, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES_V2 */ .MA1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SALES_REPORTS */ .zh5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS_V3 */ ._lW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIST_UNLIMITED_PRODUCTS */ .AH6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GIFT_CARDS */ .sKk, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIST_PRODUCTS_BY_BRAND */ .c$s, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INTEGRATED_PAYMENTS */ .r$c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INTERNATIONAL_PAYMENTS */ .E_W, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_SALES_TAXES */ .$iz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACCEPT_LOCAL_PAYMENTS */ .yjx, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_RECURRING_PAYMENTS */ .HXS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PROMOTE_ON_TIKTOK */ .QWL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SYNC_WITH_PINTEREST */ .ARL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CONNECT_WITH_FACEBOOK */ .gRh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_TOOLS */ .ljn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVERTISE_ON_GOOGLE */ .i9T, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_ORDER_EMAILS */ .mFq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INTEGRATED_SHIPMENT_TRACKING */ .hOf, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_SHIPPING_RATES */ .PSd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRINT_SHIPPING_LABELS */ .hsL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION */ .y8T];
const getWooExpressPlanCompareFeatures = () => [...getWooExpressSmallPlanCompareFeatures(), ...getWooExpressMediumPlanCompareFeatures()];
const getPlanWooExpressMediumDetails = () => ({
  ...getPlanEcommerceDetails(),
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Performance'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Accelerate your growth with advanced features.'),
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACK_IN_STOCK_NOTIFICATIONS */ .fgK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MARKETING_AUTOMATION */ .S9g, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_EMAIL_TRIGGERS */ .KgS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CART_ABANDONMENT_EMAILS */ .Cr_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_OFFER_BULK_DISCOUNTS */ .Ce5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_RECOMMEND_ADD_ONS */ .ixG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MIN_MAX_ORDER_QUANTITY */ .qpv],
  getPlanCompareFeatures: () => getWooExpressPlanCompareFeatures(),
  get2023PlanComparisonFeatureOverride: () => getWooExpressMediumPlanCompareFeatures(),
  get2023PricingGridSignupStorageOptions: () => {
    return [{
      slug: _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6,
      isAddOn: false
    }];
  },
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Learn more about everything included with Woo Express Performance and take advantage of its powerful marketplace features.')
});
const getPlanWooExpressSmallDetails = () => ({
  ...getPlanEcommerceDetails(),
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_LIVE_CHAT_SUPPORT */ .LiS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_ADMINS */ .SsD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE */ .SLH, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_PRODUCTS_SERVICES */ .Xif, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SELL_INTERNATIONALLY */ .JU8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATIC_SALES_TAX */ .p8y, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN */ .tP7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INTEGRATED_SHIPMENT_TRACKING */ .hOf, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REAL_TIME_ANALYTICS */ .Hrz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SELL_EGIFTS_AND_VOUCHERS */ .nWg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_MARKETING */ .SoP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MARKETPLACE_SYNC_SOCIAL_MEDIA_INTEGRATION */ ._U0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_TOOLS */ .ljn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION */ .y8T],
  getPlanCompareFeatures: () => getWooExpressPlanCompareFeatures(),
  get2023PlanComparisonFeatureOverride: () => getWooExpressSmallPlanCompareFeatures(),
  get2023PricingGridSignupStorageOptions: () => {
    return [{
      slug: _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE */ .SLH,
      isAddOn: false
    }];
  },
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Essential'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Everything you need to set up your store and start selling your products.'),
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Learn more about everything included with Woo Express Essential and take advantage of its powerful marketplace features.')
});
const getPlanPremiumDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_PREMIUM */ .Kb,
  getTitle: () =>
  // translators: Explorer is a plan name
  i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Explorer'),
  getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for freelancers'),
  getBlogAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for freelancers'),
  getPortfolioAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for freelancers'),
  getStoreAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for freelancers'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Build a unique website with powerful design tools.'),
  getNewsletterTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Make it even more memorable with premium designs and style customization.'),
  getLinkInBioTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Make a great first impression with premium designs and style customization.'),
  getBlogOnboardingTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Make it even more memorable with premium designs, 4K video, and style customization.'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for freelancers:{{/strong}} Build a unique website with advanced design tools, CSS editing, lots of space for audio and video,' + ' Google Analytics support,' + ' and the ability to monetize your site with ads.', plansDescriptionHeadingComponent),
  getShortDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Build a unique website with advanced design tools, CSS editing, lots of space for audio and video,' + ' Google Analytics support,' + ' and the ability to monetize your site with ads.'),
  getPlanCompareFeatures: (_, {
    isLoggedInMonthlyPricing
  } = {}) => compact([
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ESSENTIAL */ .gqo, isLoggedInMonthlyPricing && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT */ .n_S, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_13GB_STORAGE */ .E5t, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MEMBERSHIPS */ .EBu, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_BLOCK */ .EDT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, isLoggedInMonthlyPricing && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_BUSINESS_DAYS */ .N5t, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS */ .iTE, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_4 */ .MRS]),
  getPromotedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_13GB_STORAGE */ .E5t],
  getSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_BUSINESS_DAYS */ .N5t, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_PERSONAL_FEATURES */ .VyO],
  getTagline: function () {
    return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Take your Newsletter further, faster. Get everything included in %(planName)s, plus premium design themes, baked-in video uploads, ad monetization, deep visitor insights from Google Analytics, and live chat support.', {
      args: {
        planName: this.getTitle()
      }
    });
  },
  getNewsletterSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STYLE_CUSTOMIZATION */ .alN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES_V2 */ .MA1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLTD_SOCIAL_MEDIA_JP */ .HBO, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEOPRESS_JP */ .nXV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_PAID */ .ZTn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_4 */ .MRS],
  getNewsletterHighlightedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_EMAILS */ .Vhs, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AD_FREE_EXPERIENCE */ .pOV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REAL_TIME_ANALYTICS */ .Hrz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP],
  getLinkInBioDescription: function () {
    return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Take your site further, faster. Get everything included in %(planName)s, plus premium design themes, baked-in video uploads, ad monetization, deep visitor insights from Google Analytics, and live chat support.', {
      args: {
        planName: this.getTitle()
      }
    });
  },
  getLinkInBioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES_V2 */ .MA1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STYLE_CUSTOMIZATION */ .alN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEOPRESS_JP */ .nXV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLTD_SOCIAL_MEDIA_JP */ .HBO, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS */ .lRt, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_PAID */ .ZTn],
  getLinkInBioHighlightedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2],
  getBlogOnboardingSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES_V2 */ .MA1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STYLE_CUSTOMIZATION */ .alN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS */ .lRt, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_4 */ .MRS],
  getBlogOnboardingHighlightedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2],
  getBlogOnboardingSignupJetpackFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEOPRESS_JP */ .nXV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLTD_SOCIAL_MEDIA_JP */ .HBO, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_ACTIVITY_LOG_JP */ .NtL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_PAID */ .ZTn],
  getBlogSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MONETISE */ .SZ6, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_PERSONAL_FEATURES */ .VyO].filter(isValueTruthy),
  getPortfolioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_PERSONAL_FEATURES */ .VyO].filter(isValueTruthy),
  getSignupCompareAvailableFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COLLECT_PAYMENTS_V2 */ .$4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_BUSINESS_DAYS */ .N5t, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EARN_AD */ .Tx8, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms].filter(isValueTruthy),
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES_V2 */ .MA1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS */ .lRt, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STYLE_CUSTOMIZATION */ .alN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_4 */ .MRS],
  getCheckoutFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES_V2 */ .MA1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS */ .lRt, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STYLE_CUSTOMIZATION */ .alN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_PAID */ .ZTn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEOPRESS_JP */ .nXV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLTD_SOCIAL_MEDIA_JP */ .HBO, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_ACTIVITY_LOG_JP */ .NtL],
  get2023PricingGridSignupJetpackFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEOPRESS_JP */ .nXV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLTD_SOCIAL_MEDIA_JP */ .HBO, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_ACTIVITY_LOG_JP */ .NtL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_PAID */ .ZTn],
  get2023PricingGridSignupStorageOptions: () => {
    return [{
      slug: _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_13GB_STORAGE */ .E5t,
      isAddOn: false
    }];
  },
  get2023PlanComparisonConditionalFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHARES_SOCIAL_MEDIA_JP */ .TFL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMISSION_FEE_STANDARD_FEATURES */ .DUl],
  get2023PlanComparisonJetpackFeatureOverride: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYPAL_JP */ .RF_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEOPRESS_JP */ .nXV],
  // Features not displayed but used for checking plan abilities
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUDIO_UPLOADS */ .XMd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CLOUDFLARE_ANALYTICS */ .$G1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getInferiorFeatures: () => [],
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_THEMES */ .E9, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_GOOGLE_ANALYTICS */ .qK, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: false
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_LIVE_CHAT */ .kK, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_THEMES */ .E9, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_GOOGLE_ANALYTICS */ .qK, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_],
      andMore: false
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_THEMES */ .E9, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_GOOGLE_ANALYTICS */ .qK, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_COLLECT_PAYMENTS */ .j_, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_AD_FREE_SITE */ .vD],
      andMore: false
    }
  })
});
const getPlanBusinessDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_BUSINESS */ .Qj,
  getTitle: () =>
  // translators: Creator is a plan name
  i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Creator'),
  getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for small businesses'),
  getBlogAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for small businesses'),
  getPortfolioAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for small businesses'),
  getStoreAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('The plan for small businesses'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Unlock the power of WordPress with plugins and cloud tools.'),
  getBlogOnboardingTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Expand your blog with plugins and powerful tools to help you scale.'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for small businesses:{{/strong}} Power your' + ' business website with custom plugins and themes,' + ' %(nmOfGB)s GB storage, and the ability to remove WordPress.com branding.', {
    ...plansDescriptionHeadingComponent,
    args: {
      nmOfGB: (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('plans/updated-storage-labels') ? '50' : '200'
    }
  }),
  getShortDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Power your business website with custom plugins and themes,' + ' %(nmOfGB)s GB storage, and the ability to remove WordPress.com branding.', {
    args: {
      nmOfGB: (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('plans/updated-storage-labels') ? '50' : '200'
    }
  }),
  getTagline: function () {
    return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Learn more about everything included with %(planName)s and take advantage of its powerful marketplace features.', {
      args: {
        planName: this.getTitle()
      }
    });
  },
  getPlanCompareFeatures: (_, {
    isLoggedInMonthlyPricing
  } = {}) => compact([
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ADVANCED */ .c74, isLoggedInMonthlyPricing && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT */ .n_S, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE */ .SLH, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MEMBERSHIPS */ .EBu, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_BLOCK */ .EDT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, isLoggedInMonthlyPricing && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_ALL_DAYS */ .vkU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS */ .iTE, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_PLUGINS */ .xjj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES */ .Tmz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SFTP_DATABASE */ .cWM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_BRANDING */ .Q3C, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_2 */ .bA$]),
  getPromotedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS */ .iTE],
  getSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES_PLUGINS */ .vEX, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_TOOLS */ .ljn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_PREMIUM_FEATURES */ .Z5U],
  getBlogSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES_PLUGINS */ .vEX, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_TOOLS */ .ljn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_PREMIUM_FEATURES */ .Z5U],
  getPortfolioSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES_PLUGINS */ .vEX, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_PREMIUM_FEATURES */ .Z5U],
  getSignupCompareAvailableFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COLLECT_PAYMENTS_V2 */ .$4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT_ALL_DAYS */ .vkU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EARN_AD */ .Tx8, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INSTALL_PLUGINS */ .V09, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_EXPANDED_ABBR */ .vqo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_BACKUPS_AND_RESTORE */ ._3A, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SFTP_DATABASE */ .cWM].filter(isValueTruthy),
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLUGINS_THEMES */ .alZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BANDWIDTH */ .Hdl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GLOBAL_EDGE_CACHING */ .BEQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BURST */ .UAg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WAF_V2 */ .Wxo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CDN */ .BPG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CPUS */ .H_y, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DATACENTRE_FAILOVER */ ._po, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ISOLATED_INFRA */ .R9R, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_MALWARE */ .qbT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_DDOS */ .sHn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DEV_TOOLS */ .YPm, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_STAGING_SITES */ ._Ms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_UPDATES */ .bcr, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MULTI_SITE */ .AQq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_2_REGULAR */ .nLo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_0_WOO */ .JRF],
  getCheckoutFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLUGINS_THEMES */ .alZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BANDWIDTH */ .Hdl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CDN */ .BPG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_TOOLS */ .ljn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LIVE_CHAT_SUPPORT */ .Tez, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DEV_TOOLS */ .YPm, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REALTIME_BACKUPS_JP */ .cFx, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_ACTIVITY_LOG_JP */ .NtL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_DDOS */ .sHn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_STAGING_SITES */ ._Ms],
  get2023PricingGridSignupJetpackFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REALTIME_BACKUPS_JP */ .cFx, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ONE_CLICK_RESTORE_V2 */ .nCh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPTIME_MONITOR_JP */ .SMt, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ES_SEARCH_JP */ .eqi, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLUGIN_AUTOUPDATE_JP */ .B4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_JP */ .qC],
  get2023PlanComparisonConditionalFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_STORE_THEMES */ .Pm5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STORE_DESIGN */ .TNr, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_PRODUCTS */ .OMq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DISPLAY_PRODUCTS_BRAND */ .N64, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_ADD_ONS */ .NxG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ASSEMBLED_KITS */ .jY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MIN_MAX_QTY */ .aWA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STOCK_NOTIFS */ .Wa6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DYNAMIC_UPSELLS */ .pgw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_LOYALTY_PROG */ .xrd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_MARKETING_AUTOMATION */ .Crh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BULK_DISCOUNTS */ .VWq, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INVENTORY_MGMT */ .VUF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STREAMLINED_CHECKOUT */ .IxF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SELL_60_COUNTRIES */ .UQo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHIPPING_INTEGRATIONS */ .Pnf, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SHARES_SOCIAL_MEDIA_JP */ .TFL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMISSION_FEE_STANDARD_FEATURES */ .DUl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COMMISSION_FEE_WOO_FEATURES */ .XzA],
  get2023PricingGridSignupStorageOptions: showLegacyStorageFeature => {
    let storageOptionSlugs = [];
    const storageAddOns = [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE_ADD_ON */ ._Z$, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_100GB_STORAGE_ADD_ON */ .T3v];
    if (showLegacyStorageFeature) {
      storageOptionSlugs = [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6];
    } else {
      storageOptionSlugs = (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('plans/updated-storage-labels') ? [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE */ .SLH, ...storageAddOns] : [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_200GB_STORAGE */ .gI6];
    }
    return storageOptionSlugs.map(slug => {
      return {
        slug: slug,
        isAddOn: storageAddOns.includes(slug)
      };
    });
  },
  getHostingSignupFeatures: term => () => compact([term !== _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_MONTHLY */ .ob && _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLUGINS_THEMES */ .alZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BANDWIDTH */ .Hdl, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GLOBAL_EDGE_CACHING */ .BEQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BURST */ .UAg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WAF_V2 */ .Wxo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CDN */ .BPG, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CPUS */ .H_y, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DATACENTRE_FAILOVER */ ._po, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ISOLATED_INFRA */ .R9R, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_MALWARE */ .qbT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_DDOS */ .sHn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_DEV_TOOLS */ .YPm, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_STAGING_SITES */ ._Ms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_UPDATES */ .bcr, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MULTI_SITE */ .AQq]),
  getBlogOnboardingSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLUGINS_THEMES */ .alZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SECURITY_MALWARE */ .qbT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WP_UPDATES */ .bcr, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_TRANSACTION_FEES_2 */ .bA$],
  getBlogOnboardingSignupJetpackFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_JP */ .qC, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLUGIN_AUTOUPDATE_JP */ .B4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REALTIME_BACKUPS_JP */ .cFx, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ONE_CLICK_RESTORE_V2 */ .nCh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ES_SEARCH_JP */ .eqi],
  // Features not displayed but used for checking plan abilities
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUDIO_UPLOADS */ .XMd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_MY_BUSINESS */ .ggN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CLOUDFLARE_ANALYTICS */ .$G1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_INSTALL_PURCHASED_PLUGINS */ .n26, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_FORWARDING_EXTENDED_LIMIT */ .HPg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ATOMIC */ .FNU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getInferiorFeatures: () => [],
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_TOOLS */ .NV, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_BACKUPS_AND_RESTORE */ .ZJ, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SFTP_AND_DATABASE */ .BS, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EMAIL_SUPPORT */ .Ox],
      andMore: true
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_TOOLS */ .NV, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_BACKUPS_AND_RESTORE */ .ZJ, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SFTP_AND_DATABASE */ .BS, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_LIVE_CHAT */ .kK],
      andMore: true
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_TOOLS */ .NV, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_BACKUPS_AND_RESTORE */ .ZJ, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SFTP_AND_DATABASE */ .BS],
      andMore: true
    }
  })
});
const getPlanProDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_PRO */ .lY,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('WordPress Pro'),
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('This plan gives you access to our most powerful features at an affordable price for an unmatched value you won’t get anywhere else. No longer available to new users.'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('You’ve got our best deal on hosting! ' + 'Your Pro plan includes access to all the most popular features WordPress.com has to offer, including premium themes and access to over 50,000 plugins. ' + 'As an existing customer, you can keep your site on this plan as long as your subscription remains active.'),
  getSubTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Unlimited features. Unbeatable value.'),
  getPlanCompareFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_TRAFFIC */ .c__, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MANAGED_HOSTING */ .FiJ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES */ .jDM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_INSTALL_PLUGINS */ .V09, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_INSTALL_PURCHASED_PLUGINS */ .n26, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WOOCOMMERCE */ .O05, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_50GB_STORAGE */ .SLH, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_ADS */ .Xk_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_ADMINS */ .SsD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS */ .iTE, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_BLOCKS */ .x_7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SOCIAL_MEDIA_TOOLS */ .hH1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_TITAN_EMAIL */ .fDA, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MONETISE */ .SZ6, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SFTP_DATABASE */ .cWM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_BACKUPS_AND_RESTORE */ ._3A, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ESSENTIAL */ .gqo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO_EXPANDED_ABBR */ .vqo, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUDIO_UPLOADS */ .XMd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CLOUDFLARE_ANALYTICS */ .$G1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_COLLECT_PAYMENTS_V2 */ .$4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EARN_AD */ .Tx8, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_FORWARDING_EXTENDED_LIMIT */ .HPg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_MY_BUSINESS */ .ggN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_HOSTING */ .q4V, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_DESIGN_CUSTOMIZATION */ .rli, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MEMBERSHIPS */ .EBu, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_NO_BRANDING */ .Q3C, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_CONTENT_BLOCK */ .EDT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SFTP_DATABASE */ .cWM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_BACKUPS_AND_RESTORE */ ._3A, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_PLUGINS */ .xjj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES */ .Tmz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UPLOAD_THEMES_PLUGINS */ .vEX, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ATOMIC */ .FNU, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getPlanCancellationDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Heads up — you are currently on a legacy plan that is no longer available for new subscribers. ' + 'Your Pro plan includes access to all the most popular features WordPress.com has to offer, ' + 'including premium themes and access to over 50,000 plugins. As an existing Pro plan subscriber, ' + 'you can keep your site on this legacy plan as long as your subscription remains active. ' + 'If canceled, the WordPress.com Pro plan can no longer be added to your account.'),
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_THEMES */ .E9, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_HIGH_QUALITY_VIDEOS */ .pF, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SFTP_AND_DATABASE */ .BS],
      andMore: true
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_THEMES */ .E9, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_HIGH_QUALITY_VIDEOS */ .pF, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SFTP_AND_DATABASE */ .BS],
      andMore: true
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PLUGINS */ .yc, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_PREMIUM_THEMES */ .E9, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_HIGH_QUALITY_VIDEOS */ .pF],
      andMore: true
    }
  })
});

// The following is not a real plan, we are adding it here so that
// Woo Express Plus gets its own column in the plans grid.
const getPlanWooExpressPlusDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_WOO_EXPRESS_PLUS */ .nk,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Plus'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('For fast-growing businesses that need access to the most powerful tools.'),
  getDescription: () => '',
  get2023PricingGridSignupWpcomFeatures: () => [],
  get2023PricingGridSignupJetpackFeatures: () => [],
  get2023PricingGridSignupStorageOptions: () => []
});

// The following is not a real plan, we are adding it here so that
// VIP (a.k.a Enterprise) gets its own column in the plans grid.
// Check pdgrnI-1Qp-p2 for more details.
const get2023EnterprisGrideDetails = () => ({
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_ENTERPRISE_GRID_WPCOM */ .ci,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Enterprise'),
  getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for enterprises'),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Deliver an unmatched performance with the highest security standards on our enterprise content platform.'),
  getDescription: () => '',
  get2023PricingGridSignupWpcomFeatures: () => [],
  get2023PricingGridSignupJetpackFeatures: () => [],
  get2023PricingGridSignupStorageOptions: () => []
});
const getJetpackPersonalDetails = () => ({
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_PERSONAL */ .mV,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Personal'),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj].includes(plan),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for personal use:{{/strong}} Security essentials for your WordPress site, including ' + 'automated backups and priority support.', plansDescriptionHeadingComponent),
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Your data is being securely backed up and you have access to priority support.'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_DAILY_V2 */ .DwI, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ANTISPAM_V2 */ .CtJ],
  getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('per year'),
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_OFFSITE_BACKUP_VAULTPRESS_DAILY */ .s1f, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_30 */ .nsi, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_STORAGE_SPACE_UNLIMITED */ .$PM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_RESTORES */ .Rp9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_AKISMET_PLUS */ .V37, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EASY_SITE_MIGRATION */ .$QL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_OFFSITE_BACKUP_VAULTPRESS_DAILY */ .s1f, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_AKISMET_PLUS */ .V37, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACTIVITY_LOG */ .wUt, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_FREE_FEATURES_JETPACK */ .igx, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy]
});
const getJetpackPremiumDetails = () => ({
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_PREMIUM */ .Kb,
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL */ .ap, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL_MONTHLY */ .ns].includes(plan),
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Premium'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for small businesses:{{/strong}} Comprehensive, automated scanning for security vulnerabilities, ' + 'fast video hosting, and marketing automation.', plansDescriptionHeadingComponent),
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Your site is being secured and you have access to marketing tools and priority support.'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_DAILY_V2 */ .DwI, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SCAN_V2 */ .w7L, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ANTISPAM_V2 */ .CtJ],
  getIncludedFeatures: () => compact([
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_OFFSITE_BACKUP_VAULTPRESS_DAILY */ .s1f, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_30 */ .nsi, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_STORAGE_SPACE_UNLIMITED */ .$PM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_RESTORES */ .Rp9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_AKISMET_PLUS */ .V37, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EASY_SITE_MIGRATION */ .$QL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MALWARE_SCANNING_DAILY */ .zQV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS_BI_YEARLY */ .rV5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS */ .GwK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS_MONTHLY */ .w6W, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_OFFSITE_BACKUP_VAULTPRESS_DAILY */ .s1f, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_AKISMET_PLUS */ .V37, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MALWARE_SCANNING_DAILY */ .zQV, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATIC_SECURITY_FIXES */ .m1c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_FREE_FEATURES_JETPACK */ .igx, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy])
});
const getJetpackBusinessDetails = () => ({
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_BUSINESS */ .Qj,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Professional'),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PREMIUM */ .Xz, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PREMIUM_MONTHLY */ .p2, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL */ .ap, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL_MONTHLY */ .ns].includes(plan),
  getDescription: () => (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for organizations:{{/strong}} The most powerful WordPress sites.', plansDescriptionHeadingComponent) : i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for organizations:{{/strong}} The most powerful WordPress sites: real-time backups ' + 'and premium themes.', plansDescriptionHeadingComponent),
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('You have the full suite of security and performance tools.'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_REALTIME_V2 */ .csF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_SCAN_REALTIME_V2 */ .XgZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ANTISPAM_V2 */ .CtJ],
  getIncludedFeatures: () => compact([
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_OFFSITE_BACKUP_VAULTPRESS_REALTIME */ ._sL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_UNLIMITED */ .L2_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_STORAGE_SPACE_UNLIMITED */ .$PM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUTOMATED_RESTORES */ .Rp9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SPAM_AKISMET_PLUS */ .V37, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EASY_SITE_MIGRATION */ .$QL, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MALWARE_SCANNING_DAILY_AND_ON_DEMAND */ .vQ$, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ONE_CLICK_THREAT_RESOLUTION */ .E30, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME */ .s4b, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME_MONTHLY */ .TZT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS_BI_YEARLY */ .rV5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS */ .GwK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS_MONTHLY */ .w6W, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_OFFSITE_BACKUP_VAULTPRESS_REALTIME */ ._sL, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ALL_PREMIUM_FEATURES_JETPACK */ .PUy, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy]),
  getInferiorFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ]
});
const getPlanJetpackSecurityDailyDetails = () => ({
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_SECURITY_DAILY */ .VH,
  getTitle: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Security {{em}}Daily{{/em}}', {
    components: {
      em: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("em", null)
    }
  }),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, ..._constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_LEGACY_PLANS */ .$U].includes(plan),
  getDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('All of the essential Jetpack Security features in one package including VaultPress Backup, Scan, Akismet Anti-spam and more.'),
  getTagline: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Best for sites with occasional updates'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_BACKUP_DAILY_V2 */ .afj, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_SCAN_DAILY_V2 */ .oIe, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ANTISPAM_V2 */ .CtJ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WAF */ .YmK],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_30 */ .nsi, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy]
});
const getPlanJetpackSecurityRealtimeDetails = () => ({
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_SECURITY_REALTIME */ .VP,
  getTitle: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Security {{em}}Real-time{{/em}}', {
    components: {
      em: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("em", {
        style: {
          whiteSpace: 'nowrap'
        }
      })
    }
  }),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY */ .Vl, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY_MONTHLY */ .Dl, ..._constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_LEGACY_PLANS */ .$U].includes(plan),
  getDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Get next-level protection with real-time backups, real-time scan and all essential security tools.'),
  getTagline: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Best for sites with frequent updates'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLAN_SECURITY_DAILY */ .X2I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_BACKUP_REALTIME_V2 */ .HpB, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_SCAN_REALTIME_V2 */ .XgZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACTIVITY_LOG_1_YEAR_V2 */ .n$d],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME */ .s4b, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME_MONTHLY */ .TZT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_UNLIMITED */ .L2_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getInferiorFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_30 */ .nsi]
});
const getPlanJetpackSecurityT1Details = () => ({
  ...getJetpackCommonPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_SECURITY_T1 */ .w,
  getTitle: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Security', {
    context: 'Jetpack product name'
  }),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, ..._constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_LEGACY_PLANS */ .$U].includes(plan),
  getDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Easy-to-use, comprehensive WordPress site security including backups, malware scanning, and spam protection.'),
  getFeaturedDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('This bundle includes:{{ul}}{{li}}VaultPress Backup (10GB){{/li}}{{li}}Scan{{/li}}{{li}}Akismet Anti-spam (10k API calls/mo){{/li}}{{/ul}}', {
    components: {
      ul: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null),
      li: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null)
    },
    comment: '{{ul}}{{ul/}} represents an unordered list, and {{li}}{/li} represents a list item'
  }),
  getLightboxDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Easy-to-use, comprehensive WordPress site security including backups, malware scanning, and spam protection.{{br/}}Includes VaultPress Backup, Jetpack Scan, and Akismet Anti-spam.', {
    components: {
      br: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)
    },
    comment: '{{br/}} represents a line break'
  }),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_PRODUCT_BACKUP */ .VZW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_REAL_TIME_MALWARE_SCANNING */ .xlk, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ANTISPAM_V2 */ .CtJ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WAF */ .YmK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_30_DAY_ARCHIVE_ACTIVITY_LOG */ .DtS],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T1_BI_YEARLY */ ._sk, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T1_YEARLY */ .$pY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T1_MONTHLY */ .mX4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_UNLIMITED */ .L2_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getBenefits: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Protect your revenue stream and content'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Learn about issues before your customers are impacted'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Restore your site in one click from desktop or mobile'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Fix your site without a developer'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Protect Woo order and customer data'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Save time manually reviewing spam'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Best-in-class support from WordPress experts')],
  getInferiorFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ]
});
const getPlanJetpackSecurityT2Details = () => ({
  ...getPlanJetpackSecurityT1Details(),
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_SECURITY_T2 */ .$h,
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PLAN_SECURITY_DAILY */ .X2I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_BACKUP_REALTIME_V2 */ .HpB, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_SCAN_REALTIME_V2 */ .XgZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WAF */ .YmK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_1_YEAR_ARCHIVE_ACTIVITY_LOG */ .ZY2],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T2_YEARLY */ .tS0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T2_MONTHLY */ .L2R, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_UNLIMITED */ .L2_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getInferiorFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_30 */ .nsi]
});
const getPlanJetpackCompleteDetails = () => ({
  ...getJetpackCommonPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_ALL */ .L7,
  getTitle: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Complete', {
    context: 'Jetpack plan name'
  }),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, ..._constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_SECURITY_PLANS */ .jj, ..._constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_LEGACY_PLANS */ .$U].includes(plan),
  getDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Get the full power of Jetpack with all Security, Performance, Growth, and Design tools.'),
  getFeaturedDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Get the full Jetpack suite with real-time security tools, improved site performance, and tools to grow your business.'),
  getLightboxDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Full Jetpack suite with real-time security, instant site search, ad-free video, all CRM extensions, and extra storage for backups and video.'),
  getTagline: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('For best-in-class WordPress sites'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ALL_BACKUP_SECURITY_FEATURES */ .lYf, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_1TB_BACKUP_STORAGE */ .puh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_PRODUCT_VIDEOPRESS */ .sQp, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_SEARCH_V2 */ .dZ$, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CRM_V2 */ .rDn, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_1_YEAR_ARCHIVE_ACTIVITY_LOG */ .ZY2],
  getIncludedFeatures: () => compact([_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T2_YEARLY */ .tS0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T2_MONTHLY */ .L2R, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SEARCH_BI_YEARLY */ .Mrh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SEARCH */ .lv3, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SEARCH_MONTHLY */ .ewW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_CRM */ .liF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_CRM_MONTHLY */ .DJ3, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_UNLIMITED */ .L2_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BOOST_BI_YEARLY */ .JT_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BOOST */ .Ayy, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BOOST_MONTHLY */ .bsv, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SOCIAL_ADVANCED_BI_YEARLY */ .SH3, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SOCIAL_ADVANCED */ .sGT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SOCIAL_ADVANCED_MONTHLY */ .sTW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS_BI_YEARLY */ .rV5, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS */ .GwK, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_VIDEOPRESS_MONTHLY */ .w6W, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CLOUD_CRITICAL_CSS */ ._vQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('themes/premium') ? _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_THEMES */ .QfP : null, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STATS_PAID */ .ZTn]),
  getInferiorFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_30 */ .nsi, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SOCIAL_BASIC_BI_YEARLY */ .n2c, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SOCIAL_BASIC */ .AvT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SOCIAL_BASIC_MONTHLY */ .iC1],
  getBenefits: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Protect your revenue stream and content'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Learn about issues before your customers are impacted'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Restore your site in one click from desktop or mobile'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Fix your site without a developer'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Protect Woo order and customer data'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Save time manually reviewing spam'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Grow your business with video, social, and CRM tools'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Best-in-class support from WordPress experts')]
});
const getPlanJetpackStarterDetails = () => ({
  ...getJetpackCommonPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_JETPACK_STARTER */ .SW,
  getTitle: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Starter', {
    context: 'Jetpack product name'
  }),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, ..._constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_LEGACY_PLANS */ .$U].includes(plan),
  getTagline: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Essential security tools: real-time backups and comment spam protection.'),
  getDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Essential security tools: real-time backups and comment spam protection.'),
  getFeaturedDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('This bundle includes:{{ul}}{{li}}VaultPress Backup (1GB){{/li}}{{li}}Akismet Anti-spam (1k API calls/mo){{/li}}{{/ul}}', {
    components: {
      ul: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null),
      li: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null)
    },
    comment: '{{ul}}{{ul/}} represents an unordered list, and {{li}}{/li} represents a list item'
  }),
  getRecommendedFor: () => [{
    tag: _constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_TAG_FOR_SMALL_SITES */ .KW,
    label: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Small sites')
  }, {
    tag: _constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_TAG_FOR_BLOGS */ .l3,
    label: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Blogs')
  }],
  getLightboxDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Essential security tools: real-time backups and comment spam protection.'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_PRODUCT_BACKUP */ .VZW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ANTISPAM_V2 */ .CtJ],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T0_YEARLY */ .Azg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T0_MONTHLY */ .OJ1, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_BI_YEARLY */ .VOS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM */ .zrQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_ANTI_SPAM_MONTHLY */ .T$h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_UNLIMITED */ .L2_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_ANTISPAM */ .Ly9, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getBenefits: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Protect your revenue stream and content'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Restore your site in one click from desktop or mobile'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Fix your site without a developer'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Protect Woo order and customer data'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Save time manually reviewing spam'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Best-in-class support from WordPress experts')],
  getInferiorFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ]
});
const getPlanJetpackGoldenTokenDetails = () => ({
  group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_GOLDEN_TOKEN */ .l8,
  getTitle: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Golden Token', {
    context: 'The name of a Jetpack plan awarded to amazing WordPress sites'
  }),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj, ..._constants__WEBPACK_IMPORTED_MODULE_4__/* .JETPACK_LEGACY_PLANS */ .$U].includes(plan),
  getDescription: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('The Golden Token provides a lifetime license for Backup and Scan.'),
  getTagline: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('A lifetime of Jetpack powers for your website'),
  getPlanCardFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_BACKUP_REALTIME_V2 */ .HpB, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PRODUCT_SCAN_REALTIME_V2 */ .XgZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ACTIVITY_LOG_1_YEAR_V2 */ .n$d],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME */ .s4b, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME_MONTHLY */ .TZT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_UNLIMITED */ .L2_, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_VIDEO_UPLOADS_JETPACK_PRO */ .QNW, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_REPUBLICIZE */ .Zjz, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SIMPLE_PAYMENTS */ .Vml, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_WORDADS_INSTANT */ .Ej, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PREMIUM_SUPPORT */ .J8D, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_SCAN */ .ikw, _constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_BACKUPS */ .DEy],
  getInferiorFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BACKUP_ARCHIVE_30 */ .nsi]
});

// DO NOT import. Use `getPlan` instead.
const PLANS_LIST = {
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d]: {
    ...getPlanFreeDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('No expiration date'),
    getProductId: () => 1,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d,
    getPathSlug: () => 'beginner'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW]: {
    ...getPlanBloggerDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: WPComGetBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d].includes(plan),
    getProductId: () => 1010,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW,
    getPathSlug: () => 'blogger'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS]: {
    ...getPlanBloggerDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_BIENNIALLY */ .SU,
    getBillingTimeFrame: WPComGetBiennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW].includes(plan),
    getProductId: () => 1030,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS,
    getPathSlug: () => 'blogger-2-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm]: {
    ...getPlanPersonalDetails(),
    ...getMonthlyTimeframe(),
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS].includes(plan),
    getProductId: () => 1019,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm,
    getPathSlug: () => 'personal-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy]: {
    ...getPlanPersonalDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: WPComGetBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm].includes(plan),
    getProductId: () => 1009,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy,
    getPathSlug: () => 'personal'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm]: {
    ...getPlanPersonalDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_BIENNIALLY */ .SU,
    getBillingTimeFrame: WPComGetBiennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy].includes(plan),
    getProductId: () => 1029,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm,
    getPathSlug: () => 'personal-2-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_3_YEARS */ .TI]: {
    ...getPlanPersonalDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_TRIENNIALLY */ .IL,
    getBillingTimeFrame: WPComGetTriennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm].includes(plan),
    getProductId: () => 1049,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_3_YEARS */ .TI,
    getPathSlug: () => 'personal-3-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE]: {
    ...getPlanPremiumDetails(),
    ...getMonthlyTimeframe(),
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm].includes(plan),
    getProductId: () => 1013,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE,
    getPathSlug: () => 'premium-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf]: {
    ...getPlanPremiumDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: WPComGetBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id].includes(plan),
    getProductId: () => 1003,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf,
    getPathSlug: () => 'premium'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6]: {
    ...getPlanPremiumDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_BIENNIALLY */ .SU,
    getBillingTimeFrame: WPComGetBiennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf].includes(plan),
    getProductId: () => 1023,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6,
    getPathSlug: () => 'premium-2-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_3_YEARS */ ._B]: {
    ...getPlanPremiumDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_TRIENNIALLY */ .IL,
    getBillingTimeFrame: WPComGetTriennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_3_YEARS */ .TI, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6].includes(plan),
    getProductId: () => 1043,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_3_YEARS */ ._B,
    getPathSlug: () => 'premium-3-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg]: {
    ...getPlanBusinessDetails(),
    ...getMonthlyTimeframe(),
    availableFor: plan => (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('upgrades/wpcom-monthly-plans') && [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1018,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg,
    getPathSlug: () => 'business-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7]: {
    ...getPlanBusinessDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: WPComGetBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1008,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7,
    getPathSlug: () => 'business'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_2_YEARS */ .j2]: {
    ...getPlanBusinessDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_BIENNIALLY */ .SU,
    getBillingTimeFrame: WPComGetBiennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_2_YEARS */ .ln, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1028,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_2_YEARS */ .j2,
    getPathSlug: () => 'business-2-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_3_YEARS */ .hh]: {
    ...getPlanBusinessDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_TRIENNIALLY */ .IL,
    getBillingTimeFrame: WPComGetTriennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_3_YEARS */ .TI, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_3_YEARS */ ._B, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_2_YEARS */ .j2, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_2_YEARS */ .ln, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1048,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_3_YEARS */ .hh,
    getPathSlug: () => 'business-3-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_100_YEARS */ .fD]: {
    ...getPlanBusinessDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_CENTENNIALLY */ .F$,
    group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_100_YEAR */ .cF,
    // Todo: ¯\_(ツ)_/¯ on the copy.
    getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('100-Year Plan'),
    getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for long-term thinkers'),
    getBlogAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for long-term thinkers'),
    getPortfolioAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for long-term thinkers'),
    getStoreAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for long-term thinkers'),
    getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('A plan to leave a lasting mark on the web.'),
    getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('A plan to leave a lasting mark on the web.'),
    getShortDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('A plan to leave a lasting mark on the web.'),
    getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('A plan to leave a lasting mark on the web.'),
    getBlogOnboardingTagLine: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('A plan to leave a lasting mark on the web.'),
    getBillingTimeFrame: WPComGetBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1061,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_100_YEARS */ .fD,
    getPathSlug: () => 'wp_bundle_hundred_year'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_MONTHLY */ .lv]: {
    ...getPlanEcommerceDetails(),
    ...getMonthlyTimeframe(),
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_2_YEARS */ .j2, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1021,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_MONTHLY */ .lv,
    getPathSlug: () => 'ecommerce-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE */ .JA]: {
    ...getPlanEcommerceDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: WPComGetBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_2_YEARS */ .j2, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_MONTHLY */ .lv, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1011,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE */ .JA,
    getPathSlug: () => 'ecommerce'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_2_YEARS */ .f3]: {
    ...getPlanEcommerceDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_BIENNIALLY */ .SU,
    getBillingTimeFrame: WPComGetBiennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_2_YEARS */ .ln, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_2_YEARS */ .j2, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_MONTHLY */ .lv, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE */ .JA, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1031,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_2_YEARS */ .f3,
    getPathSlug: () => 'ecommerce-2-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_MEDIUM_MONTHLY */ .Je]: {
    ...getPlanWooExpressMediumDetails(),
    ...getMonthlyTimeframe(),
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_WOOEXPRESS_MEDIUM */ .iN,
    getBillingTimeFrame: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('per month'),
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL_MONTHLY */ .jG].includes(plan),
    getProductId: () => 1053,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_MEDIUM_MONTHLY */ .Je,
    getPathSlug: () => 'wooexpress-medium-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_MEDIUM */ .DN]: {
    ...getPlanWooExpressMediumDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: WPComGetBillingTimeframe,
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_WOOEXPRESS_MEDIUM */ .iN,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_MEDIUM_MONTHLY */ .Je, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL */ ._$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL_MONTHLY */ .jG].includes(plan),
    getProductId: () => 1055,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_MEDIUM */ .DN,
    getPathSlug: () => 'wooexpress-medium-yearly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL_MONTHLY */ .jG]: {
    ...getPlanWooExpressSmallDetails(),
    ...getMonthlyTimeframe(),
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_WOOEXPRESS_SMALL */ .T$,
    getBillingTimeFrame: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('per month'),
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC].includes(plan),
    getProductId: () => 1054,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL_MONTHLY */ .jG,
    getPathSlug: () => 'wooexpress-small-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL */ ._$]: {
    ...getPlanWooExpressSmallDetails(),
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_WOOEXPRESS_SMALL */ .T$,
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: WPComGetBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL_MONTHLY */ .jG, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC].includes(plan),
    getProductId: () => 1056,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_SMALL */ ._$,
    getPathSlug: () => 'wooexpress-small-yearly'
  },
  // Not a real plan. This is used to show the Plus offering in the Woo Express plans grid
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_PLUS */ .hq]: {
    ...getPlanWooExpressPlusDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: () => '',
    getProductId: () => 0,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WOOEXPRESS_PLUS */ .hq
  },
  // Not a real plan. This is used to show the Enterprise (VIP) offering in
  // the main plans grid as part of pdgrnI-1Qp-p2.
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ENTERPRISE_GRID_WPCOM */ .gt]: {
    ...get2023EnterprisGrideDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    getBillingTimeFrame: () => '',
    getProductId: () => 0,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ENTERPRISE_GRID_WPCOM */ .gt,
    getPathSlug: () => 'enterprise'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_3_YEARS */ .A3]: {
    ...getPlanEcommerceDetails(),
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_TRIENNIALLY */ .IL,
    getBillingTimeFrame: WPComGetTriennialBillingTimeframe,
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_2_YEARS */ .ln, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER */ .TW, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BLOGGER_2_YEARS */ .uS, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_MONTHLY */ .wm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL */ .sy, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_2_YEARS */ .Qm, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PERSONAL_3_YEARS */ .TI, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_MONTHLY */ .OE, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM */ .xf, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_2_YEARS */ .G6, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_PREMIUM_3_YEARS */ ._B, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_MONTHLY */ .Wg, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS */ .p7, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_2_YEARS */ .j2, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_BUSINESS_3_YEARS */ .hh, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_MONTHLY */ .lv, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE */ .JA, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_2_YEARS */ .f3, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl].includes(plan),
    getProductId: () => 1051,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_3_YEARS */ .A3,
    getPathSlug: () => 'ecommerce-3-years'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj]: {
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
    group: _constants__WEBPACK_IMPORTED_MODULE_4__/* .GROUP_JETPACK */ .mk,
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_FREE */ .UH,
    getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Free'),
    getProductId: () => 2002,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_FREE */ .lj,
    getTagline: (siteFeatures = []) => {
      const hasSiteJetpackBackup = siteFeatures.some(feature => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY */ .V1k, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_DAILY_MONTHLY */ .TBQ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME */ .s4b, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_REALTIME_MONTHLY */ .TZT, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T1_BI_YEARLY */ ._sk, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T1_YEARLY */ .$pY, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T1_MONTHLY */ .mX4, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T2_YEARLY */ .tS0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_BACKUP_T2_MONTHLY */ .L2R].includes(feature));
      const hasSiteJetpackScan = siteFeatures.some(feature => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY */ .V1I, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SCAN_DAILY_MONTHLY */ .FR0].includes(feature));
      if (hasSiteJetpackBackup && hasSiteJetpackScan) {
        return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Upgrade your site to access additional features, including spam protection and priority support.');
      } else if (hasSiteJetpackBackup) {
        return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Upgrade your site to access additional features, including spam protection, security scanning, and priority support.');
      } else if (hasSiteJetpackScan) {
        return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Upgrade your site to access additional features, including spam protection, backups, and priority support.');
      }
      return i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Upgrade your site for additional features, including spam protection, backups, security scanning, and priority support.');
    },
    getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('The features most needed by WordPress sites' + ' — perfectly packaged and optimized for everyone.'),
    getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('for life'),
    getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STANDARD_SECURITY_TOOLS */ .wwD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_STATS */ .rlg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_TRAFFIC_TOOLS */ .F$l, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MANAGE */ .gRD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_ADVANCED_SEO */ .B2h, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SEO_PREVIEW_TOOLS */ .okS, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_WORDPRESS_THEMES */ .ALM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_SITE_STATS */ .rlg, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_STANDARD_SECURITY_TOOLS */ .wwD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_TRAFFIC_TOOLS */ .F$l, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_BLANK */ .$NZ]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PREMIUM */ .Xz]: {
    ...getJetpackPremiumDetails(),
    ...getAnnualTimeframe(),
    getProductId: () => 2000,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PREMIUM */ .Xz,
    getPathSlug: () => 'premium'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PREMIUM_MONTHLY */ .p2]: {
    ...getJetpackPremiumDetails(),
    ...getMonthlyTimeframe(),
    getProductId: () => 2003,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PREMIUM_MONTHLY */ .p2,
    getPathSlug: () => 'premium-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL */ .ap]: {
    ...getJetpackPersonalDetails(),
    ...getAnnualTimeframe(),
    getProductId: () => 2005,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL */ .ap,
    getPathSlug: () => 'jetpack-personal'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL_MONTHLY */ .ns]: {
    ...getJetpackPersonalDetails(),
    ...getMonthlyTimeframe(),
    getProductId: () => 2006,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_PERSONAL_MONTHLY */ .ns,
    getPathSlug: () => 'jetpack-personal-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_BUSINESS */ .NJ]: {
    ...getJetpackBusinessDetails(),
    ...getAnnualTimeframe(),
    getProductId: () => 2001,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_BUSINESS */ .NJ,
    getPathSlug: () => 'professional'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_BUSINESS_MONTHLY */ .yY]: {
    ...getJetpackBusinessDetails(),
    ...getMonthlyTimeframe(),
    getProductId: () => 2004,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_BUSINESS_MONTHLY */ .yY,
    getPathSlug: () => 'professional-monthly'
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY */ .Vl]: {
    ...getPlanJetpackSecurityDailyDetails(),
    ...getAnnualTimeframe(),
    getMonthlySlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY_MONTHLY */ .Dl,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY */ .Vl,
    getPathSlug: () => 'security-daily',
    getProductId: () => 2010
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY_MONTHLY */ .Dl]: {
    ...getPlanJetpackSecurityDailyDetails(),
    ...getMonthlyTimeframe(),
    getAnnualSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY */ .Vl,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_DAILY_MONTHLY */ .Dl,
    getPathSlug: () => 'security-daily-monthly',
    getProductId: () => 2011
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_REALTIME */ .jI]: {
    ...getPlanJetpackSecurityRealtimeDetails(),
    ...getAnnualTimeframe(),
    getMonthlySlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_REALTIME_MONTHLY */ .G$,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_REALTIME */ .jI,
    getPathSlug: () => 'security-realtime',
    getProductId: () => 2012
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_REALTIME_MONTHLY */ .G$]: {
    ...getPlanJetpackSecurityRealtimeDetails(),
    ...getMonthlyTimeframe(),
    getAnnualSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_REALTIME */ .jI,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_REALTIME_MONTHLY */ .G$,
    getPathSlug: () => 'security-realtime-monthly',
    getProductId: () => 2013
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE_BI_YEARLY */ .iP]: {
    ...getPlanJetpackCompleteDetails(),
    ...getBiAnnualTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE_BI_YEARLY */ .iP,
    getPathSlug: () => 'complete-bi-yearly',
    getProductId: () => 2035,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T2_YEARLY */ .EI, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN_BI_YEARLY */ .YU, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM_BI_YEARLY */ .aG, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_VIDEOPRESS_BI_YEARLY */ .vT, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BOOST_BI_YEARLY */ .sA, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SOCIAL_ADVANCED_BI_YEARLY */ .XP, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SEARCH_BI_YEARLY */ .Eh, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_STATS_BI_YEARLY */ .Zo, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_CRM */ .Ve, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_CREATOR_BI_YEARLY */ .V$],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1TB (1,000GB) of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1-year activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 1 year'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (60k API calls/mo)'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VideoPress: 1TB of ad-free video hosting'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Boost: Automatic CSS generation'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Site Search: Up to 100k records and 100k requests/mo.'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Social: Get unlimited shares and share as a post by attaching images or videos.'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('CRM: Entrepreneur with 30 extensions')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE */ .th]: {
    ...getPlanJetpackCompleteDetails(),
    ...getAnnualTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE */ .th,
    getPathSlug: () => 'complete',
    getProductId: () => 2014,
    getMonthlySlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE_MONTHLY */ .JX,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T2_YEARLY */ .EI, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN */ .pE, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM */ .Sm, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_VIDEOPRESS */ .nN, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BOOST */ .GA, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SOCIAL_ADVANCED */ .Im, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SEARCH */ .DH, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_STATS_YEARLY */ .kY, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_CRM */ .Ve, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_CREATOR_YEARLY */ .lb],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1TB (1,000GB) of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1-year activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 1 year'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (60k API calls/mo)'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VideoPress: 1TB of ad-free video hosting'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Boost: Automatic CSS generation'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Site Search: Up to 100k records and 100k requests/mo.'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Social: Get unlimited shares and share as a post by attaching images or videos.'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('CRM: Entrepreneur with 30 extensions')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE_MONTHLY */ .JX]: {
    ...getPlanJetpackCompleteDetails(),
    ...getMonthlyTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE_MONTHLY */ .JX,
    getPathSlug: () => 'complete-monthly',
    getProductId: () => 2015,
    getAnnualSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_COMPLETE */ .th,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T2_MONTHLY */ .uL, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN_MONTHLY */ .sY, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM_MONTHLY */ .PF, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_VIDEOPRESS_MONTHLY */ .qH, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BOOST_MONTHLY */ .SZ, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SOCIAL_ADVANCED_MONTHLY */ .EV, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SEARCH_MONTHLY */ .XG, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_STATS_MONTHLY */ .dX, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_CRM_MONTHLY */ .vM, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_CREATOR_MONTHLY */ .eV],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1TB (1,000GB) of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1-year activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 1-year'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (60k API calls/mo)'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VideoPress: 1TB of ad-free video hosting'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Boost: Automatic CSS generation'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Site Search: Up to 100k records and 100k requests/mo.'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Social: Get unlimited shares and share as a post by attaching images or videos.'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('CRM: Entrepreneur with 30 extensions')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T1_BI_YEARLY */ .P5]: {
    ...getPlanJetpackSecurityT1Details(),
    ...getBiAnnualTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T1_BI_YEARLY */ .P5,
    getPathSlug: () => 'security-20gb-bi-yearly',
    getProductId: () => 2034,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T1_BI_YEARLY */ .QZ, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN_BI_YEARLY */ .YU, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM_BI_YEARLY */ .aG],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('10GB of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('30-day activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 30 days'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (10k API calls/mo)')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T1_YEARLY */ .Et]: {
    ...getPlanJetpackSecurityT1Details(),
    ...getAnnualTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T1_YEARLY */ .Et,
    getPathSlug: () => 'security-20gb-yearly',
    getProductId: () => 2016,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T1_YEARLY */ .oe, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN */ .pE, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM */ .Sm],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('10GB of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('30-day activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 30 days'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (10k API calls/mo)')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T1_MONTHLY */ .w2]: {
    ...getPlanJetpackSecurityT1Details(),
    ...getMonthlyTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T1_MONTHLY */ .w2,
    getPathSlug: () => 'security-20gb-monthly',
    getProductId: () => 2017,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T1_MONTHLY */ .rx, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN_MONTHLY */ .sY, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM_MONTHLY */ .PF],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('10GB of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('30-day activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 30 days'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (10k API calls/mo)')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T2_YEARLY */ .s1]: {
    ...getPlanJetpackSecurityT2Details(),
    ...getAnnualTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T2_YEARLY */ .s1,
    getPathSlug: () => 'security-1tb-yearly',
    getProductId: () => 2019,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T2_YEARLY */ .EI, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN */ .pE, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM */ .Sm],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('{{strong}}1TB (1,000GB){{/strong}} of cloud storage', {
      components: {
        strong: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null)
      }
    }), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('{{strong}}1-year{{/strong}} activity log archive', {
      components: {
        strong: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null)
      }
    }), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last {{strong}}1 year{{/strong}}', {
      components: {
        strong: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null)
      }
    }), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (10k API calls/mo)')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T2_MONTHLY */ .aS]: {
    ...getPlanJetpackSecurityT2Details(),
    ...getMonthlyTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_SECURITY_T2_MONTHLY */ .aS,
    getPathSlug: () => 'security-1tb-monthly',
    getProductId: () => 2020,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T2_MONTHLY */ .uL, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_SCAN_MONTHLY */ .sY, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM_MONTHLY */ .PF],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('{{strong}}1TB (1,000GB){{/strong}} of cloud storage', {
      components: {
        strong: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null)
      }
    }), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('{{strong}}1-year{{/strong}} activity log archive', {
      components: {
        strong: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null)
      }
    }), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last {{strong}}1 year{{/strong}}', {
      components: {
        strong: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", null)
      }
    }), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Scan: Real-time malware scanning and one-click fixes'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (10k API calls/mo)')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_STARTER_YEARLY */ .ki]: {
    ...getPlanJetpackStarterDetails(),
    ...getAnnualTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_STARTER_YEARLY */ .ki,
    getPathSlug: () => 'starter-yearly',
    getProductId: () => 2030,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T0_YEARLY */ .OH, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM */ .Sm],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1GB of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('30-day activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 30 days'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (1k API calls/mo)')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_STARTER_MONTHLY */ .Rw]: {
    ...getPlanJetpackStarterDetails(),
    ...getMonthlyTimeframe(),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_STARTER_MONTHLY */ .Rw,
    getPathSlug: () => 'starter-monthly',
    getProductId: () => 2031,
    getProductsIncluded: () => [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_BACKUP_T0_MONTHLY */ .Tp, _constants__WEBPACK_IMPORTED_MODULE_4__/* .PRODUCT_JETPACK_ANTI_SPAM_MONTHLY */ .PF],
    getWhatIsIncluded: () => [(0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('VaultPress Backup: Real-time backups as you edit'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('1GB of cloud storage'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('30-day activity log archive'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Unlimited one-click restores from the last 30 days'), (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('Akismet: Comment and form spam protection (1k API calls/mo)')]
  },
  [_constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_GOLDEN_TOKEN */ .sc]: {
    ...getPlanJetpackGoldenTokenDetails(),
    ...getAnnualTimeframe(),
    getMonthlySlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_GOLDEN_TOKEN */ .sc,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_4__/* .PLAN_JETPACK_GOLDEN_TOKEN */ .sc,
    getPathSlug: () => 'golden-token',
    getProductId: () => 2900
  },
  [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_P2_PLUS */ .Ml]: {
    ...getDotcomPlanDetails(),
    group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_P2 */ .mi,
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_P2_PLUS */ .QI,
    getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('P2+'),
    getDescription: () => '',
    getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for professionals:{{/strong}} Enhance your P2 with more space for audio and video, advanced search, an activity overview panel, and priority customer support.', plansDescriptionHeadingComponent),
    getShortDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Some short description'),
    get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_13GB_STORAGE */ .S_M, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_ADVANCED_SEARCH */ .yjN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_VIDEO_SHARING */ .iC0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_MORE_FILE_TYPES */ .rdd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_PRIORITY_CHAT_EMAIL_SUPPORT */ .bJv, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_ACTIVITY_OVERVIEW */ .ops],
    get2023PricingGridSignupStorageOptions: () => {
      return [{
        slug: _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_13GB_STORAGE */ .S_M,
        isAddOn: false
      }];
    },
    getPlanCompareFeatures: () => [
    // pay attention to ordering, shared features should align on /plan page
    _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_13GB_STORAGE */ .S_M, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_ADVANCED_SEARCH */ .yjN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_VIDEO_SHARING */ .iC0, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_MORE_FILE_TYPES */ .rdd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_PRIORITY_CHAT_EMAIL_SUPPORT */ .bJv, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_ACTIVITY_OVERVIEW */ .ops],
    // TODO: update this once we put P2+ in the signup.
    getSignupFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_EMAIL_SUPPORT_SIGNUP */ .fhe],
    // TODO: no idea about this, copied from the WP.com Premium plan.
    // Features not displayed but used for checking plan abilities
    getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_AUDIO_UPLOADS */ .XMd, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SEARCH_BI_YEARLY */ .Mrh, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SEARCH */ .lv3, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_JETPACK_SEARCH_MONTHLY */ .ewW],
    getInferiorFeatures: () => [],
    // TODO: Calypso requires this prop but we probably don't need it. Refactor Calypso?
    getAudience: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Best for bloggers'),
    ...getMonthlyTimeframe(),
    availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d].includes(plan),
    //TODO: only for P2 sites.
    getProductId: () => 1040,
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_P2_PLUS */ .Ml,
    getPathSlug: () => 'p2-plus',
    getBillingTimeFrame: () => (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .translate */ .Iu)('per user per month')
  }
};
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_P2_FREE */ .A2] = {
  ...PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d],
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_P2 */ .mi,
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('{{strong}}Best for small groups:{{/strong}} All the features needed to share, discuss, review, and collaborate with your team in one spot, without interruptions.', plansDescriptionHeadingComponent),
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('P2 Free'),
  get2023PricingGridSignupWpcomFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_3GB_STORAGE */ .$mN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_UNLIMITED_USERS */ .JqD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_UNLIMITED_POSTS_PAGES */ .bHF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_SIMPLE_SEARCH */ .XZZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_CUSTOMIZATION_OPTIONS */ .vje],
  get2023PricingGridSignupStorageOptions: () => {
    return [{
      slug: _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_3GB_STORAGE */ .$mN,
      isAddOn: false
    }];
  },
  getPlanCompareFeatures: () => [
  // pay attention to ordering, shared features should align on /plan page
  _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_3GB_STORAGE */ .$mN, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_UNLIMITED_USERS */ .JqD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_UNLIMITED_POSTS_PAGES */ .bHF, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_SIMPLE_SEARCH */ .XZZ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_P2_CUSTOMIZATION_OPTIONS */ .vje]
};

// Brand new WPCOM plans
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id] = {
  ...getDotcomPlanDetails(),
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_STARTER */ .xg,
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('WordPress Starter'),
  getProductId: () => 1033,
  getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id,
  getPathSlug: () => 'starter',
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .ZP.hasTranslation('Start with a custom domain name, simple payments, and extra storage.') || ['en', 'en-gb'].includes((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* .getLocaleSlug */ .Yj)() || '') ? i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Start with a custom domain name, simple payments, and extra storage.') : i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Start your WordPress.com website. Limited functionality and storage.'),
  getSubTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Essential features. Freedom to grow.'),
  getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('per month, billed yearly'),
  getPlanCompareFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_TRAFFIC */ .c__, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_MANAGED_HOSTING */ .FiJ, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_FREE_THEMES */ .jDM, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_CUSTOM_DOMAIN */ .Eb2, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_UNLIMITED_ADMINS */ .SsD, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_6GB_STORAGE */ .W4b, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_GOOGLE_ANALYTICS */ .Vms, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_PAYMENT_BLOCKS */ .x_7, _constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_TITAN_EMAIL */ .fDA],
  getIncludedFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .WPCOM_FEATURES_INSTALL_PURCHASED_PLUGINS */ .n26],
  getCancellationFeatureList: () => ({
    monthly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_MANAGED_HOSTINGS */ .KG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_AND_SOCIAL */ ._o, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SECURITY_AND_SPAM */ .Zs, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_JETPACK_ESSENTIALS */ .$N],
      andMore: true
    },
    yearly: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_MANAGED_HOSTINGS */ .KG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_AND_SOCIAL */ ._o, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SECURITY_AND_SPAM */ .Zs, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_JETPACK_ESSENTIALS */ .$N],
      andMore: true
    },
    withDomain: {
      featureList: [_constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_MANAGED_HOSTINGS */ .KG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SEO_AND_SOCIAL */ ._o, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_EARN_AD_REVENUE */ .pG, _constants__WEBPACK_IMPORTED_MODULE_8__/* .FEATURE_CANCELLATION_SECURITY_AND_SPAM */ .Zs],
      andMore: true
    }
  })
};
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_FLEXIBLE */ .Cq] = {
  // Inherits the free plan
  ...PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d],
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_FLEXIBLE */ .qC,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('WordPress Free'),
  getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('upgrade when you need'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Start your free WordPress.com website. Limited functionality and storage.'),
  getPlanCompareFeatures: () => [_constants__WEBPACK_IMPORTED_MODULE_5__/* .FEATURE_1GB_STORAGE */ .Zaf]
};
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s] = {
  ...getPlanProDetails(),
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_ANNUALLY */ .w$,
  getProductId: () => 1032,
  getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s,
  getPathSlug: () => 'pro',
  getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('per month, billed yearly')
};
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU] = {
  ...getPlanProDetails(),
  ...getMonthlyTimeframe(),
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d].includes(plan),
  getProductId: () => 1034,
  getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU,
  getPathSlug: () => 'pro-monthly'
};
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_2_YEARS */ .ln] = {
  ...getPlanProDetails(),
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_BIENNIALLY */ .SU,
  availableFor: plan => [_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_FREE */ ._d, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_STARTER */ .Id, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO */ ._s, _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_MONTHLY */ .dU].includes(plan),
  getProductId: () => 1035,
  getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_WPCOM_PRO_2_YEARS */ .ln,
  getPathSlug: () => 'pro-2-years',
  getBillingTimeFrame: WPComGetBiennialBillingTimeframe
};
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC] = {
  ...getDotcomPlanDetails(),
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_ECOMMERCE */ .h7,
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  getProductId: () => 1052,
  getPathSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC,
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_MONTHLY */ .ob,
  getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('free trial'),
  getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_ECOMMERCE_TRIAL_MONTHLY */ .FC,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('eCommerce free trial'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('eCommerce free trial'),
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Get a taste of the world’s most popular eCommerce software.')
};
if ((0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_1__/* .isEnabled */ ._k)('plans/migration-trial')) {
  PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$] = {
    ...getPlanBusinessDetails(),
    type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_BUSINESS */ .Qj,
    group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
    getProductId: () => 1057,
    getPathSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$,
    term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_MONTHLY */ .ob,
    getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('free trial'),
    getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_MIGRATION_TRIAL_MONTHLY */ .T$,
    getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Business Trial')
  };
}
PLANS_LIST[_constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl] = {
  ...getPlanBusinessDetails(),
  getPlanTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Try all the features of our Business plan.'),
  type: _constants__WEBPACK_IMPORTED_MODULE_7__/* .TYPE_BUSINESS */ .Qj,
  group: _constants__WEBPACK_IMPORTED_MODULE_6__/* .GROUP_WPCOM */ .w9,
  getProductId: () => 1058,
  getPathSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl,
  term: _constants__WEBPACK_IMPORTED_MODULE_3__/* .TERM_MONTHLY */ .ob,
  getBillingTimeFrame: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Try it for 3 days'),
  getStoreSlug: () => _constants__WEBPACK_IMPORTED_MODULE_6__/* .PLAN_HOSTING_TRIAL_MONTHLY */ .Rl,
  getTitle: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Business trial'),
  getDescription: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Hosting free trial'),
  getTagline: () => i18n_calypso__WEBPACK_IMPORTED_MODULE_2__/* ["default"].translate */ .ZP.translate('Get a taste of unlimited performance and unbeatable uptime')
};

/***/ }),

/***/ 544:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Returns configuration value for given key
 *
 * If the requested key isn't defined in the configuration
 * data then this will report the failure with either an
 * error or a console warning.
 *
 * When in the 'development' NODE_ENV it will raise an error
 * to crash execution early. However, because many modules
 * call this function in the module-global scope a failure
 * here can not only crash that module but also entire
 * application flows as well as trigger unexpected and
 * unwanted behaviors. Therefore if the NODE_ENV is not
 * 'development' we will return `undefined` and log a message
 * to the console instead of halting the execution thread.
 *
 * The config files are loaded in sequence: _shared.json, {env}.json, {env}.local.json
 *
 * @see server/config/parser.js
 * @param data Configurat data.
 * @throws {ReferenceError} when key not defined in the config (NODE_ENV=development only)
 * @returns A function that gets the value of property named by the key
 */
const config = data => key => {
  if (key in data) {
    return data[key];
  }
  if (false) {}

  // display console error only in a browser
  // (not in tests, for example)
  if (true) {
    // eslint-disable-next-line no-console
    console.error('%cCore Error: ' + `%cCould not find config value for key %c${key}%c. ` + 'Please make sure that if you need it then it has a default value assigned in ' + '%cconfig/_shared.json' + '%c.', 'color: red; font-size: 120%',
    // error prefix
    'color: black;',
    // message
    'color: blue;',
    // key name
    'color: black;',
    // message
    'color: blue;',
    // config file reference
    'color: black' // message
    );
  }
  return undefined;
};

/**
 * Checks whether a specific feature is enabled.
 *
 * @param data the json environment configuration to use for getting config values
 * @returns A function that takes a feature name and returns true when the feature is enabled.
 */
const isEnabled = data => feature => data.features && !!data.features[feature] || false;

/**
 * Gets a list of all enabled features.
 *
 * @param data A set of config data (Not used by general users, is pre-filled via currying).
 * @returns List of enabled features (strings).
 */
const enabledFeatures = data => () => {
  if (!data.features) {
    return [];
  }
  return Object.entries(data.features).reduce((enabled, [feature, isEnabled]) => isEnabled ? [...enabled, feature] : enabled, []);
};

/**
 * Enables a specific feature.
 *
 * @param data the json environment configuration to use for getting config values
 */
const enable = data => feature => {
  if (data.features) {
    data.features[feature] = true;
  }
};

/**
 * Disables a specific feature.
 *
 * @param data the json environment configuration to use for getting config values
 */

const disable = data => feature => {
  if (data.features) {
    data.features[feature] = false;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (data => {
  const configApi = config(data);
  configApi.isEnabled = isEnabled(data);
  configApi.enabledFeatures = enabledFeatures(data);
  configApi.enable = enable(data);
  configApi.disable = disable(data);
  return configApi;
});

/***/ }),

/***/ 4703:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   xf: () => (/* binding */ PLAN_PREMIUM)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (unpackIntroOffer);

/***/ }),

/***/ 4025:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const useQueryKeysFactory = () => ({
  sitePlans: siteId => ['site-plans', siteId],
  plans: coupon => ['plans', coupon]
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useQueryKeysFactory);

/***/ }),

/***/ 7987:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _automattic_calypso_products__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4112);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2180);
/* harmony import */ var wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8552);
/* harmony import */ var _lib_unpack_intro_offer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2897);
/* harmony import */ var _lib_use_query_keys_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4025);





/**
 * Plans from `/plans` endpoint, transformed into a map of planSlug => PlanNext
 */
function usePlans({
  coupon
}) {
  const queryKeys = (0,_lib_use_query_keys_factory__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
  const params = new URLSearchParams();
  coupon && params.append('coupon_code', coupon);
  return (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_1__/* .useQuery */ .a)({
    queryKey: queryKeys.plans(coupon),
    queryFn: async () => {
      const data = await (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .ZP)({
        path: `/plans`,
        apiVersion: '1.5',
        query: params.toString()
      });
      return Object.fromEntries(data.map(plan => {
        const discountedPriceFull = plan.orig_cost_integer !== plan.raw_price_integer ? plan.raw_price_integer : null;
        return [plan.product_slug, {
          planSlug: plan.product_slug,
          productSlug: plan.product_slug,
          productId: plan.product_id,
          productNameShort: plan.product_name_short,
          pricing: {
            billPeriod: plan.bill_period,
            currencyCode: plan.currency_code,
            introOffer: (0,_lib_unpack_intro_offer__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(plan),
            originalPrice: {
              monthly: typeof plan.orig_cost_integer === 'number' ? (0,_automattic_calypso_products__WEBPACK_IMPORTED_MODULE_4__/* .calculateMonthlyPriceForPlan */ .Sl)(plan.product_slug, plan.orig_cost_integer) : null,
              full: plan.orig_cost_integer
            },
            discountedPrice: {
              monthly: typeof discountedPriceFull === 'number' ? (0,_automattic_calypso_products__WEBPACK_IMPORTED_MODULE_4__/* .calculateMonthlyPriceForPlan */ .Sl)(plan.product_slug, discountedPriceFull) : null,
              full: discountedPriceFull
            }
          }
        }];
      }));
    }
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (usePlans);

/***/ }),

/***/ 4724:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(914);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z());

/***/ }),

/***/ 914:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2699);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_interpolate_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2594);
/* harmony import */ var _tannin_sprintf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6668);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var hash_js_lib_hash_sha_1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5079);
/* harmony import */ var hash_js_lib_hash_sha_1__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hash_js_lib_hash_sha_1__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lru__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7839);
/* harmony import */ var lru__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lru__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var tannin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9830);
/* harmony import */ var _number_format__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);









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
  return (0,_number_format__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(number, decimals, decPoint, thousandsSep);
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
  this.state.tannin = new tannin__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z({
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
      translation = (0,_tannin_sprintf__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)(...sprintfArgs);
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
    translation = (0,_automattic_interpolate_components__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)({
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

/***/ 1481:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Iu: () => (/* binding */ translate),
/* harmony export */   Yj: () => (/* binding */ getLocaleSlug),
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports numberFormat, configure, setLocale, getLocale, getLocaleVariant, isRtl, addTranslations, reRenderTranslations, registerComponentUpdateHook, registerTranslateHook, state, stateObserver, on, off, emit */
/* harmony import */ var _default_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4724);







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);

// Export the default instance's properties and bound methods for convenience
// These should be deprecated eventually, exposing only the default `i18n` instance
const numberFormat = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.numberFormat.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const translate = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.translate.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const configure = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.configure.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const setLocale = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.setLocale.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const getLocale = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.getLocale.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const getLocaleSlug = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.getLocaleSlug.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const getLocaleVariant = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.getLocaleVariant.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const isRtl = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.isRtl.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const addTranslations = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.addTranslations.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const reRenderTranslations = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.reRenderTranslations.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const registerComponentUpdateHook = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.registerComponentUpdateHook.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const registerTranslateHook = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.registerTranslateHook.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const state = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.state;
const stateObserver = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.stateObserver;
const on = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.on.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const off = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.off.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
const emit = _default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.emit.bind(_default_i18n__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);

/***/ }),

/***/ 3:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ number_format)
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

/***/ 2594:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ interpolate)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tokenize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1310);


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
  const tokens = (0,_tokenize__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(mixedString);
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

/***/ 1310:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ tokenize)
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

/***/ 3340:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Yt: () => (/* binding */ handleRequestError),
/* harmony export */   _W: () => (/* binding */ handleRequestSuccess),
/* harmony export */   hg: () => (/* binding */ isLoading),
/* harmony export */   lZ: () => (/* binding */ addScriptCallback)
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
function executeCallbacks(url, error = null) {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ createScriptElement),
/* harmony export */   k: () => (/* binding */ attachToHead)
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
    Object.entries(args).forEach(([key, value]) => script[key] = value);
  }
  return script;
}
function attachToHead(element) {
  debug('Attaching element to head');
  document.head.appendChild(element);
}

/***/ }),

/***/ 4898:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ve: () => (/* binding */ loadScript)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (request);


/***/ }),

/***/ 8049:
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

/***/ 3830:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var camelCase = __webpack_require__(956);

module.exports = function () {
	var cased = camelCase.apply(camelCase, arguments);
	return cased.charAt(0).toUpperCase() + cased.slice(1);
};


/***/ }),

/***/ 956:
/***/ ((module) => {

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

/***/ 2686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ 5302:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ rng)
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ 8767:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ 6525:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2686);


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ 2884:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "images/image-f40c6b2b12b942b650ea.svg";

/***/ }),

/***/ 9196:
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ 5609:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ 9818:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ 7701:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["domReady"];

/***/ }),

/***/ 9307:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ 5736:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ 8817:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["plugins"];

/***/ }),

/***/ 6483:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["url"];

/***/ }),

/***/ 5777:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ focusManager)
/* harmony export */ });
/* unused harmony export FocusManager */
/* harmony import */ var _subscribable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3248);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8298);
// src/focusManager.ts


var FocusManager = class extends _subscribable_js__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  #focused;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onFocus) => {
      if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.#focused !== focused;
    if (changed) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
  isFocused() {
    if (typeof this.#focused === "boolean") {
      return this.#focused;
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
};
var focusManager = new FocusManager();

//# sourceMappingURL=focusManager.js.map

/***/ }),

/***/ 3620:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gm: () => (/* binding */ infiniteQueryBehavior)
/* harmony export */ });
/* unused harmony exports hasNextPage, hasPreviousPage */
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8298);
// src/infiniteQueryBehavior.ts

function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const fetchFn = async () => {
        const options = context.options;
        const direction = context.fetchOptions?.meta?.fetchMore?.direction;
        const oldPages = context.state.data?.pages || [];
        const oldPageParams = context.state.data?.pageParams || [];
        const empty = { pages: [], pageParams: [] };
        let cancelled = false;
        const addSignalProperty = (object) => {
          Object.defineProperty(object, "signal", {
            enumerable: true,
            get: () => {
              if (context.signal.aborted) {
                cancelled = true;
              } else {
                context.signal.addEventListener("abort", () => {
                  cancelled = true;
                });
              }
              return context.signal;
            }
          });
        };
        const queryFn = context.options.queryFn || (() => Promise.reject(
          new Error(`Missing queryFn: '${context.options.queryHash}'`)
        ));
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject();
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const queryFnContext = {
            queryKey: context.queryKey,
            pageParam: param,
            direction: previous ? "backward" : "forward",
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext);
          const page = await queryFn(
            queryFnContext
          );
          const { maxPages } = context.options;
          const addTo = previous ? _utils_js__WEBPACK_IMPORTED_MODULE_0__/* .addToStart */ .Ht : _utils_js__WEBPACK_IMPORTED_MODULE_0__/* .addToEnd */ .VX;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        let result;
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          result = await fetchPage(
            empty,
            oldPageParams[0] ?? options.initialPageParam
          );
          const remainingPages = pages ?? oldPages.length;
          for (let i = 1; i < remainingPages; i++) {
            const param = getNextPageParam(options, result);
            result = await fetchPage(result, param);
          }
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  );
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return options.getPreviousPageParam?.(
    pages[0],
    pages,
    pageParams[0],
    pageParams
  );
}
function hasNextPage(options, data) {
  if (!data)
    return false;
  return getNextPageParam(options, data) != null;
}
function hasPreviousPage(options, data) {
  if (!data || !options.getPreviousPageParam)
    return false;
  return getPreviousPageParam(options, data) != null;
}

//# sourceMappingURL=infiniteQueryBehavior.js.map

/***/ }),

/***/ 457:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ Mutation)
/* harmony export */ });
/* unused harmony export getDefaultState */
/* harmony import */ var _notifyManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1895);
/* harmony import */ var _removable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9085);
/* harmony import */ var _retryer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6087);
// src/mutation.ts



var Mutation = class extends _removable_js__WEBPACK_IMPORTED_MODULE_0__/* .Removable */ .F {
  constructor(config) {
    super();
    this.mutationId = config.mutationId;
    this.#defaultOptions = config.defaultOptions;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  #observers;
  #defaultOptions;
  #mutationCache;
  #retryer;
  setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.#observers = this.#observers.filter((x) => x !== observer);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const executeMutation = () => {
      this.#retryer = (0,_retryer_js__WEBPACK_IMPORTED_MODULE_1__/* .createRetryer */ .Mz)({
        fn: () => {
          if (!this.options.mutationFn) {
            return Promise.reject(new Error("No mutationFn found"));
          }
          return this.options.mutationFn(variables);
        },
        onFail: (failureCount, error) => {
          this.#dispatch({ type: "failed", failureCount, error });
        },
        onPause: () => {
          this.#dispatch({ type: "pause" });
        },
        onContinue: () => {
          this.#dispatch({ type: "continue" });
        },
        retry: this.options.retry ?? 0,
        retryDelay: this.options.retryDelay,
        networkMode: this.options.networkMode
      });
      return this.#retryer.promise;
    };
    const restored = this.state.status === "pending";
    try {
      if (!restored) {
        this.#dispatch({ type: "pending", variables });
        await this.#mutationCache.config.onMutate?.(
          variables,
          this
        );
        const context = await this.options.onMutate?.(variables);
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables
          });
        }
      }
      const data = await executeMutation();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this
      );
      await this.options.onSuccess?.(data, variables, this.state.context);
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this
      );
      await this.options.onSettled?.(data, null, variables, this.state.context);
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this
        );
        await this.options.onError?.(
          error,
          variables,
          this.state.context
        );
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this
        );
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context
        );
        throw error;
      } finally {
        this.#dispatch({ type: "error", error });
      }
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: !(0,_retryer_js__WEBPACK_IMPORTED_MODULE_1__/* .canFetch */ .Kw)(this.options.networkMode),
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}

//# sourceMappingURL=mutation.js.map

/***/ }),

/***/ 1750:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ MutationCache)
/* harmony export */ });
/* harmony import */ var _notifyManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1895);
/* harmony import */ var _mutation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(457);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8298);
/* harmony import */ var _subscribable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3248);
// src/mutationCache.ts




var MutationCache = class extends _subscribable_js__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = [];
    this.#mutationId = 0;
  }
  #mutations;
  #mutationId;
  #resuming;
  build(client, options, state) {
    const mutation = new _mutation_js__WEBPACK_IMPORTED_MODULE_1__/* .Mutation */ .m({
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.push(mutation);
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    this.#mutations = this.#mutations.filter((x) => x !== mutation);
    this.notify({ type: "removed", mutation });
  }
  clear() {
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.remove(mutation);
      });
    });
  }
  getAll() {
    return this.#mutations;
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.#mutations.find(
      (mutation) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .matchMutation */ .X7)(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.#mutations.filter(
      (mutation) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .matchMutation */ .X7)(filters, mutation)
    );
  }
  notify(event) {
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    this.#resuming = (this.#resuming ?? Promise.resolve()).then(() => {
      const pausedMutations = this.#mutations.filter((x) => x.state.isPaused);
      return _notifyManager_js__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batch(
        () => pausedMutations.reduce(
          (promise, mutation) => promise.then(() => mutation.continue().catch(_utils_js__WEBPACK_IMPORTED_MODULE_3__/* .noop */ .ZT)),
          Promise.resolve()
        )
      );
    }).then(() => {
      this.#resuming = void 0;
    });
    return this.#resuming;
  }
};

//# sourceMappingURL=mutationCache.js.map

/***/ }),

/***/ 1895:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: () => (/* binding */ notifyManager)
/* harmony export */ });
/* unused harmony export createNotifyManager */
// src/notifyManager.ts
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = (cb) => setTimeout(cb, 0);
  const setScheduler = (fn) => {
    scheduleFn = fn;
  };
  const batch = (callback) => {
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
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const batchCalls = (callback) => {
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
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  const setNotifyFunction = (fn) => {
    notifyFn = fn;
  };
  const setBatchNotifyFunction = (fn) => {
    batchNotifyFn = fn;
  };
  return {
    batch,
    batchCalls,
    schedule,
    setNotifyFunction,
    setBatchNotifyFunction,
    setScheduler
  };
}
var notifyManager = createNotifyManager();

//# sourceMappingURL=notifyManager.js.map

/***/ }),

/***/ 3965:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ onlineManager)
/* harmony export */ });
/* unused harmony export OnlineManager */
/* harmony import */ var _subscribable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3248);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8298);
// src/onlineManager.ts


var OnlineManager = class extends _subscribable_js__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  #online = true;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onOnline) => {
      if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  setOnline(online) {
    const changed = this.#online !== online;
    if (changed) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return this.#online;
  }
};
var onlineManager = new OnlineManager();

//# sourceMappingURL=onlineManager.js.map

/***/ }),

/***/ 681:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Query)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8298);
/* harmony import */ var _notifyManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1895);
/* harmony import */ var _retryer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6087);
/* harmony import */ var _removable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9085);
// src/query.ts




var Query = class extends _removable_js__WEBPACK_IMPORTED_MODULE_0__/* .Removable */ .F {
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.#setOptions(config.options);
    this.#observers = [];
    this.#cache = config.cache;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = config.state || getDefaultState(this.options);
    this.state = this.#initialState;
    this.scheduleGc();
  }
  #initialState;
  #revertState;
  #cache;
  #promise;
  #retryer;
  #observers;
  #defaultOptions;
  #abortSignalConsumed;
  get meta() {
    return this.options.meta;
  }
  #setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    this.updateGcTime(this.options.gcTime);
  }
  optionalRemove() {
    if (!this.#observers.length && this.state.fetchStatus === "idle") {
      this.#cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .replaceData */ .oE)(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state, setStateOptions) {
    this.#dispatch({ type: "setState", state, setStateOptions });
  }
  cancel(options) {
    const promise = this.#promise;
    this.#retryer?.cancel(options);
    return promise ? promise.then(_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .noop */ .ZT).catch(_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .noop */ .ZT) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  reset() {
    this.destroy();
    this.setState(this.#initialState);
  }
  isActive() {
    return this.#observers.some(
      (observer) => observer.options.enabled !== false
    );
  }
  isDisabled() {
    return this.getObserversCount() > 0 && !this.isActive();
  }
  isStale() {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || this.#observers.some((observer) => observer.getCurrentResult().isStale);
  }
  isStaleByTime(staleTime = 0) {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .timeUntilStale */ .Kp)(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer = this.#observers.find((x) => x.shouldFetchOnWindowFocus());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  onOnline() {
    const observer = this.#observers.find((x) => x.shouldFetchOnReconnect());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#cache.notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.#observers.includes(observer)) {
      this.#observers = this.#observers.filter((x) => x !== observer);
      if (!this.#observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed) {
            this.#retryer.cancel({ revert: true });
          } else {
            this.#retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.#cache.notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.#observers.length;
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.#dispatch({ type: "invalidate" });
    }
  }
  fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle") {
      if (this.state.dataUpdatedAt && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (this.#promise) {
        this.#retryer?.continueRetry();
        return this.#promise;
      }
    }
    if (options) {
      this.#setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.#observers.find((x) => x.options.queryFn);
      if (observer) {
        this.#setOptions(observer.options);
      }
    }
    if (false) {}
    const abortController = new AbortController();
    const queryFnContext = {
      queryKey: this.queryKey,
      meta: this.meta
    };
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          this.#abortSignalConsumed = true;
          return abortController.signal;
        }
      });
    };
    addSignalProperty(queryFnContext);
    const fetchFn = () => {
      if (!this.options.queryFn) {
        return Promise.reject(
          new Error(`Missing queryFn: '${this.options.queryHash}'`)
        );
      }
      this.#abortSignalConsumed = false;
      if (this.options.persister) {
        return this.options.persister(
          this.options.queryFn,
          queryFnContext,
          this
        );
      }
      return this.options.queryFn(
        queryFnContext
      );
    };
    const context = {
      fetchOptions,
      options: this.options,
      queryKey: this.queryKey,
      state: this.state,
      fetchFn
    };
    addSignalProperty(context);
    this.options.behavior?.onFetch(
      context,
      this
    );
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      this.#dispatch({ type: "fetch", meta: context.fetchOptions?.meta });
    }
    const onError = (error) => {
      if (!((0,_retryer_js__WEBPACK_IMPORTED_MODULE_2__/* .isCancelledError */ .DV)(error) && error.silent)) {
        this.#dispatch({
          type: "error",
          error
        });
      }
      if (!(0,_retryer_js__WEBPACK_IMPORTED_MODULE_2__/* .isCancelledError */ .DV)(error)) {
        this.#cache.config.onError?.(
          error,
          this
        );
        this.#cache.config.onSettled?.(
          this.state.data,
          error,
          this
        );
      }
      if (!this.isFetchingOptimistic) {
        this.scheduleGc();
      }
      this.isFetchingOptimistic = false;
    };
    this.#retryer = (0,_retryer_js__WEBPACK_IMPORTED_MODULE_2__/* .createRetryer */ .Mz)({
      fn: context.fetchFn,
      abort: abortController.abort.bind(abortController),
      onSuccess: (data) => {
        if (typeof data === "undefined") {
          if (false) {}
          onError(new Error(`${this.queryHash} data is undefined`));
          return;
        }
        this.setData(data);
        this.#cache.config.onSuccess?.(data, this);
        this.#cache.config.onSettled?.(
          data,
          this.state.error,
          this
        );
        if (!this.isFetchingOptimistic) {
          this.scheduleGc();
        }
        this.isFetchingOptimistic = false;
      },
      onError,
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode
    });
    this.#promise = this.#retryer.promise;
    return this.#promise;
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            fetchFailureCount: 0,
            fetchFailureReason: null,
            fetchMeta: action.meta ?? null,
            fetchStatus: (0,_retryer_js__WEBPACK_IMPORTED_MODULE_2__/* .canFetch */ .Kw)(this.options.networkMode) ? "fetching" : "paused",
            ...!state.dataUpdatedAt && {
              error: null,
              status: "pending"
            }
          };
        case "success":
          return {
            ...state,
            data: action.data,
            dataUpdateCount: state.dataUpdateCount + 1,
            dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
            error: null,
            isInvalidated: false,
            status: "success",
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
        case "error":
          const error = action.error;
          if ((0,_retryer_js__WEBPACK_IMPORTED_MODULE_2__/* .isCancelledError */ .DV)(error) && error.revert && this.#revertState) {
            return { ...this.#revertState, fetchStatus: "idle" };
          }
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error"
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onQueryUpdate();
      });
      this.#cache.notify({ query: this, type: "updated", action });
    });
  }
};
function getDefaultState(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = typeof data !== "undefined";
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}

//# sourceMappingURL=query.js.map

/***/ }),

/***/ 6275:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ QueryCache)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8298);
/* harmony import */ var _query_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(681);
/* harmony import */ var _notifyManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1895);
/* harmony import */ var _subscribable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3248);
// src/queryCache.ts




var QueryCache = class extends _subscribable_js__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .hashQueryKeyByOptions */ .Rm)(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new _query_js__WEBPACK_IMPORTED_MODULE_2__/* .Query */ .A({
        cache: this,
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
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .matchQuery */ ._x)(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .matchQuery */ ._x)(filters, query)) : queries;
  }
  notify(event) {
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};

//# sourceMappingURL=queryCache.js.map

/***/ }),

/***/ 372:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ QueryClient)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8298);
/* harmony import */ var _queryCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6275);
/* harmony import */ var _mutationCache_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1750);
/* harmony import */ var _focusManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5777);
/* harmony import */ var _onlineManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3965);
/* harmony import */ var _notifyManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1895);
/* harmony import */ var _infiniteQueryBehavior_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3620);
// src/queryClient.ts







var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new _queryCache_js__WEBPACK_IMPORTED_MODULE_0__/* .QueryCache */ .t();
    this.#mutationCache = config.mutationCache || new _mutationCache_js__WEBPACK_IMPORTED_MODULE_1__/* .MutationCache */ .L();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1)
      return;
    this.#unsubscribeFocus = _focusManager_js__WEBPACK_IMPORTED_MODULE_2__/* .focusManager */ .j.subscribe(() => {
      if (_focusManager_js__WEBPACK_IMPORTED_MODULE_2__/* .focusManager */ .j.isFocused()) {
        this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = _onlineManager_js__WEBPACK_IMPORTED_MODULE_3__/* .onlineManager */ .N.subscribe(() => {
      if (_onlineManager_js__WEBPACK_IMPORTED_MODULE_3__/* .onlineManager */ .N.isOnline()) {
        this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0)
      return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  getQueryData(queryKey) {
    return this.#queryCache.find({ queryKey })?.state.data;
  }
  ensureQueryData(options) {
    const cachedData = this.getQueryData(options.queryKey);
    return cachedData !== void 0 ? Promise.resolve(cachedData) : this.fetchQuery(options);
  }
  getQueriesData(filters) {
    return this.getQueryCache().findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const query = this.#queryCache.find({ queryKey });
    const prevData = query?.state.data;
    const data = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .functionalUpdate */ .SE)(updater, prevData);
    if (typeof data === "undefined") {
      return void 0;
    }
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return _notifyManager_js__WEBPACK_IMPORTED_MODULE_5__/* .notifyManager */ .V.batch(
      () => this.getQueryCache().findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    return this.#queryCache.find({ queryKey })?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_5__/* .notifyManager */ .V.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    const refetchFilters = {
      type: "active",
      ...filters
    };
    return _notifyManager_js__WEBPACK_IMPORTED_MODULE_5__/* .notifyManager */ .V.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(refetchFilters, options);
    });
  }
  cancelQueries(filters = {}, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = _notifyManager_js__WEBPACK_IMPORTED_MODULE_5__/* .notifyManager */ .V.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT).catch(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT);
  }
  invalidateQueries(filters = {}, options = {}) {
    return _notifyManager_js__WEBPACK_IMPORTED_MODULE_5__/* .notifyManager */ .V.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters.refetchType === "none") {
        return Promise.resolve();
      }
      const refetchFilters = {
        ...filters,
        type: filters.refetchType ?? filters.type ?? "active"
      };
      return this.refetchQueries(refetchFilters, options);
    });
  }
  refetchQueries(filters = {}, options) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options?.cancelRefetch ?? true
    };
    const promises = _notifyManager_js__WEBPACK_IMPORTED_MODULE_5__/* .notifyManager */ .V.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (typeof defaultedOptions.retry === "undefined") {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT).catch(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT);
  }
  fetchInfiniteQuery(options) {
    options.behavior = (0,_infiniteQueryBehavior_js__WEBPACK_IMPORTED_MODULE_6__/* .infiniteQueryBehavior */ .Gm)(options.pages);
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT).catch(_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .noop */ .ZT);
  }
  resumePausedMutations() {
    return this.#mutationCache.resumePausedMutations();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .hashKey */ .Ym)(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    let result = {};
    defaults.forEach((queryDefault) => {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .partialMatchKey */ .to)(queryKey, queryDefault.queryKey)) {
        result = { ...result, ...queryDefault.defaultOptions };
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .hashKey */ .Ym)(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    let result = {};
    defaults.forEach((queryDefault) => {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .partialMatchKey */ .to)(mutationKey, queryDefault.mutationKey)) {
        result = { ...result, ...queryDefault.defaultOptions };
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...options?.queryKey && this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__/* .hashQueryKeyByOptions */ .Rm)(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (typeof defaultedOptions.refetchOnReconnect === "undefined") {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (typeof defaultedOptions.throwOnError === "undefined") {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (typeof defaultedOptions.networkMode === "undefined" && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};

//# sourceMappingURL=queryClient.js.map

/***/ }),

/***/ 4218:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ QueryObserver)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8298);
/* harmony import */ var _notifyManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1895);
/* harmony import */ var _focusManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5777);
/* harmony import */ var _subscribable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3248);
/* harmony import */ var _retryer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6087);
// src/queryObserver.ts





var QueryObserver = class extends _subscribable_js__WEBPACK_IMPORTED_MODULE_0__/* .Subscribable */ .l {
  constructor(client, options) {
    super();
    this.options = options;
    this.#client = client;
    this.#selectError = null;
    this.bindMethods();
    this.setOptions(options);
  }
  #client;
  #currentQuery = void 0;
  #currentQueryInitialState = void 0;
  #currentResult = void 0;
  #currentResultState;
  #currentResultOptions;
  #selectError;
  #selectFn;
  #selectResult;
  // This property keeps track of the last query with defined data.
  // It will be used to pass the previous data and query to the placeholder function between renders.
  #lastQueryWithDefinedData;
  #staleTimeoutId;
  #refetchIntervalId;
  #currentRefetchInterval;
  #trackedProps = /* @__PURE__ */ new Set();
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      this.#currentQuery.addObserver(this);
      if (shouldFetchOnMount(this.#currentQuery, this.options)) {
        this.#executeFetch();
      } else {
        this.updateResult();
      }
      this.#updateTimers();
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      this.#currentQuery,
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      this.#currentQuery,
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    this.#clearStaleTimeout();
    this.#clearRefetchInterval();
    this.#currentQuery.removeObserver(this);
  }
  setOptions(options, notifyOptions) {
    const prevOptions = this.options;
    const prevQuery = this.#currentQuery;
    this.options = this.#client.defaultQueryOptions(options);
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(prevOptions, this.options)) {
      this.#client.getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: this.#currentQuery,
        observer: this
      });
    }
    if (typeof this.options.enabled !== "undefined" && typeof this.options.enabled !== "boolean") {
      throw new Error("Expected enabled to be a boolean");
    }
    if (!this.options.queryKey) {
      this.options.queryKey = prevOptions.queryKey;
    }
    this.#updateQuery();
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      this.#currentQuery,
      prevQuery,
      this.options,
      prevOptions
    )) {
      this.#executeFetch();
    }
    this.updateResult(notifyOptions);
    if (mounted && (this.#currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || this.options.staleTime !== prevOptions.staleTime)) {
      this.#updateStaleTimeout();
    }
    const nextRefetchInterval = this.#computeRefetchInterval();
    if (mounted && (this.#currentQuery !== prevQuery || this.options.enabled !== prevOptions.enabled || nextRefetchInterval !== this.#currentRefetchInterval)) {
      this.#updateRefetchInterval(nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = this.#client.getQueryCache().build(this.#client, options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      this.#currentResult = result;
      this.#currentResultOptions = this.options;
      this.#currentResultState = this.#currentQuery.state;
    }
    return result;
  }
  getCurrentResult() {
    return this.#currentResult;
  }
  trackResult(result) {
    const trackedResult = {};
    Object.keys(result).forEach((key) => {
      Object.defineProperty(trackedResult, key, {
        configurable: false,
        enumerable: true,
        get: () => {
          this.#trackedProps.add(key);
          return result[key];
        }
      });
    });
    return trackedResult;
  }
  getCurrentQuery() {
    return this.#currentQuery;
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = this.#client.defaultQueryOptions(options);
    const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
    query.isFetchingOptimistic = true;
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return this.#executeFetch({
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return this.#currentResult;
    });
  }
  #executeFetch(fetchOptions) {
    this.#updateQuery();
    let promise = this.#currentQuery.fetch(
      this.options,
      fetchOptions
    );
    if (!fetchOptions?.throwOnError) {
      promise = promise.catch(_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .noop */ .ZT);
    }
    return promise;
  }
  #updateStaleTimeout() {
    this.#clearStaleTimeout();
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk || this.#currentResult.isStale || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isValidTimeout */ .PN)(this.options.staleTime)) {
      return;
    }
    const time = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .timeUntilStale */ .Kp)(
      this.#currentResult.dataUpdatedAt,
      this.options.staleTime
    );
    const timeout = time + 1;
    this.#staleTimeoutId = setTimeout(() => {
      if (!this.#currentResult.isStale) {
        this.updateResult();
      }
    }, timeout);
  }
  #computeRefetchInterval() {
    return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
  }
  #updateRefetchInterval(nextInterval) {
    this.#clearRefetchInterval();
    this.#currentRefetchInterval = nextInterval;
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isServer */ .sk || this.options.enabled === false || !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isValidTimeout */ .PN)(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) {
      return;
    }
    this.#refetchIntervalId = setInterval(() => {
      if (this.options.refetchIntervalInBackground || _focusManager_js__WEBPACK_IMPORTED_MODULE_2__/* .focusManager */ .j.isFocused()) {
        this.#executeFetch();
      }
    }, this.#currentRefetchInterval);
  }
  #updateTimers() {
    this.#updateStaleTimeout();
    this.#updateRefetchInterval(this.#computeRefetchInterval());
  }
  #clearStaleTimeout() {
    if (this.#staleTimeoutId) {
      clearTimeout(this.#staleTimeoutId);
      this.#staleTimeoutId = void 0;
    }
  }
  #clearRefetchInterval() {
    if (this.#refetchIntervalId) {
      clearInterval(this.#refetchIntervalId);
      this.#refetchIntervalId = void 0;
    }
  }
  createResult(query, options) {
    const prevQuery = this.#currentQuery;
    const prevOptions = this.options;
    const prevResult = this.#currentResult;
    const prevResultState = this.#currentResultState;
    const prevResultOptions = this.#currentResultOptions;
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : this.#currentQueryInitialState;
    const { state } = query;
    let { error, errorUpdatedAt, fetchStatus, status } = state;
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        fetchStatus = (0,_retryer_js__WEBPACK_IMPORTED_MODULE_3__/* .canFetch */ .Kw)(query.options.networkMode) ? "fetching" : "paused";
        if (!state.dataUpdatedAt) {
          status = "pending";
        }
      }
      if (options._optimisticResults === "isRestoring") {
        fetchStatus = "idle";
      }
    }
    if (options.select && typeof state.data !== "undefined") {
      if (prevResult && state.data === prevResultState?.data && options.select === this.#selectFn) {
        data = this.#selectResult;
      } else {
        try {
          this.#selectFn = options.select;
          data = options.select(state.data);
          data = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .replaceData */ .oE)(prevResult?.data, data, options);
          this.#selectResult = data;
          this.#selectError = null;
        } catch (selectError) {
          this.#selectError = selectError;
        }
      }
    } else {
      data = state.data;
    }
    if (typeof options.placeholderData !== "undefined" && typeof data === "undefined" && status === "pending") {
      let placeholderData;
      if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
        placeholderData = prevResult.data;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          this.#lastQueryWithDefinedData?.state.data,
          this.#lastQueryWithDefinedData
        ) : options.placeholderData;
        if (options.select && typeof placeholderData !== "undefined") {
          try {
            placeholderData = options.select(placeholderData);
            this.#selectError = null;
          } catch (selectError) {
            this.#selectError = selectError;
          }
        }
      }
      if (typeof placeholderData !== "undefined") {
        status = "success";
        data = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .replaceData */ .oE)(
          prevResult?.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (this.#selectError) {
      error = this.#selectError;
      data = this.#selectResult;
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const result = {
      status,
      fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: state.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: state.fetchFailureCount,
      failureReason: state.fetchFailureReason,
      errorUpdateCount: state.errorUpdateCount,
      isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
      isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount || state.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && state.dataUpdatedAt === 0,
      isPaused: fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && state.dataUpdatedAt !== 0,
      isStale: isStale(query, options),
      refetch: this.refetch
    };
    return result;
  }
  updateResult(notifyOptions) {
    const prevResult = this.#currentResult;
    const nextResult = this.createResult(this.#currentQuery, this.options);
    this.#currentResultState = this.#currentQuery.state;
    this.#currentResultOptions = this.options;
    if (this.#currentResultState.data !== void 0) {
      this.#lastQueryWithDefinedData = this.#currentQuery;
    }
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(nextResult, prevResult)) {
      return;
    }
    this.#currentResult = nextResult;
    const defaultNotifyOptions = {};
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? this.#trackedProps
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(this.#currentResult).some((key) => {
        const typedKey = key;
        const changed = this.#currentResult[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    if (notifyOptions?.listeners !== false && shouldNotifyListeners()) {
      defaultNotifyOptions.listeners = true;
    }
    this.#notify({ ...defaultNotifyOptions, ...notifyOptions });
  }
  #updateQuery() {
    const query = this.#client.getQueryCache().build(this.#client, this.options);
    if (query === this.#currentQuery) {
      return;
    }
    const prevQuery = this.#currentQuery;
    this.#currentQuery = query;
    this.#currentQueryInitialState = query.state;
    if (this.hasListeners()) {
      prevQuery?.removeObserver(this);
      query.addObserver(this);
    }
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      this.#updateTimers();
    }
  }
  #notify(notifyOptions) {
    _notifyManager_js__WEBPACK_IMPORTED_MODULE_4__/* .notifyManager */ .V.batch(() => {
      if (notifyOptions.listeners) {
        this.listeners.forEach((listener) => {
          listener(this.#currentResult);
        });
      }
      this.#client.getQueryCache().notify({
        query: this.#currentQuery,
        type: "observerResultsUpdated"
      });
    });
  }
};
function shouldLoadOnMount(query, options) {
  return options.enabled !== false && !query.state.dataUpdatedAt && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.dataUpdatedAt > 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (options.enabled !== false) {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return options.enabled !== false && (query !== prevQuery || prevOptions.enabled === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return query.isStaleByTime(options.staleTime);
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .shallowEqualObjects */ .VS)(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}

//# sourceMappingURL=queryObserver.js.map

/***/ }),

/***/ 9085:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ Removable)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8298);
// src/removable.ts

var Removable = class {
  #gcTimeout;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .isValidTimeout */ .PN)(this.gcTime)) {
      this.#gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .isServer */ .sk ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (this.#gcTimeout) {
      clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};

//# sourceMappingURL=removable.js.map

/***/ }),

/***/ 6087:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DV: () => (/* binding */ isCancelledError),
/* harmony export */   Kw: () => (/* binding */ canFetch),
/* harmony export */   Mz: () => (/* binding */ createRetryer)
/* harmony export */ });
/* unused harmony export CancelledError */
/* harmony import */ var _focusManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5777);
/* harmony import */ var _onlineManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3965);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8298);
// src/retryer.ts



function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? _onlineManager_js__WEBPACK_IMPORTED_MODULE_0__/* .onlineManager */ .N.isOnline() : true;
}
var CancelledError = class {
  constructor(options) {
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
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
  const cancel = (cancelOptions) => {
    if (!isResolved) {
      reject(new CancelledError(cancelOptions));
      config.abort?.();
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const shouldPause = () => !_focusManager_js__WEBPACK_IMPORTED_MODULE_1__/* .focusManager */ .j.isFocused() || config.networkMode !== "always" && !_onlineManager_js__WEBPACK_IMPORTED_MODULE_0__/* .onlineManager */ .N.isOnline();
  const resolve = (value) => {
    if (!isResolved) {
      isResolved = true;
      config.onSuccess?.(value);
      continueFn?.();
      promiseResolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved) {
      isResolved = true;
      config.onError?.(value);
      continueFn?.();
      promiseReject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        const canContinue = isResolved || !shouldPause();
        if (canContinue) {
          continueResolve(value);
        }
        return canContinue;
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved) {
      return;
    }
    let promiseOrValue;
    try {
      promiseOrValue = config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved) {
        return;
      }
      const retry = config.retry ?? (_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .isServer */ .sk ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__/* .sleep */ ._v)(delay).then(() => {
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
  };
  if (canFetch(config.networkMode)) {
    run();
  } else {
    pause().then(run);
  }
  return {
    promise,
    cancel,
    continue: () => {
      const didContinue = continueFn?.();
      return didContinue ? promise : Promise.resolve();
    },
    cancelRetry,
    continueRetry
  };
}

//# sourceMappingURL=retryer.js.map

/***/ }),

/***/ 3248:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ Subscribable)
/* harmony export */ });
// src/subscribable.ts
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};

//# sourceMappingURL=subscribable.js.map

/***/ }),

/***/ 8298:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ht: () => (/* binding */ addToStart),
/* harmony export */   Kp: () => (/* binding */ timeUntilStale),
/* harmony export */   PN: () => (/* binding */ isValidTimeout),
/* harmony export */   Rm: () => (/* binding */ hashQueryKeyByOptions),
/* harmony export */   SE: () => (/* binding */ functionalUpdate),
/* harmony export */   VS: () => (/* binding */ shallowEqualObjects),
/* harmony export */   VX: () => (/* binding */ addToEnd),
/* harmony export */   X7: () => (/* binding */ matchMutation),
/* harmony export */   Ym: () => (/* binding */ hashKey),
/* harmony export */   ZT: () => (/* binding */ noop),
/* harmony export */   _v: () => (/* binding */ sleep),
/* harmony export */   _x: () => (/* binding */ matchQuery),
/* harmony export */   oE: () => (/* binding */ replaceData),
/* harmony export */   sk: () => (/* binding */ isServer),
/* harmony export */   to: () => (/* binding */ partialMatchKey)
/* harmony export */ });
/* unused harmony exports isPlainArray, isPlainObject, keepPreviousData, replaceEqualDeep */
// src/utils.ts
var isServer =  false || "Deno" in window;
function noop() {
  return void 0;
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (typeof fetchStatus !== "undefined" && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return !Object.keys(b).some((key) => !partialMatchKey(a[key], b[key]));
  }
  return false;
}
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
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function keepPreviousData(previousData) {
  return previousData;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 4010:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NL: () => (/* binding */ useQueryClient),
/* harmony export */   aH: () => (/* binding */ QueryClientProvider)
/* harmony export */ });
/* unused harmony export QueryClientContext */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
"use client";

// src/QueryClientProvider.tsx

var QueryClientContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(
  void 0
);
var useQueryClient = (queryClient) => {
  const client = react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryClientContext);
  if (queryClient) {
    return queryClient;
  }
  if (!client) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return client;
};
var QueryClientProvider = ({
  client,
  children
}) => {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0__.createElement(QueryClientContext.Provider, { value: client }, children);
};

//# sourceMappingURL=QueryClientProvider.js.map

/***/ }),

/***/ 6441:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ useQueryErrorResetBoundary)
/* harmony export */ });
/* unused harmony export QueryErrorResetBoundary */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
"use client";

// src/QueryErrorResetBoundary.tsx

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
var QueryErrorResetBoundaryContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(createValue());
var useQueryErrorResetBoundary = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(QueryErrorResetBoundaryContext);
var QueryErrorResetBoundary = ({
  children
}) => {
  const [value] = React.useState(() => createValue());
  return /* @__PURE__ */ React.createElement(QueryErrorResetBoundaryContext.Provider, { value }, typeof children === "function" ? children(value) : children);
};

//# sourceMappingURL=QueryErrorResetBoundary.js.map

/***/ }),

/***/ 5325:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JN: () => (/* binding */ useClearResetErrorBoundary),
/* harmony export */   KJ: () => (/* binding */ getHasError),
/* harmony export */   pf: () => (/* binding */ ensurePreventErrorBoundaryRetry)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3575);
"use client";

// src/errorBoundaryUtils.ts


var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary) => {
  if (options.suspense || options.throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .shouldThrowError */ .L)(throwOnError, [result.error, query]);
};

//# sourceMappingURL=errorBoundaryUtils.js.map

/***/ }),

/***/ 2793:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ useIsRestoring)
/* harmony export */ });
/* unused harmony export IsRestoringProvider */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
"use client";

// src/isRestoring.ts

var IsRestoringContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(false);
var useIsRestoring = () => react__WEBPACK_IMPORTED_MODULE_0__.useContext(IsRestoringContext);
var IsRestoringProvider = IsRestoringContext.Provider;

//# sourceMappingURL=isRestoring.js.map

/***/ }),

/***/ 5738:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fb: () => (/* binding */ ensureStaleTime),
/* harmony export */   SB: () => (/* binding */ shouldSuspend),
/* harmony export */   j8: () => (/* binding */ fetchOptimistic)
/* harmony export */ });
/* unused harmony exports defaultThrowOnError, willFetch */
// src/suspense.ts
var defaultThrowOnError = (_error, query) => typeof query.state.data === "undefined";
var ensureStaleTime = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    if (typeof defaultedOptions.staleTime !== "number") {
      defaultedOptions.staleTime = 1e3;
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});

//# sourceMappingURL=suspense.js.map

/***/ }),

/***/ 2008:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ useBaseQuery)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9196);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1895);
/* harmony import */ var _QueryErrorResetBoundary_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6441);
/* harmony import */ var _QueryClientProvider_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4010);
/* harmony import */ var _isRestoring_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2793);
/* harmony import */ var _errorBoundaryUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5325);
/* harmony import */ var _suspense_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5738);
"use client";

// src/useBaseQuery.ts







function useBaseQuery(options, Observer, queryClient) {
  if (false) {}
  const client = (0,_QueryClientProvider_js__WEBPACK_IMPORTED_MODULE_1__/* .useQueryClient */ .NL)(queryClient);
  const isRestoring = (0,_isRestoring_js__WEBPACK_IMPORTED_MODULE_2__/* .useIsRestoring */ .S)();
  const errorResetBoundary = (0,_QueryErrorResetBoundary_js__WEBPACK_IMPORTED_MODULE_3__/* .useQueryErrorResetBoundary */ ._)();
  const defaultedOptions = client.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  (0,_suspense_js__WEBPACK_IMPORTED_MODULE_4__/* .ensureStaleTime */ .Fb)(defaultedOptions);
  (0,_errorBoundaryUtils_js__WEBPACK_IMPORTED_MODULE_5__/* .ensurePreventErrorBoundaryRetry */ .pf)(defaultedOptions, errorResetBoundary);
  (0,_errorBoundaryUtils_js__WEBPACK_IMPORTED_MODULE_5__/* .useClearResetErrorBoundary */ .JN)(errorResetBoundary);
  const [observer] = react__WEBPACK_IMPORTED_MODULE_0__.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(
    react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
      (onStoreChange) => {
        const unsubscribe = isRestoring ? () => void 0 : observer.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_6__/* .notifyManager */ .V.batchCalls(onStoreChange));
        observer.updateResult();
        return unsubscribe;
      },
      [observer, isRestoring]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    observer.setOptions(defaultedOptions, { listeners: false });
  }, [defaultedOptions, observer]);
  if ((0,_suspense_js__WEBPACK_IMPORTED_MODULE_4__/* .shouldSuspend */ .SB)(defaultedOptions, result)) {
    throw (0,_suspense_js__WEBPACK_IMPORTED_MODULE_4__/* .fetchOptimistic */ .j8)(defaultedOptions, observer, errorResetBoundary);
  }
  if ((0,_errorBoundaryUtils_js__WEBPACK_IMPORTED_MODULE_5__/* .getHasError */ .KJ)({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query: client.getQueryCache().get(defaultedOptions.queryHash)
  })) {
    throw result.error;
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}

//# sourceMappingURL=useBaseQuery.js.map

/***/ }),

/***/ 2180:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ useQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4218);
/* harmony import */ var _useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2008);
"use client";

// src/useQuery.ts


function useQuery(options, queryClient) {
  return (0,_useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__/* .useBaseQuery */ .r)(options, _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__/* .QueryObserver */ .z, queryClient);
}

//# sourceMappingURL=useQuery.js.map

/***/ }),

/***/ 3575:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ shouldThrowError)
/* harmony export */ });
// src/utils.ts
function shouldThrowError(throwError, params) {
  if (typeof throwError === "function") {
    return throwError(...params);
  }
  return !!throwError;
}

//# sourceMappingURL=utils.js.map

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
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
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7915);
/* harmony import */ var _public_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_public_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4010);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(372);
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
})();

window.EditingToolkit = __webpack_exports__;
/******/ })()
;