
'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
var request = require('request');

getAddonConfigVars() {
  var ops = {
      uri: 'http://api.heroku.com/apps/exampleappdemo/config-vars',
      method: 'GET',
      headers: {
          'Content-Type': 'application/vnd.heroku+json'
      }
  }
  request(ops, function (error, response) {
      console.log(error, response.body);
      return;
  });
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port);