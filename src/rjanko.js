#!/usr/bin/env node

import 'babel/register';
import program from 'commander';
import _ from 'lodash';

program.version(require('./../package.json').version);

const commandStrings = ['create', 'dev', 'prod'];
const commands = _.object(commandStrings, commandStrings);

program
  .command(`${commands.create} [name]`)
  .description('scaffold new project')
  .action((name) => {
    process.stdout.write('create project %s', name);
    require(`./actions/${commands.create}.js`)({name});
  });

program
  .command(`${commands.init}`)
  .description('scaffold new project in current directory')
  .action(() => {
    process.stdout.write('init project');
    require(`./actions/${commands.init}.js`)();
  });

program
  .command(`${commands.dev}`)
  .description('start development mode')
  .action(() => {
    process.stdout.write('Starting development mode1');
    require(`./actions/${commands.dev}.js`)();
  });

program
  .command(`${commands.prod}`)
  .description('start production mode')
  .action(() => {
    process.stdout.write('Starting production mode');
    require(`./actions/${commands.prod}.js`)();
  });

program
  .command('migrate')
  .description('apply migrations');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
