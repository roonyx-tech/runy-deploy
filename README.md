# Runy

Runy-deploy is a deployment tool which allows you to deploy your frontend application very easily.

# Setup
#### Configure server
Your server has to have next requirements to work:
- SSH public/private key pair set up
- deploy user to have access to folders where you want to install the application
- installed git
- installed nodejs

#### Install package
```bash
$ npm install --global @roonyx/runy-deploy

OR

$ yarn global add @roonyx/runy-deploy
```
> You also can install the package locally and use it via `node_modules/.bin/runy [command]`.

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
  commands: [
    'npm install',
    'npm run build',
  ]
}
```
> For the connection to your server you should setup `ssh-agent`. Also you can add `agent` key path to `runy.js` config manualy (by default that value is `process.env.SSH_AUTH_SOCK`).

There are some default commands in `commands` array. These commands will be executed when you run the `deploy` command. You can edit these commands or add other.
> You have to put commands to that array which install dependencies and build your project.

#### Setup remote structure
The 'setup' command will create a structure of the project
```bash
$ runy setup
```
Result:
```
remotePath
│   .current.release (it's a file which will contain current valid release)
│
└───releases (it's a folder which will contain last releases)
│
```

# Usage
#### Deploy
The `deploy` command will install your project to `releases` folder and create symbolic link. Your project files will be available by this path `{remotePath}/current`
```bash
$ runy deploy
```
Example:
```
remotePath
│   .current.release (it's a file which contains current valid release)
│
└───current (it's a symbolic link of last release)
│   | ... a project structure
│
│
└───releases (it's a folder which contains last releases)
|   └───1 (it's a folder that contains your project)
│
```

----

### Additional Info
- Only one person can deploy project in the same time.
- The `releases` folder store only 3 releases. Older releases are automatically removed.
- When `deploy` command is running some `lock` file is created. It's removed after completing or failing the `deploy` command. Also if something went wrong and that file kept alive - you can remove that file using the `unlock` command - `runy unlock`.
