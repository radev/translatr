'use strict';

var makePubnub = require('pubnub');
var Promise = require('bluebird'); // jshint ignore:line
var config = require('../config').pubnub;

var pubnub = makePubnub(config);

module.exports.publishSentenceTranslation = function(channelId, sentenceAddr, sentenceTranslation) {
  var message = {
    type: 'newRevision',
    translation: [sentenceAddr, sentenceTranslation]
  };
  return new Promise(function(resolve, reject) {
    pubnub.publish({
      channel: channelId,
      message: message,
      callback: resolve,
      error: reject
    });

  });
};
