import spawnChildProcess from '../utils/spawnChildProcess';
import dbg from 'debug';
const debug = dbg('rjanko:actions:dev');

export default function() {
  debug(`Starting development server`);
  return spawnChildProcess('babel-node', ['server.js'], {}, true);
}
