const fs = require('fs');
const config = require('../../config');

const configPath = `${process.cwd()}/${config.configName}`;

const isConfigCreated = () => fs.existsSync(configPath);
const removeConfig = () => fs.unlinkSync(configPath);

module.exports = {
  isConfigCreated,
  removeConfig
};
