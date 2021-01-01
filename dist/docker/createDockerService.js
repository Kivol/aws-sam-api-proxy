"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loglevel = _interopRequireDefault(require("loglevel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LABEL_KEY = 'aws-sam-api-proxy.api';

var _default = docker => {
  const removeContainers = async label => {
    const containersData = await docker.listContainers({
      all: true,
      filters: {
        label: [label]
      }
    });

    _loglevel.default.info(`Found ${containersData.length} containers, removing...`);

    const containers = await Promise.all(containersData.map(({
      Id
    }) => docker.getContainer(Id)));
    return Promise.all(containers.map(container => container.remove({
      force: true
    })));
  };

  return {
    validateDockerStatus: async () => {
      const dockerStatus = await docker.ping();

      if (dockerStatus.toString() !== 'OK') {
        throw new Error('Docker must be running');
      }
    },
    removeAllContainers: async () => removeContainers(LABEL_KEY),
    removeApiContainers: async apiName => removeContainers(`${LABEL_KEY}=${apiName}`),
    pullImages: async images => {
      _loglevel.default.info('Pulling required docker images, this might take a while...', images);

      const promises = images.map(image => new Promise((resolve, reject) => {
        docker.pull(image, (pullErr, stream) => {
          if (pullErr) return reject(pullErr);

          const onFinished = (err, output) => {
            // eslint-disable-next-line no-unused-expressions
            err ? reject(err) : resolve(output);
          };

          const onProgress = event => {
            _loglevel.default.info(event.status);
          };

          return docker.modem.followProgress(stream, onFinished, onProgress);
        });
      }));
      await Promise.all(promises);

      _loglevel.default.info('All required docker images have been pulled successfully.');
    },
    createContainers: async containersOptions => {
      const promises = containersOptions.map(async containerOptions => {
        const container = await docker.createContainer(containerOptions);

        _loglevel.default.info('Starting container', {
          id: container.id,
          name: containerOptions.name
        });

        await container.start();
        return container.id;
      });
      return Promise.all(promises);
    }
  };
};

exports.default = _default;