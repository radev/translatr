'use strict';
var markdown = require('markdown').markdown;

function transformElement(element) {
  var type = element[0];
  if (type==='para' || type==='listitem') {

  }
}

module.exports = function(text) {
  text = text.trim();
  var tree = markdown.parse(text);
  if (tree[0] !== 'markdown') {
    throw new Error('Cannot parse text');
  }
  return transformElement(tree);
};
