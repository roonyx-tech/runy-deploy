const config = require('../../config');
const { runyConfig, isRunyConfigExist } = require('../helpers/getRunyConfig');
const { run } = require('../helpers/run');

const deploy = (argv) => {
  if (!isRunyConfigExist()) {
    console.error(`${config.configName} has not found`);
    return;
  }

  const { remotePath } = runyConfig;
  if (!remotePath) {
    console.error('remotePath is empty');
    return;
  }

  const { commands } = runyConfig;
  if (!commands.length) {
    console.error('commands are empty');
    return;
  }

  run(runyConfig, [
    `cd ${remotePath}`,
    ...commands,
  ], argv.verbose);
};

module.exports = {
  deploy,
};
