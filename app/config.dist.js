'use strict';

var path = require('path');
var production = (process.env.NODE_ENV === 'production');

var config = module.exports = {
  dist: production ? 'dist' : '.tmp',
  // #### Connection details
  dbConfig: {
    host: process.env.RDB_HOST || 'localhost',
    port: parseInt(process.env.RDB_PORT) || 28015,
    db:   process.env.RDB_DB || 'translatr',
    tables: {
      'translations': 'id',
      'users': 'id'
    }
  }
};

module.exports.static = path.resolve(__dirname, '../' + config.dist);
