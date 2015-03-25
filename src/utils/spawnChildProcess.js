import childProcess from 'child_process';

export default function(cmd, args, options) {

  const cp = childProcess.spawn(cmd, args, options);

  cp.stdout.on('data', data => console.log('stdout: ' + data));
  cp.stderr.on('data', data => console.log('stderr: ' + data));
  cp.on('close',       code => console.log('child process exited with code ' + code));

}
