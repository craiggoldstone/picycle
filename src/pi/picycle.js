var gps = require('./gps/gps');
var distance = require('./distance/distance-socket').distance;

var picycle = {
    'gps': new gps({'debug': false}),
    'distance': new distance(),
    'hello': 'world'
}

picycle.gps.on('location', function(location) {
    console.log('got new location: ' + location.latitude + ',' + location.longitude);
});

picycle.distance.start();

picycle.distance.on('tick', function(data) {
    console.log('distance: ' + data);
});

exports.picycle = picycle;