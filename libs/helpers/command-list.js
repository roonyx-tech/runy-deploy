const { lockFileName } = require('../../config');
const { getRunyConfig } = require('./get-runy-config');

const getCmdList = () => {
  const { remotePath, git } = getRunyConfig();
  const IS_LOCK_FILE_EXIST = `[ ! -f ${remotePath}/${lockFileName} ]`;
  const CREATE_LOCK_FILE = `touch ${remotePath}/${lockFileName}`;
  const REMOVE_LOCK_FILE = `[ -f ${remotePath}/${lockFileName} ] && rm -f ${remotePath}/${lockFileName}`;
  const PREPARE_REMOTE_PATH = `mkdir -p ${remotePath}`;
  const MOVE_TO_REMOTE_PATH = `cd ${remotePath}`;
  const CLONE_PROJECT = `git clone ${git} .`;

  return {
    IS_LOCK_FILE_EXIST,
    CREATE_LOCK_FILE,
    REMOVE_LOCK_FILE,
    PREPARE_REMOTE_PATH,
    MOVE_TO_REMOTE_PATH,
    CLONE_PROJECT,
  };
};

module.exports = {
  getCmdList
};
