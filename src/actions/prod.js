import spawnChildProcess from '../utils/spawnChildProcess';

const debug = require('debug')('rjanko:actions:dev');

export default function() {
  debug(`Starting production server`);
  spawnChildProcess(
      './node_modules/.bin/webpack',
      ['--config', 'webpack.config.server.js'],
      {}
  );
  spawnChildProcess(
      './node_modules/.bin/webpack',
      ['--config', 'webpack.config.client.js'],
      {}
  );
  spawnChildProcess(
      'node',
      ['server.js'],
      {}
  );
}
