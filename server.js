
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.resolve('../dist/generated/js')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../dist', 'index.html'));
});

app.listen(port);