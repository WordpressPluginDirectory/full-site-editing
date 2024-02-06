/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 792:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(280);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (positionLeft);
//# sourceMappingURL=position-left.js.map

/***/ }),

/***/ 904:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(280);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (positionRight);
//# sourceMappingURL=position-right.js.map

/***/ }),

/***/ 484:
/***/ ((module, exports) => {

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

/***/ 0:
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 824:
/***/ (() => {

"use strict";
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 544:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ BlockAppender)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(496);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(396);
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

/***/ 316:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   s: () => (/* binding */ TimelineIcon)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(496);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(287);
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

/***/ 980:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _timeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(360);
/* harmony import */ var _timeline_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(136);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(824);




(0,_timeline__WEBPACK_IMPORTED_MODULE_0__/* .registerTimelineBlock */ .K)();
(0,_timeline_item__WEBPACK_IMPORTED_MODULE_1__/* .registerTimelineItemBlock */ .a)();

/***/ }),

/***/ 136:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ registerTimelineItemBlock)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(496);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(528);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(172);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(287);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(752);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(396);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(792);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(904);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(484);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(316);






const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__;



const DEFAULT_BACKGROUND = '#eeeeee';
function Controls({
  alignment,
  clientId,
  toggleAlignment
}) {
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
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .c,
    title: __('Left', 'full-site-editing')
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarButton, {
    onClick: () => toggleAlignment('right'),
    isActive: alignment === 'right',
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .c,
    title: __('Right', 'full-site-editing')
  })));
}
function registerTimelineItemBlock() {
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)('jetpack/timeline-item', {
    title: __('Timeline Entry', 'full-site-editing'),
    description: __('An entry on the timeline', 'full-site-editing'),
    icon: _icon__WEBPACK_IMPORTED_MODULE_7__/* .TimelineIcon */ .s,
    category: 'widgets',
    parent: ['jetpack/timeline'],
    edit: function Edit({
      attributes,
      clientId,
      setAttributes
    }) {
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
    save: ({
      attributes
    }) => {
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

/***/ 360:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ registerTimelineBlock)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(307);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(496);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(528);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(172);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(287);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(752);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(396);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(484);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _block_appender__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(544);
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(316);


/* eslint-disable wpcalypso/jsx-classname-namespace */
// disabled CSS class rule due to existing code already
// that users the non-conformant classnames






const __ = _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__;



function registerTimelineBlock() {
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)('jetpack/timeline', {
    title: __('Timeline', 'full-site-editing'),
    description: __('Create a timeline of events.', 'full-site-editing'),
    icon: _icon__WEBPACK_IMPORTED_MODULE_8__/* .TimelineIcon */ .s,
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
        renderAppender: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_block_appender__WEBPACK_IMPORTED_MODULE_7__/* .BlockAppender */ .k, {
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
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .c)({
        className: classes
      }, dataAttr), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, null));
    }
  });
}

/***/ }),

/***/ 280:
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ 528:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ 172:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ 287:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ 752:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ 496:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ 396:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ 8:
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["primitives"];

/***/ }),

/***/ 307:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ _extends)
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
/* harmony import */ var _blocks_src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(980);

})();

window.EditingToolkit = __webpack_exports__;
/******/ })()
;