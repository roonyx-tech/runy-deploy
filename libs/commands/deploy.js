const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');

const getDeployCommands = (runyConfig) => {
  const { remotePath, commands } = runyConfig;
  return [
    `cd ${remotePath}`,
    ...commands,
  ];
};

const deploy = (argv) => {
  const runyConfig = getRunyConfig();
  const commands = getDeployCommands(runyConfig);

  run(runyConfig, commands, argv.verbose);
};

module.exports = {
  deploy,
  getDeployCommands
};
