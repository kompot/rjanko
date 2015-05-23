import childProcess from 'child_process';

import dbg from 'debug';
const debug = dbg('rjanko:utils:spawnChildProcess');

export default function(cmd, args, options, sync = false) {
  debug(`Will spawn child process ${cmd} ${args} ${JSON.stringify(options)} ${sync}`);
  const f = sync ? childProcess.spawnSync : childProcess.spawn;
  options.stdio = 'inherit';
  return f(cmd, args, options);
}
