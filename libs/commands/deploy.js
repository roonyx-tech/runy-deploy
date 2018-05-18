const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');
const { getCmdList } = require('../helpers/command-list');

const getDeployCommands = (runyConfig) => {
  const { commands } = runyConfig;
  const cmdList = getCmdList();

  return [
    cmdList.IS_LOCK_FILE_EXIST,
    cmdList.CREATE_LOCK_FILE,
    cmdList.MOVE_TO_REMOTE_PATH,
    ...commands,
    cmdList.REMOVE_LOCK_FILE,
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
