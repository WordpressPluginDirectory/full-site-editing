"use strict";
(self["webpackChunkwebpack"] = self["webpackChunkwebpack"] || []).push([[456],{

/***/ 45076:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rH: function() { return /* binding */ INSTALL_PLUGIN; }
/* harmony export */ });
/* unused harmony exports REMOVE_PLUGIN, UPDATE_PLUGIN, ACTIVATE_PLUGIN, DEACTIVATE_PLUGIN, ENABLE_AUTOUPDATE_PLUGIN, DISABLE_AUTOUPDATE_PLUGIN, PLUGIN_UPLOAD, RECEIVE_PLUGINS */
// Notices use different action constants
const INSTALL_PLUGIN = 'INSTALL_PLUGIN';
const REMOVE_PLUGIN = 'REMOVE_PLUGIN';
const UPDATE_PLUGIN = 'UPDATE_PLUGIN';
const ACTIVATE_PLUGIN = 'ACTIVATE_PLUGIN';
const DEACTIVATE_PLUGIN = 'DEACTIVATE_PLUGIN';
const ENABLE_AUTOUPDATE_PLUGIN = 'ENABLE_AUTOUPDATE_PLUGIN';
const DISABLE_AUTOUPDATE_PLUGIN = 'DISABLE_AUTOUPDATE_PLUGIN';
const PLUGIN_UPLOAD = 'PLUGIN_UPLOAD';
const RECEIVE_PLUGINS = 'RECEIVE_PLUGINS';

/***/ }),

/***/ 84469:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w: function() { return /* binding */ withAnalytics; }
/* harmony export */ });
const mergedMetaData = (a, b) => [...(a.meta?.analytics ?? []), ...(b.meta?.analytics ?? [])];
const joinAnalytics = (analytics, action) => typeof action === 'function' ? dispatch => {
  dispatch(analytics);
  dispatch(action);
} : {
  ...action,
  ...{
    meta: {
      ...action.meta,
      analytics: mergedMetaData(analytics, action)
    }
  }
};
function withAnalytics(analytics, action) {
  if (typeof action === 'undefined') {
    return a => joinAnalytics(analytics, a);
  }
  return joinAnalytics(analytics, action);
}

/***/ }),

/***/ 71051:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LH: function() { return /* binding */ fetchAutomatedTransferStatus; },
/* harmony export */   WJ: function() { return /* binding */ setAutomatedTransferStatus; },
/* harmony export */   rv: function() { return /* binding */ updateEligibility; },
/* harmony export */   yX: function() { return /* binding */ automatedTransferStatusFetchingFailure; }
/* harmony export */ });
/* unused harmony exports initiateAutomatedTransferWithPluginZip, requestEligibility */
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_data_layer_wpcom_sites_automated_transfer_eligibility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(94171);
/* harmony import */ var calypso_state_data_layer_wpcom_sites_automated_transfer_initiate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49175);
/* harmony import */ var calypso_state_data_layer_wpcom_sites_automated_transfer_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14276);
/* harmony import */ var calypso_state_automated_transfer_init__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57299);






/**
 * Initiate a transfer to an Atomic site.
 *
 * This action is only for initiating with a plugin zip. For initiating with
 * plugin ID or theme zip, see state/themes/actions#initiateThemeTransfer
 * @param {number} siteId The id of the site to transfer
 * @param {window.File} pluginZip The plugin to upload and install on transferred site
 * @returns {Object} An action object
 */
const initiateAutomatedTransferWithPluginZip = (siteId, pluginZip) => ({
  type: AUTOMATED_TRANSFER_INITIATE_WITH_PLUGIN_ZIP,
  siteId,
  pluginZip
});

/**
 * Query the automated transfer status of a given site.
 * @param {number} siteId The id of the site to query.
 * @returns {Object} An action object
 */
const fetchAutomatedTransferStatus = siteId => ({
  type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_4__/* .AUTOMATED_TRANSFER_STATUS_REQUEST */ .k2T,
  siteId
});

/**
 * Sets the status of an automated transfer for a particular site.
 *
 * If the transfer has been initiated by uploading a plugin, the
 * ID of that plugin is returned in the API response alongside the
 * current status.
 * @see state/automated-transfer/constants#transferStates
 * @param {number} siteId The site id to which the status belongs
 * @param {string} status The new status of the automated transfer
 * @param {string} uploadedPluginId Id of any uploaded plugin
 * @returns {Object} An action object
 */
const setAutomatedTransferStatus = (siteId, status, uploadedPluginId) => ({
  type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_4__/* .AUTOMATED_TRANSFER_STATUS_SET */ .c13,
  siteId,
  status,
  uploadedPluginId
});

/**
 * Report a failure of fetching Automated Transfer status (for example, the status
 * endpoint returns 404).
 * @param {Object} param failure details
 * @param {number} param.siteId The site id to which the status belongs
 * @param {string} param.error The error string received
 * @returns {Object} An action object
 */
const automatedTransferStatusFetchingFailure = _ref => {
  let {
    siteId,
    error
  } = _ref;
  return {
    type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_4__/* .AUTOMATED_TRANSFER_STATUS_REQUEST_FAILURE */ .Sdq,
    siteId,
    error
  };
};

/**
 * Indicates that we need the eligibility information for a given site
 * @param {number} siteId site for requested information
 * @returns {Object} Redux action
 */
const requestEligibility = siteId => ({
  type: AUTOMATED_TRANSFER_ELIGIBILITY_REQUEST,
  siteId
});

/**
 * Merges given eligibility information into the app state
 * @see state/automated-transfer/eligibility/reducer
 * @param {number} siteId Site to which the information belongs
 * @param {Object} param eligibility information to be merged into existing state
 * @param {Object} param.eligibilityHolds The holds for eligibility
 * @param {Object} param.eligibilityWarnings Warnings against eligibility
 * @param {Object} param.lastUpdate last time the state was fetched
 * @param {Object} param.status transfer status
 * @returns {Object} Redux action
 */
const updateEligibility = (siteId, _ref2) => {
  let {
    eligibilityHolds,
    eligibilityWarnings,
    lastUpdate,
    status
  } = _ref2;
  return {
    type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_4__/* .AUTOMATED_TRANSFER_ELIGIBILITY_UPDATE */ .zGH,
    eligibilityHolds,
    eligibilityWarnings,
    lastUpdate,
    siteId,
    status
  };
};

/***/ }),

