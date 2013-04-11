var winston = require('winston');
var fs = require('fs');

var config_logging = function() {
    this.LOG_DIR = './logs/';
    this.DATA_LOG_NAME = 'picycle';
    this.DEBUG_LOG_NAME = 'picycle_debug';
    this.DATA_LOG_PATH = this.LOG_DIR + this.DATA_LOG_NAME + '.log';
    this.DEBUG_LOG_PATH = this.LOG_DIR + this.DEBUG_LOG_NAME + '.log';
    this.DATA_LOG_MAXSIZE = 1024 * 1024 * 10; // 10MB
    this.DEBUG_LOG_MAXSIZE = 1024 * 1024 * 10; // 10MB
    return this;
}
var config = new config_logging();

// create log directory
fs.mkdir(config.LOG_DIR, function(err) {
      if (err && err.code == 'EEXIST') {
      } else if (err) {
          throw err;
      }
});

var customLevels = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  },
  colors: {
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
  }
};

// create the logger
var logger = new(winston.Logger)({
  level: 'debug',
  levels: customLevels.levels,
  transports: [
  // setup console logging
    new(winston.transports.Console)({
      level: 'info',
      levels: customLevels.levels,
      colorize: true
    }),
    // setup logging to file
    new(winston.transports.File)({
      filename: config.DEBUG_LOG_PATH,
      maxsize: config.DEBUG_LOG_MAXSIZE,
      level: 'debug',
      levels: customLevels.levels
    })
  ]
});

winston.addColors(customLevels.colors)

// create the data logger
var datalogger = new (winston.Logger) ({
  level: 'info',
  transports: [
    new (winston.transports.File) ({
      filename: config.DATA_LOG_PATH,
      maxsize: config.DEBUG_LOG_MAXSIZE
    })
  ]
});


var Logging = function() {
    var loggers = {};

    if (Logging.prototype._singletonInstance) {
        return Logging.prototype._singletonInstance;
    }

    this.getLogger = function(name) {
        return loggers[name];
    }

    this.get = this.getLogger;

    loggers[config.DEBUG_LOG_NAME] = logger;
    loggers[config.DATA_LOG_NAME] = datalogger;

    Logging.prototype._singletonInstance = this;
};

new Logging();

logger.info('Logging set up OK!');

exports.Logging = Logging;
exports.Config_logging = config_logging;