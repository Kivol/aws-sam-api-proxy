"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _headers = require("./headers");

Object.keys(_headers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _headers[key];
    }
  });
});