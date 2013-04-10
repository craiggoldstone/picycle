var gps = require('./gps/gps');
var distance = require('./distance/distance-socket').distance;
var winston = require('winston');
var fs = require('fs');

var LOG_DIR = './logs/';
var DATA_LOG_NAME = 'picycle'
var DEBUG_LOG_NAME = 'picycle-debug';
var DATA_LOG_PATH = LOG_DIR + DATA_LOG_NAME + '.log';
var DEBUG_LOG_PATH = LOG_DIR + DEBUG_LOG_NAME + '.log';
var DATA_LOG_MAXSIZE = 1024 * 1024 * 10 // 10MB
var DEBUG_LOG_MAXSIZE = 1024 * 1024 * 10 // 10MB


// set up the debug log
fs.mkdir(LOG_DIR, function(err) {
    if (err && err.code == 'EEXIST') {
        // wait for the FILE to be set up before logging this warn
        setTimeout(function() {
            logger.warn('**100ms ago** Directory already exists: ' + LOG_DIR);
        }, 100);
    } else if (err) {
        throw err;
    }
})
var customLevels = {
    levels: {
      debug: 0,
      info: 1,
      warning: 2,
      error: 3
    },
    colors: {
      debug: 'blue',
      info: 'green',
      warning: 'orange',
      error: 'red'
    }
  };

// ========================
// create the logger
var logger = module.exports = new(winston.Logger)({
    level: 'debug',
    levels: customLevels.levels,
    //colors: customLevels.colors,
    transports: [
    // setup console logging
    new(winston.transports.Console)({
        level: 'info',
        levels: customLevels.levels,
        colorize: true
    }),
    // setup logging to mongodb
    new(winston.transports.File)({
        filename: './logs/picycle-debug-new.log',
        maxsize: DEBUG_LOG_MAXSIZE,
        level: 'debug',
        levels: customLevels.levels
    })]
})
// set the coloring
winston.addColors(customLevels.colors)

// ========================

// var logger = winston.loggers.get(DEBUG_LOG_NAME);
// fs.mkdir(LOG_DIR, function(err) {
//     if (err && err.code == 'EEXIST') {
//         // wait for the FILE to be set up before logging this warn
//         setTimeout(function() {
//             logger.warn('**100ms ago** Directory already exists: ' + LOG_DIR);
//         }, 100);
//     } else if (err) {
//         throw err;
//     }
// })
// logger.remove(winston.transports.Console);

// winston.addColors(customLevels.colors);
// logger.add(winston.transports.Console, {
//     levels: customLevels,
//     level: 'info',
//     colorize: 'true'
// });
// logger.add(winston.transports.File, {
//     filename: DEBUG_LOG_PATH,
//     maxsize: DEBUG_LOG_MAXSIZE
// });

// set up the data log
winston.loggers.add(DATA_LOG_NAME);
var datalogger = winston.loggers.get(DATA_LOG_NAME);
datalogger.remove(winston.transports.Console);
datalogger.add(winston.transports.File, {
    filename: DATA_LOG_PATH,
    maxsize: DATA_LOG_MAXSIZE
});

// var customLevelLogger = new (winston.Logger)({ levels: customLevels.levels });
// console.log(customLevelLogger);
// logger.log('debug', 'debug');
// logger.log('info', 'info');
// logger.log('warn', 'warn');
// logger.log('error', 'error');
// logger.log('fatal', 'fatal');
logger.debug('DEBUG');
logger.info('INFO');
logger.warning('WARN');
logger.error('ERROR');

var picycle = {
    'gps': new gps(),
    'distance': new distance()
}

picycle.gps.on('location', function (location) {
    logger.debug('got new location: ' + location.latitude + ',' + location.longitude);
    datalogger.info(location);
});

picycle.distance.start();

picycle.distance.on('tick', function (data) {
    logger.debug('got new distance: ' + data.distance + ' time: ' + data.time);
    datalogger.info(data);
});

process.on('exit', function() {
  logger.info('picycle about to exit. Uptime: ' + process.uptime() + ' seconds.');
});

process.on( 'SIGINT', function() {
  logger.info("gracefully shutting down from  SIGINT (Ctrl-C)");
  process.exit();
});

exports.picycle = picycle;