/***/ 27010:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pF: function() { return /* binding */ transferStates; },
/* harmony export */   tv: function() { return /* binding */ eligibilityHolds; }
/* harmony export */ });
/* unused harmony exports transferInProgress, transferRevertingInProgress */
const transferStates = {
  /**
   * This is when the request to fetch the transfer returns the error 'An invalid transfer ID was passed.'
   */
  NONE: 'none',
  PENDING: 'pending',
  INQUIRING: 'inquiring',
  PROVISIONED: 'provisioned',
  FAILURE: 'failure',
  START: 'start',
  SETUP: 'setup',
  CONFLICTS: 'conflicts',
  ACTIVE: 'active',
  UPLOADING: 'uploading',
  BACKFILLING: 'backfilling',
  RELOCATING: 'relocating_switcheroo',
  COMPLETE: 'complete',
  /**
   * Similar to 'none' there is no existing transfer, but this is when the site has been already reverted from atomic
   */
  REVERTED: 'reverted',
  RELOCATING_REVERT: 'relocating_revert',
  ERROR: 'error',
  /**
   * This is when the request to fetch the transfer status failed with an unknown error
   */
  REQUEST_FAILURE: 'request_failure'
};
const transferInProgress = [transferStates.PENDING, transferStates.ACTIVE, transferStates.PROVISIONED];
const transferRevertingInProgress = [transferStates.RELOCATING_REVERT];
const eligibilityHolds = {
  BLOCKED_ATOMIC_TRANSFER: 'BLOCKED_ATOMIC_TRANSFER',
  TRANSFER_ALREADY_EXISTS: 'TRANSFER_ALREADY_EXISTS',
  NO_BUSINESS_PLAN: 'NO_BUSINESS_PLAN',
  NO_JETPACK_SITES: 'NO_JETPACK_SITES',
  NO_VIP_SITES: 'NO_VIP_SITES',
  SITE_PRIVATE: 'SITE_PRIVATE',
  // SITE_UNLAUNCHED is a client constant to differentiate between launched private sites, and unlaunched sites.
  // See: client/state/data-layer/wpcom/sites/automated-transfer/eligibility/index.js
  SITE_UNLAUNCHED: 'SITE_UNLAUNCHED',
  SITE_GRAYLISTED: 'SITE_GRAYLISTED',
  NON_ADMIN_USER: 'NON_ADMIN_USER',
  NOT_RESOLVING_TO_WPCOM: 'NOT_RESOLVING_TO_WPCOM',
  NO_SSL_CERTIFICATE: 'NO_SSL_CERTIFICATE',
  EMAIL_UNVERIFIED: 'EMAIL_UNVERIFIED',
  EXCESSIVE_DISK_SPACE: 'EXCESSIVE_DISK_SPACE'
};

/***/ }),

/***/ 64386:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71085);



const initialState = {
  eligibilityHolds: [],
  eligibilityWarnings: [],
  lastUpdate: 0
};

// the parent reducer will verify the schema
/* harmony default export */ __webpack_exports__.Z = ((0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__/* .withPersistence */ .$)(function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .AUTOMATED_TRANSFER_ELIGIBILITY_UPDATE */ .zGH:
      return {
        eligibilityHolds: (0,lodash__WEBPACK_IMPORTED_MODULE_0__.sortBy)(action.eligibilityHolds),
        eligibilityWarnings: (0,lodash__WEBPACK_IMPORTED_MODULE_0__.sortBy)(action.eligibilityWarnings, (0,lodash__WEBPACK_IMPORTED_MODULE_0__.property)('name')),
        lastUpdate: action.lastUpdate
      };
  }
  return state;
}));

/***/ }),

/***/ 95559:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   x2: function() { return /* binding */ eligibility; }
/* harmony export */ });
/* unused harmony exports lastUpdate, eligibilityHolds, eligibilityWarnings */
const lastUpdate = {
  type: 'number',
  minimum: 0
};
const eligibilityHolds = {
  type: 'array',
  items: {
    type: 'string'
  }
};
const eligibilityWarnings = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      supportUrl: {
        type: 'string'
      }
    }
  }
};
const eligibility = {
  type: 'object',
  properties: {
    lastUpdate,
    eligibilityHolds,
    eligibilityWarnings
  }
};

/***/ }),

/***/ 57299:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var calypso_state_redux_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9044);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(80648);


(0,calypso_state_redux_store__WEBPACK_IMPORTED_MODULE_0__/* .registerReducer */ .x)(['automatedTransfer'], _reducer__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .ZP);

/***/ }),

/***/ 80648:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports status, fetchingStatus, siteReducer */
/* harmony import */ var _automattic_state_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83685);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_themes_action_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(46505);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71085);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95884);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(29398);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(15960);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(27010);
/* harmony import */ var _eligibility_reducer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(64386);
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(84635);







const status = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__/* .withPersistence */ .$)(function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .AUTOMATED_TRANSFER_ELIGIBILITY_UPDATE */ .zGH:
      return state || _constants__WEBPACK_IMPORTED_MODULE_3__/* .transferStates */ .pF.INQUIRING;
    case calypso_state_themes_action_types__WEBPACK_IMPORTED_MODULE_4__/* .THEME_TRANSFER_INITIATE_REQUEST */ .LG:
      return _constants__WEBPACK_IMPORTED_MODULE_3__/* .transferStates */ .pF.START;
    case calypso_state_themes_action_types__WEBPACK_IMPORTED_MODULE_4__/* .THEME_TRANSFER_INITIATE_FAILURE */ .aB:
      return _constants__WEBPACK_IMPORTED_MODULE_3__/* .transferStates */ .pF.FAILURE;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .AUTOMATED_TRANSFER_STATUS_SET */ .c13:
      return action.status;
    case calypso_state_themes_action_types__WEBPACK_IMPORTED_MODULE_4__/* .THEME_TRANSFER_STATUS_RECEIVE */ .rV:
      return 'complete' === action.status ? _constants__WEBPACK_IMPORTED_MODULE_3__/* .transferStates */ .pF.COMPLETE : state;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .AUTOMATED_TRANSFER_STATUS_REQUEST_FAILURE */ .Sdq:
      // TODO : [MARKETPLACE] rely on a tangible status from the backend instead of this message
      return action.error === 'An invalid transfer ID was passed.' ? _constants__WEBPACK_IMPORTED_MODULE_3__/* .transferStates */ .pF.NONE : _constants__WEBPACK_IMPORTED_MODULE_3__/* .transferStates */ .pF.REQUEST_FAILURE;
  }
  return state;
});
const fetchingStatus = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .AUTOMATED_TRANSFER_STATUS_REQUEST */ .k2T:
      return true;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .AUTOMATED_TRANSFER_STATUS_SET */ .c13:
      return false;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .AUTOMATED_TRANSFER_STATUS_REQUEST_FAILURE */ .Sdq:
      return false;
    default:
      return state;
  }
};
const siteReducer = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_5__/* .combineReducers */ .U)({
  eligibility: _eligibility_reducer__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z,
  status,
  fetchingStatus
});

// state is a map of transfer sub-states
// keyed by the associated site id
const validatedReducer = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_7__/* .withSchemaValidation */ .G)(_schema__WEBPACK_IMPORTED_MODULE_8__/* .automatedTransfer */ .YJ, (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_9__/* .keyedReducer */ .J)('siteId', siteReducer));
const automatedTransferReducer = (0,_automattic_state_utils__WEBPACK_IMPORTED_MODULE_0__/* .withStorageKey */ .xi)('automatedTransfer', validatedReducer);
/* harmony default export */ __webpack_exports__.ZP = (automatedTransferReducer);

/***/ }),

/***/ 84635:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   YJ: function() { return /* binding */ automatedTransfer; }
/* harmony export */ });
/* unused harmony exports status, automatedTransferSite */
/* harmony import */ var _eligibility_schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95559);

const status = {
  type: ['string', 'null']
};
const automatedTransferSite = {
  type: 'object',
  properties: {
    eligibility: _eligibility_schema__WEBPACK_IMPORTED_MODULE_0__/* .eligibility */ .x2,
    status
  }
};
const automatedTransfer = {
  type: 'object',
  patternProperties: {
    '^\\d+$': automatedTransferSite
  }
};

/***/ }),

/***/ 73952:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: function() { return /* binding */ getAutomatedTransfer; }
/* harmony export */ });
/* harmony import */ var calypso_state_automated_transfer_init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57299);

const emptyData = {};
const getAutomatedTransfer = (state, siteId) => siteId ? state?.automatedTransfer?.[siteId] ?? emptyData : emptyData;

/***/ }),

/***/ 11840:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_state_automated_transfer_selectors_get_automated_transfer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73952);
/* harmony import */ var calypso_state_automated_transfer_init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57299);




/**
 * Returns whether we are already fetching the Automated Transfer status for given siteId.
 * @param {Object} state global app state
 * @param {?number} siteId requested site for transfer info
 * @returns {?boolean} whether we are fetching transfer status for given siteId
 */
