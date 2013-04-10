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
winston.loggers.add(DEBUG_LOG_NAME);
var logger = winston.loggers.get(DEBUG_LOG_NAME);
fs.mkdir(LOG_DIR, function(err) {
    if (err && err.code == 'EEXIST') {
        // wait for the FILE to be set up before logging this warn
        setTimeout(function() {
            logger.warn('**100ms ago** Directory already exists: ' + LOG_DIR);
        }, 100);
    } else {
        throw err;
    }
})
logger.remove(winston.transports.Console);
logger.add(winston.transports.Console, {
    level: 'notice',
    colorize: 'true'
});
logger.add(winston.transports.File, {
    filename: DEBUG_LOG_PATH,
    maxsize: DEBUG_LOG_MAXSIZE
});

// set up the data log
winston.loggers.add(DATA_LOG_NAME);
var datalogger = winston.loggers.get(DATA_LOG_NAME);
datalogger.remove(winston.transports.Console);
datalogger.add(winston.transports.File, {
    filename: DATA_LOG_PATH,
    maxsize: DATA_LOG_MAXSIZE
});

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

exports.picycle = picycle;