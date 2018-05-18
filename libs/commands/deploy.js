const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');
const { getCmdList } = require('../helpers/command-list');

const getDeployCommands = (runyConfig) => {
  const { commands } = runyConfig;
  const cmdList = getCmdList();

  return [
    cmdList.IS_LOCK_FILE_EXIST,
    cmdList.CREATE_LOCK_FILE,
    cmdList.CREATE_TEMP_FOLDER,
    cmdList.MOVE_TO_TEMP_FOLDER,
    cmdList.CLONE_PROJECT,
    ...commands,
    cmdList.PUT_CURRENT_RELEASE_TO_VARIABLE,
    cmdList.INCREASE_CURRENT_RELEASE_VALIABLE,
    cmdList.MOVE_TO_PROJECT_FOLDER,
    cmdList.MOVE_TEMP_FOLDER_TO_NEW_RELEASE_FOLDER,
    cmdList.CHECK_AND_REMOVE_OLD_RELEASE,
    cmdList.MAKE_RELEASE_SYMBOLIC_LINK,
    cmdList.UPDATE_CURRENT_RELEASE_FILE,
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
