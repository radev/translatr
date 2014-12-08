'use strict';

var path = require('path');
var production = (process.env.NODE_ENV === 'production');

var config = module.exports = {
  dist: production ? 'dist' : '.tmp',
  livereloadPort: 35729,
  // DB
  dbConfig: {
    host: process.env.RDB_HOST || 'localhost',
    port: parseInt(process.env.RDB_PORT) || 28015,
    db:   process.env.RDB_DB || 'translatr',
    tables: {
      'translations': 'id',
      'users': 'id'
    }
  },
  pubnub: {
    'ssl': true,  // <- enable TLS Tunneling over TCP
    'publish_key': 'pub-c-7ddd488b-c7c9-42e2-93d5-ed4765eddfb0',
    'subscribe_key': 'sub-c-7e4988ce-7d7d-11e4-bfb6-02ee2ddab7fe'
  }
};

module.exports.static = path.resolve(__dirname, '../' + config.dist);
