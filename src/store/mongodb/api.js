import mongoose from 'mongoose';
import _ from 'lodash';
import Promise from 'bluebird';
Promise.promisifyAll(mongoose);
import express from 'express';

const debug = require('core/logging/debug')(__filename);

const expressApp = express();

const models = require('store/mongodb/viewable');

Object.keys(models).map((key) => {
  //debug(`==================`, key, models[key]);
  expressApp.get('/' + key.toLowerCase(), async (req, res, next) => {
    //console.log('___________ key===', key.toLowerCase(), models);
    res.send(await models[key][key].find().lean().execAsync());
  });
});

expressApp.get('/groups', (req, res, next) => {
  const groups = [{id: 1, name: 'wheel'}, {id: 2, name: 'хуй'}];
  const filteredGroups = req.query.search
      ? _.filter(groups, (g) => g.name.indexOf(req.query.search) !== -1)
      : groups;
  res.send(filteredGroups);
});


export default expressApp;
