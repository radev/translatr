'use strict';

var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
  props: {
    id: 'string',
    name: 'string',
    color: 'string',
    selectedAddr: 'array'
  }
});
