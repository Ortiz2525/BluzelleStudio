
'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const passport = require('passport');
const util = require('util');
const HerokuStrategy = require('passport-heroku').Strategy;
const app = express();

var request = require('request');
var uuid = require('node-uuid');

var HEROKU_CLIENT_ID = process.env.HEROKU_CLIENT_ID;
var HEROKU_CLIENT_SECRET = process.env.HEROKU_CLIENT_SECRET;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


passport.use(new HerokuStrategy({
    clientID: HEROKU_CLIENT_ID,
    clientSecret: HEROKU_CLIENT_SECRET,
    callbackURL: "https://bluzelledashboard.herokuapp.com/auth/heroku/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  //retrieves the config vars by passing application name and oauth token
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/auth/heroku',
  passport.authenticate('heroku'),
  function(req, res){
    // The request will be redirected to Heroku for authentication, so this
    // function will not be called.
  });

  app.get('/auth/heroku/callback', 
        passport.authenticate('heroku', { failureRedirect: '/auth/heroku' }),
        function(req, res) {
           res.sendFile(path.join(__dirname, 'dist/index.html'));
          //res.redirect('/');
    });

    
app.listen(port);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth/heroku')
  }