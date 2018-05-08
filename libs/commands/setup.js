const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');

const getSetupCommands = (runyConfig) => {
  const { remotePath, git } = runyConfig;

  return [
    `mkdir -p ${remotePath}`,
    `cd ${remotePath}`,
    `git clone ${git} .`,
  ];
};

const setup = (argv) => {
  const runyConfig = getRunyConfig();
  const commands = getSetupCommands(runyConfig);

  run(runyConfig, commands, argv.verbose);
};

module.exports = {
  setup,
  getSetupCommands
};
