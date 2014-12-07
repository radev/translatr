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
  urlRoot: '/t/d',
  parse: function () {
    console.log(this.tree);
  }
});

module.exports = Translation;
