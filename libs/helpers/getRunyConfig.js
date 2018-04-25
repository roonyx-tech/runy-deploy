const config = require('../../config');
const fs = require('fs');

const runyConfigPath = `${process.cwd()}/${config.configName}`;
const isRunyConfigExist = () => fs.existsSync(runyConfigPath);

module.exports = {
  isRunyConfigExist,
  runyConfig: (() => (
    isRunyConfigExist() ? require(runyConfigPath) : {}
  ))(),
};
