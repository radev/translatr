'use strict';

var r = require('rethinkdb');
var assert = require('assert');
var Promise = require('bluebird'); // jshint ignore:line
var using = Promise.using;
var logDebug = require('debug')('rdb:debug');
var logError = require('debug')('rdb:error');

var dbConfig = require('../config').dbConfig;

// #### Helper functions

function getConnection() {
  return r.connect({host: dbConfig.host, port: dbConfig.port}).disposer(function(connection) {
    connection.close();
  });
}

/**
 * A wrapper function for the RethinkDB API `r.connect`
 * to keep the configuration details in a single function
 * and fail fast in case of a connection error.
 */
function onConnect() {
  return r.connect({host: dbConfig.host, port: dbConfig.port})
    .then(
      function(connection) {
        connection._id = Math.floor(Math.random() * 10001);
        return connection;
      },
      function(e) {
        assert.ifError(e);
      }
    );
}

/**
 * Connect to RethinkDB instance and perform a basic database setup:
 *
 * - create the `RDB_DB` database (defaults to `chat`)
 * - create tables `translations`, `cache`, `users` in this database
 */
module.exports.setup = function() {
  return using(getConnection(), function(connection) {
    function createTable(tableName) {
      return r.db(dbConfig.db)
        .tableCreate(tableName, {primaryKey: dbConfig.tables[tableName]})
        .run(connection).then(function() {
          logDebug('[INFO ] RethinkDB table \'%s\' created', tableName);
        }).catch(function(err) {
          logDebug('[DEBUG] RethinkDB table \'%s\' already exists (%s:%s)\n%s', tableName, err.name, err.msg, err.message);
        });
    }

    return r.dbCreate(dbConfig.db).run(connection)
      .then(function() {
        logDebug('[INFO ] RethinkDB database \'%s\' created', dbConfig.db);
      })
      .catch(function(err) {
        logDebug('[DEBUG] RethinkDB database \'%s\' already exists (%s:%s)\n%s', dbConfig.db, err.name, err.msg, err.message);
      })
      .then(function() {
        return Promise.map(Object.keys(dbConfig.tables), function(tblName) {
          return createTable(tblName);
        });
      });
  });
};

// #### Filtering results

