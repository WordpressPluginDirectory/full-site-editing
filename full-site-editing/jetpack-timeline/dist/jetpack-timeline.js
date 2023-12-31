/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 445:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(196);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(444);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const positionLeft = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M5 5.5h8V4H5v1.5ZM5 20h8v-1.5H5V20ZM19 9H5v6h14V9Z"
}));
/* harmony default export */ __webpack_exports__.Z = (positionLeft);
//# sourceMappingURL=position-left.js.map

/***/ }),

/***/ 996:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(196);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(444);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const positionRight = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M19 5.5h-8V4h8v1.5ZM19 20h-8v-1.5h8V20ZM5 9h14v6H5V9Z"
}));
/* harmony default export */ __webpack_exports__.Z = (positionRight);
//# sourceMappingURL=position-right.js.map

/***/ }),

/***/ 779:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ 103:
/***/ (function() {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 630:
/***/ (function() {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 615:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: function() { return /* binding */ BlockAppender; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);

/* eslint-disable wpcalypso/jsx-classname-namespace */
// disabled CSS class rule due to existing code already
// that users the non-conformant classnames


const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__;
const BlockAppender = props => {
  const {
    onClick
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "block-editor-inserter__toggle timeline-item-appender components-button",
    type: "button",
    style: {
      zIndex: 99999
    },
    onClick: onClick
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "24",
    height: "24",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    role: "img",
    "aria-hidden": "true",
    focusable: "false"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z"
  })), ' ', __('Add entry', 'full-site-editing'));
};

/***/ }),

/***/ 764:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E: function() { return /* binding */ TimelineIcon; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(609);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);


const TimelineIcon = () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M15 13v1.2h-2.2V6h-1.6v2.2H9V7H4v4h5V9.8h2.2V18h1.6v-2.2H15V17h5v-4z"
}));

/***/ }),

/***/ 63:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _timeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);
/* harmony import */ var _timeline_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(424);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(103);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(630);




(0,_timeline__WEBPACK_IMPORTED_MODULE_0__/* .registerTimelineBlock */ .q)();
(0,_timeline_item__WEBPACK_IMPORTED_MODULE_1__/* .registerTimelineItemBlock */ .j)();

/***/ }),

/***/ 424:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: function() { return /* binding */ registerTimelineItemBlock; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(175);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(981);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(609);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(445);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(996);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(779);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(764);






const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__;



const DEFAULT_BACKGROUND = '#eeeeee';
function Controls(_ref) {
  let {
    alignment,
    clientId,
    toggleAlignment
  } = _ref;
  const parentIsAlternating = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    const parentIds = select('core/block-editor').getBlockParents(clientId);
    const parent = select('core/block-editor').getBlock(parentIds[0]);
    return parent?.attributes?.isAlternating;
  });
  if (parentIsAlternating === false) {
    return null;
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarButton, {
    onClick: () => toggleAlignment('left'),
    isActive: alignment === 'left',
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z,
    title: __('Left', 'full-site-editing')
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarButton, {
    onClick: () => toggleAlignment('right'),
    isActive: alignment === 'right',
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z,
    title: __('Right', 'full-site-editing')
  })));
}
function registerTimelineItemBlock() {
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)('jetpack/timeline-item', {
    title: __('Timeline Entry', 'full-site-editing'),
    description: __('An entry on the timeline', 'full-site-editing'),
    icon: _icon__WEBPACK_IMPORTED_MODULE_7__/* .TimelineIcon */ .E,
    category: 'widgets',
    parent: ['jetpack/timeline'],
    edit: function Edit(_ref2) {
      let {
        attributes,
        clientId,
        setAttributes
      } = _ref2;
      const style = {
        backgroundColor: attributes.background
      };
      const bubbleStyle = {
        borderColor: attributes.background
      };
      const toggleAlignment = alignment => {
        const newAlignment = alignment === attributes.alignment ? 'auto' : alignment;
        setAttributes({
          alignment: newAlignment
        });
      };
      const classes = classnames__WEBPACK_IMPORTED_MODULE_6___default()('wp-block-jetpack-timeline-item', {
        'is-left': attributes.alignment === 'left',
        'is-right': attributes.alignment === 'right'
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Controls, {
        alignment: attributes.alignment,
        clientId: clientId,
        toggleAlignment: toggleAlignment
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        style: style,
        className: classes
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.PanelColorSettings, {
        title: __('Color Settings', 'full-site-editing'),
        enableAlpha: true,
        colorSettings: [{
          value: attributes.background,
          onChange: background => setAttributes({
            background: background || DEFAULT_BACKGROUND
          }),
          label: __('Background Color', 'full-site-editing')
        }]
      })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "timeline-item"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "timeline-item__bubble",
        style: bubbleStyle
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "timeline-item__dot",
        style: style
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
        template: [['core/paragraph']]
      }))));
    },
    save: _ref3 => {
      let {
        attributes
      } = _ref3;
      const classes = classnames__WEBPACK_IMPORTED_MODULE_6___default()({
        'is-left': attributes.alignment === 'left',
        'is-right': attributes.alignment === 'right'
      });
      const style = {
        backgroundColor: attributes.background
      };
      const bubbleStyle = {
        borderColor: attributes.background
      };
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        style: style,
        className: classes
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "timeline-item"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "timeline-item__bubble",
        style: bubbleStyle
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "timeline-item__dot",
        style: style
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null)));
    },
    attributes: {
      alignment: {
        type: 'string',
        default: 'auto'
      },
      background: {
        type: 'string',
        default: DEFAULT_BACKGROUND
      }
    }
  });
}

