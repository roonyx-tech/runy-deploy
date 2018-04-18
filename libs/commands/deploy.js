'use strict';

const config = require('../../config');
const { runyConfig, isRunyConfigExist } = require('../helpers/getRunyConfig');
const { run } = require('../helpers/run');

const deploy = () => {
  if (!isRunyConfigExist()) {
    console.log(`${config.configName} has not found`);
    return;
  }

  const remotePath = runyConfig.remotePath;
  if (!remotePath) {
    console.log('remotePath is empty');
    return;
  }

  const commands = runyConfig.commands;
  if (!commands.length) {
    console.log('commands are empty');
    return;
  }

  run(runyConfig, [
    `cd ${remotePath}`,
    ...commands,
  ]);
};

module.exports = {
  deploy
};
