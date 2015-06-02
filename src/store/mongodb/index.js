import mongoose from 'mongoose';
import Promise from 'bluebird';
Promise.promisifyAll(mongoose);
import {User, UserSchema} from './User';

const debug = require('../../core/logging/debug')(__filename);
const derror = require('../../core/logging/debug')(__filename, 'error');

mongoose.connect('mongodb://localhost/rjanko');

const db = mongoose.connection;
db.on('error', () => derror('Error connecting to MongoDB instance.'));
db.once('open', async () => {
  debug('Connection to MongoDB opened');

  const user = new User({
    username: 'userXX'
  });

  const saveResult = await user.saveAsync();
  debug(`user saved ${saveResult}`);

});
