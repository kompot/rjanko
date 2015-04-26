import assert from 'assert';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const tmpProjectName = 'testRjankoProject';

describe('Rjanko', function() {
  describe('action', function() {

    before(function(){
      if (fs.existsSync(tmpProjectName)) {
        rimraf.sync(tmpProjectName);
      }
    });

    it('project directory should exist after creation', async function(){
      var createAction = require('../src/actions/create');
      await createAction({name: tmpProjectName});
      assert.equal(fs.existsSync(tmpProjectName), true);
      assert.equal(fs.existsSync(path.join(tmpProjectName, 'package.json')), true);
    });

    after(function() {
      rimraf.sync(tmpProjectName);
    })

  })
});
