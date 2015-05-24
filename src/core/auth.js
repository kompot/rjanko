import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

import User from '../models/User';
const debug = require('../core/logging/debug')(__filename);

export default function(expressApp) {
  expressApp.use(cookieParser());
  expressApp.use(bodyParser.urlencoded({
    extended: true
  }));
  expressApp.use(bodyParser.json());
  expressApp.use(expressSession({
    // TODO replace with an ENV variable
    secret: 'sessionSuperVerySecret',
    resave: true,
    saveUninitialized: true
  }));
  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  // serialize user ID to session
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    return new User(id);
  });

  passport.use(new LocalStrategy((username, password, done) => {
    if (username === 'admin' && password === '12345') {
      return done(null, {id: 1, username: 'admin'});
    }
    return done(null, false, {
      message: 'Incorrect username or password.'
    });
  }));

  expressApp.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send(req.user);
  });
}
