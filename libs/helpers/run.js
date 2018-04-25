const ZENCIShell = require('./zenci-shell');

const run = (config, commands, verbose = false) => {
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

  SSH.on('commandComplete', (notice) => {
    if (notice.status === 0) {
      console.info(`Command: ${notice.command} is successfully completed\n`);
    } else if (notice.status === 1) {
      console.error(`Command: ${notice.command} has been crushed`);
      console.error('===== Output =====\n', notice.output);
      SSH.end();
    }
  });

  SSH.on('commandProcessing', (notice) => {
    if (processingCMDS[processingCMDS.length - 1] !== notice.command) {
      processingCMDS.push(notice.command);
      console.info(`Command: ${notice.command} is running`);
    }

    if (verbose && notice.status === -1 && notice.output) {
      console.info(notice.output);
    }
  });

  SSH.on('error', (error) => {
    console.error('ERROR:', error);
    SSH.end();
  });

  SSH.connect();
};

module.exports = {
  run,
};

