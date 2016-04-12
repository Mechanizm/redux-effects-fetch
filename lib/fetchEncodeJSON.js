'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _index = require('./index');

/**
 * @see https://github.com/lodash/lodash/blob/4.8.0/lodash.js#L10705
 * @see https://lodash.com/docs#isObject
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * A middleware which automatically converts object bodies to JSON for fetch effects.
 *
 * The middleware intercepts all fetch actions, and encodes their body to JSON if
 *
 * - the request has a `Content-Type: application/json` and
 * - the body is an object.
 *
 * In this case it also adds an `Accept: application/json` header but only if there's no other `Accept` header yet.
 *
 * Hook into **before** the regular fetch middleware.
 */
var fetchEncodeJSON = function fetchEncodeJSON() {
  return function (next) {
    return function (action) {
      return action.type === _index.FETCH ? next(maybeConvertBodyToJSON(action)) : next(action);
    };
  };
};

/**
 * Whether we may convert a request with the given params to JSON.
 */
var shallConvertToJSON = function shallConvertToJSON(params) {
  return isObject(params.body) && params.headers && params.headers['Content-Type'] === 'application/json';
};

/**
 * Add an accept header if necessary.
 *
 * Add an `Accept: application/json` header to the given headers but only if they don't already contain an `Accept`
 * header.
 */
var maybeAddAcceptHeader = function maybeAddAcceptHeader(headers) {
  return headers.hasOwnProperty('Accept') ? headers : _extends({}, headers, { 'Accept': 'application/json' });
};

var maybeConvertBodyToJSON = function maybeConvertBodyToJSON(action) {
  var payload = action.payload;

  if (shallConvertToJSON(payload.params)) {
    var body = JSON.stringify(payload.params.body);
    var headers = maybeAddAcceptHeader(payload.params.headers);
    var params = _extends({}, payload.params, { body: body, headers: headers });
    var result = _extends({}, action, { payload: _extends({}, payload, { params: params }) });
    return result;
  } else {
    return action;
  }
};

exports.default = fetchEncodeJSON;