'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
var os = require("os");
var hostname = os.hostname();

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Application version 2 and hostname = '+ hostname);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
