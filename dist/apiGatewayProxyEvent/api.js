"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = ({
  method,
  path
}) => ({
  path,
  httpMethod: method,
  multiValueHeaders: null,
  multiValueQueryStringParameters: null,
  resource: '/{proxy+}'
});

exports.default = _default;