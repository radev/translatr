'use strict';

var express = require('express');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var Promise = require('bluebird'); // jshint ignore:line

var routes = require('./routes/index');
//var users = require('./routes/users');
var config = require('./config');
var db = require('./lib/db');

var app = express();

// view engine setup
// use nunjucks to process view templates in express
nunjucks.configure('app/views', {
  autoescape: true,
  express: app
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(config.static));

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(require('connect-livereload')({ port: config.livereloadPort }));
  var PrettyError = require('pretty-error');
  var pe = new PrettyError();
  Promise.longStackTraces();
  pe.skipNodeFiles();
  pe.skipPackage('express');
  app.use(function(err, req, res, next) { // jshint ignore:line
    res.status(err.status || 500);
    var errObj = pe.getObject(err);
    console.log(pe.render(err));
    res.render('error.html', {
      message: err.message,
      dump: require('util').inspect(errObj, {depth:9}),
      error: errObj['pretty-error']
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) { // jshint ignore:line
  res.status(err.status || 500);
  res.render('error.html', {
    message: err.message,
    error: {}
  });
});

// Setup database
db.setup().then(function() {
  return db.generateTestRecord();
});

module.exports = app;
