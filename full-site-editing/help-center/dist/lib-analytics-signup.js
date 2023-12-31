"use strict";
(self["webpackChunkwebpack"] = self["webpackChunkwebpack"] || []).push([[874,474],{

/***/ 11901:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: function() { return /* binding */ adTrackRegistration; }
/* harmony export */ });
/* harmony import */ var calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7369);
/* harmony import */ var _tracker_buckets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54995);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(36190);
/* harmony import */ var _floodlight__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(33675);
/* harmony import */ var _load_tracking_scripts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(30214);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28122);






// Ensure setup has run.

async function adTrackRegistration() {
  await (0,calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)();
  await (0,_load_tracking_scripts__WEBPACK_IMPORTED_MODULE_3__/* .loadTrackingScripts */ ._)();

  // Google Ads Gtag

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .G0)('googleAds')) {
    const params = ['event', 'conversion', {
      send_to: _constants__WEBPACK_IMPORTED_MODULE_4__/* .TRACKING_IDS */ .Hb.wpcomGoogleAdsGtagRegistration
    }];
    (0,_constants__WEBPACK_IMPORTED_MODULE_4__/* .debug */ .fF)('adTrackRegistration: [Google Ads Gtag]', params);
    window.gtag(...params);
  }

  // Facebook

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .G0)('facebook')) {
    const params = ['trackSingle', _constants__WEBPACK_IMPORTED_MODULE_4__/* .TRACKING_IDS */ .Hb.facebookInit, 'Lead'];
    (0,_constants__WEBPACK_IMPORTED_MODULE_4__/* .debug */ .fF)('adTrackRegistration: [Facebook]', params);
    window.fbq(...params);
  }

  // Bing

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .G0)('bing')) {
    const params = {
      ec: 'registration'
    };
    (0,_constants__WEBPACK_IMPORTED_MODULE_4__/* .debug */ .fF)('adTrackRegistration: [Bing]', params);
    window.uetq.push(params);
  }

  // DCM Floodlight

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .G0)('floodlight')) {
    (0,_constants__WEBPACK_IMPORTED_MODULE_4__/* .debug */ .fF)('adTrackRegistration: [Floodlight]');
    (0,_floodlight__WEBPACK_IMPORTED_MODULE_5__/* .recordParamsInFloodlightGtag */ .j)({
      send_to: 'DC-6355556/wordp0/regis0+unique'
    });
  }

  // Pinterest

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .G0)('pinterest')) {
    const params = ['track', 'lead'];
    (0,_constants__WEBPACK_IMPORTED_MODULE_4__/* .debug */ .fF)('adTrackRegistration: [Pinterest]', params);
    window.pintrk(...params);
  }

  // Twitter

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_0__/* .mayWeTrackByTracker */ .G0)('twitter')) {
    const params = ['event', 'tw-nvzbs-odfz8'];
    (0,_constants__WEBPACK_IMPORTED_MODULE_4__/* .debug */ .fF)('adTrackRegistration: [Twitter]', params);
    window.twq(...params);
  }
  (0,_constants__WEBPACK_IMPORTED_MODULE_4__/* .debug */ .fF)('adTrackRegistration: dataLayer:', JSON.stringify(window.dataLayer, null, 2));
}

/***/ }),

/***/ 76297:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ adTrackSignupComplete; }
/* harmony export */ });
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36115);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(88767);
/* harmony import */ var calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7369);
/* harmony import */ var calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(39161);
/* harmony import */ var _tracker_buckets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54995);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(36190);
/* harmony import */ var _floodlight__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(33675);
/* harmony import */ var _load_tracking_scripts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(30214);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28122);








// Ensure setup has run.


/**
 * Tracks a signup conversion
 * @param {boolean} isNewUserSite Whether the signup is new user with a new site created
 * @returns {void}
 */
