"use strict";
(globalThis["webpackChunkwebpack"] = globalThis["webpackChunkwebpack"] || []).push([[474],{

/***/ 11209:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   recordAliasInFloodlight: () => (/* binding */ recordAliasInFloodlight)
/* harmony export */ });
/* harmony import */ var _tracker_buckets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54995);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(36190);
/* harmony import */ var _floodlight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(33675);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28122);




// Ensure setup has run.


/**
 * Records the anonymous user id and wpcom user id in DCM Floodlight
 * @returns {void}
 */
function recordAliasInFloodlight() {
  if (!(0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .G0)('floodlight')) {
    return;
  }
  (0,_constants__WEBPACK_IMPORTED_MODULE_2__/* .debug */ .fF)('recordAliasInFloodlight: Aliasing anonymous user id with WordPress.com user id');
  (0,_constants__WEBPACK_IMPORTED_MODULE_2__/* .debug */ .fF)('recordAliasInFloodlight:');
  (0,_floodlight__WEBPACK_IMPORTED_MODULE_3__/* .recordParamsInFloodlightGtag */ .j)({
    send_to: 'DC-6355556/wordp0/alias0+standard'
  });
}

/***/ })

}]);