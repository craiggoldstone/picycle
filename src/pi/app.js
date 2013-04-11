// First things first, set up logging!
var logging = require('./logging');
var log_config = logging.Config_logging();
var logger = logging.Logging().get(log_config.DEBUG_LOG_NAME);
var datalogger = logging.Logging().get(log_config.DATA_LOG_NAME);

logger.info('picycle started, pid:' + process.pid);

var gps = require('./gps/gps');
var distance = require('./distance/distance-socket').distance;

var picycle = {
    gps: new gps(),
    distance: new distance()
}

// listen for GPS locations. Frequency varies!
picycle.gps.on('location', function (location) {
    location.label = 'location';
    location.lastReadDistance = picycle.distance.lastread();
    delete location.lastReadDistance.lastReadGPS;
    logger.debug('got new location: ' + location);
    datalogger.info(location);
});

// initial log to say things are OK
picycle.gps.once('location', function (location) {
    logger.info('receiving data from GPS stream... OK!');
});

// listen for ticking distance data. Roughly every 100ms
picycle.distance.on('tick', function (distance) {
    distance == distance || {};
    distance.distance = distance.distance || 500;
    
    // only log if distance less than 200
    if (distance.distance <= 200) {
      distance.label = 'distance';
      distance.lastReadGPS = picycle.gps.lastread;
      delete distance.lastReadGPS.lastReadDistance;
      logger.debug('got new distance: ' + distance);
      datalogger.info(distance);  
    }
    
});

// initial log to say things are OK
picycle.distance.once('tick', function (data) {
    logger.info('receiving data from distance sensor... OK!');
});

picycle.distance.start();

process.on('exit', function() {
  logger.info('picycle about to exit. Uptime: ' + Math.round(process.uptime()) + ' seconds.');
});

process.on( 'SIGINT', function() {
  logger.info("gracefully shutting down from  SIGINT (Ctrl-C)");
  process.exit();
});

exports.picycle = picycle;
