import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));
const mkdirp = Promise.promisify(require('mkdirp'));
const recursive = Promise.promisify(require('recursive-readdir'));
import _ from 'lodash';
import spawnChildProcess from '../utils/spawnChildProcess';

import dbg from 'debug';
const debug = dbg('rjanko:actions:create');
const error = dbg('rjanko:error:actions:create');

async function dirExists(dir) {
  return await fs.statAsync(dir);
}

async function createDir(dir) {
  return await fs.mkdirAsync(dir);
}

async function createDirNested(dir) {
  return await mkdirp(dir);
}

async function readFile(f) {
  return await fs.readFileAsync(f, 'utf-8');
}

async function writeFile(f, data) {
  return await fs.writeFileAsync(f, data, 'utf-8');
}

async function readDir(dir) {
  return await recursive(dir);
}

const templatesDirName = 'node_modules/rjanko/lib/templates/';

async function templateFile(name, filename) {
  debug(`Templating ${filename}`);
  try {
    const srcFileContents = await readFile(`${templatesDirName}${filename}`);
    const dstFileName = `${name}/${filename}`;
    const dstDirName = dstFileName.substr(0, dstFileName.lastIndexOf('/'));
    await createDirNested(`${dstDirName}`);
    const compiled = _.template(srcFileContents);
    await writeFile(`${name}/${filename}`, compiled({
      rjanko: {
        name,
        version: require('./../../package.json').version
      }
    }));
  } catch (e) {
    error(`Failed to template file ${filename}`);
  }
}

async function createProjectDirOrThrowIfExists(name) {
  try {
    await dirExists(name);
    error(`Project '${name}' can not be created as directory '${name}' already exists`);
    return false;
  } catch (e) {
    if (e.code === 'ENOENT') {
      await createDir(name);
      debug(`Project '${name}' created`);
      return true;
    } else {
      error(`Unknown error while creating project`);
      return false;
    }
  }
}

async function processTemplates(name) {
  const templates = await readDir(templatesDirName);
  _.forEach(templates, t => templateFile(name, t.substr(templatesDirName.length)));
}

export default async function({name}) {
  if (await createProjectDirOrThrowIfExists(name)) {
    processTemplates(name);
    spawnChildProcess('npm', ['install'], {cwd: name});
  }
};
