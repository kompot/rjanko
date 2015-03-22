#!/usr/bin/env node

// polyfill for async/await
import 'babel/polyfill';
import program from 'commander';

program.version(require('./../package.json').version);

program
    .command('create [name] [subname]')
    .description('scaffold new subproject')
    .action(function (name, subname, options) {
        console.log('create project %s subproject %s', name, subname);
        require('./actions/create.js')({name});
    });

program
    .command('migrate')
    .description('apply migrations');

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
