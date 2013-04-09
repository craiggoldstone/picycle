var Bancroft = require('bancroft');
EventEmitter = require('events').EventEmitter;

gps = function(options) {
  bancroft = new Bancroft();
  bancroft.options = options || {};
  
  bancroft.on('connect', function() {
    if (bancroft.options.debug) {
      console.log('connected');
    }
  });
  bancroft.on('location', function(location) {
    if (bancroft.options.debug) {
      console.log('got new location: ' + location.latitude + ',' + location.longitude);
    }
  });
  bancroft.on('satellite', function(satellite) {
    if (bancroft.options.debug) {
      console.log('got new satellite state');
    }
  });
  bancroft.on('disconnect', function(err) {
    if (bancroft.options.debug) {
      console.log('disconnected');
    }
  });

  return bancroft;
}

module.exports = gps;