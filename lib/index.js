'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchEncodeJSON = exports.FETCH = exports.fetch = undefined;

require('isomorphic-fetch');

var _fetchEncodeJSON = require('./fetchEncodeJSON');

var _fetchEncodeJSON2 = _interopRequireDefault(_fetchEncodeJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Action types
 */

/**
 * Imports
 */

var FETCH = 'EFFECT_FETCH';

/**
 * Fetch middleware
 */

function fetchMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return action.type === FETCH ? fetch(action.payload.url, action.payload.params).then(checkStatus).then(createResponse, createErrorResponse) : next(action);
    };
  };
}

/**
 * Create a plain JS response object.  Note that 'headers' is still a Headers
 * object (https://developer.mozilla.org/en-US/docs/Web/API/Headers), and must be
 * read using that API.
 */

function createResponse(res) {
  return deserialize(res).then(function (value) {
    return {
      url: res.url,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      value: value
    };
  });
}

/**
 * Create the response, then return a new rejected
 * promise so the failure chain stays failed.
 */

function createErrorResponse(res) {
  return createResponse(res).then(function (res) {
    throw res;
  });
}

/**
 * Deserialize the request body
 */

function deserialize(res) {
  var header = res.headers.get('Content-Type') || '';
  if (header.indexOf('application/json') > -1) return res.json();
  if (header.indexOf('application/ld+json') > -1) return res.json();
  if (header.indexOf('application/octet-stream') > -1) return res.arrayBuffer();
  return res.text();
}

/**
 * Check the status and reject the promise if it's not in the 200 range
 */

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    throw res;
  }
}

/**
 * Action creator
 */

function fetchActionCreator() {
  var url = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return {
    type: FETCH,
    payload: {
      url: url,
      params: params
    }
  };
}

/**
 * Exports
 */

exports.default = fetchMiddleware;
exports.fetch = fetchActionCreator;
exports.FETCH = FETCH;
exports.fetchEncodeJSON = _fetchEncodeJSON2.default;