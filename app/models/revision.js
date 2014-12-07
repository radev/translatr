'use strict';

// Require the lib
var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
  props: {
    addr: 'array',
    // Translated document Id
    id: 'string',
    text: 'string',
    userId: 'string'
  },

  urlRoot: '/t'

});
