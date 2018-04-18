'use strict';

const fs = require('fs');
const ZENCIShell = require('./zenci-shell');

const run = (config, commands) => {
  const processingCMDS = [];
  const SSH = new ZENCIShell({
    server: {
      host: config.host,
      userName: config.username,
      port: config.port,
      agent: config.agent,
      agentForward: true,
    },
    commands,
    idleTimeOut: 360000,
    idleCommandTime: 300,
  });

  SSH.on('commandComplete', notice => {
    if (notice.status === 0) {
      console.log(`Command: ${notice.command} is successfully completed\n`);
    } else if (notice.status === 1) {
      console.log(`Command: ${notice.command} has been crushed`);
      console.log('===== Output =====\n', notice.output);
      SSH.end();
    }
  });

  SSH.on('commandProcessing', notice => {
    if (processingCMDS[processingCMDS.length - 1] !== notice.command) {
      processingCMDS.push(notice.command);
      console.log(`Command: ${notice.command} is running`);
    }

    if (notice.status === -1 && notice.output) {
      console.log(notice.output);
    }
  });

  SSH.on('error', error => {
    console.log('ERROR:', error);
    SSH.end();
  });

  SSH.connect();
};

module.exports = {
  run
};

