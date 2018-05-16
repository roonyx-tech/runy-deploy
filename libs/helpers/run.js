const ZENCIShell = require('./zenci-shell');
const cmdList = require('./command-list');

const runNextCmd = (SSH, commands) => {
  const cmd = commands.shift();
  if (!cmd || !('exec' in SSH)) {
    return false;
  }

  console.info(`Command: ${cmd} is running`);
  return SSH.exec(cmd);
}

const run = (config, commands, verbose = false) => {
  const SSH = new ZENCIShell({
    server: {
      host: config.host,
      userName: config.username,
      port: config.port,
      agent: config.agent,
      agentForward: true,
      keep_alive: true,
    },
    commands: [],
    idleTimeOut: 360000,
    idleCommandTimeOut: 5000,
  });

  const lockCmds = [
    cmdList.IS_LOCK_FILE_EXIST,
    cmdList.CREATE_LOCK_FILE,
    cmdList.REMOVE_LOCK_FILE,
  ];

  SSH.on('ready', () => {
    runNextCmd(SSH, commands);
  });

  SSH.on('commandComplete', (notice) => {
    if (notice.status === 0) {
      console.info(`Command: ${notice.command} is successfully completed\n`);
      runNextCmd(SSH, commands);
    } else {
      console.error(`Command: ${notice.command} hasn\`t passed\n`);
      console.error('Output:', `${notice.output}`);
      console.error('The commands have been stopped performing as one of them have not passed!\n');
      commands = [];

      if (!lockCmds.includes(notice.command)) {
        runNextCmd(SSH, [cmdList.REMOVE_LOCK_FILE]);
      }
    }
  });

  SSH.on('commandProcessing', (notice) => {
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
  runNextCmd
};
