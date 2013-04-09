var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var sys = require('sys');
var io = require('socket.io').listen(8000);
var pythonStream;


io.set('log level', 1); // don't show all the debug stuff

// start python stream
var start = function() {
    var self = this;
    pythonStream  = spawn('python', ['distance/distance-socket.py']);
    
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
    console.log(pythonStream.pid);
    console.log('killing the python stream');
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