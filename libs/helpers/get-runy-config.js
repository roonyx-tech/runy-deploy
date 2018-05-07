const config = require('../../config');
const confConfig = require('../config.conf');

const _getRunyConfig = () => require(`${process.cwd()}/${config.configName}`);

const validateRunyConfig = (runyConfig) => {
  const errors = [];

  Object.keys(confConfig)
    .sort()
    .forEach((key) => {
      const isArray = Array.isArray(confConfig[key]);
      const isString = (typeof confConfig[key]) === (typeof '');

      if (!(key in runyConfig)) {
        errors.push({
          key,
          description: `${config.configName} config doesn\`t have the ${key} key`
        });
        return 0;
      }

      if (isArray !== Array.isArray(runyConfig[key])) {
        errors.push({
          key,
          description: `key ${key} of ${config.configName} config should be an array`
        });
      } else if (isArray && runyConfig[key].length === 0) {
        errors.push({
          key,
          description: `key ${key} of ${config.configName} can\`t be an empty array`
        });
      } else if (isString && !runyConfig[key].trim()) {
        errors.push({
          key,
          description: `key ${key} of ${config.configName} can\`t be an empty string`
        });
      }
    });

  if (errors.length) {
    throw new Error(JSON.stringify({
      text: `${config.configName} is invalid`,
      errors
    }, undefined, 4));
  }
};

const getRunyConfig = () => {
  const runyConfig = _getRunyConfig();
  validateRunyConfig(runyConfig);

  return runyConfig;
};

module.exports = {
  validateRunyConfig,
  getRunyConfig
};
