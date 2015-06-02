const files = ['User', 'Group'];

files.map((file) => {
  module.exports[file] = require('./' + file);
});