/***/ }),

/***/ 173:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   q: function() { return /* binding */ registerTimelineBlock; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(896);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(175);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(981);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(609);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(818);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(736);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(779);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _block_appender__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(615);
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(764);


/* eslint-disable wpcalypso/jsx-classname-namespace */
// disabled CSS class rule due to existing code already
// that users the non-conformant classnames






const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__;



function registerTimelineBlock() {
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)('jetpack/timeline', {
    title: __('Timeline', 'full-site-editing'),
    description: __('Create a timeline of events.', 'full-site-editing'),
    icon: _icon__WEBPACK_IMPORTED_MODULE_8__/* .TimelineIcon */ .E,
    category: 'widgets',
    example: {
      innerBlocks: [{
        name: 'jetpack/timeline-item',
        innerBlocks: [{
          name: 'core/heading',
          attributes: {
            content: __('Spring', 'full-site-editing')
          }
        }]
      }, {
        name: 'jetpack/timeline-item',
        innerBlocks: [{
          name: 'core/heading',
          attributes: {
            content: __('Summer', 'full-site-editing')
          }
        }]
      }, {
        name: 'jetpack/timeline-item',
        innerBlocks: [{
          name: 'core/heading',
          attributes: {
            content: __('Fall', 'full-site-editing')
          }
        }]
      }, {
        name: 'jetpack/timeline-item',
        innerBlocks: [{
          name: 'core/heading',
          attributes: {
            content: __('Winter', 'full-site-editing')
          }
        }]
      }]
    },
    attributes: {
      isAlternating: {
        type: 'attribute',
        selector: 'ul',
        attribute: 'data-is-alternating'
      }
    },
    edit: props => {
      const {
        clientId,
        attributes,
        setAttributes
      } = props;
      const {
        isAlternating
      } = attributes;
      const addItem = () => {
        const block = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.createBlock)('jetpack/timeline-item');
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.dispatch)('core/block-editor').insertBlock(block, undefined, clientId);
      };
      const toggleAlternate = () => setAttributes({
        isAlternating: !isAlternating
      });
      const classes = classnames__WEBPACK_IMPORTED_MODULE_6___default()('wp-block-jetpack-timeline', {
        'is-alternating': isAlternating
      });
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
        title: __('Timeline settings', 'full-site-editing')
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
        label: __('Alternate items', 'full-site-editing'),
        onChange: toggleAlternate,
        checked: isAlternating
      }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
        className: classes
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
        allowedBlocks: ['jetpack/timeline-item'],
        template: [['jetpack/timeline-item']],
        renderAppender: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_block_appender__WEBPACK_IMPORTED_MODULE_7__/* .BlockAppender */ ._, {
          onClick: addItem
        })
      })));
    },
    save: props => {
      const {
        attributes
      } = props;
      const {
        isAlternating
      } = attributes;
      const classes = classnames__WEBPACK_IMPORTED_MODULE_6___default()('wp-block-jetpack-timeline', {
        'is-alternating': isAlternating
      });
      const dataAttr = typeof isAlternating === 'boolean' ? {
        'data-is-alternating': isAlternating
      } : null;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)({
        className: classes
      }, dataAttr), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null));
    }
  });
}

/***/ }),

/***/ 196:
/***/ (function(module) {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ 175:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ 981:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ 609:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ 818:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ 307:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ 736:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ 444:
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["primitives"];

/***/ }),

/***/ 896:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63);

}();
window.EditingToolkit = __webpack_exports__;
/******/ })()
;