async function adTrackSignupComplete(_ref) {
  let {
    isNewUserSite
  } = _ref;
  await (0,calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)();
  await (0,_load_tracking_scripts__WEBPACK_IMPORTED_MODULE_4__/* .loadTrackingScripts */ ._)();

  // Record all signups up in DCM Floodlight (deprecated Floodlight pixels)
  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('floodlight')) {
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('adTrackSignupComplete: Floodlight:');
    (0,_floodlight__WEBPACK_IMPORTED_MODULE_6__/* .recordParamsInFloodlightGtag */ .j)({
      send_to: 'DC-6355556/wordp0/signu0+unique'
    });
  }

  // Track new user conversions by generating a synthetic cart and treating it like an order.

  if (!isNewUserSite) {
    // only for new users with a new site created
    return;
  }
  const syntheticCart = {
    is_signup: true,
    currency: 'USD',
    total_cost: 0,
    products: [{
      is_signup: true,
      product_id: 'new-user-site',
      product_slug: 'new-user-site',
      product_name: 'new-user-site',
      currency: 'USD',
      volume: 1,
      cost: 0
    }]
  };

  // Prepare a few more variables.

  const currentUser = (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__/* .getCurrentUser */ .ts)();
  const syntheticOrderId = 's_' + (0,uuid__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)().replace(/-/g, ''); // 35-byte signup tracking ID.
  const usdCost = (0,calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(syntheticCart.total_cost, syntheticCart.currency);

  // Google Ads Gtag

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('googleAds')) {
    const params = ['event', 'conversion', {
      send_to: _constants__WEBPACK_IMPORTED_MODULE_5__/* .TRACKING_IDS */ .Hb.wpcomGoogleAdsGtagSignup,
      value: syntheticCart.total_cost,
      currency: syntheticCart.currency,
      transaction_id: syntheticOrderId
    }];
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Google Ads Gtag]', params);
    window.gtag(...params);
  }

  // Bing

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('bing')) {
    if (null !== usdCost) {
      const params = {
        ec: 'signup',
        gv: usdCost
      };
      (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Bing]', params);
      window.uetq.push(params);
    } else {
      (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Bing] currency not supported, dropping WPCom pixel');
    }
  }

  // Facebook

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('facebook')) {
    const params = ['trackSingle', _constants__WEBPACK_IMPORTED_MODULE_5__/* .TRACKING_IDS */ .Hb.facebookInit, 'Subscribe', {
      product_slug: syntheticCart.products.map(product => product.product_slug).join(', '),
      value: syntheticCart.total_cost,
      currency: syntheticCart.currency,
      user_id: currentUser ? currentUser.hashedPii.ID : 0,
      order_id: syntheticOrderId
    }];
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Facebook]', params);
    window.fbq(...params);
  }

  // DCM Floodlight

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('floodlight')) {
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Floodlight]');
    (0,_floodlight__WEBPACK_IMPORTED_MODULE_6__/* .recordParamsInFloodlightGtag */ .j)({
      send_to: 'DC-6355556/wordp0/signu1+unique'
    });
  }

  // Quantcast

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('quantcast')) {
    const params = {
      qacct: _constants__WEBPACK_IMPORTED_MODULE_5__/* .TRACKING_IDS */ .Hb.quantcast,
      labels: '_fp.event.WordPress Signup,_fp.pcat.' + syntheticCart.products.map(product => product.product_slug).join(' '),
      orderid: syntheticOrderId,
      revenue: usdCost,
      event: 'refresh'
    };
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Quantcast]', params);
    window._qevents.push(params);
  }

  // Icon Media

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('iconMedia')) {
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Icon Media]', _constants__WEBPACK_IMPORTED_MODULE_5__/* .ICON_MEDIA_SIGNUP_PIXEL_URL */ .yf);
    new window.Image().src = _constants__WEBPACK_IMPORTED_MODULE_5__/* .ICON_MEDIA_SIGNUP_PIXEL_URL */ .yf;
  }

  // Pinterest

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('pinterest')) {
    const params = ['track', 'signup', {
      value: syntheticCart.total_cost,
      currency: syntheticCart.currency
    }];
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Pinterest]', params);
    window.pintrk(...params);
  }

  // Twitter

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('twitter')) {
    const params = ['event', 'tw-nvzbs-ode0f'];
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: [Twitter]', params);
    window.twq(...params);
  }
  (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('recordSignup: dataLayer:', JSON.stringify(window.dataLayer, null, 2));
}

