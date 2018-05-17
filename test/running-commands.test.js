const { isConfigCreated, removeConfig } = require('./helpers/init');
const { getRunyConfig } = require('../libs/helpers/get-runy-config');
const { init } = require('../libs/commands/init');
const { deploy, getDeployCommands } = require('../libs/commands/deploy');
const { setup, getSetupCommands } = require('../libs/commands/setup');
const { unlock } = require('../libs/commands/unlock');
const { run } = require('../libs/helpers/run');
const { getCmdList } = require('../libs/helpers/command-list');
const confConfig = require('../libs/config.conf');

jest.mock('../libs/helpers/run', () => ({
  run: jest.fn()
}));

describe('testing of init command', () => {
  beforeAll(() => init());
  afterAll(() => removeConfig());

  test('the init command is successfully creating a config file', () => {
    expect(isConfigCreated()).toBeTruthy();
  });

  test('the runy.js is equal to the config.conf.js', () => {
    const runyConfig = getRunyConfig();
    expect(runyConfig).toEqual(confConfig);
  });
});

describe('testing of setup command', () => {
  beforeAll(() => init());
  afterAll(() => removeConfig());

  test('the getSetupCommands function return correct array', () => {
    const runyConfig = getRunyConfig();
    const cmdList = getCmdList();
    const result = [
      cmdList.PREPARE_REMOTE_PATH,
      cmdList.MOVE_TO_REMOTE_PATH,
      cmdList.CLONE_PROJECT,
    ];

    expect(Array.isArray(getSetupCommands(runyConfig))).toBe(true);
    expect(getSetupCommands(runyConfig)).toEqual(result);
  });

  test('the run function is running with correct parameters inside setup function', () => {
    const runyConfig = getRunyConfig();
    const commands = getSetupCommands(runyConfig);
    const verbose = true;

    setup({ verbose });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(runyConfig, commands, verbose);
  });
});

describe('testing of deploy command', () => {
  beforeAll(() => {
    init();
    jest.resetAllMocks();
  });
  afterAll(() => removeConfig());

  test('the getDeployCommands function return correct array', () => {
    const runyConfig = getRunyConfig();
    const cmdList = getCmdList();
    const result = [
      cmdList.IS_LOCK_FILE_EXIST,
      cmdList.CREATE_LOCK_FILE,
      cmdList.MOVE_TO_REMOTE_PATH,
      ...runyConfig.commands,
      cmdList.REMOVE_LOCK_FILE,
    ];

    expect(Array.isArray(getSetupCommands(runyConfig))).toBe(true);
    expect(getDeployCommands(runyConfig)).toEqual(result);
  });

  test('the run function is running with correct parameters inside deploy function', () => {
    const runyConfig = getRunyConfig();
    const commands = getDeployCommands(runyConfig);
    const verbose = true;

    deploy({ verbose });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(runyConfig, commands, verbose);
  });
});

describe('testing the unlock command', () => {
  beforeAll(() => {
    init();
    jest.resetAllMocks();
  });
  afterAll(() => removeConfig());

  test('the run function is running with correct parameters inside unlock function', () => {
    const runyConfig = getRunyConfig();
    const cmdList = getCmdList();
    const commands = [cmdList.REMOVE_LOCK_FILE];

    unlock();
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(runyConfig, commands);
  });
});
