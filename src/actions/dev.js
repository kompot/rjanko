import spawnChildProcess from '../utils/spawnChildProcess';

export default function() {
  return spawnChildProcess('babel-node', ['server.js'], {}, true);
}
