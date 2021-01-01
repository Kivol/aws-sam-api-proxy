"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _util = require("util");

var _yamlCfn = require("yaml-cfn");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _serverlessFunctions = require("./serverlessFunctions");

var _docker = require("./docker");

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const encoding = 'utf-8';
const readFileAsync = (0, _util.promisify)(_fs.readFile);

const getEnvVars = async ({
  envVars,
  basePath
}) => {
  if (envVars === undefined) return {};

  const envVarsPath = _path.default.join(basePath, envVars);

  const envVarsString = await readFileAsync(envVarsPath, encoding);
  return JSON.parse(envVarsString);
};

const getTemplate = async ({
  basePath,
  template
}) => {
  const templatePath = _path.default.join(basePath, template);

  return readFileAsync(templatePath, encoding).then(_yamlCfn.yamlParse);
};

const getRequiredDependencies = async options => {
  const [envVars, template] = await Promise.all([getEnvVars(options), getTemplate(options)]);
  return {
    envVars,
    template
  };
};

const getDistinctDockerImages = functions => Array.from(new Set(functions.map(({
  dockerImageWithTag
}) => dockerImageWithTag)));

const parseRefOverrides = ({
  refOverrides = ''
}) => refOverrides.split(',').map(p => p.split('=')).reduce((curr, [key, value]) => ({ ...curr,
  [key]: value
}), {});

var _default = async (dockerService, options) => {
  const {
    template,
    envVars
  } = await getRequiredDependencies(options);
  const refOverrides = parseRefOverrides(options);
  const dockerServiceTasks = [];
  const {
    apiName,
    basePath,
    port,
    portIncrement,
    logLevel,
    baseImageRepo,
    skipPullImages
  } = options;
  const portOffset = port + portIncrement;
  const functions = (0, _serverlessFunctions.parseFunctionsFromTemplate)(template, envVars, portOffset, basePath, refOverrides, portIncrement, baseImageRepo);

  if (Object.keys(_loglevel.default.levels).includes(logLevel.toUpperCase())) {
    _loglevel.default.setLevel(logLevel);
  } else {
    _loglevel.default.setLevel('debug');
  }

  dockerServiceTasks.push(dockerService.removeApiContainers(apiName));

  if (!skipPullImages) {
    dockerServiceTasks.push(dockerService.pullImages(getDistinctDockerImages(functions)));
  }

  await Promise.all(dockerServiceTasks);
  const containersOptions = functions.map(f => (0, _docker.buildContainerOptions)(f, options));
  await dockerService.createContainers(containersOptions);
  (0, _server.default)(functions, port, apiName);
};

exports.default = _default;