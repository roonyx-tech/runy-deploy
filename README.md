# Runy

Runy is a deploy tool which allows you to deploy your frontend application very easily.

# Setup
#### Configure server
Your server has to have next requirements to work:
- SSH public/private key pair set up
- deploy user to have access to folders where you want to install the application
- installed git
- installed nodejs

#### Install package
```bash
$ npm install --global @roonyx-tech/runy-deploy

OR

$ yarn global add @roonyx-tech/runy-deploy
```
> You also can install the package locally and use it via `node_modules/.bin/runy [command]`

#### Create config file
The `init` command will create the `runy.js` config
```bash
$ runy init
```

Now you have to change `runy.js` file and put there your credentials.
```
{
  host: '0.0.0.0',
  username: 'username',
  port: 22,
  remotePath: '/your/project/path',
  git: 'link-to-your-git-repository',
  agent: process.env.SSH_AUTH_SOCK,
  commands: [
  'git pull origin master',
  'npm install',
  'npm build',
  ]
}
```
> For the connection to your server you should setup `ssh-agent`

There are some default commands in commands array. These commands will be executed when you run the `deploy` command. You can edit these commands or add other.

#### Setup remote structure
The `setup` command will create folders based on your `remotePath` from `runy.js` config. And clone a git repository.
```bash
$ runy setup
```

# Usage
#### Deploy
The `deploy` command will go to your project folder and execute list of commands from `runy.js` config.
```bash
$ runy deploy
```
