#!/usr/bin/env node

// polyfill for async/await
import 'babel/polyfill';
import program from 'commander';
import colors from 'colors';
import cliColor from 'colors';
import _ from 'lodash';

program.version(require('./../package.json').version);

const commandStrings = ['create', 'dev'];
const commands = _.object(commandStrings, commandStrings);

program
    .command(`${commands.create} [name]`)
    .description('scaffold new project')
    .action(function (name, options) {
        console.log('create project %s', name);
        require(`./actions/${commands.create}.js`)({name});
    });

program
    .command(`${commands.dev}`)
    .description('start development mode')
    .action(function (options) {
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
