import debug from 'debug';
import _ from 'lodash';

if (process.env.NODE_ENV !== 'production') {
  debug.enable('rjanko:*');
}

export default function (filename) {
  const splt = filename.split('/');
  const index = _.findIndex(splt, (elem) => elem === 'src');
  if (index === -1) {
    throw new Error(`Using debug outside of src directory is not allowed.
                     Used in ${filename}`);
  }
  return debug('rjanko:' + splt.slice(index + 1).join(':'));
}
