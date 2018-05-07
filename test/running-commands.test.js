const { isConfigCreated, removeConfig } = require('./helpers/init');
const { getRunyConfig } = require('../libs/helpers/get-runy-config');
const { init } = require('../libs/commands/init');
const { deploy, getDeployCommands } = require('../libs/commands/deploy');
const { setup, getSetupCommands } = require('../libs/commands/setup');
const { run } = require('../libs/helpers/run');
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
    const mockGit = 'mock-git-url';
    const result = [
      'mkdir -p end/slash',
      'cd end/slash',
      `git clone ${mockGit}`
    ];

    expect(Array.isArray(getSetupCommands(runyConfig))).toBe(true);
    expect(getSetupCommands({
      remotePath: 'end/slash/none-exists',
      git: mockGit
    })).toEqual(result);
    expect(getSetupCommands({
      remotePath: 'end/slash/exists/',
      git: mockGit
    })).toEqual(result);
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
    const mockRemotePath = 'mock-remote-path';
    const mockCommands = ['mock', 'commands'];
    const result = [
      `cd ${mockRemotePath}`,
      ...mockCommands
    ];

    expect(Array.isArray(getSetupCommands(runyConfig))).toBe(true);
    expect(getDeployCommands({
      remotePath: mockRemotePath,
      commands: mockCommands
    })).toEqual(result);
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
