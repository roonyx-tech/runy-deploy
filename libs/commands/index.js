const { init } = require('./init');
const { setup } = require('./setup');
const { deploy } = require('./deploy');
const { unlock } = require('./unlock');
const { rollback } = require('./rollback');

module.exports = {
  init,
  setup,
  deploy,
  unlock,
  rollback,
};
