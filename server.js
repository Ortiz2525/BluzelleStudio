
'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();


app.use(express.static("dist"));
app.use('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


    
app.listen(port);

