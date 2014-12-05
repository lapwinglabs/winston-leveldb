var util = require('util')
  , winston = require('winston')
  , level = require('level-11')
  , sublevel = require('sublevel')
  , uid = require('uid')
  , util = require('util')
  , format = util.format
  , inherits = util.inherits

var openDBs = { }

var LevelDB = exports.LevelDB = function(options) {
  options = (options || {})

  winston.Transport.call(this, options);

  this.location = options.location || './winston-log';
  this.level = options.level || 'info';

  // Expects an array of strings. These refer to attributes that will
  // be used to split the db into sublevels. Sublevels will be created 
  // in the order of the attributes specified
  //
  // E.g. ['type', 'level'] will store messages where level='info' and meta.type='db-log'
  //      under /db-log/info in the database
  //
  // If a sublevel attribute is undefined on a message, it will be put under the ' ' sublevel.
  //
  // E.g. ['type', 'level'] will store messages where level='info' and meta.type=undefined
  //      under / /info

  this.sublevels = options.sublevels || []
  if (!Array.isArray(this.sublevels)) {
    this.sublevels = [String(this.sublevels)]
  }

  var globalDB = openDBs[this.location] 
                 ? openDBs[this.location]
                 : level(this.location, options);

  openDBs[this.location] = globalDB;
  this.db = sublevel(globalDB);
}

inherits(LevelDB, winston.Transport);
winston.transports.LevelDB = LevelDB;

LevelDB.prototype.name = 'leveldb';

LevelDB.prototype.log = function (level, msg, meta, callback) {
  var log = this.db;
  this.sublevels.forEach(function(partition) {
    if (partition == 'level')
      log = log.sublevel(level)
    else if (partition == 'msg')
      log = log.sublevel(msg)
    else if (meta[partition])
      log = log.sublevel(meta[partition])
    else
      log = log.sublevel(' ')
  })
  var timestamp = new Date()
    , id = String(timestamp.getTime()) + uid(4)
    , entry = {
        timestamp: timestamp,
        level: level,
        message: msg,
        meta: meta
      }
  log.put(id, entry, function(err) {
    if (err)
      callback(new Error(format('Failed to log message (%s): %s\nError: %s', 
        id, JSON.stringify(entry), err)), false);
    else
      callback(null, true);
  })
};
