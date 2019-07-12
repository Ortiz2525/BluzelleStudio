
// The sole purpose for this server is to host an instance on Heroku



'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();


app.use(express.static("dist"));
app.use(express.static(__dirname + '/dist'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


    
app.listen(port);

