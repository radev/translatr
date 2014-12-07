'use strict';

var express = require('express');
var router = express.Router();
var util = require('util');
//var parseText = require('../lib/parse');
var db = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html', {title: 'Express'});
});

router.post('/', function(req, res) {
  //var text = req.body.text;
  //var tree = parseText(text);
  res.redirect('/t/c843e0e4-8697-442b-8b90-99e03560049f');
});

router.get('/demo/', function(req, res) {
  res.render('demo.html');
});

router.get('/about/', function(req, res) {
  res.render('about.html');
});

router.get('/t/:id', function(req, res, next) {
  var translationId = req.params.id;
  db.findTranslationById(translationId)
    .then(function(translation) {
      if (!translation) {
        return next();
      }
      res.render('t.html', {id: translationId});
    }).error(function(err) {
      return next(err);
    });
});

router.get('/t/d/:id', function(req, res, next) {
  var translationId = req.params.id;
  db.findTranslationById(translationId)
    .then(function(translation) {
      if (!translation) {
        return next();
      }
      res.json(translation);
    }).error(function(err) {
      return next(err);
    });
});

router.patch('/t/:id', function(req, res, next) {
  var translationId = req.params.id;
  var pair = req.body;
  if (!util.isArray(pair) || pair.length !== 2) {
    return res.sendStatus(400);
  }
  db.findTranslationById(translationId)
    .error(function() {
      console.log('error');
      next();
    })
    .then(function(translation) {
      if (translation === null) {
        return next();
      }
      console.log(pair);
      return db.addSentenceTranslation(translationId, pair[0], pair[1]);
    })
    .then(function() {
      res.sendStatus(204);
    });

});

module.exports = router;
