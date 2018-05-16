const { run } = require('../helpers/run');
const cmdList = require('../helpers/command-list');

const getSetupCommands = () => {
  return [
    cmdList.PREPARE_REMOTE_PATH,
    cmdList.MOVE_TO_REMOTE_PATH,
    cmdList.CLONE_PROJECT,
  ];
};

const setup = (argv) => {
  const runyConfig = getRunyConfig();
  const commands = getSetupCommands();

  run(runyConfig, commands, argv.verbose);
};

module.exports = {
  setup,
  getSetupCommands
};
