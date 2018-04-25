const config = require('../../config');
const run = require('../helpers/run').run;
const {
  runyConfig,
  isRunyConfigExist
} = require('../helpers/getRunyConfig');

const deploy = (argv) => {
  if (!isRunyConfigExist()) {
    console.error(`${config.configName} has not found`);
    return;
  }

  const remotePath = runyConfig.remotePath;
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
  deploy
};
