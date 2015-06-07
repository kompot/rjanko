import mongoose from 'mongoose';
import Promise from 'bluebird';
Promise.promisifyAll(mongoose);
import express from 'express';

const debug = require('core/logging/debug')(__filename);

const expressApp = express();

const models = require('store/mongodb/viewable');

Object.keys(models).map((key) => {
  expressApp.get(`/${key.toLowerCase()}`, async (req, res, next) => {
    const findQuery = {};
    if (req.query.search) {
      findQuery.name = new RegExp(req.query.search, 'i');
    }
    res.send(await models[key][key].find(findQuery).lean().execAsync());
  });
  expressApp.get(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    await Promise.delay(500);
    res.send(await models[key][key].find({'_id': req.params.id}).lean().execAsync());
  });
  expressApp.post(`/${key.toLowerCase()}/:id`, async (req, res, next) => {
    res.send(await models[key][key].findByIdAndUpdate(req.params.id, req.body).lean().execAsync());
    res.send({ok: true});
  });
});

export default expressApp;
