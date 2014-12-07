/**
 * scripts/main.js
 *
 * This is the starting point for your application.
 * Take a look at http://browserify.org/ for more info
 */

'use strict';

var React = require('react');
var Translatr = require('./views/translatr.jsx');
var translatrEl = document.getElementById('translatr'); // jshint ignore:line
var translationId = window.location.pathname.split('/')[2]; // jshint ignore:line
var pubnub = require('pubnub');
var uuid = pubnub.uuid();
if (translatrEl) {
  React.render(
    React.createElement(
      Translatr,
      {
        translationId: translationId,
        userId: uuid
      }
    ),
    translatrEl
  );
}

