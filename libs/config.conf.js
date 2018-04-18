'use strict';

module.exports = {
  host: '0.0.0.0',
  username: 'username',
  port: 22,
  remotePath: '/your/project/path',
  git: 'link-to-your-git-repository',
  agent: process.env.SSH_AUTH_SOCK,
  commands: [
    'npm install',
    'git pull origin master',
    'npm build',
  ],
};