/***/ }),

/***/ 30530:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: function() { return /* binding */ adTrackSignupStart; }
/* harmony export */ });
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36115);
/* harmony import */ var calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7369);
/* harmony import */ var _tracker_buckets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54995);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(36190);
/* harmony import */ var _floodlight__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(33675);
/* harmony import */ var _load_tracking_scripts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(30214);
/* harmony import */ var _setup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28122);







// Ensure setup has run.

async function adTrackSignupStart(flow) {
  await (0,calypso_lib_analytics_utils__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)();
  await (0,_load_tracking_scripts__WEBPACK_IMPORTED_MODULE_4__/* .loadTrackingScripts */ ._)();
  const currentUser = (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__/* .getCurrentUser */ .ts)();

  // Floodlight.

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('floodlight')) {
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('adTrackSignupStart: [Floodlight]');
    (0,_floodlight__WEBPACK_IMPORTED_MODULE_6__/* .recordParamsInFloodlightGtag */ .j)({
      send_to: 'DC-6355556/wordp0/pre-p0+unique'
    });
  }
  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('floodlight') && !currentUser && 'onboarding' === flow) {
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('adTrackSignupStart: [Floodlight]');
    (0,_floodlight__WEBPACK_IMPORTED_MODULE_6__/* .recordParamsInFloodlightGtag */ .j)({
      send_to: 'DC-6355556/wordp0/landi00+unique'
    });
  }

  // Google Ads.

  if ((0,_tracker_buckets__WEBPACK_IMPORTED_MODULE_1__/* .mayWeTrackByTracker */ .G0)('googleAds') && !currentUser && 'onboarding' === flow) {
    const params = ['event', 'conversion', {
      send_to: _constants__WEBPACK_IMPORTED_MODULE_5__/* .TRACKING_IDS */ .Hb.wpcomGoogleAdsGtagSignupStart
    }];
    (0,_constants__WEBPACK_IMPORTED_MODULE_5__/* .debug */ .fF)('adTrackSignupStart: [Google Ads Gtag]', params);
    window.gtag(...params);
  }
}

/***/ }),

/***/ 11209:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   recordAliasInFloodlight: function() { return /* binding */ recordAliasInFloodlight; }
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

/***/ }),

/***/ 51953:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: function() { return /* binding */ identifyUser; }
/* harmony export */ });
/* harmony import */ var _automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36115);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11209);




/**
 * Module variables
 */
const debug = debug__WEBPACK_IMPORTED_MODULE_1___default()('calypso:analytics:identifyUser');
function identifyUser(userData) {
  (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__/* .identifyUser */ .$A)(userData);

  // neccessary because calypso-analytics/initializeAnalytics no longer calls out to ad-tracking
  const user = (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__/* .getCurrentUser */ .ts)();
  if ('object' === typeof userData && user && (0,_automattic_calypso_analytics__WEBPACK_IMPORTED_MODULE_0__/* .getTracksAnonymousUserId */ .di)()) {
    debug('recordAliasInFloodlight', user);
    (0,calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_2__.recordAliasInFloodlight)();
  }
}

/***/ }),

