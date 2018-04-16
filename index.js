'use strict';

const { init, setup, deploy } = require('./libs/commands');
const aliases = require('./libs/aliases');
const yargs = require('yargs');

yargs
  .command('init', 'Create config file')
  .command('setup', 'Create project structure', {
    verbose: aliases.verbose
  })
  .command('deploy', 'Deploy project to remote server', {
    verbose: aliases.verbose
  })
  .help();

const argv = yargs.argv;
const command = argv._[0];

switch (command) {
  case 'init':
    init();
    break;
  case 'setup':
    setup();
    break;
  case 'deploy':
    deploy();
    break;
  default:
    console.log('default');
}