/**
 * Find a user by email using the
 * [`filter`](http://www.rethinkdb.com/api/javascript/filter/) function.
 * We are using the simple form of `filter` accepting an object as an argument which
 * is used to perform the matching (in this case the attribute `mail` must be equal to
 * the value provided).
 *
 * We only need one result back so we use [`limit`](http://www.rethinkdb.com/api/javascript/limit/)
 * to return it (if found). The result is collected with
 * [`next`](http://www.rethinkdb.com/api/javascript/next/) and passed as an array to the callback
 * function.
 *
 * @param {String} mail
 *    the email of the user that we search for
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
module.exports.findUserByEmail = function(mail, callback) {
  onConnect(function(err, connection) {
    logDebug('[INFO ][%s][findUserByEmail] Login {user: %s, pwd: \'you really thought I\'d log it?\'}', connection._id, mail);

    r.db(dbConfig.db).table('users').filter({'mail': mail}).limit(1).run(connection, function(err,
                                                                                              cursor) {
      if (err) {
        logError('[ERROR][%s][findUserByEmail][collect] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        callback(err);
      }
      else {
        cursor.next(function(err, row) {
          if (err) {
            logError('[ERROR][%s][findUserByEmail][collect] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
            callback(err);
          }
          else {
            callback(null, row);
          }
          connection.close();
        });
      }

    });
  });
};

/**
 * Every user document is assigned a unique id when created. Retrieving
 * a document by its id can be done using the
 * [`get`](http://www.rethinkdb.com/api/javascript/get/) function.
 *
 * RethinkDB will use the primary key index to fetch the result.
 *
 * @param {String} userId
 *    The ID of the user to be retrieved.
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
module.exports.findUserById = function(userId) {
  return using(getConnection(), function(connection) {
    return r.db(dbConfig.db).table('users').get(userId).run(connection)
      .error(function(err) {
        logError('[ERROR][%s][findUserById] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
      });
  });
};

module.exports.findTranslationById = function(translationId) {
  return using(getConnection(), function(connection) {
    return r.db(dbConfig.db).table('translations').get(translationId).run(connection)
      .error(function(err) {
        logError('[ERROR][%s][findTranslationById] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        throw err;
      });
  });
};

/**
 * To save a new chat message using we are using
 * [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * An `insert` op returns an object specifying the number
 * of successfully created objects and their corresponding IDs:
 *
 * ```
 * {
 *   "inserted": 1,
 *   "errors": 0,
 *   "generated_keys": [
 *     "b3426201-9992-ab84-4a21-576719746036"
 *   ]
 * }
 * ```
 *
 * @param {Object} translation
 *    The translation object to be saved
 *
 * @param {Object} opts
 *    Options
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
module.exports.saveTranslation = function(translation, opts) {
  return using(getConnection(), function(connection) {
    return r.db(dbConfig.db).table('translations').insert(translation, opts).run(connection)
      .then(function(result) {
        if (result.inserted === 1) {
          return result.generated_keys[0]; // jshint ignore:line
        } else {
          return false;
        }
      });
  });
};

/**
 * Adding a new user to database using  [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * If the document to be saved doesn't have an `id` field, RethinkDB automatically
 * generates an unique `id`. This is returned in the result object.
 *
 * @param {Object} user
 *   The user JSON object to be saved.
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
module.exports.saveUser = function(user, callback) {
  onConnect(function(err, connection) {
    r.db(dbConfig.db).table('users').insert(user).run(connection, function(err, result) {
      if (err) {
        logError('[ERROR][%s][saveUser] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        callback(err);
      }
      else {
        if (result.inserted === 1) {
          callback(null, result.generated_keys[0]);// jshint ignore:line
        }
        else {
          callback(null, false);
        }
      }
      connection.close();
    });
  });
};

module.exports.generateTestRecord = function() {
  var s = ['So if you’re going to propose in the near future, don’t worry if you can’t afford a massive engagement ring. ',
          'A recent study suggests that the bigger the ring is, the shorter the marriage will be. ',
          'Economics professors at Emory University in America have shown that bigger isn’t always better. \n\n',

          '* In fact, men who spend between £1200 – £2000 on an engagement ring are actually 1.3 times more likely to divorce, ',
          'than those who spend between £300 – £1200. \n',
          '* Of course, these statistics don’t prove that a large ring is the cause of the problem.\n\n',

          'They simply show a correlation?!!!\n',
          'However it seems clear that if you place more importance on the cost of the ring, than the man you’re about to marry, ',
          'it’s not a promising sign. \n',
          'Do you think the size of an engagement ring is important?'];
  // TODO: Remove me
  var t = {
    id: 'c843e0e4-8697-442b-8b90-99e03560049f',
    text: s.join(),
    tree: [ 'markdown',
            [ 'para',
              ['sentence', 'So if you’re going to propose in the near future, don’t worry if you can’t afford a massive engagement ring.'],
              ['sentence', 'A recent study suggests that the bigger the ring is, the shorter the marriage will be.'],
              ['sentence', 'Economics professors at Emory University in America have shown that bigger isn’t always better. ' ]
            ],
            [ 'para',
              ['sentence', 'They simply show a correlation?!!!'],
              ['sentence', 'However it seems clear that if you place more importance on the cost of the ring, than the man you’re about to marry, it’s not a promising sign.'],
              ['sentence', 'Do you think the size of an engagement ring is important?']
            ]
    ],
    translations: []
  };
  module.exports.saveTranslation(t, {conflict: 'replace'});
};

// #### Connection management
//
// This application uses a new connection for each query needed to serve
// a user request. In case generating the response would require multiple
// queries, the same connection should be used for all queries.
//
// Example:
//
//     onConnect(function (err, connection)) {
//         if(err) { return callback(err); }
//
//         query1.run(connection, callback);
//         query2.run(connection, callback);
//     }
//
