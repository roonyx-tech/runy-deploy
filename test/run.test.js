const { removeConfig } = require('./helpers/init');
const { getRunyConfig } = require('../libs/helpers/get-runy-config');
const { run, runNextCmd } = require('../libs/helpers/run');
const { init } = require('../libs/commands/init');

const mockOn = jest.fn();
const mockConnect = jest.fn();

jest.mock('../libs/helpers/zenci-shell', () => (
  jest.fn().mockImplementation(() => ({
    on: mockOn,
    connect: mockConnect
  }))
));

describe('testing that ZENCIShell methods are calling', () => {
  beforeAll(() => init());
  afterAll(() => removeConfig());

  test('when the run command is running - ZENCIShell`s methods are calling', () => {
    const runyConfig = getRunyConfig();
    const mockCommands = ['ls -l', 'pwd'];
    const verbose = true;

    run(runyConfig, mockCommands, verbose);
    expect(mockOn).toHaveBeenCalled();
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
});

describe('testing the runNextCmd function', () => {
  const mockSSH = {
    exec: cmd => !!cmd
  };

  beforeAll(() => init());
  afterAll(() => removeConfig());

  test('the runNextCmd function should return true', () => {
    const mockCommands = ['ls -l', 'pwd'];

    expect(runNextCmd(mockSSH, mockCommands)).toBeTruthy();
    expect(runNextCmd(mockSSH, mockCommands)).toBeTruthy();
  });

  test('the runNextCmd function should return false', () => {
    const mockCommands = ['ls -l', 'pwd'];
    const mockCommands2 = ['ls -l', 'pwd'];
    const mockSSH2 = {};

    runNextCmd(mockSSH, mockCommands);
    runNextCmd(mockSSH, mockCommands);

    expect(runNextCmd(mockSSH, mockCommands)).toBeFalsy();
    expect(runNextCmd(mockSSH2, mockCommands2)).toBeFalsy();
  });
});
