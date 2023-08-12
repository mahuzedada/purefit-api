module.exports = {
  options: {
    user: 'ubuntu',
    port: '22',
    repo: 'git@github.com:mahuzedada/purefit-api.git',
    'pre-deploy-local': '',
    'post-deploy': 'npm run post-deploy',
  },
  appName: require('./package.json').name,
  appsDirectoryPath: '/home/ubuntu',
};
