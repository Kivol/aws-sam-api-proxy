"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash.snakecase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = ({
  name,
  environment,
  containerPort,
  handler,
  memorySize,
  timeout,
  dockerImageWithTag,
  distPath
}, {
  apiName,
  dockerNetwork
}) => ({
  Image: dockerImageWithTag,
  name: `${(0, _lodash.default)(name)}_lambda`,
  Cmd: [handler],
  Env: [`AWS_LAMBDA_FUNCTION_MEMORY_SIZE=${memorySize}`, `AWS_LAMBDA_FUNCTION_TIMEOUT=${timeout}`, 'DOCKER_LAMBDA_WATCH=1', 'DOCKER_LAMBDA_STAY_OPEN=1', ...Object.entries(environment).map(([key, value]) => `${key}=${value}`)],
  Labels: {
    'aws-sam-api-proxy.api': apiName
  },
  ExposedPorts: {
    '9001/tcp': {}
  },
  Volumes: {
    '/var/task': {}
  },
  HostConfig: {
    Binds: [`${distPath}:/var/task:ro,delegated`],
    PortBindings: {
      '9001/tcp': [{
        HostPort: `${containerPort}`
      }]
    },
    ...(dockerNetwork !== undefined ? {
      NetworkMode: dockerNetwork
    } : {})
  }
});

exports.default = _default;