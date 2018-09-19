
'use strict'

const express = require('express');
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var crypto = require('crypto');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/dist'));
app.use('/heroku/resources', bodyParser.json());
app.use('/heroku/sso', bodyParser.urlencoded());

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
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



app.listen(port);