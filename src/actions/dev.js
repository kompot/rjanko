import spawnChildProcess from '../utils/spawnChildProcess';

export default function() {
  spawnChildProcess('node', ['server.js']);
}
