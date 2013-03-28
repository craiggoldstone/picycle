var rpio = require('rpio');
//var async = require('async');
var microtime = require('microtime');

var lastRead = -1;

var PIN = 12; // use this pin for the ultrasonic distance sensor

var setup = false;
var measureDistance = function() {
    console.log('start measuring');
    // set up gpio pin 12 as output
    if (!setup) {
        rpio.setOutput(12);
        setup = true;
    }
    var alpha = 0;
    var beta = 0;
    var gamma = 0;
    var delta = 0;
    var inch = 0;
    var cm = 0;

    var lowSent = false;
    // ensure there is no signal to parallax ping: set pin to 0
    //rpio.write(12, rpio.LOW);
    while (rpio.read(PIN) != 0) {
        // blocking wait until there is no signal.
        if (!lowSent) {
            rpio.write(PIN, rpio.LOW);
            lowSent = true;
            // console.log('sent LOW');
        }
        // console.log('waiting for LOW');
    }

    // send a high signal to pin 12
    rpio.write(PIN, rpio.HIGH);
    // console.log('sent HIGH to start read');


    var now = microtime.nowDouble();
    // while (microtime.nowDouble() < now + 0.00075) {
    //     // blocking wait
    // }

    // console.log('current read: ' + rpio.read(PIN));

    rpio.setInput(PIN);

    while (rpio.read(PIN) == rpio.LOW) {
        // busy waiting
        // console.log('waiting for pulse to start');
    }
    alpha = microtime.nowDouble();


    while (rpio.read(PIN) == 1 || delta < 20) {
        delta = delta + 1;
        // console.log('current read: ' + rpio.read(PIN) + ' (delta: ' + delta + ')');
    }
    // console.log('pulse ended - current read: ' + rpio.read(PIN));
    beta = microtime.nowDouble();
    gamma = beta - alpha;

    inch = Math.round(13512 * gamma);
    cm = Math.round(34320.48 * gamma);

    if (gamma > 0) {
        //if (gamma > 0 
        //&& (gamma > lastRead + gamma*0.1 || gamma < lastRead - gamma*0.1)
        //&& cm > 5) {
        console.log('CM: ' + cm + ' gamma: ' + gamma);
        lastRead = gamma;
    } else {
        console.log('gamma unreadable: ' + gamma);
    }

    setTimeout(function() {
        measureDistance();
    }, 1000);
}


setTimeout(function() {
    measureDistance();
}, 1000);
//while(true) {
//    measureDistance();
//}