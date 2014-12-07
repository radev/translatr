'use strict';

var _ = require('underscore');
var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
  props: {
    addr: 'array',
    originalText: 'string',
    type: 'string',

    // child TreeItems
    items: {
      type: 'array',
      default: function() { return []; }
    },
    revisions: {
      type: 'array',
      default: function() { return []; }
    }
  },

  getTranslatedText: function() {
    if (this.revisions.length) {
      return _.last(this.revisions).text;
    } else {
      return this.originalText;
    }
  },

  hasItems: function() {
    return !!this.items.length;
  }




});
