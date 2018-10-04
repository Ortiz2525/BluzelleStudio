
'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

var request = require('request');
var uuid = require('node-uuid');

function getoAuthToken(){
  var resp;
  var ops = {
      uri: 'https://api.heroku.com/oauth/tokens',
      method: 'POST',
      client: {
        secret: uuid.v4()
      },
      grant: {
        //code: uuid.v4(),
        type: "authorization_code"
      }
      ,
      headers: {
          'Accept': 'application/vnd.heroku+json; version=3',
          'Content-Type': 'application/json'
      }
  }
  request(ops, function (error, response) {
      console.log(ops);
      console.log("this is a first test " + error, response.body);
      resp = response.body;
      return;
  });
  return resp;
}

function getAddonConfigVars(appName, oauthtoken) {
  var ops = {
      uri: 'https://api.heroku.com/apps/' + appName + '/config-vars',
      method: 'GET',
      headers: {
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': 'Bearer ' + oauthtoken
      }
  }
  request(ops, function (error, response) {
      console.log("this is a test " + error, response.body);
      return;
  });
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  //retrieves the config vars by passing application name and oauth token
  getAddonConfigVars(_req.query.app, getoAuthToken());
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port);