/* harmony default export */ __webpack_exports__.Z = ((state, siteId) => {
  if (!siteId) {
    return null;
  }
  const siteTransfer = (0,calypso_state_automated_transfer_selectors_get_automated_transfer__WEBPACK_IMPORTED_MODULE_2__/* .getAutomatedTransfer */ .t)(state, siteId);
  if (!siteTransfer || (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(siteTransfer)) {
    return null;
  }
  return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(siteTransfer, 'fetchingStatus', false);
});

/***/ }),

/***/ 94171:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports eligibilityHoldsFromApi, requestAutomatedTransferEligibility, updateAutomatedTransferEligibility */
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(19298);
/* harmony import */ var calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(84469);
/* harmony import */ var calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(71051);
/* harmony import */ var calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(27010);
/* harmony import */ var calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(50505);
/* harmony import */ var calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(28867);
/* harmony import */ var calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67577);
/* harmony import */ var calypso_state_selectors_is_unlaunched_site__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(14706);










/**
 * Maps the constants used in the WordPress.com API with
 * those used inside of Calypso. Somewhat redundant, this
 * provides safety for when the API changes. We need not
 * changes the constants in the Calypso side, only here
 * in the code directly dealing with the API.
 */
const statusMapping = {
  blocked_atomic_transfer: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.BLOCKED_ATOMIC_TRANSFER,
  transfer_already_exists: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.TRANSFER_ALREADY_EXISTS,
  no_business_plan: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.NO_BUSINESS_PLAN,
  no_jetpack_sites: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.NO_JETPACK_SITES,
  no_vip_sites: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.NO_VIP_SITES,
  site_private: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.SITE_PRIVATE,
  //site_private: eligibilityHolds.SITE_UNLAUNCHED, // modified in eligibilityHoldsFromApi
  site_graylisted: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.SITE_GRAYLISTED,
  non_admin_user: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.NON_ADMIN_USER,
  not_resolving_to_wpcom: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.NOT_RESOLVING_TO_WPCOM,
  no_ssl_certificate: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.NO_SSL_CERTIFICATE,
  email_unverified: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.EMAIL_UNVERIFIED,
  excessive_disk_space: calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.EXCESSIVE_DISK_SPACE
};

/**
 * Maps from API response the issues which prevent automated transfer
 * @param {Object} response API response data
 * @param {Array} response.errors List of { code, message } pairs describing issues
 * @param {Object} options object
 * @returns {Array} list of hold constants associated with issues listed in API response
 */
const eligibilityHoldsFromApi = function (_ref) {
  let {
    errors = []
  } = _ref;
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return errors.map(_ref2 => {
    let {
      code
    } = _ref2;
    //differentiate on the client between a launched private site vs an unlaunched site
    if (options.sitePrivateUnlaunched && code === 'site_private') {
      return calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_4__/* .eligibilityHolds */ .tv.SITE_UNLAUNCHED;
    }
    return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(statusMapping, code, '');
  }).filter(Boolean);
};

/**
 * Maps from API response the issues which trigger a confirmation for automated transfer
 * @param {Object} response API response data
 * @param {Object} response.warnings Lists of warnings by type, { plugins, themes }
 * @returns {Array} flat list of warnings with { name, description, supportUrl }
 */
const eligibilityWarningsFromApi = _ref3 => {
  let {
    warnings = {}
  } = _ref3;
  return Object.keys(warnings).reduce((list, type) => list.concat(warnings[type]), []) // combine plugin and theme warnings into one list
  .map(_ref4 => {
    let {
      description,
      name,
      support_url,
      id,
      domain_names
    } = _ref4;
    return {
      id,
      name,
      description,
      supportUrl: support_url,
      domainNames: domain_names
    };
  });
};

/**
 * Maps from API response to internal representation of automated transfer eligibility data
 * @param {Object} data API response data
 * @param {Object} options object
 * @returns {Object} Calypso eligibility information
 */
const fromApi = function (data) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    lastUpdate: Date.now(),
    eligibilityHolds: eligibilityHoldsFromApi(data, options),
    eligibilityWarnings: eligibilityWarningsFromApi(data)
  };
};

/**
 * Build track events for eligibility status
 * @param {Object} data eligibility data from the api
 * @returns {Object} An analytics event object
 */
const trackEligibility = data => {
  const isEligible = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(data, 'is_eligible', false);
  const pluginWarnings = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(data, 'warnings.plugins', []);
  const widgetWarnings = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(data, 'warnings.widgets', []);
  const hasEligibilityWarnings = !((0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(pluginWarnings) && (0,lodash__WEBPACK_IMPORTED_MODULE_0__.isEmpty)(widgetWarnings));
  const eventProps = {
    has_warnings: hasEligibilityWarnings,
    plugins: (0,lodash__WEBPACK_IMPORTED_MODULE_0__.map)(pluginWarnings, 'id').join(','),
    widgets: (0,lodash__WEBPACK_IMPORTED_MODULE_0__.map)(widgetWarnings, 'id').join(',')
  };
  if (isEligible) {
    return (0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_5__/* .recordTracksEvent */ .jN)('calypso_automated_transfer_eligibility_eligible', eventProps);
  }

  // add holds to event props if the transfer is ineligible
  eventProps.holds = eligibilityHoldsFromApi(data).join(',');
  return (0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_5__/* .recordTracksEvent */ .jN)('calypso_automated_transfer_eligibility_ineligible', eventProps);
};

/**
 * Issues an API request to fetch eligibility information for a site
 * @param {Function} action dispatcher
 * @returns {Object} action
 */
const requestAutomatedTransferEligibility = action => (0,calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_6__/* .http */ .d)({
  method: 'GET',
  path: `/sites/${action.siteId}/automated-transfers/eligibility`,
  apiVersion: '1'
}, action);
const updateAutomatedTransferEligibility = (_ref5, data) => {
  let {
    siteId
  } = _ref5;
  return (dispatch, getState) => {
    const siteIsUnlaunched = (0,calypso_state_selectors_is_unlaunched_site__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(getState(), siteId);
    dispatch((0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_7__/* .withAnalytics */ .w)(trackEligibility(data), (0,calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_8__/* .updateEligibility */ .rv)(siteId, fromApi(data, {
      sitePrivateUnlaunched: siteIsUnlaunched
    }))));
  };
};
(0,calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_1__/* .registerHandlers */ .Z9)('state/data-layer/wpcom/sites/automated-transfer/eligibility/index.js', {
  [calypso_state_action_types__WEBPACK_IMPORTED_MODULE_9__/* .AUTOMATED_TRANSFER_ELIGIBILITY_REQUEST */ .vzh]: [(0,calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_2__/* .dispatchRequest */ .BN)({
    fetch: requestAutomatedTransferEligibility,
    onSuccess: updateAutomatedTransferEligibility,
    onError: () => {} // noop
  })]
});

/***/ }),

/***/ 49175:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports initiateTransferWithPluginZip, receiveError, receiveResponse, updateUploadProgress */
/* harmony import */ var i18n_calypso__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11481);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19298);
/* harmony import */ var calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(71051);
/* harmony import */ var calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(50505);
/* harmony import */ var calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28867);
/* harmony import */ var calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67577);
/* harmony import */ var calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13306);
/* harmony import */ var calypso_state_plugins_upload_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(33342);










/*
 * Currently this module is only used for initiating transfers
 * with a plugin zip file. For initiating with a plugin ID
 * or theme zip, see state/themes/actions#initiateThemeTransfer.
 */

