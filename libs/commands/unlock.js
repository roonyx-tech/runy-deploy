const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');
const { getCmdList } = require('../helpers/command-list');

const unlock = () => {
  const runyConfig = getRunyConfig();
  const cmdList = getCmdList();
  const commands = [cmdList.REMOVE_LOCK_FILE];

  run(runyConfig, commands);
};

module.exports = {
  unlock
};
