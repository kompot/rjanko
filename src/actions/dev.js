import spawnChildProcess from '../utils/spawnChildProcess';
import dbg from 'debug';
const debug = dbg('rjanko:actions:dev');

export default function({name}) {
  debug(`Starting development server`);
  return spawnChildProcess(
      'forego',
      ['start'],
      {cwd: name}
  );
}