const initiateTransferWithPluginZip = action => {
  const {
    siteId,
    pluginZip
  } = action;
  return [(0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_2__/* .recordTracksEvent */ .jN)('calypso_automated_transfer_inititate_transfer', {
    context: 'plugin_upload'
  }), (0,calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_3__/* .http */ .d)({
    method: 'POST',
    path: `/sites/${siteId}/automated-transfers/initiate`,
    apiVersion: '1',
    formData: [['plugin_zip', pluginZip], ['context', 'plugin_upload']]
  }, action)];
};
const showErrorNotice = error => {
  if (error.error === 'invalid_input') {
    return (0,calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_4__/* .errorNotice */ .tF)((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('The uploaded file is not a valid zip.'));
  }
  if (error.error === 'api_success_false') {
    return (0,calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_4__/* .errorNotice */ .tF)((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('The uploaded file is not a valid plugin.'));
  }
  if (error.error) {
    return (0,calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_4__/* .errorNotice */ .tF)((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('Upload problem: %(error)s.', {
      args: {
        error: error.error
      }
    }));
  }
  return (0,calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_4__/* .errorNotice */ .tF)((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('Problem uploading the plugin.'));
};
const receiveError = (_ref, error) => {
  let {
    siteId
  } = _ref;
  return [(0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_2__/* .recordTracksEvent */ .jN)('calypso_automated_transfer_inititate_failure', {
    context: 'plugin_upload',
    error: error.error
  }), showErrorNotice(error), (0,calypso_state_plugins_upload_actions__WEBPACK_IMPORTED_MODULE_6__/* .pluginUploadError */ .y9)(siteId, error)];
};
const receiveResponse = (action, _ref2) => {
  let {
    success
  } = _ref2;
  if (success === false) {
    return receiveError(action, {
      error: 'api_success_false'
    });
  }
  return [(0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_2__/* .recordTracksEvent */ .jN)('calypso_automated_transfer_inititate_success', {
    context: 'plugin_upload'
  }), (0,calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_7__/* .fetchAutomatedTransferStatus */ .LH)(action.siteId)];
};
const updateUploadProgress = (_ref3, _ref4) => {
  let {
    siteId
  } = _ref3;
  let {
    loaded,
    total
  } = _ref4;
  const progress = total ? loaded / total * 100 : 0;
  return (0,calypso_state_plugins_upload_actions__WEBPACK_IMPORTED_MODULE_6__/* .updatePluginUploadProgress */ .oZ)(siteId, progress);
};
(0,calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_0__/* .registerHandlers */ .Z9)('state/data-layer/wpcom/sites/automated-transfer/initiate/index.js', {
  [calypso_state_action_types__WEBPACK_IMPORTED_MODULE_8__/* .AUTOMATED_TRANSFER_INITIATE_WITH_PLUGIN_ZIP */ ._az]: [(0,calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_1__/* .dispatchRequest */ .BN)({
    fetch: initiateTransferWithPluginZip,
    onSuccess: receiveResponse,
    onError: receiveError,
    onProgress: updateUploadProgress
  })]
});

/***/ }),

/***/ 14276:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports requestStatus, receiveStatus, requestingStatusFailure */
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(71051);
/* harmony import */ var calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(27010);
/* harmony import */ var calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(50505);
/* harmony import */ var calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(28867);
/* harmony import */ var calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67577);
/* harmony import */ var calypso_state_sites_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(40540);








const requestStatus = action => (0,calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_4__/* .http */ .d)({
  method: 'GET',
  path: `/sites/${action.siteId}/automated-transfers/status`,
  apiVersion: '1'
}, action);
const receiveStatus = (_ref, _ref2) => {
  let {
    siteId
  } = _ref;
  let {
    status,
    uploaded_plugin_slug
  } = _ref2;
  return dispatch => {
    const pluginId = uploaded_plugin_slug;
    dispatch((0,calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_5__/* .setAutomatedTransferStatus */ .WJ)(siteId, status, pluginId));
    if (status !== calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_6__/* .transferStates */ .pF.ERROR && status !== calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_6__/* .transferStates */ .pF.COMPLETE) {
      (0,lodash__WEBPACK_IMPORTED_MODULE_0__.delay)(dispatch, 3000, (0,calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_5__/* .fetchAutomatedTransferStatus */ .LH)(siteId));
    }
    if (status === calypso_state_automated_transfer_constants__WEBPACK_IMPORTED_MODULE_6__/* .transferStates */ .pF.COMPLETE) {
      // Update the now-atomic site to ensure plugin page displays correctly.
      dispatch((0,calypso_state_sites_actions__WEBPACK_IMPORTED_MODULE_3__/* .requestSite */ .LV)(siteId));
    }
  };
};
const requestingStatusFailure = response => {
  return (0,calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_5__/* .automatedTransferStatusFetchingFailure */ .yX)({
    siteId: response.siteId,
    error: response.meta?.dataLayer?.error?.message
  });
};
(0,calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_1__/* .registerHandlers */ .Z9)('state/data-layer/wpcom/sites/automated-transfer/status/index.js', {
  [calypso_state_action_types__WEBPACK_IMPORTED_MODULE_7__/* .AUTOMATED_TRANSFER_STATUS_REQUEST */ .k2T]: [(0,calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_2__/* .dispatchRequest */ .BN)({
    fetch: requestStatus,
    onSuccess: receiveStatus,
    onError: requestingStatusFailure
  })]
});

/***/ }),

/***/ 38333:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports uploadPlugin, uploadComplete, receiveError, updateUploadProgress */
/* harmony import */ var i18n_calypso__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11481);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_lib_plugins_constants__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(45076);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19298);
/* harmony import */ var calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(50505);
/* harmony import */ var calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(28867);
/* harmony import */ var calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67577);
/* harmony import */ var calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(13306);
/* harmony import */ var calypso_state_plugins_upload_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(33342);










