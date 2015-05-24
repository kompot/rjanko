import spawnChildProcess from '../utils/spawnChildProcess';
const debug = require('../core/logging/debug')(__filename);

export default function() {
  debug(`Starting development server`);
  spawnChildProcess(
      './node_modules/.bin/webpack',
      ['--watch', '--config', 'webpack.config.server.js'],
      {}
  );
  spawnChildProcess(
      './node_modules/.bin/nodemon',
      ['server.js'],
      {}
  );
  spawnChildProcess(
      './node_modules/.bin/babel-node',
      ['./node_modules/rjanko/src/core/server.webpack.js'],
      {}
  );
}
