const { removeConfig } = require('./helpers/init');
const { getRunyConfig } = require('../libs/helpers/get-runy-config');
const { run } = require('../libs/helpers/run');
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