const uploadPlugin = action => {
  const {
    siteId,
    file
  } = action;
  return [(0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_3__/* .recordTracksEvent */ .jN)('calypso_plugin_upload'), (0,calypso_state_data_layer_wpcom_http_actions__WEBPACK_IMPORTED_MODULE_4__/* .http */ .d)({
    method: 'POST',
    path: `/sites/${siteId}/plugins/new`,
    apiVersion: '1',
    formData: [['zip[]', file]]
  }, action)];
};
const showErrorNotice = error => {
  const knownErrors = {
    exists: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('This plugin is already installed on your site.'),
    'too large': (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('The plugin zip file must be smaller than 10MB.'),
    incompatible: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('The uploaded file is not a compatible plugin.'),
    unsupported_mime_type: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('The uploaded file is not a valid zip.'),
    plugin_malicious: (0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('The uploaded file is identified as malicious.')
  };
  const errorString = `${error.error}${error.message}`.toLowerCase();
  const knownError = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.find)(knownErrors, (v, key) => (0,lodash__WEBPACK_IMPORTED_MODULE_0__.includes)(errorString, key));
  if (knownError) {
    return (0,calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_6__/* .errorNotice */ .tF)(knownError);
  }
  if (error.error) {
    return (0,calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_6__/* .errorNotice */ .tF)((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('Upload problem: %(error)s.', {
      args: {
        error: error.error
      }
    }));
  }
  return (0,calypso_state_notices_actions__WEBPACK_IMPORTED_MODULE_6__/* .errorNotice */ .tF)((0,i18n_calypso__WEBPACK_IMPORTED_MODULE_5__/* .translate */ .Iu)('Problem installing the plugin.'));
};
const uploadComplete = (_ref, data) => {
  let {
    siteId
  } = _ref;
  return dispatch => {
    const {
      slug: pluginId
    } = data;
    dispatch((0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_3__/* .recordTracksEvent */ .jN)('calypso_plugin_upload_complete', {
      plugin_id: pluginId
    }));
    dispatch((0,calypso_state_plugins_upload_actions__WEBPACK_IMPORTED_MODULE_7__/* .completePluginUpload */ .ZN)(siteId, pluginId));

    // Notifying installed plugins that this plugin was successfully installed
    dispatch({
      type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_8__/* .PLUGIN_INSTALL_REQUEST_SUCCESS */ .Pk2,
      action: calypso_lib_plugins_constants__WEBPACK_IMPORTED_MODULE_9__/* .INSTALL_PLUGIN */ .rH,
      siteId,
      pluginId: data.id,
      data
    });
  };
};
const receiveError = (_ref2, error) => {
  let {
    siteId
  } = _ref2;
  return [(0,calypso_state_analytics_actions__WEBPACK_IMPORTED_MODULE_3__/* .recordTracksEvent */ .jN)('calypso_plugin_upload_error', {
    error_code: error.error,
    error_message: error.message
  }), showErrorNotice(error), (0,calypso_state_plugins_upload_actions__WEBPACK_IMPORTED_MODULE_7__/* .pluginUploadError */ .y9)(siteId, error)];
};
const updateUploadProgress = (_ref3, _ref4) => {
  let {
    siteId
  } = _ref3;
  let {
    loaded,
    total
  } = _ref4;
  const progress = total ? loaded / total * 100 : total;
  return (0,calypso_state_plugins_upload_actions__WEBPACK_IMPORTED_MODULE_7__/* .updatePluginUploadProgress */ .oZ)(siteId, progress);
};
(0,calypso_state_data_layer_handler_registry__WEBPACK_IMPORTED_MODULE_1__/* .registerHandlers */ .Z9)('state/data-layer/wpcom/sites/plugins/new/index.js', {
  [calypso_state_action_types__WEBPACK_IMPORTED_MODULE_8__/* .PLUGIN_UPLOAD */ .ZxD]: [(0,calypso_state_data_layer_wpcom_http_utils__WEBPACK_IMPORTED_MODULE_2__/* .dispatchRequest */ .BN)({
    fetch: uploadPlugin,
    onSuccess: uploadComplete,
    onError: receiveError,
    onProgress: updateUploadProgress
  })]
});

/***/ }),

/***/ 8977:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchAutomatedTransferStatusForSelectedSite: function() { return /* binding */ fetchAutomatedTransferStatusForSelectedSite; }
/* harmony export */ });
/* harmony import */ var calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71051);
/* harmony import */ var calypso_state_automated_transfer_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11840);
/* harmony import */ var calypso_state_selectors_has_site_pending_automated_transfer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(48793);
/* harmony import */ var calypso_state_ui_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20834);




const fetchAutomatedTransferStatusForSelectedSite = (dispatch, getState) => {
  const state = getState();
  const siteId = (0,calypso_state_ui_selectors__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(state);
  const isFetchingATStatus = (0,calypso_state_automated_transfer_selectors__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(state, siteId);
  if (!isFetchingATStatus && (0,calypso_state_selectors_has_site_pending_automated_transfer__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(state, siteId)) {
    dispatch((0,calypso_state_automated_transfer_actions__WEBPACK_IMPORTED_MODULE_3__/* .fetchAutomatedTransferStatus */ .LH)(siteId));
  }
};

/***/ }),

/***/ 47872:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var calypso_state_redux_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9044);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(76057);


(0,calypso_state_redux_store__WEBPACK_IMPORTED_MODULE_0__/* .registerReducer */ .x)(['plugins'], _reducer__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);

/***/ }),

/***/ 74594:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports isRequestingAll, requestError, isRequesting, plugins */
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_lib_formatting__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(50118);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(29398);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95884);
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(43337);
/* harmony import */ var _status_reducer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(38362);
/* eslint-disable no-case-declarations */








/**
 * Returns the updated requesting state after an action has been dispatched.
 * Requesting state tracks whether a network request is in progress for all
 * plugins on all sites.
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @returns {Object}        Updated state
 */
function isRequestingAll() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_ALL_REQUEST */ .nxI:
      return true;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_ALL_REQUEST_FAILURE */ .Cjy:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_ALL_REQUEST_SUCCESS */ .rLo:
      return false;
    default:
      return state;
  }
}

/**
 * Returns the updated requesting error state after an action has been dispatched.
 * requestingError state tracks whether a network request is failed for all
 * plugins on all sites.
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @returns {Object}        Updated state
 */
function requestError() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_ALL_REQUEST */ .nxI:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_ALL_REQUEST_SUCCESS */ .rLo:
      return false;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_ALL_REQUEST_FAILURE */ .Cjy:
      return true;
    default:
      return state;
  }
}

/*
 * Tracks the requesting state for installed plugins on a per-site index.
 */
function isRequesting() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_REQUEST */ .EDz:
      return Object.assign({}, state, {
        [action.siteId]: true
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_REQUEST_FAILURE */ .Dp5:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_REQUEST_SUCCESS */ .FHu:
      return Object.assign({}, state, {
        [action.siteId]: false
      });
    default:
      return state;
  }
}

/*
 * Helper function to update a plugin's state after a successful plugin action
 * (multiple action-types are possible)
 */
const updatePlugin = function (state, action) {
  if (typeof state[action.siteId] !== 'undefined') {
    return Object.assign({}, state, {
      [action.siteId]: pluginsForSite(state[action.siteId], action)
    });
  }
  return state;
};

/**
 * Helper function that iterates over the allSites object to update the name of the plugins
 * @param {Object} allSites Object containing all the sites and their respective plugins
 * @returns {Object} Object containing all the sites and their respective plugins with decoded names
 */
function decodeAllSitePluginsName(allSites) {
  return Object.fromEntries(Object.entries(allSites).map(_ref => {
    let [siteId, pluginItems] = _ref;
    return [siteId, decodeAllPluginsName(pluginItems)];
  }));
}

/**
 * Helper function that iterates over a list of plugins to update its name if required
 * @param {Array} pluginData List of plugin objects
 * @returns {Array} List of plugin objects with decoded names
 */
function decodeAllPluginsName(pluginData) {
  return pluginData.map(pluginItem => decodePluginName(pluginItem));
}

/*
 * Helper function to decode a plugin's name after a successful plugin action
 * (multiple action-types are possible)
 * @param {Object} pluginItem - plugin object
 * @returns {Object} - plugin object with decoded name
 */
function decodePluginName(pluginItem) {
  if (!pluginItem.name) {
    return pluginItem;
  }
  return {
    ...pluginItem,
    name: (0,calypso_lib_formatting__WEBPACK_IMPORTED_MODULE_2__/* .decodeEntities */ .S)(pluginItem.name)
  };
}

/*
 * Tracks all known installed plugin objects indexed by site ID.
 */
const plugins = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_3__/* .withSchemaValidation */ .G)(_schema__WEBPACK_IMPORTED_MODULE_4__/* .pluginsSchema */ .Q, function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_RECEIVE */ .MMT:
      {
        return {
          ...state,
          [action.siteId]: decodeAllPluginsName(action.data)
        };
      }
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGINS_ALL_RECEIVE */ .JYj:
      {
        return decodeAllSitePluginsName(action.allSitesPlugins);
      }
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_ACTIVATE_REQUEST_SUCCESS */ .rSV:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_DEACTIVATE_REQUEST_SUCCESS */ .uYK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPDATE_REQUEST_SUCCESS */ .Ubi:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS */ .Ezs:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS */ .OdF:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_INSTALL_REQUEST_SUCCESS */ .Pk2:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_REMOVE_REQUEST_SUCCESS */ .vOK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_ACTION_STATUS_UPDATE */ .XL8:
      return updatePlugin(state, action);
  }
  return state;
});

