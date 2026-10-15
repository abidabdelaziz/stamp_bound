const path = require('node:path');
const ghpages = require('gh-pages');

ghpages.publish(
  path.resolve(__dirname, '../dist'),
  {
    nojekyll: true,
    beforeAdd: (git) =>
      git.exec('add', '-f', '--', 'assets/node_modules/@expo-google-fonts/material-symbols'),
  },
  (error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
      return;
    }
    console.log('Published');
  },
);
