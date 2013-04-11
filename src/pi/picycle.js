// First things first, set up logging!
var logging = require('./logging');
var log_config = logging.Config_logging();
var logger = logging.Logging().get(log_config.DEBUG_LOG_NAME);
var datalogger = logging.Logging().get(log_config.DATA_LOG_NAME);

var gps = require('./gps/gps');
var distance = require('./distance/distance-socket').distance;

logger.debug('debug test');
logger.info('info test');
logger.warn('warning test');
logger.error('error test');

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