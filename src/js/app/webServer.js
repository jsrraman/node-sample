"use strict";

let express = require('express'),
  http = require('http'),
  fs = require('fs'),
  compression = require('compression'),
  bodyParser = require('body-parser');

//config = require('./config/' + (process.env.NODE_ENV || 'development'),
//  logger = global.logger = require('./utils/logger'),

let app = express(),
  server;

// Allow node to be run with proxy passing
app.enable('trust proxy');

//// Logging config
//app.configure('local', function () {
//  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//});
//
//app.configure('development', function () {
//  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//});
//
//app.configure('production', function () {
//  app.use(express.errorHandler());
//});

// Compression (gzip)
app.use(compression());
//app.use(express.methodOverride());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Setup routes
app.use( require('./routes') );

//function start () {
//  server = http.createServer(app).listen(config.port);
//  logger.info((new Date()).toString() + ":: PROJECT_NAME server listening on port::", config.port, ", environment:: ", app.settings.env);
//}
//
//exports.start = start;
//exports.app = app;

http.createServer(app).listen(5000, () => {
  console.log('Server running in port 5000');
});