/***/ 48528:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SIGNUP_DOMAIN_ORIGIN: function() { return /* binding */ SIGNUP_DOMAIN_ORIGIN; },
/* harmony export */   recordRegistration: function() { return /* binding */ recordRegistration; },
/* harmony export */   recordSignupComplete: function() { return /* binding */ recordSignupComplete; },
/* harmony export */   recordSignupInvalidStep: function() { return /* binding */ recordSignupInvalidStep; },
/* harmony export */   recordSignupPlanChange: function() { return /* binding */ recordSignupPlanChange; },
/* harmony export */   recordSignupProcessingScreen: function() { return /* binding */ recordSignupProcessingScreen; },
/* harmony export */   recordSignupStart: function() { return /* binding */ recordSignupStart; },
/* harmony export */   recordSignupStep: function() { return /* binding */ recordSignupStep; }
/* harmony export */ });
/* harmony import */ var _automattic_viewport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(79321);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38049);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(30530);
/* harmony import */ var calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(76297);
/* harmony import */ var calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(11901);
/* harmony import */ var calypso_lib_analytics_ga__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(44567);
/* harmony import */ var calypso_lib_analytics_identify_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(51953);
/* harmony import */ var calypso_lib_analytics_queue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(38602);
/* harmony import */ var calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(17032);
/* harmony import */ var calypso_signup_storageUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(73102);








const signupDebug = debug__WEBPACK_IMPORTED_MODULE_0___default()('calypso:analytics:signup');
function recordSignupStart(flow, ref, optionalProps) {
  (0,calypso_signup_storageUtils__WEBPACK_IMPORTED_MODULE_5__/* .setSignupStartTime */ .Yj)();

  // Tracks
  (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_signup_start', {
    flow,
    ref,
    ...optionalProps
  });
  // Google Analytics
  (0,calypso_lib_analytics_ga__WEBPACK_IMPORTED_MODULE_1__/* .gaRecordEvent */ .Yh)('Signup', 'calypso_signup_start');
  // Marketing
  (0,calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_6__/* .adTrackSignupStart */ .j)(flow);
}

// domain sources for calypso_signup_complete tracks event
const SIGNUP_DOMAIN_ORIGIN = {
  USE_YOUR_DOMAIN: 'use-your-domain',
  CHOOSE_LATER: 'choose-later',
  FREE: 'free',
  CUSTOM: 'custom',
  NOT_SET: 'not-set'
};
function recordSignupComplete(_ref, now) {
  let {
    flow,
    siteId,
    isNewUser,
    isBlankCanvas,
    hasCartItems,
    planProductSlug,
    domainProductSlug,
    isNew7DUserSite,
    theme,
    intent,
    startingPoint,
    isTransfer,
    isMapping,
    signupDomainOrigin,
    elapsedTimeSinceStart = null
  } = _ref;
  const isNewSite = !!siteId;
  if (!now) {
    // Delay using the analytics localStorage queue.
    return (0,calypso_lib_analytics_queue__WEBPACK_IMPORTED_MODULE_3__/* .addToQueue */ .x)('signup', 'recordSignupComplete', {
      elapsedTimeSinceStart: elapsedTimeSinceStart ?? (0,calypso_signup_storageUtils__WEBPACK_IMPORTED_MODULE_5__/* .getSignupCompleteElapsedTime */ .sR)(),
      flow,
      siteId,
      isNewUser,
      isBlankCanvas,
      hasCartItems,
      planProductSlug,
      domainProductSlug,
      isNew7DUserSite,
      theme,
      intent,
      startingPoint,
      isTransfer,
      isMapping,
      signupDomainOrigin
    }, true);
  }

  // Tracks
  // Note that Tracks expects blog_id to differntiate sites, hence using
  // blog_id instead of site_id here. We keep using "siteId" otherwise since
  // all the other fields still refer with "site". e.g. isNewSite
  (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_signup_complete', {
    elapsed_time_since_start: elapsedTimeSinceStart ?? (0,calypso_signup_storageUtils__WEBPACK_IMPORTED_MODULE_5__/* .getSignupCompleteElapsedTime */ .sR)(),
    flow,
    blog_id: siteId,
    is_new_user: isNewUser,
    is_new_site: isNewSite,
    is_blank_canvas: isBlankCanvas,
    has_cart_items: hasCartItems,
    plan_product_slug: planProductSlug,
    domain_product_slug: domainProductSlug,
    theme,
    intent,
    starting_point: startingPoint,
    is_transfer: isTransfer,
    is_mapping: isMapping,
    signup_domain_origin: signupDomainOrigin
  });

  // Google Analytics
  const flags = [isNewUser && 'is_new_user', isNewSite && 'is_new_site', hasCartItems && 'has_cart_items'].filter(Boolean);

  // Google Analytics
  (0,calypso_lib_analytics_ga__WEBPACK_IMPORTED_MODULE_1__/* .gaRecordEvent */ .Yh)('Signup', 'calypso_signup_complete:' + flags.join(','));

  // Tracks, Google Analytics
  if (isNew7DUserSite) {
    const device = (0,_automattic_viewport__WEBPACK_IMPORTED_MODULE_7__/* .resolveDeviceTypeByViewPort */ .jv)();

    // Tracks
    (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_new_user_site_creation', {
      flow,
      device
    });
    // Google Analytics
    (0,calypso_lib_analytics_ga__WEBPACK_IMPORTED_MODULE_1__/* .gaRecordEvent */ .Yh)('Signup', 'calypso_new_user_site_creation');
  }

  // Marketing
  (0,calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_8__/* .adTrackSignupComplete */ .Z)({
    isNewUserSite: isNewUser && isNewSite
  });
}
function recordSignupStep(flow, step, optionalProps) {
  const device = (0,_automattic_viewport__WEBPACK_IMPORTED_MODULE_7__/* .resolveDeviceTypeByViewPort */ .jv)();
  const props = {
    flow,
    step,
    device,
    ...optionalProps
  };
  signupDebug('recordSignupStep:', props);

  // Tracks
  (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_signup_step_start', props);
}
function recordSignupInvalidStep(flow, step) {
  (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_signup_goto_invalid_step', {
    flow,
    step
  });
}

