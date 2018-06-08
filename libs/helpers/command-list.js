const { getRunyConfig } = require('./get-runy-config');
const {
  lockFileName,
  releaseFolderName,
  symbolicName,
  currentReleaseFile,
  tempFolderName,
  releaseVariable,
  maxReleaseCount,
} = require('../../config');

const getCmdList = () => {
  const { remotePath: RP, git } = getRunyConfig();
  const pLockF = `${RP}/${lockFileName}`;
  const pReleaseD = `${RP}/${releaseFolderName}`;
  const pReleaseF = `${RP}/${currentReleaseFile}`;
  const pTempD = `${RP}/${tempFolderName}`;
  const pSymbolicF = `${RP}/${symbolicName}`;

  const IS_LOCK_FILE_EXIST = `[ ! -f ${pLockF} ]`;
  const CREATE_LOCK_FILE = `touch ${pLockF}`;
  const REMOVE_LOCK_FILE = `[ -f ${pLockF} ] && rm -f ${pLockF}`;
  const CREATE_PROJECT_FODLER = `mkdir -p ${RP}`;
  const MOVE_TO_PROJECT_FOLDER = `cd ${RP}`;
  const CLONE_PROJECT = `git clone --depth=1 ${git} .`; // UPDATE
  const CREATE_RELEASES_FOLDER = `mkdir -p ${pReleaseD}`;
  const CREATE_CURRENT_RELEASE_FILE = `echo 0 > ${pReleaseF}`;
  const CREATE_TEMP_FOLDER = `mkdir -p ${pTempD}`;
  const REMOVE_TEMP_FOLDER = `([ $(echo $(pwd)) != / ] && [ -d ${pTempD} ] && rm -rf ${pTempD}) || echo`; // this command has to return true for any cases
  const MOVE_TO_TEMP_FOLDER = `cd ${pTempD}`;
  const PUT_CURRENT_RELEASE_TO_VARIABLE = `${releaseVariable}=$(cat ${pReleaseF})`;
  const INCREASE_CURRENT_RELEASE_VALIABLE = `${releaseVariable}=$(($${releaseVariable} + 1))`;
  const DECREASE_CURRENT_RELEASE_VALIABLE = `${releaseVariable}=$(($${releaseVariable} - 1))`;
  const UPDATE_CURRENT_RELEASE_FILE = `echo $${releaseVariable} > ${pReleaseF}`;
  const MAKE_RELEASE_SYMBOLIC_LINK = `ln -s ${pReleaseD}/$(echo $${releaseVariable}) ${pSymbolicF}`;
  const REMOVE_RELEASE_SYMBOLIC_LINK = `rm -f ${pSymbolicF}`;
  const MOVE_TEMP_FOLDER_TO_NEW_RELEASE_FOLDER = `mv ${pTempD} ${pReleaseD}/$(echo $${releaseVariable})`;
  const CHECK_AND_REMOVE_OLD_RELEASE = [
    [
      `([ $(echo $${releaseVariable}) ]`,
      `[ $(($${releaseVariable} - ${maxReleaseCount})) -ge 1 ]`,
      `[ -d ${pReleaseD}/$(($${releaseVariable} - ${maxReleaseCount})) ]`,
      `rm -rf ${pReleaseD}/$(($${releaseVariable} - ${maxReleaseCount})))`
    ].join(' && '),
    'echo' // this command has to return true for any cases
  ].join(' || ');
  const REMOVE_RELEASE_BY_VAR = [
    `[ $(echo $${releaseVariable}) ]`,
    `[ -d ${pReleaseD}/$(echo $${releaseVariable}) ]`,
    `rm -rf ${pReleaseD}/$(echo $${releaseVariable})`,
  ].join(' && ');

  return {
    IS_LOCK_FILE_EXIST,
    CREATE_LOCK_FILE,
    REMOVE_LOCK_FILE,
    CREATE_PROJECT_FODLER,
    MOVE_TO_PROJECT_FOLDER,
    CLONE_PROJECT,
    CREATE_RELEASES_FOLDER,
    CREATE_CURRENT_RELEASE_FILE,
    CREATE_TEMP_FOLDER,
    MOVE_TO_TEMP_FOLDER,
    PUT_CURRENT_RELEASE_TO_VARIABLE,
    INCREASE_CURRENT_RELEASE_VALIABLE,
    MOVE_TEMP_FOLDER_TO_NEW_RELEASE_FOLDER,
    CHECK_AND_REMOVE_OLD_RELEASE,
    MAKE_RELEASE_SYMBOLIC_LINK,
    UPDATE_CURRENT_RELEASE_FILE,
    DECREASE_CURRENT_RELEASE_VALIABLE,
    REMOVE_RELEASE_SYMBOLIC_LINK,
    REMOVE_RELEASE_BY_VAR,
    REMOVE_TEMP_FOLDER,
  };
};

module.exports = {
  getCmdList
};
