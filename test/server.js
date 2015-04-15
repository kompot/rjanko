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

    it('should response with HTTP 200', async function(){
      await require('../src/actions/create')({name: tmpProjectName});
      require('../src/actions/dev')();
      const response = await axios.get('http://127.0.0.1:3000');
      assert.equal(response.status, 200);
    });

    after(function() {
      rimraf.sync(tmpProjectName);
    })

  })
});
