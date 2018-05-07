const { init, setup, deploy } = require('./commands');

const handleCommand = (command, argv = {}) => {
  switch (command) {
    case 'init':
      init();
      break;
    case 'setup':
      setup(argv);
      break;
    case 'deploy':
      deploy(argv);
      break;
    default:
      console.info('Please, enter the valid command or use --help');
  }
};

module.exports = handleCommand;
