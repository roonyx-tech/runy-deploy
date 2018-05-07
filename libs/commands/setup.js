const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');

const getSetupCommands = (runyConfig) => {
  const { remotePath, git } = runyConfig;

  const paths = remotePath.split('/');
  if (paths.pop() === '') paths.pop();

  const path = paths.join('/');

  return [
    `mkdir -p ${path}`,
    `cd ${path}`,
    `git clone ${git}`,
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
