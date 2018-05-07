const handleCommand = require('../libs/command-handler');
const { init, setup, deploy } = require('../libs/commands/index');

jest.mock('../libs/commands/index', () => ({
  init: jest.fn(),
  setup: jest.fn(),
  deploy: jest.fn()
}));

describe('testing of commands', () => {
  beforeEach(() => jest.clearAllMocks());

  test('init command is called with no parameters', () => {
    handleCommand('init');
    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toBeCalledWith();
  });

  test('setup command is called with passing an object', () => {
    const mockObj = { verbose: true };
    handleCommand('setup', mockObj);
    expect(setup).toHaveBeenCalledTimes(1);
    expect(setup).toBeCalledWith(mockObj);
  });

  test('setup command is called with a default object', () => {
    handleCommand('setup');
    expect(setup).toHaveBeenCalledTimes(1);
    expect(setup).toBeCalledWith({});
  });

  test('deploy command is called with passing an object', () => {
    const mockObj = { verbose: true };
    handleCommand('deploy', mockObj);
    expect(deploy).toHaveBeenCalledTimes(1);
    expect(deploy).toBeCalledWith(mockObj);
  });

  test('deploy command is called with a default object', () => {
    handleCommand('deploy');
    expect(deploy).toHaveBeenCalledTimes(1);
    expect(deploy).toBeCalledWith({});
  });

  test('when init command is called others command are not called', () => {
    handleCommand('init');
    expect(setup).toHaveBeenCalledTimes(0);
    expect(deploy).toHaveBeenCalledTimes(0);
  });

  test('when setup command is called others command are not called', () => {
    handleCommand('setup');
    expect(init).toHaveBeenCalledTimes(0);
    expect(deploy).toHaveBeenCalledTimes(0);
  });

  test('when deploy command is called others command are not called', () => {
    handleCommand('deploy');
    expect(init).toHaveBeenCalledTimes(0);
    expect(setup).toHaveBeenCalledTimes(0);
  });
});
