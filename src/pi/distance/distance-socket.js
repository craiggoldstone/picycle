var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var sys = require('sys');
var io = require('socket.io').listen(8000);
var pythonStream;
var winston = require('winston');

var logger = winston.loggers.get('picycle-debug');

io.set('log level', 1); // don't show all the debug stuff

// start python stream
var start = function() {
    logger.debug('distance-socket started');
    var self = this;
    pythonStream  = spawn('python', ['distance/distance-socket.py']);
    logger.debug('distance-socket python child process started, pid:' + pythonStream.pid);
    // listen for the 'distance' message on socket
    io.sockets.on('connection', function (socket) {
        socket.on('distance', function(data) {
            // emit an event with the distance data
            self.emit('tick', data);
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
    return this;
}

distance.prototype = Object.create(EventEmitter.prototype);

exports.distance = distance;