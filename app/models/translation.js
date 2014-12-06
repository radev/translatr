'use strict';

// Require the lib
var AmpersandState = require('ampersand-state');

var Translation = AmpersandState.extend({
  props: {
    text: 'string',
    strings: 'array'
  }
});

module.exports = Translation;
