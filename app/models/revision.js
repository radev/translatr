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

  urlRoot: '/t',

  toJSON: function() {
    var data = [
      this.addr,
      [{text: this.text, userId: this.userId}]
    ];

    return data;
  }

});
