'use strict';

const config = require(`${__dirname}/../../config`);
const { runyConfig, isRunyConfigExist } = require(`${__dirname}/../helpers/getRunyConfig`);
const SSH = require(`${__dirname}/../helpers/getSSH`);

const setup = () => {
  if (!isRunyConfigExist()) {
    console.log(`${config.configName} has not found`);
    return;
  }

  const remotePath = runyConfig.remotePath;
  if (!remotePath) {
    console.log('remotePath is empty');
    return;
  }

  const paths = remotePath.split('/');
  if (paths.pop() === '') paths.pop();

  const path = paths.join('/');

  const ssh = SSH(runyConfig, [
    `mkdir -p ${path}`,
    `cd ${path}`,
    `git clone ${runyConfig.gitSSH}`
  ]);

  ssh.connect();
};

module.exports = {
  setup
};
