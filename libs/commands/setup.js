const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');
const { getCmdList } = require('../helpers/command-list');

const getSetupCommands = () => {
  const cmdList = getCmdList();

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
