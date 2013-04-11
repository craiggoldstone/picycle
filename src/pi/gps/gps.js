var Bancroft = require('bancroft');
EventEmitter = require('events').EventEmitter;
var logging = require('../logging');

// get the loggers
var log_config = logging.Config_logging();
var logger = logging.Logging().get(log_config.DEBUG_LOG_NAME);

gps = function (options) {
  bancroft = new Bancroft();
  bancroft.options = options || {};

  
  bancroft.on('connect', function () {
      logger.debug('connected');
  });
  bancroft.on('location', function (location) {
      logger.debug('got new location: ' + location.latitude + ',' + location.longitude);
  });
  bancroft.on('satellite', function (satellite) {
      logger.debug('got new satellite state');
  });
  bancroft.on('disconnect', function (err) {
      logger.debug('disconnected');
  });

  return bancroft;
}

logger.info('GPS set up OK!');

module.exports = gps;