/**
 * Records registration event.
 * @param {Object} param {}
 * @param {Object} param.userData User data
 * @param {string} param.flow Registration flow
 * @param {string} param.type Registration type
 */
function recordRegistration(_ref2) {
  let {
    userData,
    flow,
    type
  } = _ref2;
  const device = (0,_automattic_viewport__WEBPACK_IMPORTED_MODULE_7__/* .resolveDeviceTypeByViewPort */ .jv)();
  signupDebug('recordRegistration:', {
    userData,
    flow,
    type
  });

  // Tracks user identification
  (0,calypso_lib_analytics_identify_user__WEBPACK_IMPORTED_MODULE_2__/* .identifyUser */ .$)(userData);
  // Tracks
  (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_user_registration_complete', {
    flow,
    type,
    device
  });
  // Google Analytics
  (0,calypso_lib_analytics_ga__WEBPACK_IMPORTED_MODULE_1__/* .gaRecordEvent */ .Yh)('Signup', 'calypso_user_registration_complete');
  // Marketing
  (0,calypso_lib_analytics_ad_tracking__WEBPACK_IMPORTED_MODULE_9__/* .adTrackRegistration */ .f)();
}

/**
 * Records loading of the processing screen
 * @param {string} flow Signup flow name
 * @param {string} previousStep The step before the processing screen
 * @param {string} optionalProps Extra properties to record
 */
function recordSignupProcessingScreen(flow, previousStep, optionalProps) {
  const device = (0,_automattic_viewport__WEBPACK_IMPORTED_MODULE_7__/* .resolveDeviceTypeByViewPort */ .jv)();
  (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_signup_processing_screen_show', {
    flow,
    previous_step: previousStep,
    device,
    ...optionalProps
  });
}

