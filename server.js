
'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

var request = require('request');
var uuid = require('node-uuid');
var fetchUrl = require("fetch").fetchUrl;

function getToken(){
  var appName = this.props.location.query.app;
  return fetchUrl('https://api.heroku.com/apps/' + appName + '/config-vars', {
      method: 'GET',
      accept: 'application/vnd.heroku+json; version=3',
      authorization: 'Bearer 440fc53d-e177-4e3c-962a-570be65ab3f2'
  }).then(
      response => response.json(),
      error => console.log("this is an error: " + error)
  ).then(
      res => console.log(res)
  )
  
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
  getToken();
});

    
app.listen(port);

//440fc53d-e177-4e3c-962a-570be65ab3f2
