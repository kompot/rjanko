import spawnChildProcess from '../utils/spawnChildProcess';

export default function() {
  // TODO replace `b` with real project name (how?)
  spawnChildProcess('node', ['server.js'], {cwd: 'b'});
};
