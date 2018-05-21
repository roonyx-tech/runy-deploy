const { run } = require('../helpers/run');
const { getRunyConfig } = require('../helpers/get-runy-config');
const { getCmdList } = require('../helpers/command-list');

const getSetupCommands = () => {
  const cmdList = getCmdList();

  return [
    cmdList.CREATE_PROJECT_FODLER,
    cmdList.CREATE_RELEASES_FOLDER,
    cmdList.CREATE_CURRENT_RELEASE_FILE,
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
