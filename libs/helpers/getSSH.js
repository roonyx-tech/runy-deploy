'use strict';

const fs = require('fs');
const SSH2Shell = require('ssh2shell');

module.exports = (config, commands) => new SSH2Shell({
  server: {
    host: config.host,
    port: config.port,
    userName: config.user,
    privateKey: fs.readFileSync(config.privateKey),
  },
  commands,
  idleTimeOut: 10000,
  msg: {
    send: message => console.log(message, "\n")
  },
  onCommandComplete: function(command, response, sshObj) {
    this.emit('msg', `running: ${command}`);
    let stdout = response.split("\n");
    stdout.pop();
    stdout.shift();
    stdout = stdout.join("\n");
    if (stdout) {
      this.emit('msg', stdout);
    }
  }
});
