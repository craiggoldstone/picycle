var fs = require('fs');
var Lazy = require('lazy');

var rs = fs.createReadStream('logs/picycle.log');

new Lazy(rs).lines.forEach(function (line) {
    console.log(JSON.parse(line).message.distance);
})