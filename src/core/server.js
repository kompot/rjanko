import fs from 'fs'
import http from 'http';
import path from 'path';

import axios from 'axios';
import express from 'express';
import Promise from 'bluebird';
import React from 'react';
import SocketIoServer from './SocketIoServer';

const debug = require('debug')('rjanko:server.dev');
const expressApp = express();
const statsJsonPath = path.join(process.cwd(), 'build', '_stats.json');

import renderApp from './renderApp';

const readWebpackBuildStats = (req) => {
  // TODO do not read on every request in prod mode!
  if (process.env.NODE_ENV === 'production') {
    return axios.get(req.protocol + '://' + req.get('host') +'/build/_stats.json');
  } else {
    return axios.get('http://127.0.0.1:3001/build/_stats.json');
  }
};

if (process.env.NODE_ENV === 'production') {
  expressApp.use('/build', express.static(path.join(process.cwd(), 'build')));
}

//expressApp.get('/_webpack_stats.json', function(req, res, next) {
//  const webpackAssets = readWebpackBuildStats();
//  res.send(webpackAssets);
//});


/**
 * Passport js related start
 */
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

expressApp.use(cookieParser());
expressApp.use(bodyParser.urlencoded({
  extended: true
}));
expressApp.use(bodyParser.json());
expressApp.use(expressSession({
  secret: 'sessionSuperVerySecret',
  resave: true,
  saveUninitialized: true
}));
expressApp.use(passport.initialize());
expressApp.use(passport.session());

// serialize user ID to session
passport.serializeUser((user, done) => done(null, user.id));

import User from '../models/User';

passport.deserializeUser(function(id, done) {
  return new User(id);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    debug(`_____username`, username, `password`, password);
    if (username === 'admin' && password === '12345') {
      return done(null, {id: 1});
    } else {
      return done(null, false, {
        message: 'Incorrect username or password.'
      });
    }
  }
));

expressApp.post('/api/login', passport.authenticate('local', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/loginFailure'
}));
/**
 * Passport js related end
 */


expressApp.use(async function(req, res, next) {
  const webpackAssets = await readWebpackBuildStats(req);
  renderApp(req, res, next, webpackAssets.data).catch(next);
});

expressApp.use(function(err, req, res, next) {
  if (err) {
    debug(err.stack);
    res.send('<html><body><pre>' + err.stack + '</pre></body></html>');
  }
});






const port = process.env.PORT || 3000;
const server = http.Server(expressApp);

new SocketIoServer(server);

server.listen(port, function(err, result) {
  if (err) {
    debug(err);
  }
  debug(`Express server listening on ${port}`);
});