/**
 * Records plan change in signup flow
 * @param {string} flow Signup flow name
 * @param {string} step The step when the user changes the plan
 * @param {string} previousPlanName The plan name before changing
 * @param {string} previousPlanSlug The plan slug before changing
 * @param {string} currentPlanName The plan name after changing
 * @param {string} currentPlanSlug The plan slug after changing
 */
const recordSignupPlanChange = (flow, step, previousPlanName, previousPlanSlug, currentPlanName, currentPlanSlug) => {
  const device = (0,_automattic_viewport__WEBPACK_IMPORTED_MODULE_7__/* .resolveDeviceTypeByViewPort */ .jv)();
  (0,calypso_lib_analytics_tracks__WEBPACK_IMPORTED_MODULE_4__.recordTracksEvent)('calypso_signup_plan_change', {
    flow,
    step,
    device,
    previous_plan_name: previousPlanName,
    previous_plan_slug: previousPlanSlug,
    current_plan_name: currentPlanName,
    current_plan_slug: currentPlanSlug
  });
};

/***/ }),

/***/ 39161:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ costToUSD; }
/* harmony export */ });
// For converting other currencies into USD for tracking purposes.
// Short-term fix, taken from <https://openexchangerates.org/> (last updated 2019-04-10).
const EXCHANGE_RATES = {
  AED: 3.673181,
  AFN: 77.277444,
  ALL: 110.685,
  AMD: 485.718536,
  ANG: 1.857145,
  AOA: 318.1145,
  ARS: 42.996883,
  AUD: 1.39546,
  AWG: 1.801247,
  AZN: 1.7025,
  BAM: 1.73465,
  BBD: 2,
  BDT: 84.350813,
  BGN: 1.7345,
  BHD: 0.377065,
  BIF: 1829.456861,
  BMD: 1,
  BND: 1.350704,
  BOB: 6.910218,
  BRL: 3.825491,
  BSD: 1,
  BTC: 0.000188070491,
  BTN: 69.241,
  BWP: 10.571,
  BYN: 2.12125,
  BZD: 2.01582,
  CAD: 1.331913,
  CDF: 1640.538151,
  CHF: 1.002295,
  CLF: 0.024214,
  CLP: 662.405194,
  CNH: 6.718409,
  CNY: 6.7164,
  COP: 3102.756403,
  CRC: 603.878956,
  CUC: 1,
  CUP: 25.75,
  CVE: 98.34575,
  CZK: 22.699242,
  DJF: 178,
  DKK: 6.620894,
  DOP: 50.601863,
  DZD: 119.094464,
  EGP: 17.321,
  ERN: 14.996695,
  ETB: 28.87,
  EUR: 0.886846,
  FJD: 2.135399,
  FKP: 0.763495,
  GBP: 0.763495,
  GEL: 2.695,
  GGP: 0.763495,
  GHS: 5.18885,
  GIP: 0.763495,
  GMD: 49.5025,
  GNF: 9126.453332,
  GTQ: 7.6503,
  GYD: 207.888008,
  HKD: 7.83635,
  HNL: 24.53,
  HRK: 6.587,
  HTG: 84.642,
  HUF: 285.120971,
  IDR: 14140.665178,
  ILS: 3.57935,
  IMP: 0.763495,
  INR: 69.1502,
  IQD: 1190,
  IRR: 42105,
  ISK: 119.899897,
  JEP: 0.763495,
  JMD: 129.28,
  JOD: 0.709001,
  JPY: 110.9875,
  KES: 101.11,
  KGS: 68.708365,
  KHR: 4021.592884,
  KMF: 437.375,
  KPW: 900,
  KRW: 1137.899434,
  KWD: 0.304268,
  KYD: 0.833459,
  KZT: 378.893401,
  LAK: 8630.377846,
  LBP: 1509.5,
  LKR: 174.733735,
  LRD: 164.499779,
  LSL: 14.1,
  LYD: 1.391411,
  MAD: 9.622,
  MDL: 17.513226,
  MGA: 3642.597503,
  MKD: 54.731723,
  MMK: 1510.092364,
  MNT: 2511.632328,
  MOP: 8.07298,
  MRO: 357,
  MRU: 36.55,
  MUR: 34.9505,
  MVR: 15.424994,
  MWK: 728.565,
  MXN: 18.8201,
  MYR: 4.1106,
  MZN: 64.576343,
  NAD: 14.11,
  NGN: 360.105269,
  NIO: 33.04,
  NOK: 8.49614,
  NPR: 110.785702,
  NZD: 1.47776,
  OMR: 0.38502,
  PAB: 1,
  PEN: 3.294475,
  PGK: 3.374968,
  PHP: 51.872601,
  PKR: 141.62807,
  PLN: 3.79605,
  PYG: 6186.225628,
  QAR: 3.641793,
  RON: 4.217807,
  RSD: 104.64086,
  RUB: 64.2743,
  RWF: 904.135,
  SAR: 3.75,
  SBD: 8.21464,
  SCR: 13.675964,
  SDG: 47.613574,
  SEK: 9.261891,
  SGD: 1.351801,
  SHP: 0.763495,
  SLL: 8390,
  SOS: 578.545,
  SRD: 7.458,
  SSP: 130.2634,
  STD: 21050.59961,
  STN: 21.8,
  SVC: 8.751385,
  SYP: 514.993308,
  SZL: 13.972654,
  THB: 31.75,
  TJS: 9.434819,
  TMT: 3.509961,
  TND: 3.0117,
  TOP: 2.267415,
  TRY: 5.683728,
  TTD: 6.768744,
  TWD: 30.840434,
  TZS: 2315.252864,
  UAH: 26.819481,
  UGX: 3758.198709,
  USD: 1,
  UYU: 33.969037,
  UZS: 8427.57062,
  VEF: 248487.642241,
  VES: 3305.47961,
  VND: 23197.866398,
  VUV: 111.269352,
  WST: 2.607815,
  XAF: 581.732894,
  XAG: 0.06563851,
  XAU: 0.00076444,
  XCD: 2.70255,
  XDR: 0.717354,
  XOF: 581.732894,
  XPD: 0.00071959,
  XPF: 105.828888,
  XPT: 0.00110645,
  YER: 250.35,
  ZAR: 13.909458,
  ZMW: 12.110083,
  ZWL: 322.355011
};

