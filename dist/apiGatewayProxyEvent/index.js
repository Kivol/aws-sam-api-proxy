"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _querystring = _interopRequireDefault(require("querystring"));

var _api = _interopRequireDefault(require("./api"));

var _httpApiVersion1_ = _interopRequireDefault(require("./httpApiVersion1_0"));

var _httpApiVersion2_ = _interopRequireDefault(require("./httpApiVersion2_0"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */
const buildPathParameters = (fnPath, path) => path.slice(1).split('/').reduce((result, current, i) => {
  if (fnPath.splitted[i].isParameter) {
    const key = fnPath.splitted[i].data; // eslint-disable-next-line no-param-reassign

    result[key] = current;
  }

  return result;
}, {});

const getEventBuildStrategy = ({
  type,
  payloadFormatVersion
}) => {
  if (type.toLowerCase() === 'api') return _api.default;
  return payloadFormatVersion === '1.0' ? _httpApiVersion1_.default : _httpApiVersion2_.default;
};

var _default = ({
  path: fnPath,
  event
}, {
  headers,
  path,
  method,
  body,
  querystring
}) => {
  const pathParameters = buildPathParameters(fnPath, path);

  const queryStringParameters = _querystring.default.parse(querystring);

  const common = {
    body,
    headers,
    pathParameters,
    queryStringParameters,
    isBase64Encoded: false,
    stageVariables: null,
    requestContext: null
  };
  const eventBuildStrategy = getEventBuildStrategy(event);
  const specific = eventBuildStrategy({
    path,
    method,
    querystring
  });
  return { ...common,
    ...specific
  };
};

exports.default = _default;