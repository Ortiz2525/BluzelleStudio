
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
      body:{
        'client':{
          'secret': uuid
        },
        'grant':{
          'code': uuid,
          'type': 'authorization_code'
        },
        'refresh_token':{
          'token': uuid
        }
      }
      ,
      headers: {
          'Accept': 'application/vnd.heroku+json; version=3',
          'Content-Type': 'application/json'
      }
  }
  request(ops, function (error, response) {
      console.log("this is a test " + error, response.body);
      resp = response.body;
      return;
  });
  return resp;
}

function getAddonConfigVars() {
  var ops = {
      uri: 'https://api.heroku.com/apps/exampleappdemo/config-vars',
      method: 'GET',
      headers: {
          'Accept': 'application/vnd.heroku+json; version=3',
          'Authorization': 'Bearer ' + getoAuthToken().access_token.token
      }
  }
  request(ops, function (error, response) {
      console.log("this is a test " + error, response.body);
      return;
  });
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
  getAddonConfigVars();
});

app.listen(port);