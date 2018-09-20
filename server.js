
'use strict'

var addonManifest = require('./addon_manifest.json');
var config = require('./config');
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var crypto = require('crypto');

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/heroku/resources', bodyParser.json());
app.use('/heroku/sso', bodyParser.urlencoded());

app.post('/heroku/sso', function(req,res) {
  
  if( !req.body || !req.body.id || !req.body.token || !req.body.timestamp) {
    return res.status(401).end();
  }

  //new hash
  var hash = crypto.createHash('sha1').update(`${req.body.id}:${config.heroku.sso_salt}:${req.body.timestamp}`).digest('hex');
  //old hash
  var legacyHash = crypto.createHash('sha1').update(`${req.body.id}:${config.heroku.legacy_salt}:${req.body.timestamp}`).digest('hex');
  //generate time
  var time = Math.abs(Date.now() - new Date((req.body.timestamp | 0) * 1000));

  if( (hash !== req.body.token && legacyHash !== req.body.token) || time > 100000) {
      // invalid hash
      return res.status(403).end();
  }

  // cookie set
  res.cookie('heroku-nav-data', 'bluzelle');

  // Render SSO page
  return res.redirect(`https://bluzelledashboard.herokuapp.com/`);
});

app.use('/heroku', function enforceAuth(req, res, next) {
  var creds = auth(req);

  if ( typeof creds === 'undefined' ) {
    return res.status(401).end();
  }

  if ( creds.pass !== addonManifest.api.password ||
       creds.name !== addonManifest.id ) {
    return res.status(401).end();
  }

  // If we pass authentication, let the next handler take over
  next();
});

app.post('/heroku/resources', function provisionRequest(req, res) {
  var uuid = req.uuid;
  console.log(req.body);
  res.json({
    'id': uuid
  });
});

app.put('/heroku/resources/:id', function(req, res) {
  return res.status(422).json({
    'message': `No Plan Change for now!`
  });
});

app.listen(port);