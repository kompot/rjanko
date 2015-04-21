import assert from 'assert';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import axios from 'axios';

import dbg from 'debug';
const debug = dbg('rjanko:test:server');
const tmpProjectName = 'testRjankoProject1';

describe('Rjanko', function() {
  describe('server', function() {

    var devServer;

    before(function(){
      if (fs.existsSync(tmpProjectName)) {
        rimraf.sync(tmpProjectName);
      }
    });

    it('should response with HTTP 200', async function(done){
      await require('../src/actions/create')({name: tmpProjectName});
      devServer = require('../src/actions/dev')({name: tmpProjectName});
      setTimeout(function() {
        axios.get('http://127.0.0.1:5000').then(function (response) {
          assert.equal(response.status, 200);
          done();
        });
      }, 50000);
    });

    after(function() {
      devServer.kill('SIGHUP');
      rimraf.sync(tmpProjectName);
    })

  })
});
