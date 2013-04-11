var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var sys = require('sys');
var io = require('socket.io').listen(8000);
var pythonStream;
var logging = require('../logging');

// get the loggers
var log_config = logging.Config_logging();
var logger = logging.Logging().get(log_config.DEBUG_LOG_NAME);
io.set('log level', 1); // don't show all the debug stuff

var lastread = {};

// start python stream
var start = function() {
    logger.debug('distance-socket started');
    var self = this;
    pythonStream  = spawn('python', ['distance/distance-socket.py']);
    logger.info('distance-socket python child process started, pid: ' + pythonStream.pid);
    // listen for the 'distance' message on socket
    io.sockets.on('connection', function (socket) {
        socket.on('distance', function(data) {
            // emit an event with the distance data
            self.emit('tick', data);
            lastread = data;
        });
    });
}

// stop python stream
var stop = function() {
    logger.info('killing the gps python stream');
    pythonStream.kill('SIGHUP');
}

function distance() {
    EventEmitter.call(this);
    this.start = start;
    this.stop = stop;
    this.lastread = function() {
        return lastread;
    }
    return this;
}

distance.prototype = Object.create(EventEmitter.prototype);

logger.info('Distance set up OK!');

exports.distance = distance;