/**
 * Returns whether a currency is supported
 * @param {string} currency - `USD`, `JPY`, etc
 * @returns {boolean} Whether there's an exchange rate for the currency
 */
function isSupportedCurrency(currency) {
  return Object.keys(EXCHANGE_RATES).indexOf(currency) !== -1;
}

/**
 * Converts a cost into USD
 *
 * Don't rely on this for precise conversions, it's meant to be an estimate for ad tracking purposes
 * @param {number} cost - The cost of the cart or product
 * @param {string} currency - The currency such as `USD`, `JPY`, etc
 * @returns {number|null} Or null if the currency is not supported
 */
function costToUSD(cost, currency) {
  if (!isSupportedCurrency(currency)) {
    return null;
  }
  return (cost / EXCHANGE_RATES[currency]).toFixed(3);
}

/***/ }),

/***/ 73102:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Yj: function() { return /* binding */ setSignupStartTime; },
/* harmony export */   sR: function() { return /* binding */ getSignupCompleteElapsedTime; }
/* harmony export */ });
/* unused harmony exports persistSignupDestination, retrieveSignupDestination, clearSignupDestinationCookie, getSignupCompleteSlug, setSignupCompleteSlug, wasSignupCheckoutPageUnloaded, setSignupCheckoutPageUnloaded, getSignupCompleteFlowName, setSignupCompleteFlowName, clearSignupCompleteFlowName, getSignupCompleteFlowNameAndClear, getSignupCompleteStepName, setSignupCompleteStepName, clearSignupCompleteStepName, getSignupCompleteStepNameAndClear, getSignupStartTime, clearSignupStartTime */
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13421);

