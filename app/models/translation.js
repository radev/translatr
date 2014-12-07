'use strict';

// Require the lib
var AmpersandModel = require('ampersand-model');

var Translation = AmpersandModel.extend({
  props: {
    id: 'string',
    text: 'string',
    tree: 'array',
    translations: 'array'
  },

  urlRoot: '/t/d'
});

module.exports = Translation;
