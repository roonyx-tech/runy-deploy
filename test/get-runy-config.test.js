const { validateRunyConfig, getRunyConfig } = require('../libs/helpers/get-runy-config');
const { init } = require('../libs/commands/init');
const { removeConfig } = require('./helpers/init');

describe('check the validateRunyConfig function', () => {
  beforeAll(() => init());
  afterAll(() => removeConfig());

  test('the validateRunyConfig function should pass', () => {
    const runyConfig = getRunyConfig();
    const anotherOne = { ...runyConfig, ...{ agent: '/some/path/to/key' } };

    expect(validateRunyConfig(runyConfig)).toBeUndefined();
    expect(validateRunyConfig(anotherOne)).toBeUndefined();
  });

  test('the validateRunyConfig function should throw an error', () => {
    const runyConfig = getRunyConfig();
    const mock1 = { ...runyConfig, ...{ host: '' } };
    const mock2 = { ...runyConfig, ...{ commands: '' } };
    const mock3 = { ...runyConfig, ...{ commands: [] } };
    const mock4 = { ...runyConfig, ...{ agent: [] } };
    const mock5 = {};

    expect(() => validateRunyConfig(mock1)).toThrow();
    expect(() => validateRunyConfig(mock2)).toThrow();
    expect(() => validateRunyConfig(mock3)).toThrow();
    expect(() => validateRunyConfig(mock4)).toThrow();
    expect(() => validateRunyConfig(mock5)).toThrow();
  });
});
