"use strict";

const express = require('express'),
	  path = require('path'),
	  app = express(),
      helmet = require('helmet'),
	  server = require('http').createServer(app),
      bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, '/client')));

const instance = app.listen(process.env.port || 5000, function(){
  console.log('we\'re listening on port 5000');
}),   
	  io = require('./server/socketManager.js')(instance);