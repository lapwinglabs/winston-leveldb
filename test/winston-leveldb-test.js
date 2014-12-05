var winston = require('winston')
  , leveldb = require('../lib/winston-leveldb.js').LevelDB
  , format = require('util').format

var location = './log-test'
var options1 = { location: './log-test', valueEncoding: 'json' }
var options2 = { location: './log-test', valueEncoding: 'json', sublevels: ['level', 'awesome'] }

var basic = winston.loggers.add('basic')
basic.add(leveldb, options1);
basic.info("I'm logging into leveldb!", { awesome: true }, 
  function(error) {
    console.log("Finished 1: (error=" + error + ")");
  })

var sublevels = winston.loggers.add('sublevels')
sublevels.add(leveldb, options2);
sublevels.info("I'm logging into leveldb sublevels", { awesome: 'indubitably' },
  function(error) {
    console.log("Finished 2: (error=" + error + ")")
  })
