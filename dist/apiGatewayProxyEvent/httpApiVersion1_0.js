"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = ({
  path,
  method
}) => ({
  path,
  httpMethod: method,
  multiValueHeaders: null,
  multiValueQueryStringParameters: null,
  resource: '/{proxy+}',
  version: '1.0'
});

exports.default = _default;