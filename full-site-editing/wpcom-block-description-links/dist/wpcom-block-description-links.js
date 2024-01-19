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

/***/ 2680:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(7286);

var callBind = __webpack_require__(9429);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ 9429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(4090);
var GetIntrinsic = __webpack_require__(7286);

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
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

/***/ 7795:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 4090:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(7795);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 7286:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(2636)();
var hasProto = __webpack_require__(8486)();

var getProto = Object.getPrototypeOf || (
	hasProto
		? function (x) { return x.__proto__; } // eslint-disable-line no-proto
		: null
);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(4090);
var hasOwn = __webpack_require__(3198);
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ 8486:
/***/ ((module) => {

"use strict";


var test = {
	foo: {}
};

var $Object = Object;

module.exports = function hasProto() {
	return { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object);
};


/***/ }),

/***/ 2636:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(6679);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 6679:
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 3198:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(4090);

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


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

/***/ 9500:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __webpack_require__(3260);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}


/***/ }),

/***/ 5527:
/***/ ((module) => {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};


/***/ }),

/***/ 9126:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var stringify = __webpack_require__(6845);
var parse = __webpack_require__(9166);
var formats = __webpack_require__(5527);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ 9166:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(2493);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };

    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (cleanRoot !== '__proto__') {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};


/***/ }),

/***/ 6845:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var getSideChannel = __webpack_require__(4294);
var utils = __webpack_require__(2493);
var formats = __webpack_require__(5527);
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? prefix + '[]' : prefix;

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + key : '[' + key + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
    if (opts && 'commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }
    var commaRoundTrip = generateArrayPrefix === 'comma' && opts && opts.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ 2493:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var formats = __webpack_require__(5527);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        /* eslint operator-linebreak: [2, "before"] */
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(7286);
var callBound = __webpack_require__(2680);
var inspect = __webpack_require__(9500);

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
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

/***/ 4814:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   gM: () => (/* binding */ childrenBlockInfoWithDifferentUrl),
/* harmony export */   yd: () => (/* binding */ blockInfoWithVariations)
/* harmony export */ });
/* URLs are localized within the function where these URLs are used. */
/* eslint-disable wpcalypso/i18n-unlocalized-url */
const blockInfoMapping = {
  /**
   * Core Blocks
   */
  'core/template-part': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/template-part-block/',
    postId: 192398
  },
  'core/site-title': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/site-title-block/',
    postId: 184569
  },
  'core/site-tagline': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/site-tagline-block/',
    postId: 184553
  },
  'core/site-logo': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/site-logo-block/',
    postId: 184537
  },
  'core/page-list': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/page-list-block/',
    postId: 180696
  },
  'core/loginout': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/login-out-block/',
    postId: 184610
  },
  'core/video': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/video-block/',
    postId: 149045
  },
  'core/verse': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/verse-block/',
    postId: 149992
  },
  'core/spacer': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/spacer-block/',
    postId: 148996
  },
  'core/shortcode': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/shortcode-block/',
    postId: 149209
  },
  'core/separator': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/separator-block/',
    postId: 149012
  },
  'core/search': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/search-block/',
    postId: 187104
  },
  'core/rss': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/rss-block/',
    postId: 174794
  },
  'core/navigation': {
    link: 'https://wordpress.com/support/site-editing/theme-blocks/navigation-block/',
    postId: 162159
  },
  'core/tag-cloud': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/tag-cloud-block/',
    postId: 188957
  },
  'core/quote': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/quote-block/',
    postId: 148575
  },
  'core/pullquote': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/pullquote-block/',
    postId: 149344
  },
  'core/preformatted': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/preformatted-block/',
    postId: 149339
  },
  'core/more': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/more-block/',
    postId: 148614
  },
  'core/list': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/list-block/',
    postId: 148563
  },
  'core/latest-posts': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/latest-posts-block/',
    postId: 149818
  },
  'core/latest-comments': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/latest-comments-block/',
    postId: 149811
  },
  'core/heading': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/heading-block/',
    postId: 148403
  },
  'core/file': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/file-block/',
    postId: 148586
  },
  'core/embed': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/embed-block/',
    postId: 150644
  },
  'core/html': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/custom-html-block/',
    postId: 149059
  },
  'core/code': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/code-block/',
    postId: 149042
  },
  'core/freeform': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/classic-block/',
    postId: 149026
  },
  'core/categories': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/categories-block/',
    postId: 149793
  },
  'core/calendar': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/calendar-block/',
    postId: 171935
  },
  'core/audio': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/audio-block/',
    postId: 148670
  },
  'core/archives': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/archives-block/',
    postId: 149225
  },
  'core/query': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/query-loop-block/',
    postId: 184188
  },
  'core/media-text': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/media-text-block/',
    postId: 151100
  },
  'core/table': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/table-block/',
    postId: 149666
  },
  'core/social-links': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/social-links-block/',
    postId: 159466
  },
  'core/columns': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/columns-block/',
    postId: 149073
  },
  'core/image': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/image-block/',
    postId: 148378
  },
  'core/cover': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/cover-block/',
    postId: 148675
  },
  'core/buttons': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/buttons-block/',
    postId: 162116
  },
  'core/gallery': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/gallery-block/',
    postId: 148667
  },
  'core/post-content': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/post-content-block/',
    postId: 216265
  },
  'core/table-of-contents': {
    link: 'https://wordpress.com/support/wordpress-editor/table-of-contents-block/',
    postId: 201571
  },
  'core/comments': {
    link: 'https://wordpress.com/support/full-site-editing/theme-blocks/comments-block/',
    postId: 218903
  },
  'core/post-time-to-read': {
    link: 'https://wordpress.com/support/site-editing/theme-blocks/time-to-read-block',
    postId: 243241
  },
  'syntaxhighlighter/code': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/syntax-highlighter-code-block/',
    postId: 4743
  },
  'crowdsignal-forms/vote': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/vote-block/',
    postId: 174824
  },
  'crowdsignal-forms/poll': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/poll-block/',
    postId: 170183
  },
  'crowdsignal-forms/nps': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/measure-nps-block/',
    postId: 182393
  },
  'crowdsignal-forms/feedback': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/feedback-button-block/',
    postId: 183578
  },
  'a8c/posts-carousel': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/posts-carousel-block/',
    postId: 166417
  },
  'premium-content/container': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/premium-content-block/',
    postId: 243475
  },
  'a8c/blog-posts': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/blog-posts-block/',
    postId: 158419
  },
  'jetpack/send-a-message': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/whatsapp-button-block/',
    postId: 169728
  },
  'jetpack/blogroll': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/blogroll-block/',
    postId: 291406
  },
  'jetpack/timeline': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/timeline-block/',
    postId: 158453
  },
  'jetpack/story': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/story-block/',
    postId: 176320
  },
  'jetpack/revue': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/revue-block/',
    postId: 67810
  },
  'jetpack/rating-star': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/ratings-block/',
    postId: 158224
  },
  'jetpack/related-posts': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/related-posts-block/',
    postId: 1545
  },
  'jetpack/repeat-visitor': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/repeat-visitor-block/',
    postId: 154471
  },
  'jetpack/podcast-player': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/podcast-player-block/',
    postId: 163160
  },
  'jetpack/opentable': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/opentable-block/',
    postId: 162208
  },
  'jetpack/map': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/map-block/',
    postId: 149684
  },
  'jetpack/image-compare': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/image-compare-block/',
    postId: 168169
  },
  'jetpack/gif': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/gif-block/',
    postId: 174810
  },
  'jetpack/event-countdown': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/event-countdown-block/',
    postId: 159246
  },
  'jetpack/donations': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/donations/',
    postId: 171110
  },
  'jetpack/calendly': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/calendly-block/',
    postId: 162199
  },
  'jetpack/business-hours': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/business-hours-block/',
    postId: 173136
  },
  'jetpack/wordads': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/ad-block/',
    postId: 190916
  },
  'jetpack/payments-intro': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/payments/',
    postId: 169123
  },
  'jetpack/contact-info': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/contact-info-block/',
    postId: 186162
  },
  'jetpack/tiled-gallery': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/tiled-gallery-block/',
    postId: 150746
  },
  'jetpack/slideshow': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/slideshow-block/',
    postId: 157055
  },
  'jetpack/subscriptions': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/subscription-form-block/',
    postId: 170164
  },
  'jetpack/contact-form': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/form-block/',
    postId: 168307
  },
  'jetpack/layout-grid': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/layout-grid-block/',
    postId: 160172
  },
  'jetpack/mailchimp': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/mailchimp-block/',
    postId: 152657
  },
  'jetpack/paywall': {
    link: 'https://wordpress.com/support/paid-newsletters/#use-the-paywall-block',
    postId: 168381
  }
};
const blockInfoWithVariations = {
  'core/group': {
    group: {
      link: 'https://wordpress.com/support/wordpress-editor/blocks/group-block/',
      postId: 161882
    },
    'group-row': {
      link: 'https://wordpress.com/support/wordpress-editor/blocks/row-block/',
      postId: 190036
    },
    'group-stack': {
      link: 'https://wordpress.com/support/wordpress-editor/blocks/row-block/',
      postId: 190036
    }
  }
};
const childrenBlockInfoWithDifferentUrl = {
  /**
   * Core Blocks
   */
  'core/nextpage': {
    link: 'https://wordpress.com/support/wordpress-editor/blocks/page-break-block/',
    postId: 149374
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (blockInfoMapping);

/***/ }),

/***/ 9226:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7498);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2694);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _block_links_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4814);
/* harmony import */ var _inline_support_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4526);






const createLocalizedDescriptionWithLearnMore = (title, description, url, postId) => {
  const localizedUrl = (0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_4__/* .localizeUrl */ .aq)(url, window.wpcomBlockDescriptionLinksLocale);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createInterpolateElement)('<InlineSupportLink />', {
    InlineSupportLink: (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_inline_support_link__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {
      title: String(title),
      url: localizedUrl,
      postId: postId
    }, description)
  });
};
const processedBlocks = {};
const addBlockSupportLinks = (settings, name) => {
  // If block has a parent, use the parents name in the switch. This will apply the link to all nested blocks.
  // The exception is "post content" block because it's used to allow blocks like "more" and "jetpack/paywall" only in post content areas & post editor
  // `parent` is actually an array of strings, so converting to string is going to join multiple blocks together, making the method buggy.
  const parentName = settings?.parent?.toString();
  const isChild = parentName && parentName !== 'core/post-content';
  const blockName = isChild ? parentName : name;

  /**
   * This is needed because the `blocks.registerBlockType` filter is also triggered for deprecations.
   *
   * When the block has deprecations, this filter is triggered multiple times, resulting the Learn more link being appended multiple times.
   */
  if (processedBlocks[name]) {
    return settings;
  }
  processedBlocks[name] = true;
  const additonalDescLink = _block_links_map__WEBPACK_IMPORTED_MODULE_2__/* .childrenBlockInfoWithDifferentUrl */ .gM[name]?.link || _block_links_map__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .ZP[blockName]?.link;
  const additionalDescPostId = _block_links_map__WEBPACK_IMPORTED_MODULE_2__/* .childrenBlockInfoWithDifferentUrl */ .gM[name]?.postId || _block_links_map__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .ZP[blockName]?.postId;

  /**
   * Some elements are children, but have their own url for Learn More, and we want to show those.
   */
  if (additonalDescLink && additionalDescPostId) {
    settings.description = createLocalizedDescriptionWithLearnMore(String(settings.title), settings.description, additonalDescLink, additionalDescPostId);
  }
  if (_block_links_map__WEBPACK_IMPORTED_MODULE_2__/* .blockInfoWithVariations */ .yd[name] && settings.variations && Array.isArray(settings.variations)) {
    settings.variations = settings.variations.map(variation => {
      const link = _block_links_map__WEBPACK_IMPORTED_MODULE_2__/* .blockInfoWithVariations */ .yd[name][variation.name]?.link;
      const postId = _block_links_map__WEBPACK_IMPORTED_MODULE_2__/* .blockInfoWithVariations */ .yd[name][variation.name]?.postId;
      if (!link) {
        return variation;
      }
      variation.description = createLocalizedDescriptionWithLearnMore(variation.title, variation.description, link, postId);
      return variation;
    });
  }
  return settings;
};
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('blocks.registerBlockType', 'full-site-editing/add-block-support-link', addBlockSupportLinks);

