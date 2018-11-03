
'use strict'

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();


app.use(express.static("dist"));
app.use(express.static(__dirname + '/dist'));

app.get('*', function (req, res) {
  if(req.protocol === "https"){
    res.sendFile(path.join(__dirname, 'dist/errorredirect.html'));
  }
  else{
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  }
  
});


    
app.listen(port);

