
'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

var request = require('request');
var uuid = require('node-uuid');
var fetchUrl = require("fetch").fetchUrl;

function getToken(appName){
  var ops = {
    method: 'GET',
    headers: {
      "Authorization": "Bearer 440fc53d-e177-4e3c-962a-570be65ab3f2",
      "Accept": "application/vnd.heroku+json; version=3"
    }
    
  };

  return fetchUrl('https://api.heroku.com/apps/' + appName + '/config-vars', ops, function(error, meta, body){
    console.log(body.toString());
  }); 

}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
  console.log("test 1 " + res.body);
  //var appName = _req.params.app;
  //getToken(appName);
});

app.get('/', (_req, res) => {
  console.log("test 2 " + res.body);
  //var appName = _req.params.app;
  //getToken(appName);
});

    
app.listen(port);

//440fc53d-e177-4e3c-962a-570be65ab3f2
