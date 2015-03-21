import Promise from 'bluebird';
const fs = Promise.promisifyAll(require('fs'));

import dbg from 'debug';
const debug = dbg('rjanko:actions:create');
const error = dbg('rjanko:error:actions:create');

async function dirExists(dir) {
  return await fs.statAsync(dir);
}

async function createDir(dir) {
  return await fs.mkdirAsync(dir);
}

export default async function(projectName) {
  try {
    await dirExists(projectName);
    error(`Project ${projectName} can not be created as directory ${projectName} already exists`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      await createDir(projectName);
      debug(`Project ${projectName} created`);
    } else {
      error(`Unknown error while creating project`);
    }
  }
};
