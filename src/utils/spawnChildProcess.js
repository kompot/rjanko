import childProcess from 'child_process';

const debug = require('../core/logging/debug')(__filename);

export default function(cmd, args, options, sync = false) {
  debug(`Will spawn child process ${cmd} ${args} ${JSON.stringify(options)} ${sync}`);
  const f = sync ? childProcess.spawnSync : childProcess.spawn;
  options.stdio = 'inherit';
  return f(cmd, args, options);
}
