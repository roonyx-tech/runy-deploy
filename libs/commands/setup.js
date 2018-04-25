const config = require('../../config');
const run = require('../helpers/run').run;
const {
  runyConfig,
  isRunyConfigExist
} = require('../helpers/getRunyConfig');

const setup = (argv) => {
  if (!isRunyConfigExist()) {
    console.error(`${config.configName} has not found`);
    return;
  }

  const remotePath = runyConfig.remotePath;
  if (!remotePath) {
    console.error('remotePath is empty');
    return;
  }

  const paths = remotePath.split('/');
  if (paths.pop() === '') paths.pop();

  const path = paths.join('/');

  run(runyConfig, [
    `mkdir -p ${path}`,
    `cd ${path}`,
    `git clone ${runyConfig.git}`,
  ], argv.verbose);
};

module.exports = {
  setup
};
