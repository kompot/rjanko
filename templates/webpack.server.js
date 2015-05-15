var fs = require('fs');
var webpack = require('webpack');
var nodemon = require('nodemon');
var backendConfig = require('./webpack.config.server');


//nodemon.restart();

webpack(backendConfig).watch(100, function(err, stats) {
  console.log('___________ will restart');
  nodemon.restart();
});

setTimeout(function() {
  console.log('__timeout');
  nodemon({
    "execMap": {
      "js": "node"
    },
    "script": "server.js",
    //"ignore": ["*"],
    //"watch": ["nothing/"],
    "watch": ["server.js"],
    //"ext": "noop"
  }).on('restart', function() {
    console.log('Patched!');
    setTimeout(function() {
      removeHotUpdateChunks();
    }, 3000);
  });
}, 3000);

const recordsInfoFile = './_records.server.json';

function removeHotUpdateChunks() {
  var hash = JSON.parse(fs.readFileSync(recordsInfoFile));

  Object.keys(hash.chunkModuleIds).map(function(moduleId) {
    fs.unlinkSync(moduleId + '.' + hash.prepreHash + '.hot-update.js');
    fs.unlinkSync(moduleId + '.' + hash.prepreHash + '.hot-update.js.map');
    fs.unlinkSync(hash.prepreHash + '.hot-update.json');
  })
}
