var fs = require('fs');
var Lazy = require('lazy');
var moment = require('moment');

var filename = process.argv[2];

var rs = fs.createReadStream(filename);


new Lazy(rs).lines.forEach(function (line) {
    data = JSON.parse(line);
    message = data.message;

    // have to use the inaccurate LOG timestamp, because GPS isn't sending a timestamp??? Awwww HELL nawww
    time = moment(data.timestamp).toString();
    label = message.label;
    gps = 'NO GPS';
    if (label == 'distance') {
        coords = (message.lastReadGPS) ? message.lastReadGPS.geometries.coordinates :'NO-GPS';
        
        // another hack. If no altitude is returned, assume 0. Hopefully our map will stick to the ground level....
        if (coords != 'NO-GPS' && !coords[2]) {
          coords[2] = 0;
        }
        console.log(label + ', ' + time + ', ' + message.distance + 'cm, ' + coords)
    } else if (label == 'location') {
        distance = (message.lastReadDistance) ? message.lastReadDistance.distance : 'NO-DISTANCE';
        
        // same hack as line 21, dammit!
        if (!message.geometries.coordinates[2]) {
          message.geometries.coordinates[2] = 0;
        }
        console.log(label + ', ' + time + ', ' + distance + 'cm, ' + message.geometries.coordinates)
    }    
})

/* example lines:
{ level: 'info',
  message: 
   { timestamp: null,
     latitude: 50.7936404,
     longitude: -1.06770525,
     speed: 2.54,
     geometries: { type: 'Point', coordinates: [Object] },
     label: 'location',
     lastReadDistance: { distance: 349, time: 1365799956.48 } },
  timestamp: '2013-04-12T20:52:36.627Z' }
{ level: 'info',
  message: 
   { distance: 55,
     time: 1365799956.59,
     label: 'distance',
     lastReadGPS: 
      { timestamp: null,
        latitude: 50.7936404,
        longitude: -1.06770525,
        speed: 2.54,
        geometries: [Object],
        label: 'location' } },
  timestamp: '2013-04-12T20:52:36.638Z' }
*/
