'use strict';

module.exports = {
  host: '0.0.0.0',
  username: 'username',
  port: 22,
  remotePath: '/your/project/path',
  git: 'git@github.com:[username]/[repository-name].git',
  agent: process.env.SSH_AUTH_SOCK,
  commands: [
    'nmp install',
    'git pull origin master',
    'ng build',
  ],
};
