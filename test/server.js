import assert from 'assert';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import axios from 'axios';

const tmpProjectName = 'testRjankoProject';

describe('Rjanko', function() {
  describe('server', function() {

    before(function(){
      if (fs.existsSync(tmpProjectName)) {
        rimraf.sync(tmpProjectName);
      }
    });

    it('should response with HTTP 200', async function(done){
      await require('../src/actions/create')({name: tmpProjectName});
      require('../src/actions/dev')({name: tmpProjectName});
      setTimeout(async function() {
        const response = await axios.get('http://127.0.0.1:3000');
        assert.equal(response.status, 200);
        done();
      }, 1000);
    });

    after(function() {
      rimraf.sync(tmpProjectName);
    })

  })
});