/*
 * Tracks the list of premium plugin objects for a single site
 */
function pluginsForSite() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_ACTIVATE_REQUEST_SUCCESS */ .rSV:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_DEACTIVATE_REQUEST_SUCCESS */ .uYK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPDATE_REQUEST_SUCCESS */ .Ubi:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS */ .Ezs:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS */ .OdF:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_ACTION_STATUS_UPDATE */ .XL8:
      return state.map(p => plugin(p, action));
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_INSTALL_REQUEST_SUCCESS */ .Pk2:
      {
        return [...state, decodePluginName(action.data)];
      }
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_REMOVE_REQUEST_SUCCESS */ .vOK:
      const index = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.findIndex)(state, {
        id: action.pluginId
      });
      return [...state.slice(0, index), ...state.slice(index + 1)];
    default:
      return state;
  }
}

/*
 * Tracks the state of a single premium plugin object
 */
function plugin(state, action) {
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_ACTIVATE_REQUEST_SUCCESS */ .rSV:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_DEACTIVATE_REQUEST_SUCCESS */ .uYK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS */ .Ezs:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS */ .OdF:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_ACTION_STATUS_UPDATE */ .XL8:
      if (state.id !== action.data.id) {
        return state;
      }
      return Object.assign({}, state, decodePluginName(action.data));
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPDATE_REQUEST_SUCCESS */ .Ubi:
      if (state.id !== action.data.id) {
        return state;
      }
      return Object.assign({}, state, {
        update: {
          recentlyUpdated: true
        }
      }, decodePluginName(action.data));
    default:
      return state;
  }
}
/* harmony default export */ __webpack_exports__.ZP = ((0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_5__/* .combineReducers */ .U)({
  isRequesting,
  isRequestingAll,
  requestError,
  plugins,
  status: _status_reducer__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z
}));

/***/ }),

/***/ 43337:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: function() { return /* binding */ pluginsSchema; }
/* harmony export */ });
const pluginsSchema = {
  type: 'object',
  patternProperties: {
    //be careful to escape regexes properly
    '^[0-9]+$': {
      type: 'array',
      items: {
        required: ['id', 'slug', 'name', 'active', 'autoupdate'],
        properties: {
          id: {
            type: 'string'
          },
          slug: {
            type: 'string'
          },
          active: {
            type: 'boolean'
          },
          name: {
            type: 'string'
          },
          plugin_url: {
            type: 'string'
          },
          version: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          author: {
            type: 'string'
          },
          author_url: {
            type: 'string'
          },
          network: {
            type: 'boolean'
          },
          autoupdate: {
            type: 'boolean'
          },
          update: {
            type: 'object'
          }
        }
      }
    }
  },
  additionalProperties: false
};

/***/ }),

/***/ 92708:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gb: function() { return /* binding */ PLUGIN_INSTALLATION_UP_TO_DATE; },
/* harmony export */   gm: function() { return /* binding */ PLUGIN_INSTALLATION_IN_PROGRESS; },
/* harmony export */   m: function() { return /* binding */ PLUGIN_INSTALLATION_ERROR; },
/* harmony export */   s1: function() { return /* binding */ PLUGIN_INSTALLATION_COMPLETED; }
/* harmony export */ });
/**
 * Plugin installation statuses
 */

const PLUGIN_INSTALLATION_IN_PROGRESS = 'inProgress';
const PLUGIN_INSTALLATION_COMPLETED = 'completed';
const PLUGIN_INSTALLATION_ERROR = 'error';
const PLUGIN_INSTALLATION_UP_TO_DATE = 'up-to-date';

/***/ }),

/***/ 38362:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ status; }
/* harmony export */ });
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_plugins_installed_status_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(92708);



/*
 * Tracks the current status of plugins on sites, indexed by (site, plugin).
 */
function status() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    siteId
  } = action;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST */ .aRw:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST */ .nM3:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST */ .c0y:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST */ .oe9:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST */ .DIf:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST */ .OzL:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST */ .ku_:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST_SUCCESS */ .rSV:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST_SUCCESS */ .uYK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST_SUCCESS */ .Ubi:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS */ .Ezs:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS */ .OdF:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST_SUCCESS */ .Pk2:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST_SUCCESS */ .vOK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST_FAILURE */ .v1B:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST_FAILURE */ .jWe:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST_FAILURE */ .RRf:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_FAILURE */ .At6:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_FAILURE */ .ns$:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST_FAILURE */ .x8h:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST_FAILURE */ .czR:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ALREADY_UP_TO_DATE */ .vk3:
      return Object.assign({}, state, {
        [siteId]: statusForSite(state[siteId], action)
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_NOTICES_REMOVE */ .mCe:
      {
        if (!action.statuses || !action.statuses.length) {
          return state;
        }
        const allStatuses = Object.entries(state).map(_ref => {
          let [stateSiteId, siteStatuses] = _ref;
          const updatedSiteStatuses = Object.entries(siteStatuses).filter(_ref2 => {
            let [, pluginStatus] = _ref2;
            return !action.statuses.includes(pluginStatus.status);
          });
          if (!updatedSiteStatuses.length) {
            return [];
          }
          return [stateSiteId, Object.fromEntries(updatedSiteStatuses)];
        }).filter(siteStatus => siteStatus.length);
        return Object.fromEntries(allStatuses);
      }
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .RESET_PLUGIN_NOTICES */ .lK$:
      return {};
    default:
      return state;
  }
}
function statusForSite() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    pluginId
  } = action;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST */ .aRw:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST */ .nM3:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST */ .c0y:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST */ .oe9:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST */ .DIf:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST */ .OzL:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST */ .ku_:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST_SUCCESS */ .rSV:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST_SUCCESS */ .uYK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST_SUCCESS */ .Ubi:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS */ .Ezs:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS */ .OdF:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST_SUCCESS */ .Pk2:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST_SUCCESS */ .vOK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST_FAILURE */ .v1B:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST_FAILURE */ .jWe:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST_FAILURE */ .RRf:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_FAILURE */ .At6:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_FAILURE */ .ns$:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST_FAILURE */ .x8h:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST_FAILURE */ .czR:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ALREADY_UP_TO_DATE */ .vk3:
      if (typeof state[pluginId] !== 'undefined') {
        return Object.assign({}, state, {
          [pluginId]: statusForSitePlugin(state[pluginId], action)
        });
      }
      return Object.assign({}, state, {
        [pluginId]: statusForSitePlugin({}, action)
      });
    default:
      return state;
  }
}
function statusForSitePlugin() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST */ .aRw:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST */ .nM3:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST */ .c0y:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST */ .oe9:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST */ .DIf:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST */ .OzL:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST */ .ku_:
      return Object.assign({}, state, {
        status: calypso_state_plugins_installed_status_constants__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_INSTALLATION_IN_PROGRESS */ .gm,
        action: action.action
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST_SUCCESS */ .rSV:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST_SUCCESS */ .uYK:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST_SUCCESS */ .Ubi:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_SUCCESS */ .Ezs:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_SUCCESS */ .OdF:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST_SUCCESS */ .Pk2:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST_SUCCESS */ .vOK:
      return Object.assign({}, state, {
        status: calypso_state_plugins_installed_status_constants__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_INSTALLATION_COMPLETED */ .s1,
        action: action.action
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ACTIVATE_REQUEST_FAILURE */ .v1B:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_DEACTIVATE_REQUEST_FAILURE */ .jWe:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_UPDATE_REQUEST_FAILURE */ .RRf:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_ENABLE_REQUEST_FAILURE */ .At6:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_AUTOUPDATE_DISABLE_REQUEST_FAILURE */ .ns$:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_INSTALL_REQUEST_FAILURE */ .x8h:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_REMOVE_REQUEST_FAILURE */ .czR:
      return Object.assign({}, state, {
        status: calypso_state_plugins_installed_status_constants__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_INSTALLATION_ERROR */ .m,
        action: action.action,
        error: action.error
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGIN_ALREADY_UP_TO_DATE */ .vk3:
      return Object.assign({}, state, {
        status: calypso_state_plugins_installed_status_constants__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_INSTALLATION_UP_TO_DATE */ .Gb,
        action: action.action
      });
    default:
      return state;
  }
}

/***/ }),

/***/ 13850:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports isRequesting, hasRequested, plugins */
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29398);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(71085);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95884);
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(90772);