/***/ }),

/***/ 4526:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ DescriptionSupportLink)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6115);
/* harmony import */ var _automattic_help_center_src_stores__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8865);
/* harmony import */ var _automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7498);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5609);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9196);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);







const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__;

function DescriptionSupportLink({
  children,
  title,
  url,
  postId
}) {
  // This was cooked up to only apply the link in the BlockEditor sidebar.
  // Since there was no identifier in the environment to differentiate.
  const [ref, setRef] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)();
  const {
    setShowHelpCenter,
    setShowSupportDoc
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)(_automattic_help_center_src_stores__WEBPACK_IMPORTED_MODULE_6__/* .HELP_CENTER_STORE */ .aM);
  if (ref && !ref?.closest('.block-editor-block-inspector')) {
    return children;
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, children, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), setShowHelpCenter ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    onClick: () => {
      setShowHelpCenter(true);
      setShowSupportDoc((0,_automattic_i18n_utils__WEBPACK_IMPORTED_MODULE_7__/* .localizeUrl */ .aq)(url), postId);
      (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__/* .recordTracksEvent */ .jN)('calypso_block_description_support_link_click', {
        block: title,
        support_link: url
      });
    },
    style: {
      marginTop: 10,
      height: 'unset'
    },
    ref: reference => ref !== reference && setRef(reference),
    className: "fse-inline-support-link is-compact",
    variant: "link"
  }, __('Learn more', 'full-site-editing')) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ExternalLink, {
    onClick: () => {
      (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_1__/* .recordTracksEvent */ .jN)('calypso_block_description_support_link_click', {
        block: title,
        support_link: url
      });
    },
    ref: reference => ref !== reference && setRef(reference),
    style: {
      display: 'block',
      marginTop: 10,
      maxWidth: 'fit-content'
    },
    className: "fse-inline-support-link",
    href: url
  }, __('Learn more', 'full-site-editing')));
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
  _loadTracksResult = (0,_automattic_load_script__WEBPACK_IMPORTED_MODULE_1__/* .loadScript */ .ve)('//stats.wp.com/w.js?67');
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
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__),
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (configApi);
const isEnabled = configApi.isEnabled;
const enabledFeatures = configApi.enabledFeatures;
const enable = configApi.enable;
const disable = configApi.disable;

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

/***/ 2865:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   receiveHasSeenWhatsNewModal: () => (/* binding */ receiveHasSeenWhatsNewModal),
/* harmony export */   resetStore: () => (/* binding */ resetStore),
/* harmony export */   setHasSeenWhatsNewModal: () => (/* binding */ setHasSeenWhatsNewModal),
/* harmony export */   setInitialRoute: () => (/* binding */ setInitialRoute),
/* harmony export */   setIsMinimized: () => (/* binding */ setIsMinimized),
/* harmony export */   setMessage: () => (/* binding */ setMessage),
/* harmony export */   setShowHelpCenter: () => (/* binding */ setShowHelpCenter),
/* harmony export */   setShowMessagingChat: () => (/* binding */ setShowMessagingChat),
/* harmony export */   setShowMessagingLauncher: () => (/* binding */ setShowMessagingLauncher),
/* harmony export */   setShowMessagingWidget: () => (/* binding */ setShowMessagingWidget),
/* harmony export */   setShowSupportDoc: () => (/* binding */ setShowSupportDoc),
/* harmony export */   setSite: () => (/* binding */ setSite),
/* harmony export */   setSubject: () => (/* binding */ setSubject),
/* harmony export */   setUnreadCount: () => (/* binding */ setUnreadCount),
/* harmony export */   setUserDeclaredSite: () => (/* binding */ setUserDeclaredSite),
/* harmony export */   setUserDeclaredSiteUrl: () => (/* binding */ setUserDeclaredSiteUrl),
/* harmony export */   startHelpCenterChat: () => (/* binding */ startHelpCenterChat)
/* harmony export */ });
/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3418);
/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8552);
/* harmony import */ var _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3661);



