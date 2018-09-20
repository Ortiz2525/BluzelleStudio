
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

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port);