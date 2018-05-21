const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');
const { getCmdList } = require('../helpers/command-list');

const getRollbackCommands = () => {
  const cmdList = getCmdList();

  return [
    cmdList.PUT_CURRENT_RELEASE_TO_VARIABLE,
    cmdList.DECREASE_CURRENT_RELEASE_VALIABLE,
    cmdList.REMOVE_RELEASE_SYMBOLIC_LINK,
    cmdList.MAKE_RELEASE_SYMBOLIC_LINK,
    cmdList.UPDATE_CURRENT_RELEASE_FILE,
    cmdList.INCREASE_CURRENT_RELEASE_VALIABLE,
    cmdList.REMOVE_RELEASE_BY_VAR,
  ];
};

const rollback = () => {
  const runyConfig = getRunyConfig();
  const commands = getRollbackCommands();

  run(runyConfig, commands);
};

module.exports = {
  rollback,
  getRollbackCommands,
};
