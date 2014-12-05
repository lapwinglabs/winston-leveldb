var winston = require('winston')
  , levellog = require('../lib/winston-leveldb.js').LevelDB

var location = './log-test'
var options1 = { location: './log-test', valueEncoding: 'json' }
var options2 = { location: './log-test', valueEncoding: 'json', sublevels: ['level', 'awesome'] }

winston.loggers.add('basic', {
  LevelDB: options1
})
winston.loggers.get('basic').info("I'm logging into leveldb!", { awesome: true }, 
  function(error) {
    console.log("Finished 1: (error=" + error + ")");
  })


winston.loggers.add('sublevels', {
  LevelDB: options2
})

winston.loggers.get('sublevels').info("I'm logging into leveldb sublevels", { awesome: 'indubitably' },
  function(error) {
    console.log("Finished 2: (error=" + error + ")")
  })