/*
 * Tracks the requesting state for premium plugin "instructions" (the list
 * of plugins and API keys) on a per-site index.
 */
function isRequesting() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTRUCTIONS_FETCH */ .thH:
      return Object.assign({}, state, {
        [action.siteId]: true
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTRUCTIONS_RECEIVE */ .oeh:
      return Object.assign({}, state, {
        [action.siteId]: false
      });
    default:
      return state;
  }
}

/*
 * Tracks the requesting state for premium plugin "instructions" (the list
 * of plugins and API keys) on a per-site index.
 */
function hasRequested() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTRUCTIONS_RECEIVE */ .oeh:
      return Object.assign({}, state, {
        [action.siteId]: true
      });
    default:
      return state;
  }
}

/*
 * Tracks all known premium plugin objects (plugin meta and install status),
 * indexed by site ID.
 */
const pluginsReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTRUCTIONS_RECEIVE */ .oeh:
      return Object.assign({}, state, {
        [action.siteId]: action.data
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTALL */ .Rn8:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_ACTIVATE */ .C8L:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_CONFIGURE */ .f7C:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_FINISH */ .yXo:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_ERROR */ .S6B:
      if (typeof state[action.siteId] !== 'undefined') {
        return Object.assign({}, state, {
          [action.siteId]: pluginsForSite(state[action.siteId], action)
        });
      }
      return state;
    default:
      return state;
  }
};

// pick selected properties from the error object and ignore ones that are `undefined`.
const serializeError = error => Object.fromEntries(['name', 'code', 'error', 'message'].map(k => [k, error[k]]).filter(_ref => {
  let [, v] = _ref;
  return v !== undefined;
}));
const plugins = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_2__/* .withSchemaValidation */ .G)(_schema__WEBPACK_IMPORTED_MODULE_3__/* .pluginInstructionSchema */ .m, (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_4__/* .withPersistence */ .$)(pluginsReducer, {
  // - save only selected fields of an error (an `Error` instance is not serializable per se)
  // - omit the `key` field.
  serialize: state => (0,lodash__WEBPACK_IMPORTED_MODULE_0__.mapValues)(state, pluginList => pluginList.map(item => {
    if (item.error) {
      item = {
        ...item,
        error: serializeError(item.error)
      };
    }
    return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.omit)(item, 'key');
  }))
}));

/*
 * Tracks the list of premium plugin objects for a single site
 */
function pluginsForSite() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTRUCTIONS_RECEIVE */ .oeh:
      return action.data;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTALL */ .Rn8:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_ACTIVATE */ .C8L:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_CONFIGURE */ .f7C:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_FINISH */ .yXo:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_ERROR */ .S6B:
      return state.map(p => plugin(p, action));
    default:
      return state;
  }
}

/*
 * Tracks the state of a single premium plugin object
 */
function plugin(state, action) {
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTALL */ .Rn8:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_ACTIVATE */ .C8L:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_CONFIGURE */ .f7C:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_FINISH */ .yXo:
      if (state.slug !== action.slug) {
        return state;
      }
      return Object.assign({}, state, {
        status: pluginStatus(state.status, action)
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_ERROR */ .S6B:
      if (state.slug !== action.slug) {
        return state;
      }
      return Object.assign({}, state, {
        status: pluginStatus(state.status, action),
        error: action.error
      });
    default:
      return state;
  }
}

/*
 * Tracks the status of a plugin through the install/activate/configure process
 */
function pluginStatus(state, action) {
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_INSTALL */ .Rn8:
      return 'install';
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_ACTIVATE */ .C8L:
      return 'activate';
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_CONFIGURE */ .f7C:
      return 'configure';
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_SETUP_FINISH */ .yXo:
      return 'done';
    default:
      return state || 'wait';
  }
}
/* harmony default export */ __webpack_exports__.ZP = ((0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_5__/* .combineReducers */ .U)({
  isRequesting,
  hasRequested,
  plugins
}));

/***/ }),

/***/ 90772:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: function() { return /* binding */ pluginInstructionSchema; }
/* harmony export */ });
const pluginInstructionSchema = {
  type: 'object',
  patternProperties: {
    //be careful to escape regexes properly
    '^[0-9]+$': {
      type: 'array',
      items: {
        required: ['slug'],
        properties: {
          name: {
            type: 'string'
          },
          slug: {
            type: 'string'
          },
          status: {
            type: 'string'
          },
          error: {
            type: ['object', 'string', 'null']
          },
          /* Invalidate state if the key has been persisted */
          key: {
            type: 'null'
          }
        }
      }
    }
  },
  additionalProperties: false
};

/***/ }),

/***/ 76057:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var _automattic_state_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83685);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(95884);
/* harmony import */ var _installed_reducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(74594);
/* harmony import */ var _premium_reducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13850);
/* harmony import */ var _upload_reducer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(91853);
/* harmony import */ var _wporg_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(52891);






const combinedReducer = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__/* .combineReducers */ .U)({
  wporg: _wporg_reducer__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .ZP,
  premium: _premium_reducer__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .ZP,
  installed: _installed_reducer__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .ZP,
  upload: _upload_reducer__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .ZP
});
/* harmony default export */ __webpack_exports__.Z = ((0,_automattic_state_utils__WEBPACK_IMPORTED_MODULE_0__/* .withStorageKey */ .xi)('plugins', combinedReducer));

/***/ }),

/***/ 33342:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZN: function() { return /* binding */ completePluginUpload; },
/* harmony export */   oZ: function() { return /* binding */ updatePluginUploadProgress; },
/* harmony export */   y9: function() { return /* binding */ pluginUploadError; }
/* harmony export */ });
/* unused harmony exports uploadPlugin, clearPluginUpload */
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_data_layer_wpcom_sites_plugins_new__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38333);
/* harmony import */ var calypso_state_plugins_init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(47872);




/**
 * Upload a plugin to a site.
 * @param {number} siteId site ID
 * @param {window.File} file the plugin zip to upload
 * @returns {Object} action object
 */
function uploadPlugin(siteId, file) {
  return {
    type: PLUGIN_UPLOAD,
    siteId,
    file
  };
}

/**
 * Update progress for an uploading plugin.
 * @param {number} siteId site ID
 * @param {number} progress percentage of file uploaded
 * @returns {Object} action object
 */
function updatePluginUploadProgress(siteId, progress) {
  return {
    type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .PLUGIN_UPLOAD_PROGRESS */ .VLi,
    siteId,
    progress
  };
}

/**
 * Mark a plugin upload as complete.
 * @param {number} siteId site ID
 * @param {string} pluginId plugin id
 * @returns {Object} action object
 */
function completePluginUpload(siteId, pluginId) {
  return {
    type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .PLUGIN_UPLOAD_COMPLETE */ .VnH,
    siteId,
    pluginId
  };
}

