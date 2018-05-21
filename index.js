#!/usr/bin/env node

const yargs = require('yargs');
const handleCommand = require('./libs/command-handler');

yargs
  .command('init', 'Create config file')
  .command('setup', 'Create project structure')
  .command('deploy', 'Deploy project to remote server')
  .command('unlock', 'Remove the lock file')
  .command('rollback', 'Do a rollback to previous release')
  .help();

const argv = yargs.argv;
const command = argv._[0];

handleCommand(command, argv);
