#!/usr/bin/env node

import 'babel/register';
import program from 'commander';
import _ from 'lodash';

program.version(require('./../package.json').version);

const commandStrings = ['create', 'dev', 'prod'];
const commands = _.object(commandStrings, commandStrings);

program
  .command(`${commands.dev}`)
  .description('start development mode')
  .action(() => {
    process.stdout.write('Starting development mode');
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
