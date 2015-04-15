import childProcess from 'child_process';

import dbg from 'debug';
const debug = dbg('rjanko:utils:spawnChildProcess');


export default function(cmd, args, options, sync = false) {

  debug(`Will spawn child process ${cmd} ${args} ${JSON.stringify(options)} ${sync}`);

  const f = sync ? childProcess.spawnSync  : childProcess.spawn;
  const cp = f(cmd, args, options);

  if (cp.stdout.on) {
    cp.stdout.on('data', data => console.log('stdout: ' + data));
  }
  if (cp.stderr.on) {
    cp.stderr.on('data', data => console.log('stderr: ' + data));
  }
  if (cp.on) {
    cp.on('close', code => console.log('child process exited with code ' + code));
  }

  return cp;

}