const receiveHasSeenWhatsNewModal = value => ({
  type: 'HELP_CENTER_SET_SEEN_WHATS_NEW_MODAL',
  value
});
function* setHasSeenWhatsNewModal(value) {
  let response;
  if ((0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_1__/* .canAccessWpcomApis */ .aO)()) {
    response = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/block-editor/has-seen-whats-new-modal`,
      apiNamespace: 'wpcom/v2',
      method: 'PUT',
      body: {
        has_seen_whats_new_modal: value
      }
    });
  } else {
    response = yield (0,_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_0__.apiFetch)({
      global: true,
      path: `/wpcom/v2/block-editor/has-seen-whats-new-modal`,
      method: 'PUT',
      data: {
        has_seen_whats_new_modal: value
      }
    });
  }
  return receiveHasSeenWhatsNewModal(response.has_seen_whats_new_modal);
}
const setSite = site => ({
  type: 'HELP_CENTER_SET_SITE',
  site
});
const setUnreadCount = count => ({
  type: 'HELP_CENTER_SET_UNREAD_COUNT',
  count
});
const setInitialRoute = route => ({
  type: 'HELP_CENTER_SET_INITIAL_ROUTE',
  route
});
const setIsMinimized = minimized => ({
  type: 'HELP_CENTER_SET_MINIMIZED',
  minimized
});
const setShowMessagingLauncher = show => ({
  type: 'HELP_CENTER_SET_SHOW_MESSAGING_LAUNCHER',
  show
});
const setShowMessagingWidget = show => ({
  type: 'HELP_CENTER_SET_SHOW_MESSAGING_WIDGET',
  show
});
const setShowHelpCenter = function* (show) {
  if (!show) {
    yield setInitialRoute(undefined);
    yield setIsMinimized(false);
  } else {
    yield setShowMessagingWidget(false);
  }
  return {
    type: 'HELP_CENTER_SET_SHOW',
    show
  };
};
const setSubject = subject => ({
  type: 'HELP_CENTER_SET_SUBJECT',
  subject
});
const setMessage = message => ({
  type: 'HELP_CENTER_SET_MESSAGE',
  message
});
const setUserDeclaredSiteUrl = url => ({
  type: 'HELP_CENTER_SET_USER_DECLARED_SITE_URL',
  url
});
const setUserDeclaredSite = site => ({
  type: 'HELP_CENTER_SET_USER_DECLARED_SITE',
  site
});
const resetStore = () => ({
  type: 'HELP_CENTER_RESET_STORE'
});
const startHelpCenterChat = function* (site, message) {
  yield setInitialRoute('/contact-form?mode=CHAT');
  yield setSite(site);
  yield setMessage(message);
  yield setShowHelpCenter(true);
};
const setShowMessagingChat = function* () {
  yield setShowHelpCenter(false);
  yield setShowMessagingLauncher(true);
  yield setShowMessagingWidget(true);
  yield resetStore();
};
const setShowSupportDoc = function* (link, postId) {
  const params = new URLSearchParams({
    link,
    postId: String(postId),
    cacheBuster: String(Date.now())
  });
  yield setInitialRoute(`/post/?${params}`);
  yield setShowHelpCenter(true);
};

/***/ }),

/***/ 2193:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ STORE_KEY)
/* harmony export */ });
const STORE_KEY = 'automattic/help-center';

/***/ }),

/***/ 7624:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ register)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3418);
/* harmony import */ var _wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6963);
/* harmony import */ var _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3661);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2865);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2193);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1654);
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5601);








let isRegistered = false;
function register() {
  (0,_plugins__WEBPACK_IMPORTED_MODULE_2__/* .registerPlugins */ .z)();
  if (!isRegistered) {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.registerStore)(_constants__WEBPACK_IMPORTED_MODULE_3__/* .STORE_KEY */ .L, {
      actions: _actions__WEBPACK_IMPORTED_MODULE_4__,
      reducer: _reducer__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z,
      controls: {
        ..._wordpress_data_controls__WEBPACK_IMPORTED_MODULE_1__.controls,
        ..._wpcom_request_controls__WEBPACK_IMPORTED_MODULE_6__/* .controls */ .ai
      },
      selectors: _selectors__WEBPACK_IMPORTED_MODULE_7__,
      persist: ['site', 'message', 'userDeclaredSite', 'userDeclaredSiteUrl', 'subject']
    });
    isRegistered = true;
  }
  return _constants__WEBPACK_IMPORTED_MODULE_3__/* .STORE_KEY */ .L;
}

/***/ }),

/***/ 1654:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const showHelpCenter = (state, action) => {
  switch (action.type) {
    case 'HELP_CENTER_SET_SHOW':
      return action.show;
  }
  return state;
};
const showMessagingLauncher = (state, action) => {
  switch (action.type) {
    case 'HELP_CENTER_SET_SHOW_MESSAGING_LAUNCHER':
      return action.show;
  }
  return state;
};
const showMessagingWidget = (state, action) => {
  switch (action.type) {
    case 'HELP_CENTER_SET_SHOW_MESSAGING_WIDGET':
      return action.show;
  }
  return state;
};
const hasSeenWhatsNewModal = (state, action) => {
  switch (action.type) {
    case 'HELP_CENTER_SET_SEEN_WHATS_NEW_MODAL':
      return action.value;
  }
  return state;
};
const isMinimized = (state = false, action) => {
  switch (action.type) {
    case 'HELP_CENTER_SET_MINIMIZED':
      return action.minimized;
  }
  return state;
};
const site = (state, action) => {
  if (action.type === 'HELP_CENTER_RESET_STORE') {
    return undefined;
  } else if (action.type === 'HELP_CENTER_SET_SITE') {
    return action.site;
  }
  return state;
};
const subject = (state, action) => {
  if (action.type === 'HELP_CENTER_RESET_STORE') {
    return undefined;
  } else if (action.type === 'HELP_CENTER_SET_SUBJECT') {
    return action.subject;
  }
  return state;
};
const unreadCount = (state = 0, action) => {
  if (action.type === 'HELP_CENTER_SET_UNREAD_COUNT') {
    return action.count;
  } else if (action.type === 'HELP_CENTER_RESET_STORE') {
    return 0;
  }
  return state;
};
const message = (state, action) => {
  if (action.type === 'HELP_CENTER_RESET_STORE') {
    return undefined;
  } else if (action.type === 'HELP_CENTER_SET_MESSAGE') {
    return action.message;
  }
  return state;
};
const userDeclaredSiteUrl = (state, action) => {
  if (action.type === 'HELP_CENTER_RESET_STORE') {
    return undefined;
  } else if (action.type === 'HELP_CENTER_SET_USER_DECLARED_SITE_URL') {
    return action.url;
  }
  return state;
};
const userDeclaredSite = (state, action) => {
  if (action.type === 'HELP_CENTER_RESET_STORE') {
    return undefined;
  } else if (action.type === 'HELP_CENTER_SET_USER_DECLARED_SITE') {
    return action.site;
  }
  return state;
};
const initialRoute = (state, action) => {
  if (action.type === 'HELP_CENTER_SET_INITIAL_ROUTE') {
    return action.route;
  }
  return state;
};
const reducer = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  showHelpCenter,
  showMessagingLauncher,
  showMessagingWidget,
  site,
  subject,
  message,
  userDeclaredSite,
  userDeclaredSiteUrl,
  hasSeenWhatsNewModal,
  isMinimized,
  unreadCount,
  initialRoute
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer);

/***/ }),

/***/ 5601:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHasSeenWhatsNewModal: () => (/* binding */ getHasSeenWhatsNewModal),
/* harmony export */   getInitialRoute: () => (/* binding */ getInitialRoute),
/* harmony export */   getIsMinimized: () => (/* binding */ getIsMinimized),
/* harmony export */   getMessage: () => (/* binding */ getMessage),
/* harmony export */   getSite: () => (/* binding */ getSite),
/* harmony export */   getSubject: () => (/* binding */ getSubject),
/* harmony export */   getUnreadCount: () => (/* binding */ getUnreadCount),
/* harmony export */   getUserDeclaredSite: () => (/* binding */ getUserDeclaredSite),
/* harmony export */   getUserDeclaredSiteUrl: () => (/* binding */ getUserDeclaredSiteUrl),
/* harmony export */   isHelpCenterShown: () => (/* binding */ isHelpCenterShown),
/* harmony export */   isMessagingLauncherShown: () => (/* binding */ isMessagingLauncherShown),
/* harmony export */   isMessagingWidgetShown: () => (/* binding */ isMessagingWidgetShown)
/* harmony export */ });
const isHelpCenterShown = state => state.showHelpCenter;
const isMessagingLauncherShown = state => state.showMessagingLauncher;
const isMessagingWidgetShown = state => state.showMessagingWidget;
const getSite = state => state.site;
const getSubject = state => state.subject;
const getMessage = state => state.message;
const getUserDeclaredSiteUrl = state => state.userDeclaredSiteUrl;
const getUserDeclaredSite = state => state.userDeclaredSite;
const getUnreadCount = state => state.unreadCount;
const getIsMinimized = state => state.isMinimized;
const getHasSeenWhatsNewModal = state => state.hasSeenWhatsNewModal;
const getInitialRoute = state => state.initialRoute;

/***/ }),

/***/ 6963:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ registerPlugins)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _one_week_persistence_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7246);


let isRegistered = false;
const registerPlugins = () => {
  if (isRegistered) {
    return;
  }
  isRegistered = true;

  /**
   * Register plugins for data-stores
   */
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.use)(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.plugins.persistence, _one_week_persistence_config__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);
};

/***/ }),

/***/ 7246:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
    Defines the options used for the @wp/data persistence plugin, 
    which include a persistent storage implementation to add data expiration handling.
*/
const storageKey = 'WPCOM_7_DAYS_PERSISTENCE';
const PERSISTENCE_INTERVAL = 7 * 24 * 3600000; // days * hours in days * ms in hour
const STORAGE_KEY = storageKey;
const STORAGE_TS_KEY = storageKey + '_TS';

// A plain object fallback if localStorage is not available
const objStore = {};
const objStorage = {
  getItem(key) {
    if (objStore.hasOwnProperty(key)) {
      return objStore[key];
    }
    return null;
  },
  setItem(key, value) {
    objStore[key] = String(value);
  },
  removeItem(key) {
    delete objStore[key];
  }
};

// Make sure localStorage support exists
const localStorageSupport = () => {
  try {
    window.localStorage.setItem('WP_ONBOARD_TEST', '1');
    window.localStorage.removeItem('WP_ONBOARD_TEST');
    return true;
  } catch (e) {
    return false;
  }
};

// Choose the right storage implementation
const storageHandler = localStorageSupport() ? window.localStorage : objStorage;

// Persisted data expires after seven days
const isNotExpired = timestampStr => {
  const timestamp = Number(timestampStr);
  return Boolean(timestamp) && timestamp + PERSISTENCE_INTERVAL > Date.now();
};

// Check for "fresh" query param
const hasFreshParam = () => {
  return new URLSearchParams(window.location.search).has('fresh');
};

// Handle data expiration by providing a storage object override to the @wp/data persistence plugin.
const storage = {
  getItem(key) {
    const timestamp = storageHandler.getItem(STORAGE_TS_KEY);
    if (timestamp && isNotExpired(timestamp) && !hasFreshParam()) {
      return storageHandler.getItem(key);
    }
    storageHandler.removeItem(STORAGE_KEY);
    storageHandler.removeItem(STORAGE_TS_KEY);
    return null;
  },
  setItem(key, value) {
    storageHandler.setItem(STORAGE_TS_KEY, JSON.stringify(Date.now()));
    storageHandler.setItem(key, value);
  }
};
const persistOptions = {
  storageKey: STORAGE_KEY,
  storage
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (persistOptions);

/***/ }),

/***/ 8459:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ createActions)
/* harmony export */ });
/* harmony import */ var _automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(899);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3661);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9639);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3691);


const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__;



// Import from a specific file directly to avoid the circular dependencies

function createActions(clientCreds) {
  const fetchSite = () => ({
    type: 'FETCH_SITE'
  });
  const fetchNewSite = () => ({
    type: 'FETCH_NEW_SITE'
  });
  const receiveNewSite = response => ({
    type: 'RECEIVE_NEW_SITE',
    response
  });
  const receiveNewSiteFailed = error => ({
    type: 'RECEIVE_NEW_SITE_FAILED',
    error
  });
  function* createSite(params) {
    yield fetchNewSite();
    try {
      const {
        authToken,
        ...providedParams
      } = params;
      const defaultParams = {
        client_id: clientCreds.client_id,
        client_secret: clientCreds.client_secret,
        // will find an available `*.wordpress.com` url based on the `blog_name`
        find_available_url: true,
        // Private site is default, but overridable, setting
        public: -1
      };
      const mergedParams = {
        ...defaultParams,
        ...providedParams,
        // Set to false because site validation should be a separate action
        validate: false
      };
      const newSite = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: '/sites/new',
        apiVersion: '1.1',
        method: 'post',
        body: mergedParams,
        token: authToken
      });
      yield receiveNewSite(newSite);
      return true;
    } catch (err) {
      yield receiveNewSiteFailed(err);
      return false;
    }
  }
  const receiveSite = (siteId, response) => ({
    type: 'RECEIVE_SITE',
    siteId,
    response
  });
  const receiveSiteTitle = (siteId, name) => ({
    type: 'RECEIVE_SITE_TITLE',
    siteId,
    name
  });
  const receiveSiteTagline = (siteId, tagline) => ({
    type: 'RECEIVE_SITE_TAGLINE',
    siteId,
    tagline
  });
  const receiveSiteVerticalId = (siteId, verticalId) => ({
    type: 'RECEIVE_SITE_VERTICAL_ID',
    siteId,
    verticalId
  });
  const receiveSiteFailed = (siteId, response) => ({
    type: 'RECEIVE_SITE_FAILED',
    siteId,
    response
  });
  const reset = () => ({
    type: 'RESET_SITE_STORE'
  });
  const resetNewSiteFailed = () => ({
    type: 'RESET_RECEIVE_NEW_SITE_FAILED'
  });
  const launchSiteStart = siteId => ({
    type: 'LAUNCH_SITE_START',
    siteId
  });
  const launchSiteSuccess = siteId => ({
    type: 'LAUNCH_SITE_SUCCESS',
    siteId
  });
  const launchSiteFailure = (siteId, error) => ({
    type: 'LAUNCH_SITE_FAILURE',
    siteId,
    error
  });
  function* launchSite(siteId) {
    yield launchSiteStart(siteId);
    try {
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${siteId}/launch`,
        apiVersion: '1.1',
        method: 'post'
      });
      yield launchSiteSuccess(siteId);
    } catch (_) {
      yield launchSiteFailure(siteId, _types__WEBPACK_IMPORTED_MODULE_3__/* .SiteLaunchError */ .Hc.INTERNAL);
    }
  }

  // TODO: move getCart and setCart to a 'cart' data-store
  function* getCart(siteId) {
    const success = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: '/me/shopping-cart/' + siteId,
      apiVersion: '1.1',
      method: 'GET'
    });
    return success;
  }
  const receiveSiteDomains = (siteId, domains) => ({
    type: 'RECEIVE_SITE_DOMAINS',
    siteId,
    domains
  });
  const receiveSiteTheme = (siteId, theme) => ({
    type: 'RECEIVE_SITE_THEME',
    siteId,
    theme
  });
  const receiveSiteSettings = (siteId, settings) => ({
    type: 'RECEIVE_SITE_SETTINGS',
    siteId,
    settings
  });
  const updateSiteSettings = (siteId, settings) => ({
    type: 'UPDATE_SITE_SETTINGS',
    siteId,
    settings
  });
  function* setCart(siteId, cartData) {
    const success = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: '/me/shopping-cart/' + siteId,
      apiVersion: '1.1',
      method: 'POST',
      body: cartData
    });
    return success;
  }
  const receiveSiteGlobalStyles = (siteId, globalStyles) => ({
    type: 'RECEIVE_SITE_GLOBAL_STYLES',
    siteId,
    globalStyles
  });
  function* getGlobalStyles(siteId, stylesheet) {
    const globalStyles = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${siteId}/global-styles/themes/${stylesheet}`,
      apiNamespace: 'wp/v2'
    });
    yield receiveSiteGlobalStyles(siteId, globalStyles);
    return globalStyles;
  }
  function* setGlobalStyles(siteIdOrSlug, stylesheet, globalStyles, activatedTheme) {
    // only update if there settings or styles to update
    if (Object.keys(globalStyles.settings ?? {}).length || Object.keys(globalStyles.styles ?? {}).length) {
      const globalStylesId = activatedTheme?.global_styles_id || (yield getGlobalStylesId(siteIdOrSlug, stylesheet));
      const updatedGlobalStyles = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteIdOrSlug)}/global-styles/${globalStylesId}`,
        apiNamespace: 'wp/v2',
        method: 'POST',
        body: {
          id: globalStylesId,
          settings: globalStyles.settings ?? {},
          styles: globalStyles.styles ?? {}
        }
      });
      return updatedGlobalStyles;
    }
  }
  function* getGlobalStylesId(siteIdOrSlug, stylesheet) {
    const theme = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${encodeURIComponent(siteIdOrSlug)}/themes/${stylesheet}`,
      method: 'GET',
      apiNamespace: 'wp/v2'
    });
    const globalStylesUrl = theme?._links?.['wp:user-global-styles']?.[0]?.href;
    if (globalStylesUrl) {
      // eslint-disable-next-line no-useless-escape
      const match = globalStylesUrl.match(/global-styles\/(?<id>[\/\w-]+)/);
      if (match && match.groups) {
        return match.groups.id;
      }
    }
    return null;
  }
  function* getGlobalStylesVariations(siteIdOrSlug, stylesheet) {
    const variations = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${encodeURIComponent(siteIdOrSlug)}/global-styles/themes/${stylesheet}/variations`,
      method: 'GET',
      apiNamespace: 'wp/v2'
    });
    return variations;
  }
  function* saveSiteSettings(siteId, settings) {
    try {
      // extract this into its own function as a generic settings setter
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteId)}/settings`,
        apiVersion: '1.4',
        body: settings,
        method: 'POST'
      });
      if ('blogname' in settings) {
        yield receiveSiteTitle(siteId, settings.blogname);
      }
      if ('blogdescription' in settings) {
        yield receiveSiteTagline(siteId, settings.blogdescription);
      }
      if ('site_vertical_id' in settings) {
        yield receiveSiteVerticalId(siteId, settings.site_vertical_id);
      }
      yield updateSiteSettings(siteId, settings);
    } catch (e) {}
  }
  function* setIntentOnSite(siteSlug, intent) {
    try {
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteSlug)}/site-intent`,
        apiNamespace: 'wpcom/v2',
        body: {
          site_intent: intent
        },
        method: 'POST'
      });
    } catch (e) {}
  }
  function* setStaticHomepageOnSite(siteID, pageId) {
    try {
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteID)}/homepage`,
        apiVersion: '1.1',
        body: {
          is_page_on_front: true,
          page_on_front_id: pageId
        },
        method: 'POST'
      });
    } catch (e) {}
  }
  function* setGoalsOnSite(siteSlug, goals) {
    try {
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteSlug)}/site-goals`,
        apiNamespace: 'wpcom/v2',
        body: {
          site_goals: goals
        },
        method: 'POST'
      });
    } catch (e) {}
  }
  function* saveSiteTitle(siteId, blogname) {
    yield saveSiteSettings(siteId, {
      blogname
    });
  }
  function* saveSiteTagline(siteId, blogdescription) {
    yield saveSiteSettings(siteId, {
      blogdescription
    });
  }
  function* installTheme(siteSlugOrId, themeSlug) {
    yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${siteSlugOrId}/themes/${themeSlug}/install`,
      apiVersion: '1.1',
      method: 'POST'
    });
  }
  function* runThemeSetupOnSite(siteSlug) {
    yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${encodeURIComponent(siteSlug)}/theme-setup/?_locale=user`,
      apiNamespace: 'wpcom/v2',
      method: 'POST'
    });
  }
  function* setDesignOnSite(siteSlug, selectedDesign, options = {}) {
    const themeSlug = selectedDesign.slug || selectedDesign.recipe?.stylesheet?.split('/')[1] || selectedDesign.theme;
    const {
      styleVariation,
      globalStyles
    } = options;
    const activatedTheme = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${siteSlug}/themes/mine?_locale=user`,
      apiVersion: '1.1',
      body: {
        theme: themeSlug
      },
      method: 'POST'
    });

    // @todo Always use the global styles for consistency
    if (styleVariation?.slug) {
      const variations = yield* getGlobalStylesVariations(siteSlug, activatedTheme.stylesheet);
      const currentVariation = variations.find(variation => variation.title && variation.title.split(' ').join('-').toLowerCase() === styleVariation?.slug);
      if (currentVariation) {
        yield* setGlobalStyles(siteSlug, activatedTheme.stylesheet, currentVariation, activatedTheme);
      }
    }
    if (globalStyles) {
      yield* setGlobalStyles(siteSlug, activatedTheme.stylesheet, globalStyles, activatedTheme);
    }

    // Potentially runs Headstart.
    // E.g. if the homepage has a Query Loop block, we insert placeholder posts on the new site.
    yield* runThemeSetupOnSite(siteSlug);
    return activatedTheme;
  }
  function* createCustomTemplate(siteSlug, stylesheet, slug, title, content) {
    const templateId = `${stylesheet}//${slug}`;
    let existed = true;
    try {
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteSlug)}/templates/${templateId}`,
        apiNamespace: 'wp/v2',
        method: 'GET'
      });
    } catch {
      existed = false;
    }
    const templatePath = `templates/${existed ? templateId : ''}`;
    yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${encodeURIComponent(siteSlug)}/${templatePath}`,
      apiNamespace: 'wp/v2',
      body: {
        slug,
        theme: stylesheet,
        title,
        content,
        status: 'publish',
        is_wp_suggestion: true
      },
      method: 'POST'
    });
  }
  function* assembleSite(siteSlug, stylesheet = '', {
    homeHtml,
    headerHtml,
    footerHtml,
    pages,
    globalStyles,
    canReplaceContent,
    siteSetupOption
  } = {}) {
    const templates = [{
      type: 'wp_template',
      slug: 'home',
      title: __('Home'),
      content: (0,_utils__WEBPACK_IMPORTED_MODULE_4__/* .createCustomHomeTemplateContent */ .J)(stylesheet, !!headerHtml, !!footerHtml, !!homeHtml, homeHtml)
    }, headerHtml && {
      type: 'wp_template_part',
      slug: 'header',
      title: __('Header'),
      content: headerHtml
    }, footerHtml && {
      type: 'wp_template_part',
      slug: 'footer',
      title: __('Footer'),
      content: footerHtml
    }].filter(Boolean);
    const endpointSuffix = (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__/* .isEnabled */ ._k)('pattern-assembler/perf-test') ? '-perf-test' : '';
    yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
      path: `/sites/${encodeURIComponent(siteSlug)}/site-assembler${endpointSuffix}`,
      apiNamespace: 'wpcom/v2',
      body: {
        templates,
        pages,
        global_styles: globalStyles,
        can_replace_content: canReplaceContent,
        site_setup_option: siteSetupOption
      },
      method: 'POST'
    });
  }
  const setSiteSetupError = (error, message) => ({
    type: 'SET_SITE_SETUP_ERROR',
    error,
    message
  });
  const clearSiteSetupError = siteId => ({
    type: 'CLEAR_SITE_SETUP_ERROR',
    siteId
  });
  const atomicTransferStart = (siteId, softwareSet) => ({
    type: 'ATOMIC_TRANSFER_START',
    siteId,
    softwareSet
  });
  const atomicTransferSuccess = (siteId, softwareSet) => ({
    type: 'ATOMIC_TRANSFER_SUCCESS',
    siteId,
    softwareSet
  });
  const atomicTransferFailure = (siteId, softwareSet, error) => ({
    type: 'ATOMIC_TRANSFER_FAILURE',
    siteId,
    softwareSet,
    error
  });
  function* initiateAtomicTransfer(siteId, softwareSet) {
    yield atomicTransferStart(siteId, softwareSet);
    try {
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteId)}/atomic/transfers`,
        apiNamespace: 'wpcom/v2',
        method: 'POST',
        ...(softwareSet ? {
          body: {
            software_set: encodeURIComponent(softwareSet),
            context: softwareSet
          }
        } : {
          body: {
            context: 'unknown'
          }
        })
      });
      yield atomicTransferSuccess(siteId, softwareSet);
    } catch (_) {
      yield atomicTransferFailure(siteId, softwareSet, _types__WEBPACK_IMPORTED_MODULE_3__/* .AtomicTransferError */ .Hf.INTERNAL);
    }
  }
  const latestAtomicTransferStart = siteId => ({
    type: 'LATEST_ATOMIC_TRANSFER_START',
    siteId
  });
  const latestAtomicTransferSuccess = (siteId, transfer) => ({
    type: 'LATEST_ATOMIC_TRANSFER_SUCCESS',
    siteId,
    transfer
  });
  const latestAtomicTransferFailure = (siteId, error) => ({
    type: 'LATEST_ATOMIC_TRANSFER_FAILURE',
    siteId,
    error
  });
  function* requestLatestAtomicTransfer(siteId) {
    yield latestAtomicTransferStart(siteId);
    try {
      const transfer = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteId)}/atomic/transfers/latest`,
        apiNamespace: 'wpcom/v2',
        method: 'GET'
      });
      yield latestAtomicTransferSuccess(siteId, transfer);
    } catch (err) {
      yield latestAtomicTransferFailure(siteId, err);
    }
  }
  const atomicSoftwareStatusStart = (siteId, softwareSet) => ({
    type: 'ATOMIC_SOFTWARE_STATUS_START',
    siteId,
    softwareSet
  });
  const atomicSoftwareStatusSuccess = (siteId, softwareSet, status) => ({
    type: 'ATOMIC_SOFTWARE_STATUS_SUCCESS',
    siteId,
    softwareSet,
    status
  });
  const atomicSoftwareStatusFailure = (siteId, softwareSet, error) => ({
    type: 'ATOMIC_SOFTWARE_STATUS_FAILURE',
    siteId,
    softwareSet,
    error
  });
  function* requestAtomicSoftwareStatus(siteId, softwareSet) {
    yield atomicSoftwareStatusStart(siteId, softwareSet);
    try {
      const status = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteId)}/atomic/software/${encodeURIComponent(softwareSet)}`,
        apiNamespace: 'wpcom/v2',
        method: 'GET'
      });
      yield atomicSoftwareStatusSuccess(siteId, softwareSet, status);
    } catch (err) {
      yield atomicSoftwareStatusFailure(siteId, softwareSet, err);
    }
  }
  const atomicSoftwareInstallStart = (siteId, softwareSet) => ({
    type: 'ATOMIC_SOFTWARE_INSTALL_START',
    siteId,
    softwareSet
  });
  const atomicSoftwareInstallSuccess = (siteId, softwareSet) => ({
    type: 'ATOMIC_SOFTWARE_INSTALL_SUCCESS',
    siteId,
    softwareSet
  });
  const atomicSoftwareInstallFailure = (siteId, softwareSet, error) => ({
    type: 'ATOMIC_SOFTWARE_INSTALL_FAILURE',
    siteId,
    softwareSet,
    error
  });
  function* initiateSoftwareInstall(siteId, softwareSet) {
    yield atomicSoftwareInstallStart(siteId, softwareSet);
    try {
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_2__/* .wpcomRequest */ ._9)({
        path: `/sites/${encodeURIComponent(siteId)}/atomic/software/${encodeURIComponent(softwareSet)}`,
        apiNamespace: 'wpcom/v2',
        method: 'POST',
        body: {}
      });
      yield atomicSoftwareInstallSuccess(siteId, softwareSet);
    } catch (err) {
      yield atomicSoftwareInstallFailure(siteId, softwareSet, err);
    }
  }
  const setBundledPluginSlug = (siteSlug, pluginSlug) => ({
    type: 'SET_BUNDLED_PLUGIN_SLUG',
    siteSlug,
    pluginSlug
  });
  return {
    receiveSiteDomains,
    receiveSiteSettings,
    receiveSiteTheme,
    saveSiteTitle,
    saveSiteSettings,
    setIntentOnSite,
    setStaticHomepageOnSite,
    setGoalsOnSite,
    receiveSiteTitle,
    fetchNewSite,
    fetchSite,
    receiveNewSite,
    receiveNewSiteFailed,
    resetNewSiteFailed,
    installTheme,
    setDesignOnSite,
    createCustomTemplate,
    assembleSite,
    createSite,
    receiveSite,
    receiveSiteFailed,
    receiveSiteTagline,
    receiveSiteVerticalId,
    updateSiteSettings,
    saveSiteTagline,
    reset,
    launchSite,
    launchSiteStart,
    launchSiteSuccess,
    launchSiteFailure,
    getCart,
    setCart,
    getGlobalStyles,
    setGlobalStyles,
    receiveSiteGlobalStyles,
    setSiteSetupError,
    clearSiteSetupError,
    initiateAtomicTransfer,
    atomicTransferStart,
    atomicTransferSuccess,
    atomicTransferFailure,
    latestAtomicTransferStart,
    latestAtomicTransferSuccess,
    latestAtomicTransferFailure,
    requestLatestAtomicTransfer,
    atomicSoftwareStatusStart,
    atomicSoftwareStatusSuccess,
    atomicSoftwareStatusFailure,
    requestAtomicSoftwareStatus,
    initiateSoftwareInstall,
    atomicSoftwareInstallStart,
    atomicSoftwareInstallSuccess,
    atomicSoftwareInstallFailure,
    setBundledPluginSlug
  };
}

/***/ }),

/***/ 2005:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ STORE_KEY)
/* harmony export */ });
/* unused harmony export getPlaceholderSiteID */
/* harmony import */ var _automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(899);

const STORE_KEY = 'automattic/site';
const getPlaceholderSiteID = () => isEnabled('pattern-assembler/v2') ? '226011606' // assemblerdemo
: '224076220'; // creatio2demo

/***/ }),

/***/ 2369:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z2: () => (/* binding */ register)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6963);
/* harmony import */ var _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3661);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8459);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2005);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2701);
/* harmony import */ var _resolvers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7862);
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4309);










let isRegistered = false;
function register(clientCreds) {
  if (!isRegistered) {
    (0,_plugins__WEBPACK_IMPORTED_MODULE_1__/* .registerPlugins */ .z)();
    isRegistered = true;
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.registerStore)(_constants__WEBPACK_IMPORTED_MODULE_2__/* .STORE_KEY */ .L, {
      actions: (0,_actions__WEBPACK_IMPORTED_MODULE_3__/* .createActions */ .d)(clientCreds),
      controls: _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_4__/* .controls */ .ai,
      reducer: _reducer__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .ZP,
      resolvers: _resolvers__WEBPACK_IMPORTED_MODULE_6__,
      selectors: _selectors__WEBPACK_IMPORTED_MODULE_7__,
      persist: ['bundledPluginSlug']
    });
  }
  return _constants__WEBPACK_IMPORTED_MODULE_2__/* .STORE_KEY */ .L;
}

/***/ }),

/***/ 2701:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports newSiteData, newSiteError, isFetchingSite, fetchingSiteError, isFetchingSiteDetails, sites, sitesDomains, sitesSettings, siteTheme, sitesGlobalStyles, launchStatus, siteSetupErrors, atomicTransferStatus, latestAtomicTransferStatus, atomicSoftwareStatus, atomicSoftwareInstallStatus */
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9639);



const newSiteData = (state, action) => {
  if (action.type === 'RECEIVE_NEW_SITE') {
    const {
      response
    } = action;
    return response.blog_details;
  } else if (action.type === 'RECEIVE_NEW_SITE_FAILED') {
    return undefined;
  } else if (action.type === 'RESET_SITE_STORE') {
    return undefined;
  }
  return state;
};
const newSiteError = (state, action) => {
  switch (action.type) {
    case 'FETCH_NEW_SITE':
    case 'RECEIVE_NEW_SITE':
    case 'RESET_SITE_STORE':
    case 'RESET_RECEIVE_NEW_SITE_FAILED':
      return undefined;
    case 'RECEIVE_NEW_SITE_FAILED':
      return {
        error: action.error.error,
        status: action.error.status,
        statusCode: action.error.statusCode,
        name: action.error.name,
        message: action.error.message
      };
  }
  return state;
};
const isFetchingSite = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_NEW_SITE':
      return true;
    case 'RECEIVE_NEW_SITE':
    case 'RECEIVE_NEW_SITE_FAILED':
    case 'RESET_SITE_STORE':
    case 'RESET_RECEIVE_NEW_SITE_FAILED':
      return false;
  }
  return state;
};
const fetchingSiteError = (state, action) => {
  switch (action.type) {
    case 'RECEIVE_SITE_FAILED':
      return {
        error: action.response.error,
        message: action.response.message
      };
  }
  return state;
};
const isFetchingSiteDetails = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_SITE':
      return true;
    case 'RECEIVE_SITE':
    case 'RECEIVE_SITE_FAILED':
      return false;
  }
  return state;
};
const sites = (state = {}, action) => {
  if (action.type === 'RECEIVE_SITE') {
    if (action.response) {
      return {
        ...state,
        [action.response.ID]: action.response
      };
    }
    return state;
  } else if (action.type === 'RECEIVE_SITE_FAILED') {
    const {
      [action.siteId]: idToBeRemoved,
      ...remainingState
    } = state;
    return {
      ...remainingState
    };
  } else if (action.type === 'RESET_SITE_STORE') {
    return {};
  } else if (action.type === 'RECEIVE_SITE_TITLE') {
    return {
      ...state,
      [action.siteId]: {
        ...state[action.siteId],
        name: action.name
      }
    };
  } else if (action.type === 'RECEIVE_SITE_TAGLINE') {
    return {
      ...state,
      [action.siteId]: {
        ...state[action.siteId],
        description: action.tagline ?? ''
      }
    };
  } else if (action.type === 'RECEIVE_SITE_VERTICAL_ID') {
    return {
      ...state,
      [action.siteId]: {
        ...state[action.siteId],
        options: {
          ...state[action.siteId]?.options,
          site_vertical_id: action.verticalId
        }
      }
    };
  }
  return state;
};
const sitesDomains = (state = {}, action) => {
  if (action.type === 'RECEIVE_SITE_DOMAINS') {
    return {
      ...state,
      [action.siteId]: action.domains
    };
  }
  return state;
};
const sitesSettings = (state = {}, action) => {
  if (action.type === 'RECEIVE_SITE_SETTINGS') {
    return {
      ...state,
      [action.siteId]: action.settings
    };
  }
  if (action.type === 'UPDATE_SITE_SETTINGS') {
    return {
      ...state,
      [action.siteId]: {
        ...state?.[action.siteId],
        ...action.settings
      }
    };
  }
  return state;
};
const siteTheme = (state = {}, action) => {
  if (action.type === 'RECEIVE_SITE_THEME') {
    return {
      ...state,
      [action.siteId]: action.theme
    };
  }
  return state;
};
const sitesGlobalStyles = (state = {}, action) => {
  if (action.type === 'RECEIVE_SITE_GLOBAL_STYLES') {
    return {
      ...state,
      [action.siteId]: {
        ...state?.[action.siteId],
        ...action.globalStyles
      }
    };
  }
  return state;
};
const launchStatus = (state = {}, action) => {
  if (action.type === 'LAUNCH_SITE_START') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .SiteLaunchStatus */ .uS.IN_PROGRESS,
        errorCode: undefined
      }
    };
  }
  if (action.type === 'LAUNCH_SITE_SUCCESS') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .SiteLaunchStatus */ .uS.SUCCESS,
        errorCode: undefined
      }
    };
  }
  if (action.type === 'LAUNCH_SITE_FAILURE') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .SiteLaunchStatus */ .uS.FAILURE,
        errorCode: action.error
      }
    };
  }
  return state;
};
const siteSetupErrors = (state = {}, action) => {
  if (action.type === 'SET_SITE_SETUP_ERROR') {
    const {
      error,
      message
    } = action;
    return {
      error,
      message
    };
  }
  if (action.type === 'CLEAR_SITE_SETUP_ERROR') {
    return {};
  }
  return state;
};
const atomicTransferStatus = (state = {}, action) => {
  if (action.type === 'ATOMIC_TRANSFER_START') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .AtomicTransferStatus */ .bc.IN_PROGRESS,
        softwareSet: action.softwareSet,
        errorCode: undefined
      }
    };
  }
  if (action.type === 'ATOMIC_TRANSFER_SUCCESS') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .AtomicTransferStatus */ .bc.SUCCESS,
        softwareSet: action.softwareSet,
        errorCode: undefined
      }
    };
  }
  if (action.type === 'ATOMIC_TRANSFER_FAILURE') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .AtomicTransferStatus */ .bc.FAILURE,
        softwareSet: action.softwareSet,
        errorCode: action.error
      }
    };
  }
  return state;
};
const latestAtomicTransferStatus = (state = {}, action) => {
  if (action.type === 'LATEST_ATOMIC_TRANSFER_START') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .LatestAtomicTransferStatus */ .O.IN_PROGRESS,
        transfer: undefined,
        errorCode: undefined
      }
    };
  }
  if (action.type === 'LATEST_ATOMIC_TRANSFER_SUCCESS') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .LatestAtomicTransferStatus */ .O.SUCCESS,
        transfer: action.transfer,
        errorCode: undefined
      }
    };
  }
  if (action.type === 'LATEST_ATOMIC_TRANSFER_FAILURE') {
    return {
      ...state,
      [action.siteId]: {
        status: _types__WEBPACK_IMPORTED_MODULE_1__/* .LatestAtomicTransferStatus */ .O.FAILURE,
        transfer: undefined,
        errorCode: action.error
      }
    };
  }
  return state;
};
const atomicSoftwareStatus = (state = {}, action) => {
  if (action.type === 'ATOMIC_SOFTWARE_STATUS_START') {
    return {
      ...state,
      [action.siteId]: {
        [action.softwareSet]: {
          status: undefined,
          error: undefined
        }
      }
    };
  }
  if (action.type === 'ATOMIC_SOFTWARE_STATUS_SUCCESS') {
    return {
      ...state,
      [action.siteId]: {
        [action.softwareSet]: {
          status: action.status,
          error: undefined
        }
      }
    };
  }
  if (action.type === 'ATOMIC_SOFTWARE_STATUS_FAILURE') {
    return {
      ...state,
      [action.siteId]: {
        [action.softwareSet]: {
          status: undefined,
          error: action.error
        }
      }
    };
  }
  return state;
};
const atomicSoftwareInstallStatus = (state = {}, action) => {
  if (action.type === 'ATOMIC_SOFTWARE_INSTALL_START') {
    return {
      ...state,
      [action.siteId]: {
        [action.softwareSet]: {
          status: _types__WEBPACK_IMPORTED_MODULE_1__/* .AtomicSoftwareInstallStatus */ .sw.IN_PROGRESS,
          error: undefined
        }
      }
    };
  }
  if (action.type === 'ATOMIC_SOFTWARE_INSTALL_SUCCESS') {
    return {
      ...state,
      [action.siteId]: {
        [action.softwareSet]: {
          status: _types__WEBPACK_IMPORTED_MODULE_1__/* .AtomicSoftwareInstallStatus */ .sw.SUCCESS,
          error: undefined
        }
      }
    };
  }
  if (action.type === 'ATOMIC_SOFTWARE_INSTALL_FAILURE') {
    return {
      ...state,
      [action.siteId]: {
        [action.softwareSet]: {
          status: _types__WEBPACK_IMPORTED_MODULE_1__/* .AtomicSoftwareInstallStatus */ .sw.FAILURE,
          error: action.error
        }
      }
    };
  }
  return state;
};
const bundledPluginSlug = (state = {}, action) => {
  if (action.type === 'SET_BUNDLED_PLUGIN_SLUG') {
    return {
      ...state,
      [action.siteSlug]: action.pluginSlug
    };
  }
  if (action.type === 'RESET_SITE_STORE') {
    return {};
  }
  return state;
};
const newSite = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  data: newSiteData,
  error: newSiteError,
  isFetching: isFetchingSite
});
const reducer = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  isFetchingSiteDetails,
  newSite,
  fetchingSiteError,
  sites,
  launchStatus,
  sitesDomains,
  sitesSettings,
  siteTheme,
  sitesGlobalStyles,
  siteSetupErrors,
  atomicTransferStatus,
  latestAtomicTransferStatus,
  atomicSoftwareStatus,
  atomicSoftwareInstallStatus,
  bundledPluginSlug
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer);

/***/ }),

/***/ 7862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSite: () => (/* binding */ getSite),
/* harmony export */   getSiteDomains: () => (/* binding */ getSiteDomains),
/* harmony export */   getSiteSettings: () => (/* binding */ getSiteSettings),
/* harmony export */   getSiteTheme: () => (/* binding */ getSiteTheme)
/* harmony export */ });
/* harmony import */ var wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8552);
// wpcomRequest is a temporary rename while we're working on migrating generators to thunks

/**
 * Attempt to find a site based on its id, and if not return undefined.
 * We are currently ignoring error messages and silently failing if we can't find a
 * site. This could be extended in the future by retrieving the `error` and
 * `message` strings returned by the API.
 *
 * @param siteId {number}	The site to look up
 */
const getSite = siteId => async ({
  dispatch
}) => {
  dispatch.fetchSite();
  try {
    const existingSite = await (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)({
      path: '/sites/' + encodeURIComponent(siteId),
      apiVersion: '1.1',
      query: 'force=wpcom'
    });
    dispatch.receiveSite(siteId, existingSite);
  } catch (err) {
    dispatch.receiveSiteFailed(siteId, err);
  }
};

/**
 * Get all site domains
 *
 * @param siteId {number} The site id
 */
const getSiteDomains = siteId => async ({
  dispatch
}) => {
  const result = await (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)({
    path: '/sites/' + encodeURIComponent(siteId) + '/domains',
    apiVersion: '1.2'
  });
  dispatch.receiveSiteDomains(siteId, result?.domains);
};

/**
 * Get all site settings
 *
 * @param siteId {number} The site id
 */
const getSiteSettings = siteId => async ({
  dispatch
}) => {
  const result = await (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)({
    path: '/sites/' + encodeURIComponent(siteId) + '/settings',
    apiVersion: '1.4'
  });
  dispatch.receiveSiteSettings(siteId, result?.settings);
};

/**
 * Get current site theme
 *
 * @param siteId {number} The site id
 */
const getSiteTheme = siteId => async ({
  dispatch
}) => {
  const theme = await (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)({
    path: '/sites/' + encodeURIComponent(siteId) + '/themes/mine',
    apiVersion: '1.1'
  });
  dispatch.receiveSiteTheme(siteId, theme);
};

/***/ }),

/***/ 4309:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAtomicSoftwareError: () => (/* binding */ getAtomicSoftwareError),
/* harmony export */   getAtomicSoftwareInstallError: () => (/* binding */ getAtomicSoftwareInstallError),
/* harmony export */   getAtomicSoftwareStatus: () => (/* binding */ getAtomicSoftwareStatus),
/* harmony export */   getBundledPluginSlug: () => (/* binding */ getBundledPluginSlug),
/* harmony export */   getFetchingSiteError: () => (/* binding */ getFetchingSiteError),
/* harmony export */   getNewSite: () => (/* binding */ getNewSite),
/* harmony export */   getNewSiteError: () => (/* binding */ getNewSiteError),
/* harmony export */   getPrimarySiteDomain: () => (/* binding */ getPrimarySiteDomain),
/* harmony export */   getSite: () => (/* binding */ getSite),
/* harmony export */   getSiteDomains: () => (/* binding */ getSiteDomains),
/* harmony export */   getSiteGlobalStyles: () => (/* binding */ getSiteGlobalStyles),
/* harmony export */   getSiteIdBySlug: () => (/* binding */ getSiteIdBySlug),
/* harmony export */   getSiteLatestAtomicTransfer: () => (/* binding */ getSiteLatestAtomicTransfer),
/* harmony export */   getSiteLatestAtomicTransferError: () => (/* binding */ getSiteLatestAtomicTransferError),
/* harmony export */   getSiteOption: () => (/* binding */ getSiteOption),
/* harmony export */   getSiteOptions: () => (/* binding */ getSiteOptions),
/* harmony export */   getSiteSettings: () => (/* binding */ getSiteSettings),
/* harmony export */   getSiteSetupError: () => (/* binding */ getSiteSetupError),
/* harmony export */   getSiteSubdomain: () => (/* binding */ getSiteSubdomain),
/* harmony export */   getSiteTheme: () => (/* binding */ getSiteTheme),
/* harmony export */   getSiteTitle: () => (/* binding */ getSiteTitle),
/* harmony export */   getSiteVerticalId: () => (/* binding */ getSiteVerticalId),
/* harmony export */   getState: () => (/* binding */ getState),
/* harmony export */   isFetchingSite: () => (/* binding */ isFetchingSite),
/* harmony export */   isFetchingSiteDetails: () => (/* binding */ isFetchingSiteDetails),
/* harmony export */   isJetpackSite: () => (/* binding */ isJetpackSite),
/* harmony export */   isNewSite: () => (/* binding */ isNewSite),
/* harmony export */   isSiteAtomic: () => (/* binding */ isSiteAtomic),
/* harmony export */   isSiteLaunched: () => (/* binding */ isSiteLaunched),
/* harmony export */   isSiteLaunching: () => (/* binding */ isSiteLaunching),
/* harmony export */   isSiteWPForTeams: () => (/* binding */ isSiteWPForTeams),
/* harmony export */   requiresUpgrade: () => (/* binding */ requiresUpgrade),
/* harmony export */   siteHasFeature: () => (/* binding */ siteHasFeature)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2005);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9639);



const getState = state => state;
const getNewSite = state => state.newSite.data;
const getNewSiteError = state => state.newSite.error;
const isFetchingSite = state => state.newSite.isFetching;
const getFetchingSiteError = state => state.fetchingSiteError;
const isFetchingSiteDetails = state => state.isFetchingSiteDetails;
const isNewSite = state => !!state.newSite.data;

/**
 * Get a site matched by id. This selector has a matching
 * resolver that uses the `siteId` parameter to fetch an existing site. If the
 * site cannot be found, invalidate the resolution cache.
 * @param state {State}		state object
 * @param siteId {number}	id of the site to look up
 */
const getSite = (state, siteId) => {
  return (
    // Try matching numeric site ID
    state.sites[siteId] ||
    // Then try matching primary domain
    Object.values(state.sites).find(site => site && new URL(site.URL).host === siteId) ||
    // Then try matching second domain
    Object.values(state.sites).find(site => site?.options?.unmapped_url && new URL(site.options.unmapped_url).host === siteId)
  );
};
const getSiteIdBySlug = (_, slug) => {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSite(slug)?.ID;
};
const getSiteTitle = (_, siteId) => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSite(siteId)?.name;
const getSiteVerticalId = (_, siteId) => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSite(siteId)?.options?.site_vertical_id;

// @TODO: Return LaunchStatus instead of a boolean
const isSiteLaunched = (state, siteId) => {
  return state.launchStatus[siteId]?.status === _types__WEBPACK_IMPORTED_MODULE_2__/* .SiteLaunchStatus */ .uS.SUCCESS;
};

// @TODO: Return LaunchStatus instead of a boolean
const isSiteLaunching = (state, siteId) => {
  return state.launchStatus[siteId]?.status === _types__WEBPACK_IMPORTED_MODULE_2__/* .SiteLaunchStatus */ .uS.IN_PROGRESS;
};
const isSiteAtomic = (state, siteId) => {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSite(siteId)?.options?.is_wpcom_atomic === true;
};
const isSiteWPForTeams = (state, siteId) => {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSite(siteId)?.options?.is_wpforteams_site === true;
};
const getSiteDomains = (state, siteId) => {
  return state.sitesDomains[siteId];
};
const getSiteSettings = (state, siteId) => {
  return state.sitesSettings[siteId];
};
const getSiteTheme = (state, siteId) => {
  return state.siteTheme[siteId];
};
const getSiteGlobalStyles = (state, siteId) => {
  return state.sitesGlobalStyles[siteId];
};
const getSiteSetupError = state => {
  return state.siteSetupErrors;
};
const getSiteOptions = (state, siteId) => {
  return state.sites[siteId]?.options;
};
const getSiteOption = (state, siteId, optionName) => {
  return state.sites[siteId]?.options?.[optionName];
};
const getPrimarySiteDomain = (_, siteId) => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSiteDomains(siteId)?.find(domain => domain.primary_domain);
const getSiteSubdomain = (_, siteId) => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSiteDomains(siteId)?.find(domain => domain.is_subdomain);
const getSiteLatestAtomicTransfer = (state, siteId) => {
  return state.latestAtomicTransferStatus[siteId]?.transfer;
};
const getSiteLatestAtomicTransferError = (state, siteId) => {
  return state.latestAtomicTransferStatus[siteId]?.errorCode;
};
const getAtomicSoftwareStatus = (state, siteId, softwareSet) => {
  return state.atomicSoftwareStatus[siteId]?.[softwareSet]?.status;
};
const getAtomicSoftwareError = (state, siteId, softwareSet) => {
  return state.atomicSoftwareStatus[siteId]?.[softwareSet]?.error;
};
const getAtomicSoftwareInstallError = (state, siteId, softwareSet) => {
  return state.atomicSoftwareInstallStatus[siteId]?.[softwareSet]?.error;
};
const siteHasFeature = (_, siteId, featureKey) => {
  return Boolean(siteId && (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSite(siteId)?.plan?.features.active.includes(featureKey));
};

// TODO: The `0` here seems wrong and should likely be addressed.
const requiresUpgrade = (state, siteId) => {
  return siteId && !(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).siteHasFeature(siteId, 'woop');
};
function isJetpackSite(state, siteId) {
  return Boolean(siteId && (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L).getSite(siteId)?.jetpack);
}
const getBundledPluginSlug = (state, siteSlug) => state.bundledPluginSlug[siteSlug];

/***/ }),

/***/ 9639:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Hc: () => (/* binding */ SiteLaunchError),
/* harmony export */   Hf: () => (/* binding */ AtomicTransferError),
/* harmony export */   O: () => (/* binding */ LatestAtomicTransferStatus),
/* harmony export */   bc: () => (/* binding */ AtomicTransferStatus),
/* harmony export */   sw: () => (/* binding */ AtomicSoftwareInstallStatus),
/* harmony export */   uS: () => (/* binding */ SiteLaunchStatus)
/* harmony export */ });
/* unused harmony exports Visibility, SiteCapabilities */
let Visibility = /*#__PURE__*/function (Visibility) {
  Visibility[Visibility["PublicIndexed"] = 1] = "PublicIndexed";
  Visibility[Visibility["PublicNotIndexed"] = 0] = "PublicNotIndexed";
  Visibility[Visibility["Private"] = -1] = "Private";
  return Visibility;
}({});

// is_fse_active && is_fse_eligible properties have been deprecated and removed from SiteDetails interface

let SiteCapabilities = /*#__PURE__*/function (SiteCapabilities) {
  SiteCapabilities["ACTIVATE_PLUGINS"] = "activate_plugins";
  SiteCapabilities["ACTIVATE_WORDADS"] = "activate_wordads";
  SiteCapabilities["DELETE_OTHERS_POSTS"] = "delete_others_posts";
  SiteCapabilities["DELETE_USERS"] = "delete_users";
  SiteCapabilities["EDIT_OTHERS_PAGES"] = "edit_others_pages";
  SiteCapabilities["EDIT_OTHERS_POSTS"] = "edit_others_posts";
  SiteCapabilities["EDIT_PAGES"] = "edit_pages";
  SiteCapabilities["EDIT_POSTS"] = "edit_posts";
  SiteCapabilities["EDIT_THEME_OPTIONS"] = "edit_theme_options";
  SiteCapabilities["EDIT_USERS"] = "edit_users";
  SiteCapabilities["LIST_USERS"] = "list_users";
  SiteCapabilities["MANAGE_CATEGORIES"] = "manage_categories";
  SiteCapabilities["MANAGE_OPTIONS"] = "manage_options";
  SiteCapabilities["MODERATE_COMMENTS"] = "moderate_comments";
  SiteCapabilities["OWN_SITE"] = "own_site";
  SiteCapabilities["PROMOTE_USERS"] = "promote_users";
  SiteCapabilities["PUBLISH_POSTS"] = "publish_posts";
  SiteCapabilities["REMOVE_USERS"] = "remove_users";
  SiteCapabilities["UPLOAD_FILES"] = "upload_files";
  SiteCapabilities["VIEW_HOSTING"] = "view_hosting";
  SiteCapabilities["VIEW_STATS"] = "view_stats";
  return SiteCapabilities;
}({});

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-enable @typescript-eslint/no-explicit-any */

let SiteLaunchError = /*#__PURE__*/function (SiteLaunchError) {
  SiteLaunchError["INTERNAL"] = "internal";
  return SiteLaunchError;
}({});
let SiteLaunchStatus = /*#__PURE__*/function (SiteLaunchStatus) {
  SiteLaunchStatus["UNINITIALIZED"] = "unintialized";
  SiteLaunchStatus["IN_PROGRESS"] = "in_progress";
  SiteLaunchStatus["SUCCESS"] = "success";
  SiteLaunchStatus["FAILURE"] = "failure";
  return SiteLaunchStatus;
}({});
let AtomicTransferStatus = /*#__PURE__*/function (AtomicTransferStatus) {
  AtomicTransferStatus["UNINITIALIZED"] = "unintialized";
  AtomicTransferStatus["IN_PROGRESS"] = "in_progress";
  AtomicTransferStatus["SUCCESS"] = "success";
  AtomicTransferStatus["FAILURE"] = "failure";
  return AtomicTransferStatus;
}({});
let AtomicTransferError = /*#__PURE__*/function (AtomicTransferError) {
  AtomicTransferError["INTERNAL"] = "internal";
  return AtomicTransferError;
}({});
let LatestAtomicTransferStatus = /*#__PURE__*/function (LatestAtomicTransferStatus) {
  LatestAtomicTransferStatus["UNINITIALIZED"] = "unintialized";
  LatestAtomicTransferStatus["IN_PROGRESS"] = "in_progress";
  LatestAtomicTransferStatus["SUCCESS"] = "success";
  LatestAtomicTransferStatus["FAILURE"] = "failure";
  return LatestAtomicTransferStatus;
}({});
let AtomicSoftwareInstallStatus = /*#__PURE__*/function (AtomicSoftwareInstallStatus) {
  AtomicSoftwareInstallStatus["UNINITIALIZED"] = "unintialized";
  AtomicSoftwareInstallStatus["IN_PROGRESS"] = "in_progress";
  AtomicSoftwareInstallStatus["SUCCESS"] = "success";
  AtomicSoftwareInstallStatus["FAILURE"] = "failure";
  return AtomicSoftwareInstallStatus;
}({});

/***/ }),

/***/ 3691:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: () => (/* binding */ createCustomHomeTemplateContent)
/* harmony export */ });
const createCustomHomeTemplateContent = (stylesheet, hasHeader, hasFooter, hasSections, mainHtml = '') => {
  const content = [];
  if (hasHeader) {
    content.push(`<!-- wp:template-part {"slug":"header","tagName":"header","theme":"${stylesheet}"} /-->`);
  }
  if (hasSections) {
    // blockGap":"0" removes the theme blockGap from the main group while allowing users to change it from the editor
    content.push(`