/**
 * Set an error from a plugin upload.
 * @param {number} siteId site ID
 * @param {Object} error the error
 * @returns {Object} action object
 */
function pluginUploadError(siteId, error) {
  return {
    type: calypso_state_action_types__WEBPACK_IMPORTED_MODULE_2__/* .PLUGIN_UPLOAD_ERROR */ .PE7,
    siteId,
    error
  };
}

/**
 * Clear any plugin upload data for a site.
 * @param {number} siteId site ID
 * @returns {Object} action object
 */
function clearPluginUpload(siteId) {
  return {
    type: PLUGIN_UPLOAD_CLEAR,
    siteId
  };
}

/***/ }),

/***/ 91853:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports uploadedPluginId, uploadError, progressPercent, inProgress */
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15960);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95884);


const uploadedPluginId = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_0__/* .keyedReducer */ .J)('siteId', function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD */ .ZxD:
      return null;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_COMPLETE */ .VnH:
      {
        const {
          pluginId
        } = action;
        return pluginId;
      }
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_CLEAR */ .YdL:
      return null;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_ERROR */ .PE7:
      return null;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .AUTOMATED_TRANSFER_STATUS_SET */ .c13:
      {
        const {
          uploadedPluginId: pluginId
        } = action;
        return pluginId;
      }
  }
  return state;
});
const uploadError = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_0__/* .keyedReducer */ .J)('siteId', function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_ERROR */ .PE7:
      {
        const {
          error
        } = action;
        return error;
      }
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD */ .ZxD:
      return null;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_CLEAR */ .YdL:
      return null;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_COMPLETE */ .VnH:
      return null;
  }
  return state;
});
const progressPercent = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_0__/* .keyedReducer */ .J)('siteId', function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_PROGRESS */ .VLi:
      {
        const {
          progress
        } = action;
        return progress;
      }
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD */ .ZxD:
      return 0;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_CLEAR */ .YdL:
      return 0;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_ERROR */ .PE7:
      return 0;
  }
  return state;
});
const inProgress = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_0__/* .keyedReducer */ .J)('siteId', function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD */ .ZxD:
      return true;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_COMPLETE */ .VnH:
      return false;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_ERROR */ .PE7:
      return false;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .PLUGIN_UPLOAD_CLEAR */ .YdL:
      return false;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .AUTOMATED_TRANSFER_INITIATE_WITH_PLUGIN_ZIP */ ._az:
      return true;
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_1__/* .AUTOMATED_TRANSFER_STATUS_SET */ .c13:
      {
        const {
          status
        } = action;
        return status !== 'complete';
      }
  }
  return state;
});
/* harmony default export */ __webpack_exports__.ZP = ((0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_2__/* .combineReducers */ .U)({
  uploadedPluginId,
  uploadError,
  progressPercent,
  inProgress
}));

/***/ }),

/***/ 52891:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* unused harmony exports fetchingItems, fetchingLists, items, listsPagination */
/* harmony import */ var calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40211);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71085);
/* harmony import */ var calypso_state_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95884);


function updatePluginState() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let pluginSlug = arguments.length > 1 ? arguments[1] : undefined;
  let attributes = arguments.length > 2 ? arguments[2] : undefined;
  return Object.assign({}, state, {
    [pluginSlug]: Object.assign({}, state[pluginSlug], attributes)
  });
}
function fetchingItems() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_PLUGIN_REQUEST */ .h11:
      return Object.assign({}, state, {
        [action.pluginSlug]: true
      });
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_PLUGIN_RECEIVE */ .akS:
      return Object.assign({}, state, {
        [action.pluginSlug]: false
      });
  }
  return state;
}
function fetchingLists() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_LIST_REQUEST */ .anr:
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_LIST_RECEIVE */ .Sb1:
      if (action.category) {
        return {
          ...state,
          category: {
            ...state.category,
            [action.category]: action.type === calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_LIST_REQUEST */ .anr
          }
        };
      } else if (action.searchTerm) {
        return {
          ...state,
          search: {
            ...state.search,
            [action.searchTerm]: action.type === calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_LIST_REQUEST */ .anr
          }
        };
      }
  }
  return state;
}
function itemsReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    type,
    pluginSlug
  } = action;
  switch (type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_PLUGIN_RECEIVE */ .akS:
      if (action.data) {
        return updatePluginState(state, pluginSlug, Object.assign({
          fetched: true,
          wporg: true
        }, action.data));
      }
      return updatePluginState(state, pluginSlug, Object.assign({
        fetched: false,
        wporg: false,
        error: action.error
      }));
    default:
      return state;
  }
}
const items = (0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_1__/* .withPersistence */ .$)(itemsReducer);

// export const items = itemsReducer;

function listsPagination() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    category,
    pagination
  } = action;
  switch (action.type) {
    case calypso_state_action_types__WEBPACK_IMPORTED_MODULE_0__/* .PLUGINS_WPORG_LIST_RECEIVE */ .Sb1:
      if (pagination) {
        if (category) {
          return {
            ...state,
            category: {
              ...state.category,
              [category]: pagination
            }
          };
        }
      }
  }
  return state;
}
/* harmony default export */ __webpack_exports__.ZP = ((0,calypso_state_utils__WEBPACK_IMPORTED_MODULE_2__/* .combineReducers */ .U)({
  fetchingItems,
  fetchingLists,
  items,
  listsPagination
}));

/***/ }),

/***/ 48793:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92819);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var calypso_state_selectors_is_site_automated_transfer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28204);
/* harmony import */ var calypso_state_sites_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(46480);




/**
 * Indicates whether there might be an Automated Transfer process running on the backend for
 * a given site.
 *
 * For example, if a site is created through the 'store' signup flow and its plan is paid,
 * we try to transfer the site (automatically on the backend) so it can become a Store/Woo site.
 * However, the transfer process might not start immediately because of the transfer eligibility
 * reasons. That's where this selector comes handy.
 * @param   {Object}  state  App state.
 * @param   {number}  siteId Site of interest.
 * @returns {boolean}        Whether there might be a transfer process happening on the backend.
 */
/* harmony default export */ __webpack_exports__.Z = ((state, siteId) => {
  const siteOptions = (0,calypso_state_sites_selectors__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(state, siteId);
  if (!siteOptions) {
    return null;
  }

  // If the site is an Atomic one, there is no Automated Transfer process happening on the backend.
  if ((0,calypso_state_selectors_is_site_automated_transfer__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(state, siteId)) {
    return false;
  }
  return (0,lodash__WEBPACK_IMPORTED_MODULE_0__.get)(siteOptions, 'has_pending_automated_transfer', false);
});

/***/ }),

/***/ 28204:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ isSiteAutomatedTransfer; }
/* harmony export */ });
/**
 * Returns true if site is a Automated Transfer site, false if not and null if unknown
 */
function isSiteAutomatedTransfer(state, siteId) {
  if (!siteId) {
    return null;
  }
  return state?.sites?.items?.[siteId]?.options?.is_automated_transfer ?? null;
}

/***/ }),

/***/ 14706:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ isUnlaunchedSite; }
/* harmony export */ });
/* harmony import */ var calypso_state_selectors_get_raw_site__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53843);


/**
 * Returns true if the site is unlaunched
 * @param {Object} state Global state tree
 * @param {number|string|undefined|null} siteId Site ID
 * @returns {boolean} True if site is unlaunched
 */
function isUnlaunchedSite(state, siteId) {
  const site = (0,calypso_state_selectors_get_raw_site__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(state, siteId);
  return site?.launch_status === 'unlaunched';
}

/***/ })

}]);