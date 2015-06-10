import _ from 'lodash';
import mongoose from 'mongoose';
import Promise from 'bluebird';
Promise.promisifyAll(mongoose);
import express from 'express';

const debug = require('../../core/logging/debug')(__filename);

const expressApp = express();

const modelsRjanko = require('./viewable');
Object.keys(modelsRjanko).map(addApiForModel);
const modelsSubproject = require('subproject/src/modelsDb');
Object.keys(modelsSubproject).map(addApiForModel);

let models1 = _.merge({}, modelsRjanko)
let models = _.merge(models1, modelsSubproject);

function addApiForModel(key) {
  expressApp.get(`/${key.toLowerCase()}`, async (req, res, next) => {
    const findQuery = {};
    if (req.query.search) {
      findQuery.name = new RegExp(req.query.search, 'i');
    }
    // TODO remove groups
    res.send(await models[key][key].find(findQuery).populate('groups').lean().execAsync());
  });
  expressApp.get(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    // TODO remove groups
    res.send(await models[key][key].find({'_id': req.params.id}).populate('groups').lean().execAsync());
  });
  expressApp.put(`/${key.toLowerCase()}`, async (req, res, next) => {
    res.send(await models[key][key].createAsync(req.body));
  });
  expressApp.post(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    res.send(await models[key][key].findByIdAndUpdateAsync(req.params.id, req.body));
  });
  expressApp.delete(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    res.send(await models[key][key].findByIdAndRemoveAsync(req.params.id));
  });
}

export default expressApp;