<!-- wp:group {"tagName":"main","style":{"spacing":{"blockGap":"0"}}} -->
	<main class="wp-block-group">
		${mainHtml}
	</main>
<!-- /wp:group -->`);
  }
  if (hasFooter) {
    content.push(`<!-- wp:template-part {"slug":"footer","tagName":"footer","theme":"${stylesheet}","className":"site-footer-container"} /-->`);
  }
  if (content.length) {
    return content.join('\n');
  }

  // If no layout is selected, return the paragraph block to start with blank content to avoid the StartModal showing.
  // See https://github.com/WordPress/gutenberg/blob/343fd27a51ae549c013bc30f51f13aad235d0d4a/packages/edit-site/src/components/start-template-options/index.js#L162
  return '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->';
};

/***/ }),

/***/ 1382:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ createActions)
/* harmony export */ });
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9126);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3661);


function createActions(clientCreds) {
  const receiveCurrentUser = currentUser => ({
    type: 'RECEIVE_CURRENT_USER',
    currentUser
  });
  const receiveCurrentUserFailed = () => ({
    type: 'RECEIVE_CURRENT_USER_FAILED'
  });
  const fetchNewUser = () => ({
    type: 'FETCH_NEW_USER'
  });
  const receiveNewUser = response => ({
    type: 'RECEIVE_NEW_USER',
    response
  });
  const receiveNewUserFailed = error => ({
    type: 'RECEIVE_NEW_USER_FAILED',
    error
  });
  const clearErrors = () => ({
    type: 'CLEAR_ERRORS'
  });
  function* createAccount(params) {
    yield fetchNewUser();
    try {
      const newUser = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_1__/* .wpcomRequest */ ._9)({
        body: {
          // defaults
          is_passwordless: true,
          signup_flow_name: 'gutenboarding',
          locale: 'en',
          ...clientCreds,
          ...params,
          // Set to false because account validation should be a separate action
          validate: false
        },
        path: '/users/new',
        apiVersion: '1.1',
        method: 'post',
        query: (0,qs__WEBPACK_IMPORTED_MODULE_0__.stringify)({
          locale: params.locale
        })
      });
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_1__/* .reloadProxy */ .sS)();

      // Need to rerequest access after the proxy is reloaded
      yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_1__/* .requestAllBlogsAccess */ .Vw)();
      yield receiveNewUser(newUser);
      return {
        ok: true
      };
    } catch (error) {
      const newUserError = error;
      yield receiveNewUserFailed(newUserError);
      return {
        ok: false,
        newUserError
      };
    }
  }
  return {
    receiveCurrentUser,
    receiveCurrentUserFailed,
    fetchNewUser,
    receiveNewUser,
    receiveNewUserFailed,
    clearErrors,
    createAccount
  };
}

/***/ }),

/***/ 7037:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ STORE_KEY)
/* harmony export */ });
const STORE_KEY = 'automattic/user';

/***/ }),

/***/ 8330:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ register)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3661);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1382);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7037);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5938);
/* harmony import */ var _resolvers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5177);
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7092);








let isRegistered = false;
function register(clientCreds) {
  if (!isRegistered) {
    isRegistered = true;
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.registerStore)(_constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L, {
      actions: (0,_actions__WEBPACK_IMPORTED_MODULE_2__/* .createActions */ .d)(clientCreds),
      controls: _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_3__/* .controls */ .ai,
      reducer: _reducer__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .ZP,
      resolvers: (0,_resolvers__WEBPACK_IMPORTED_MODULE_5__/* .createResolvers */ .i)(clientCreds),
      selectors: _selectors__WEBPACK_IMPORTED_MODULE_6__
    });
  }
  return _constants__WEBPACK_IMPORTED_MODULE_1__/* .STORE_KEY */ .L;
}

/***/ }),

/***/ 5938:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports currentUser, newUserData, newUserError, isFetchingNewUser */
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const currentUser = (state, action) => {
  switch (action.type) {
    case 'RECEIVE_CURRENT_USER':
      return action.currentUser;
    case 'RECEIVE_CURRENT_USER_FAILED':
      return null;
  }
  return state;
};
const newUserData = (state, action) => {
  if (action.type === 'RECEIVE_NEW_USER') {
    const {
      response
    } = action;
    return {
      username: response.signup_sandbox_username || response.username,
      userId: response.signup_sandbox_user_id || response.user_id,
      bearerToken: response.bearer_token
    };
  } else if (action.type === 'RECEIVE_NEW_USER_FAILED') {
    return undefined;
  }
  return state;
};
const newUserError = (state, action) => {
  switch (action.type) {
    case 'FETCH_NEW_USER':
      return undefined;
    case 'RECEIVE_NEW_USER':
      return undefined;
    case 'CLEAR_ERRORS':
      return undefined;
    case 'RECEIVE_NEW_USER_FAILED':
      return {
        error: action.error.error,
        status: action.error.status,
        statusCode: action.error.statusCode,
        name: action.error.name,
        message: action.error.message
      };
  }
  return state;
};
const isFetchingNewUser = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_NEW_USER':
      return true;
    case 'RECEIVE_NEW_USER':
      return false;
    case 'RECEIVE_NEW_USER_FAILED':
      return false;
  }
  return state;
};
const newUser = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  data: newUserData,
  error: newUserError,
  isFetching: isFetchingNewUser
});
const reducer = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.combineReducers)({
  currentUser,
  newUser
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer);

/***/ }),

/***/ 5177:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ createResolvers)
/* harmony export */ });
/* harmony import */ var _wpcom_request_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3661);
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1382);


function createResolvers(clientCreds) {
  const {
    receiveCurrentUser,
    receiveCurrentUserFailed
  } = (0,_actions__WEBPACK_IMPORTED_MODULE_0__/* .createActions */ .d)(clientCreds);
  function* getCurrentUser() {
    // In environments where `wpcom-user-bootstrap` is set to true, the currentUser
    // object will be server-side rendered to window.currentUser. In these cases,
    // return that object instead of performing another API request to `/me`.
    if (window.currentUser) {
      return receiveCurrentUser(window.currentUser);
    }
    try {
      const currentUser = yield (0,_wpcom_request_controls__WEBPACK_IMPORTED_MODULE_1__/* .wpcomRequest */ ._9)({
        path: '/me',
        apiVersion: '1.1'
      });
      return receiveCurrentUser(currentUser);
    } catch (err) {
      return receiveCurrentUserFailed();
    }
  }
  return {
    getCurrentUser
  };
}

/***/ }),

/***/ 7092:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),
/* harmony export */   getNewUser: () => (/* binding */ getNewUser),
/* harmony export */   getNewUserError: () => (/* binding */ getNewUserError),
/* harmony export */   getState: () => (/* binding */ getState),
/* harmony export */   isCurrentUserLoggedIn: () => (/* binding */ isCurrentUserLoggedIn),
/* harmony export */   isFetchingNewUser: () => (/* binding */ isFetchingNewUser),
/* harmony export */   isNewUser: () => (/* binding */ isNewUser)
/* harmony export */ });
const getState = state => state;
const getCurrentUser = state => state.currentUser;
const isCurrentUserLoggedIn = state => !!state.currentUser?.ID;
const getNewUser = state => state.newUser.data;
const getNewUserError = state => state.newUser.error;
const isFetchingNewUser = state => state.newUser.isFetching;
const isNewUser = state => !!state.newUser.data;

/***/ }),

/***/ 3661:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Vw: () => (/* binding */ requestAllBlogsAccess),
/* harmony export */   _9: () => (/* binding */ wpcomRequest),
/* harmony export */   ai: () => (/* binding */ controls),
/* harmony export */   sS: () => (/* binding */ reloadProxy)
/* harmony export */ });
/* unused harmony exports fetchAndParse, wait */
/* harmony import */ var wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8552);

const wpcomRequest = request => ({
  type: 'WPCOM_REQUEST',
  request
});

/**
 * Action for performing a fetching using `window.fetch()` and parsing the response body.
 * It's different from `apiFetch()` from
 * `@wordpress/data-controls` in that it doesn't use any middleware to add extra parameters.
 *
 * @param resource the resource you wish to fetch
 * @param options request options
 */
const fetchAndParse = (resource, options) => ({
  type: 'FETCH_AND_PARSE',
  resource,
  options
});
const reloadProxy = () => ({
  type: 'RELOAD_PROXY'
});
const requestAllBlogsAccess = () => ({
  type: 'REQUEST_ALL_BLOGS_ACCESS'
});
const wait = ms => ({
  type: 'WAIT',
  ms
});
const controls = {
  WPCOM_REQUEST: ({
    request
  }) => (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)(request),
  FETCH_AND_PARSE: async ({
    resource,
    options
  }) => {
    const response = await window.fetch(resource, options);
    return {
      ok: response.ok,
      body: await response.json()
    };
  },
  RELOAD_PROXY: () => {
    (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__/* .reloadProxy */ .sS)();
  },
  REQUEST_ALL_BLOGS_ACCESS: () => (0,wpcom_proxy_request__WEBPACK_IMPORTED_MODULE_0__/* .requestAllBlogsAccess */ .Vw)(),
  WAIT: ({
    ms
  }) => new Promise(resolve => setTimeout(resolve, ms))
};

/***/ }),

/***/ 8865:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aM: () => (/* binding */ HELP_CENTER_STORE)
/* harmony export */ });
/* unused harmony exports USER_STORE, SITE_STORE */
/* harmony import */ var _automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(899);
/* harmony import */ var _automattic_data_stores__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7624);
/* harmony import */ var _automattic_data_stores__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8330);
/* harmony import */ var _automattic_data_stores__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2369);
/**
 * External Dependencies
 */


const HELP_CENTER_STORE = _automattic_data_stores__WEBPACK_IMPORTED_MODULE_1__/* .register */ .z();

// these creds are only needed when signing up users
const USER_STORE = _automattic_data_stores__WEBPACK_IMPORTED_MODULE_2__/* .register */ .z({
  client_id: (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)('wpcom_signup_id'),
  client_secret: (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)('wpcom_signup_key')
});
const SITE_STORE = _automattic_data_stores__WEBPACK_IMPORTED_MODULE_3__/* .register */ .z2({
  client_id: (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)('wpcom_signup_id'),
  client_secret: (0,_automattic_calypso_config__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .ZP)('wpcom_signup_key')
});

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
/* harmony export */   Yj: () => (/* binding */ getLocaleSlug)
/* harmony export */ });
/* unused harmony exports numberFormat, translate, configure, setLocale, getLocale, getLocaleVariant, isRtl, addTranslations, reRenderTranslations, registerComponentUpdateHook, registerTranslateHook, state, stateObserver, on, off, emit */
/* harmony import */ var _default_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4724);







/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (i18n)));

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

/***/ 849:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bU: () => (/* binding */ useLocale)
/* harmony export */ });
/* unused harmony exports localeContext, LocaleProvider, withLocale, useIsEnglishLocale, useHasEnTranslation */
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4333);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9196);
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
 *
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
 *
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
 *
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
 *
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

/***/ 4655:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GG: () => (/* binding */ localesWithBlog),
/* harmony export */   Xb: () => (/* binding */ localesToSubdomains),
/* harmony export */   _r: () => (/* binding */ jetpackComLocales),
/* harmony export */   dH: () => (/* binding */ localesWithGoBlog),
/* harmony export */   hI: () => (/* binding */ supportSiteLocales),
/* harmony export */   iT: () => (/* binding */ localesWithPrivacyPolicy),
/* harmony export */   mL: () => (/* binding */ forumLocales),
/* harmony export */   vS: () => (/* binding */ magnificentNonEnLocales),
/* harmony export */   xh: () => (/* binding */ localesForPricePlans),
/* harmony export */   xn: () => (/* binding */ localesWithCookiePolicy)
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

/***/ 7498:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aq: () => (/* binding */ localizeUrl)
/* harmony export */ });
/* unused harmony exports urlLocalizationMapping, useLocalizeUrl, withLocalizeUrl */
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4333);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var i18n_calypso__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1481);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9196);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _locale_context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(849);
/* harmony import */ var _locales__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4655);






const INVALID_URL = `http://__domain__.invalid`;
function getDefaultLocale() {
  return (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_3__/* .getLocaleSlug */ .Yj)?.() ?? 'en';
}
const setLocalizedUrlHost = (hostname, validLocales = []) => (url, locale) => {
  if (validLocales.includes(locale) && locale !== 'en') {
    // Avoid changing the hostname when the locale is set via the path.
    if (url.pathname.substr(0, locale.length + 2) !== '/' + locale + '/') {
      url.host = `${_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesToSubdomains */ .Xb[locale] || locale}.${hostname}`;
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
  'wordpress.com/support/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .supportSiteLocales */ .hI),
  'wordpress.com/forums/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .forumLocales */ .mL),
  'wordpress.com/blog/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithBlog */ .GG, /^\/blog\/?$/),
  'wordpress.com/go/': (url, localeSlug) => {
    // Rewrite non-home URLs (e.g. posts) only for Spanish, because that's
    // the only language into which we're currently translating content.
    const isHome = ['/go/', '/go'].includes(url.pathname);
    if (!isHome && 'es' !== localeSlug) {
      return url;
    }
    return prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithGoBlog */ .dH)(url, localeSlug);
  },
  'wordpress.com/tos/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS),
  'wordpress.com/wp-admin/': setLocalizedUrlHost('wordpress.com', _locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS),
  'wordpress.com/wp-login.php': setLocalizedUrlHost('wordpress.com', _locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS),
  'jetpack.com': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .jetpackComLocales */ ._r),
  'en.support.wordpress.com': setLocalizedWpComPath('/support', _locales__WEBPACK_IMPORTED_MODULE_4__/* .supportSiteLocales */ .hI),
  'en.blog.wordpress.com': setLocalizedWpComPath('/blog', _locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithBlog */ .GG, /^\/$/),
  'apps.wordpress.com': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS),
  'en.forums.wordpress.com': setLocalizedWpComPath('/forums', _locales__WEBPACK_IMPORTED_MODULE_4__/* .forumLocales */ .mL),
  'automattic.com/privacy/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithPrivacyPolicy */ .iT),
  'automattic.com/cookies/': prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesWithCookiePolicy */ .xn),
  'wordpress.com/help/contact/': (url, localeSlug, isLoggedIn) => {
    if (isLoggedIn) {
      return url;
    }
    url.pathname = url.pathname.replace(/\/help\//, '/support/');
    return prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .supportSiteLocales */ .hI)(url, localeSlug);
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
    return prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS)(url, localeSlug);
  },
  'wordpress.com/theme/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS)(url, localeSlug);
  },
  'wordpress.com/themes/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS)(url, localeSlug);
  },
  'wordpress.com/plugins/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS)(url, localeSlug);
  },
  'wordpress.com/log-in/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : suffixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS)(url, localeSlug);
  },
  'wordpress.com/start/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : suffixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS)(url, localeSlug);
  },
  'wordpress.com/plans/': (url, localeSlug, isLoggedIn) => {
    // if logged in, or url.pathname contains characters after `/plans/`, don't rewrite
    return isLoggedIn || url.pathname !== '/plans/' ? url : prefixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .localesForPricePlans */ .xh)(url, localeSlug);
  },
  'wordpress.com/setup/': (url, localeSlug, isLoggedIn) => {
    return isLoggedIn ? url : suffixLocalizedUrlPath(_locales__WEBPACK_IMPORTED_MODULE_4__/* .magnificentNonEnLocales */ .vS)(url, localeSlug);
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
  const providerLocale = (0,_locale_context__WEBPACK_IMPORTED_MODULE_5__/* .useLocale */ .bU)();
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
/* harmony export */   Vw: () => (/* binding */ requestAllBlogsAccess),
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   aO: () => (/* binding */ canAccessWpcomApis),
/* harmony export */   sS: () => (/* binding */ reloadProxy)
/* harmony export */ });
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
const wpcomAllowedOrigins = ['https://wordpress.com', 'https://cloud.jetpack.com', 'http://wpcalypso.wordpress.com',
// for running docker on dev instances
'http://widgets.wp.com', 'https://widgets.wp.com', 'https://dev-mc.a8c.com', 'https://mc.a8c.com', 'https://dserve.a8c.com', 'http://calypso.localhost:3000', 'https://calypso.localhost:3000', 'http://jetpack.cloud.localhost:3000', 'https://jetpack.cloud.localhost:3000', 'http://calypso.localhost:3001', 'https://calypso.localhost:3001', 'https://calypso.live', 'http://127.0.0.1:41050', 'http://send.linguine.localhost:3000'];

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

/***/ 4333:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ 9818:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ 3418:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["dataControls"];

/***/ }),

/***/ 9307:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ 2694:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ 5736:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ 3260:
/***/ (() => {

/* (ignored) */

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
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9226);

})();

window.EditingToolkit = __webpack_exports__;
/******/ })()
;