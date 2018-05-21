const { getRunyConfig } = require('./get-runy-config');
const {
  lockFileName,
  releaseFolderName,
  currentFolderName,
  currentReleaseFile,
  tempFolderName,
  releaseVariable,
  maxReleaseCount,
} = require('../../config');

const getCmdList = () => {
  const { remotePath: RP, git } = getRunyConfig();

  const IS_LOCK_FILE_EXIST = `[ ! -f ${RP}/${lockFileName} ]`;
  const CREATE_LOCK_FILE = `touch ${RP}/${lockFileName}`;
  const REMOVE_LOCK_FILE = `[ -f ${RP}/${lockFileName} ] && rm -f ${RP}/${lockFileName}`;
  const CREATE_PROJECT_FODLER = `mkdir -p ${RP}`;
  const MOVE_TO_PROJECT_FOLDER = `cd ${RP}`;
  const CLONE_PROJECT = `git clone --depth=1 ${git} .`; // UPDATE
  const CREATE_RELEASES_FOLDER = `mkdir -p ${RP}/${releaseFolderName}`;
  const CREATE_CURRENT_RELEASE_FILE = `echo 0 > ${RP}/${currentReleaseFile}`;
  const CREATE_TEMP_FOLDER = `mkdir -p ${RP}/${tempFolderName}`;
  const MOVE_TO_TEMP_FOLDER = `cd ${RP}/${tempFolderName}`;
  const PUT_CURRENT_RELEASE_TO_VARIABLE = `${releaseVariable}=$(cat ${RP}/${currentReleaseFile})`;
  const INCREASE_CURRENT_RELEASE_VALIABLE = `${releaseVariable}=$(($${releaseVariable} + 1))`;
  const MOVE_TEMP_FOLDER_TO_NEW_RELEASE_FOLDER = `mv ${RP}/${tempFolderName} ${RP}/${releaseFolderName}/$(echo $${releaseVariable})`;
  const CHECK_AND_REMOVE_OLD_RELEASE = [
    [
      `([ $(($${releaseVariable} - ${maxReleaseCount})) -ge 1 ]`,
      `[ -d ${RP}/${releaseFolderName}/$(($${releaseVariable} - ${maxReleaseCount})) ]`,
      `rm -rf ${RP}/${releaseFolderName}/$(($${releaseVariable} - ${maxReleaseCount})))`
    ].join(' && '),
    'echo' // this commdan should return true
  ].join(' || ');
  const MAKE_RELEASE_SYMBOLIC_LINK = `ln -sf ${RP}/${releaseFolderName}/$(echo $${releaseVariable}) ${RP}/${currentFolderName}`;
  const UPDATE_CURRENT_RELEASE_FILE = `echo $${releaseVariable} > ${RP}/${currentReleaseFile}`;

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
  };
};

module.exports = {
  getCmdList
};
