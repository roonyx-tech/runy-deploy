'use strict';

const fs = require('fs');
const config = require(`${__dirname}/../../config`);

const init = () => {
  fs.copyFile(`${__dirname}/../config.conf.js`, `${process.cwd()}/${config.configName}`, err => {
    if (err) throw err;
    console.log(`${config.configName} was successfully created`);
  });
};

module.exports = {
  init
};
