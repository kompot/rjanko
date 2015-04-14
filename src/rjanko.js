#!/usr/bin/env node

import 'babel/register';
import program from 'commander';
import _ from 'lodash';

program.version(require('./../package.json').version);

const commandStrings = ['create', 'dev'];
const commands = _.object(commandStrings, commandStrings);

program
  .command(`${commands.create} [name]`)
  .description('scaffold new project')
  .action((name) => {
    console.log('create project %s', name);
    require(`./actions/${commands.create}.js`)({name});
  });

program
  .command(`${commands.dev}`)
  .description('start development mode')
  .action(() => {
    console.log('Starting development mode');
    require(`./actions/${commands.dev}.js`)();
  });

program
  .command('migrate')
  .description('apply migrations');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
