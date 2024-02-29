"use strict";
(globalThis["webpackChunkwebpack"] = globalThis["webpackChunkwebpack"] || []).push([[189],{

/***/ 48094:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   recordAliasInFloodlight: () => (/* binding */ recordAliasInFloodlight)
/* harmony export */ });
/* harmony import */ var _tracker_buckets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73943);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10228);
/* harmony import */ var _floodlight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9305);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84488);




// Ensure setup has run.


/**
 * Records the anonymous user id and wpcom user id in DCM Floodlight
 * @returns {void}
 */
function recordAliasInFloodlight() {
  if (!(0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .ct)('floodlight')) {
    return;
  }
  (0,_constants__WEBPACK_IMPORTED_MODULE_2__/* .debug */ .Yz)('recordAliasInFloodlight: Aliasing anonymous user id with WordPress.com user id');
  (0,_constants__WEBPACK_IMPORTED_MODULE_2__/* .debug */ .Yz)('recordAliasInFloodlight:');
  (0,_floodlight__WEBPACK_IMPORTED_MODULE_3__/* .recordParamsInFloodlightGtag */ .M)({
    send_to: 'DC-6355556/wordp0/alias0+standard'
  });
}

/***/ })

}]);