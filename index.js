#!/usr/bin/env node

const yargs = require('yargs');
const aliases = require('./libs/aliases');
const handleCommand = require('./libs/command-handler');

yargs
  .command('init', 'Create config file')
  .command('setup', 'Create project structure', {
    verbose: aliases.verbose
  })
  .command('deploy', 'Deploy project to remote server', {
    verbose: aliases.verbose
  })
  .command('rollback', 'Remove the lock file')
  .help();

const argv = yargs.argv;
const command = argv._[0];

handleCommand(command, argv);
