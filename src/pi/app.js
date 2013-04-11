// First things first, set up logging!
var logging = require('./logging');
var log_config = logging.Config_logging();
var logger = logging.Logging().get(log_config.DEBUG_LOG_NAME);
var datalogger = logging.Logging().get(log_config.DATA_LOG_NAME);

var gps = require('./gps/gps');
var distance = require('./distance/distance-socket').distance;

var picycle = {
    'gps': new gps(),
    'distance': new distance()
}

picycle.gps.on('location', function (location) {
    logger.debug('got new location: ' + location.latitude + ',' + location.longitude);
    datalogger.info(location);
});

picycle.gps.once('location', function (location) {
    logger.info('receiving data from GPS stream... OK!');
});

picycle.distance.start();

picycle.distance.on('tick', function (data) {
    logger.debug('got new distance: ' + data.distance + ' time: ' + data.time);
    datalogger.info(data);
});

picycle.distance.once('tick', function (data) {
    logger.info('receiving data from distance sensor... OK!');
});

process.on('exit', function() {
  logger.info('picycle about to exit. Uptime: ' + Math.round(process.uptime()) + ' seconds.');
});

process.on( 'SIGINT', function() {
  logger.info("gracefully shutting down from  SIGINT (Ctrl-C)");
  process.exit();
});

exports.picycle = picycle;
