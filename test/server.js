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
      debug(`____________1`);
      await require('../src/actions/create')({name: tmpProjectName});
      debug(`____________2`);
      devServer = require('../src/actions/dev')({name: tmpProjectName});
      debug(`____________3`);
      setTimeout(function() {
        debug(`____________4`);
        axios.get('http://127.0.0.1:5000').then(function (response) {
          debug(`____________5`);
          assert.equal(response.status, 200);
          done();
        });
      }, 180000);
      debug(`____________6`);
    });

    after(function() {
      debug(`____________7`);
      devServer.kill('SIGHUP');
      rimraf.sync(tmpProjectName);
    })

  })
});