const persistSignupDestination = url => {
  const DAY_IN_SECONDS = 3600 * 24;
  const expirationDate = new Date(new Date().getTime() + DAY_IN_SECONDS * 1000);
  const options = {
    path: '/',
    expires: expirationDate,
    sameSite: 'strict'
  };
  document.cookie = cookie.serialize('wpcom_signup_complete_destination', url, options);
};
const retrieveSignupDestination = () => {
  const cookies = cookie.parse(document.cookie);
  return cookies.wpcom_signup_complete_destination;
};
const clearSignupDestinationCookie = () => {
  // Set expiration to a random time in the past so that the cookie gets removed.
  const expirationDate = new Date(new Date().getTime() - 1000);
  const options = {
    path: '/',
    expires: expirationDate
  };
  document.cookie = cookie.serialize('wpcom_signup_complete_destination', '', options);
};

/**
 * Ignore fatals when trying to access window.sessionStorage so that we do not
 * see them logged in Sentry. Please don't use this for anything else.
 */
function ignoreFatalsForSessionStorage(callback) {
  try {
    return callback();
  } catch {
    // Do nothing.
    return undefined;
  }
}
const getSignupCompleteSlug = () => ignoreFatalsForSessionStorage(() => sessionStorage?.getItem('wpcom_signup_complete_site_slug'));
const setSignupCompleteSlug = value => ignoreFatalsForSessionStorage(() => sessionStorage?.setItem('wpcom_signup_complete_site_slug', value));
const wasSignupCheckoutPageUnloaded = () => ignoreFatalsForSessionStorage(() => sessionStorage?.getItem('was_signup_checkout_page_unloaded'));
const setSignupCheckoutPageUnloaded = value => ignoreFatalsForSessionStorage(() => sessionStorage?.setItem('was_signup_checkout_page_unloaded', value));
const getSignupCompleteFlowName = () => ignoreFatalsForSessionStorage(() => sessionStorage?.getItem('wpcom_signup_complete_flow_name'));
const setSignupCompleteFlowName = value => ignoreFatalsForSessionStorage(() => sessionStorage?.setItem('wpcom_signup_complete_flow_name', value));
const clearSignupCompleteFlowName = () => ignoreFatalsForSessionStorage(() => sessionStorage?.removeItem('wpcom_signup_complete_flow_name'));
const getSignupCompleteFlowNameAndClear = () => {
  const value = getSignupCompleteFlowName();
  clearSignupCompleteFlowName();
  return value;
};
const getSignupCompleteStepName = () => ignoreFatalsForSessionStorage(() => sessionStorage?.getItem('wpcom_signup_complete_step_name'));
const setSignupCompleteStepName = value => ignoreFatalsForSessionStorage(() => sessionStorage?.setItem('wpcom_signup_complete_step_name', value));
const clearSignupCompleteStepName = () => ignoreFatalsForSessionStorage(() => sessionStorage?.removeItem('wpcom_signup_complete_step_name'));
const getSignupCompleteStepNameAndClear = () => {
  const value = getSignupCompleteStepName();
  clearSignupCompleteStepName();
  return value;
};
const setSignupStartTime = () => ignoreFatalsForSessionStorage(() => sessionStorage?.setItem('wpcom_signup_start_time', performance.now()));
const getSignupStartTime = () => ignoreFatalsForSessionStorage(() => sessionStorage?.getItem('wpcom_signup_start_time'));
const clearSignupStartTime = () => ignoreFatalsForSessionStorage(() => sessionStorage?.removeItem('wpcom_signup_start_time'));
const getSignupCompleteElapsedTime = () => {
  const startTime = getSignupStartTime();
  if (startTime == null) {
    return null;
  }
  clearSignupStartTime();
  return Math.floor(performance.now() - startTime);
};

/***/ })

}]);