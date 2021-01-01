"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (functions, {
  path,
  method
}) => functions.filter(fn => {
  if (fn.method !== 'any' && fn.method !== method.toLowerCase()) return false;
  const splittedPath = path.slice(1).split('/');
  if (fn.path.splitted.length !== splittedPath.length) return false;
  return fn.path.splitted.every(({
    isParameter,
    data
  }, i) => isParameter || data === splittedPath[i]);
});

exports.default = _default;