"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = ({
  path,
  querystring
}) => ({
  rawPath: path,
  routeKey: '$default',
  rawQueryString: querystring,
  cookies: null,
  version: '2.0'
});

exports.default = _default;