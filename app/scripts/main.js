/**
 * scripts/main.js
 *
 * This is the starting point for your application.
 * Take a look at http://browserify.org/ for more info
 */

'use strict';

var $ = require('jquery');
var React = require('react');
var Translatr = require('./views/translatr.jsx');

var translatrEl = $('#translatr')[0];

var DEMO = require('./demo.json');

if (translatrEl) {
  React.render(<Translatr data={DEMO} />, translatrEl);
}

