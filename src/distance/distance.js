var gpio = require('gpio');
var microtime = require('microtime');

var PIN = 12; // use this pin for the ultrasonic distance sensor

gpio12 = gpio.export(12, {
    direction: 'out',
    ready: function() {
        console.log(microtime.nowDouble() + ' - pin12 ready');
        if (gpio12.value == 1) {
            gpio12.reset(); // assure there is no signal on the pin.
        }
        setTimeout(getDistance, 1000);
        setTimeout(die, 10000);
    }
});


alpha = 0;
beta = 0;

gpio12.on('change', function(val) {
    console.log(microtime.nowDouble() + ' - change on pin12: ' + val);
    // if (gpio12.direction == 'inX') {
    if (val == 1) {
        alpha = microtime.nowDouble();
    } else if (val == 0) {
        beta = microtime.nowDouble();
        gamma = beta - alpha;
        cm = Math.round(34320.48 * gamma);
        console.log('CM: ' + cm + ', gamma: ' + gamma);
    }
    // }
    // if (val == 0) {
    //     setTimeout(getDistance, 1000);
    // }
});

getDistance = function() {
    alpha = 0;
    beta = 0;

    if (gpio12.direction == 'in') {
        gpio12.setDirection('out');
        while (microtime.nowDouble() < now + 0.00075) {}
    }

    var now = microtime.nowDouble();

    gpio12.set();
    while (microtime.nowDouble() < now + 0.00075) {}

    console.log(microtime.nowDouble() + ' - pin12 set');
    gpio12.setDirection('in');

    // console.log('val before while: ' + gpio12.value);
    //while (gpio12.value == 0) {
    // wait for 0, then start
    //}

    // alpha = microtime.nowDouble(); // start timing
    // delta = 0;
    // while (gpio12.value == 1) {

    // }
    // beta = microtime.nowDouble();
    // gamma = beta - alpha;
    // cm = Math.round(34320.48 * gamma);
    // console.log('CM: ' + cm + ', gamma: ' + gamma);
    //setTimeout(getDistance, 1000);
}


die = function() {
    gpio12.removeAllListeners('change');
    gpio12.reset();
    gpio12.unexport(function() {
        process.exit();
    });
}