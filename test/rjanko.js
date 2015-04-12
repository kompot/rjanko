import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';

const tmpProjectName = 'testRjankoProject';

describe('Rjanko', function() {
  describe('action', function() {

    before(function(){
      if (fs.existsSync(tmpProjectName)) {
        rimraf.sync(tmpProjectName);
      }
    });

    it('project directory should exist after creation', function(done){
      var createAction = require('../src/actions/create');
      createAction({name: tmpProjectName}).then(() => {
        assert.equal(fs.existsSync(tmpProjectName), true);
        //assert.equal(fs.existsSync(`${tmpProjectName}/package.json`), true);
        done()
      });

    });

    after(function() {
      rimraf.sync(tmpProjectName);
    })

  })
});
