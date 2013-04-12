picycle
=============

Raspberry Pi as data logging device (GPS, vehicle proximity, temperature, webcam) in Node.JS

Project vision: pi, powered by batteries, attached to a bicycle. All these sensors feed in data, which can the be uploaded and analysed. 
We could figure out the exact roads and pinpoint dangerous spots, based on the proximity of cars to cyclists.
We could improve road safety by collating all collected data together. We could investigate trends into dangerous roads.
We could estimate vehicle speed (GPS, proximity sensors, webcam, measuring doppler effect and tyre noise).  We could even do Automatic NumberPlate Recognition.

This is my final year project at University, on BSc Computer Science.

There are two main parts: pi and web

pi
========
Yep, you guessed it: this stuff runs on the Raspberry Pi. There are some things in there that are pi-only, such as the packages for gpio.

web
========
This is a HTTP server to draw pretty maps of the data.
