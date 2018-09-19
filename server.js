
'use strict'

var addonManifest = require('./addon_manifest.json');
var config = require('./config');
var uuid = require('node-uuid');
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var crypto = require('crypto');

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

//app.use(express.static(__dirname + '/dist'));
app.use('/heroku/resources', bodyParser.json());
app.use('/heroku/sso', bodyParser.urlencoded());

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'));
// });

app.use('*', function addUUID(req, res, next) {
  req.uuid = uuid.v4();
  next();
});

// Health check
app.get('/health', function(req, res) {
  return res.status(200).end();
});
// Health check Kubernetes
app.get('/', function(req, res) {
  return res.status(200).end();
});

app.post('/heroku/sso', function(req,res) {
  
  if( !req.body || !req.body.id || !req.body.token || !req.body.timestamp) {
    // failed
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
    log.error(`${req.uuid}: Incoming request provided no auth data`);
    return res.status(401).end();
  }

  if ( creds.pass !== addonManifest.api.password ||
       creds.name !== addonManifest.id ) {
    // If either the id or password don't match, reject the request
    log.error(`${req.uuid}: Incomming request failed authentication`);
    log.error(`${req.uuid}: ID: "${creds.name}" Password: "${creds.pass}"`);
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