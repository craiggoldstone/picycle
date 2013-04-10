var Bancroft = require('bancroft');
EventEmitter = require('events').EventEmitter;
var winston = require('winston');

var logger = winston.loggers.get('picycle-debug');

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

module.exports = gps;