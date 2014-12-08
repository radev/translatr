'use strict';

var _ = require('underscore');
var AmpersandModel = require('ampersand-model');
var TreeElement = require('./tree-element');
var Revision = require('./revision');

var Translation = AmpersandModel.extend({
  props: {
    id: 'string',
    text: 'string',
    tree: 'array',
    translations: 'array',

    rootElement: {
      type: 'object',
      default: function() { return new TreeElement() }
    }
  },

  urlRoot: '/t/d',

  parse: function(data) {
    var result = data;
    result.rootElement = this.parseTreeElement(data.tree, [1]);

    return result;
  },

  parseTreeElement: function(treeElement, address) {
    var el = new TreeElement({
      addr: address.slice(),
      type: treeElement[0],
      items: []
    });

    for (var i=1; i < treeElement.length; i++ ) {
      if (_.isArray(treeElement[i])) {
        el.items.push( this.parseTreeElement(treeElement[i], address.concat(i)) );
      } else {
        el.originalText = treeElement[i];
      }
    }

    return el;
  },

  applyTranslations: function(translations) {
    var items = translations || this.translations;

    items.forEach(function(trans){
      var addr = trans[0];
      var el = this.getByAddress(addr);

      if (el) {
        this.applyTranslation(el, trans)
      }
    }, this)
  },

  /**
   * Apply translation to specified element
   * @param  {TreeElement} element     Element to apply translation. Can be select by .getByAddress()
   * @param  {array} translation Translation array
   */
  applyTranslation: function(element, translation) {
    element.revisions = element.revisions.concat( this.parseTranslation(translation) );
  },

  parseTranslation: function(translation) {
    var addr = translation[0];
    var revs = translation[1];
    var result = [];

    if (!addr || !revs) {
      throw 'Incorrect translation format';
    }

    revs.forEach(function(rev){
      if (_.isArray(rev)){
        rev = rev[0];
      }
      result.push( new Revision({
        addr: addr.slice(),
        text: rev.text,
        userId: rev.userId
      }) )
    });

    return result;
  },

  /**
   * Return element by address
   * @param  {array} addr
   * @return {object}      TreeItem object
   */
  getByAddress: function(addr) {
    var el = this.rootElement;

    // accept 1st element as root
    for (var i=1; i<addr.length; i++) {
      // we have to subtract 1 because origianl array contains type of element
      el = el.items ? el.items[ addr[i]-1 ] : null;
    }

    return el;
  }


});

module.exports = Translation;
