'use strict';

var _ = require('lodash');
var r = require('rethinkdb');
var Promise = require('bluebird'); // jshint ignore:line
var using = Promise.using;
var logDebug = require('debug')('rdb:debug');
var logError = require('debug')('rdb:error');

var dbConfig = require('../config').dbConfig;

// #### Helper functions

function getConnection() {
  return r.connect({host: dbConfig.host, port: dbConfig.port})
    .error(function(err) {
      logError(err);
      throw err ;
    })
    .disposer(function(connection) {
      connection.close();
    });
}

/**
 * Connect to RethinkDB instance and perform a basic database setup:
 *
 * - create the database
 * - create tables in this database
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

/**
 * Get translation from database
 * @param translationId
 * @returns {*}
 */
module.exports.findTranslationById = function(translationId) {
  return using(getConnection(), function(connection) {
    logDebug('[INFO ][%s][findTranslationById] %s', connection._id, translationId);
    return r.db(dbConfig.db).table('translations').get(translationId).run(connection)
      .error(function(err) {
        logError('[ERROR][%s][findTranslationById] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        throw err;
      });
  });
};

module.exports.saveTranslation = function(translation, opts) {
  return using(getConnection(), function(connection) {
    return r.db(dbConfig.db)
      .table('translations')
      .insert(translation, opts)
      .run(connection)
      .then(function(result) {
        if (result.inserted === 1) {
          return result.generated_keys[0]; // jshint ignore:line
        } else {
          return false;
        }
      })
      .error(function(err) {
        logError('[ERROR][%s][saveTranslation] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        throw err;
      });
  });
};

// TODO: Avoid race condition when two translations are sent at the same time
module.exports.addSentenceTranslation = function(translationId, sentenceAddr, sentenceTranslation) {
  return using(getConnection(), function(connection) {
    return r.db(dbConfig.db)
      .table('translations')
      .get(translationId)
      .run(connection)
      .then(function(translation) {
        var updated = false;
        var translations = _.map(translation.translations, function(pair) {
          var sAddr = pair[0];
          if (!_.isEqual(sAddr, sentenceAddr)) {
            // sAddr is not the same
            return pair;
          }
          var sTranslations = pair[1];
          sTranslations.push(sentenceTranslation);
          updated = true;
          return pair;
        });
        // Insert new
        if (!updated) {
          translations.push(
            [sentenceAddr, [sentenceTranslation]]
          );
        }
        return r.db(dbConfig.db)
          .table('translations')
          .get(translationId)
          .update({translations: translations})
          .run(connection);
      });
  });
};

/**
 * @param {String} mail
 *    the email of the user that we search for
 *
 * @returns {Promise} the user if found, `null` otherwise
 */
module.exports.findUserByEmail = function(mail) {
  return using(getConnection(), function(connection) {
    logDebug('[INFO ][%s][findUserByEmail] %s', connection._id, mail);
    return r.db(dbConfig.db).filter({'mail': mail}).limit(1).run(connection)
      .then(function(cursor) {
        return cursor.next();
      })
      .error(function(err) {
        logError('[ERROR][%s][findUserByEmail] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        throw err;
      });
  });
};

/**
 * Get user from database
 * @param {String} userId
 * @returns {Promise}
 */
module.exports.findUserById = function(userId) {
  return using(getConnection(), function(connection) {
    return r.db(dbConfig.db).table('users').get(userId).run(connection)
      .error(function(err) {
        logError('[ERROR][%s][findUserById] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        throw err;
      });
  });
};

module.exports.saveUser = function(user, opts) {
  return using(getConnection(), function(connection) {
    return r.db(dbConfig.db).table('users').insert(user, opts).run(connection)
      .then(function(result) {
        if (result.inserted === 1) {
          return result.generated_keys[0]; // jshint ignore:line
        } else {
          return false;
        }
      })
      .error(function(err) {
        logError('[ERROR][%s][saveUser] %s:%s\n%s', connection._id, err.name, err.msg, err.message);
        throw err;
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
