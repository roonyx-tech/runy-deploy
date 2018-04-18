'use strict';

module.exports = {
  username: 'username',
  host: '0.0.0.0',
  port: 22,
  remotePath: '/your/project/path',
  git: 'git@github.com:[username]/[repository-name].git',
  agent: process.env.SSH_AUTH_SOCK,
};
