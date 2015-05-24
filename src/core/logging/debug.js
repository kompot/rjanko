import debug from 'debug';
import _ from 'lodash';

if (process.env.NODE_ENV !== 'production') {
  debug.enable('rjanko:*');
}

export default function(filename, prefix = '') {
  const splt = filename.split('/');
  // TODO describe strategy somewhere? or just accept everything?
  const index = _.findIndex(splt, (elem) => elem === 'src' || elem === 'lib');
  if (index === -1) {
    throw new Error(`Using debug outside of 'src' or 'lib' directories is not allowed.
                     Used in ${filename}`);
  }
  const noSrc = splt.slice(index + 1);
  const arr = prefix
      ? [prefix].concat(noSrc)
      : noSrc;
  return debug('rjanko:' + arr.join(':'));
}
