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
    var t = this.getLatestTranslation();

    return t ? t : this.originalText;
  },

  getLatestTranslation: function() {
    if (this.revisions.length) {
      return _.last(this.revisions).text;
    } else {
      return '';
    }
  },

  hasItems: function() {
    return !!this.items.length;
  }




});
