# Runy

Runy is a deploy tool which allows you deploy your frontend application very easy.

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

#### Create config file
```bash
$ runy init
```

Now you have to change `runy.js` file and put there your credentials.
```
{
  ...
  user: 'username',
  host: '0.0.0.0',
  remotePath: '/your/project/path',
  ...
}
```

#### Setup remote structure
```bash
$ runy setup
```

# Usage
#### Deploy
```bash
$ runy deploy
```
