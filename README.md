picycle
=============

Raspberry Pi as data logging device (GPS, vehicle proximity, temperature, webcam) in Node.JS

Project vision: a pi powered by batteries, collecting useful data on a bicycle. Sensors feed in data, which can be visualises in all sorts of ways. 
Sensors would be (as a start):
- GPS
- Proximity (ultrasonis or infrared)
- Temperature, light, humidity... anything!

With the data, we could:
- Pinpoint dangerous spots, based on the proximity of cars to cyclists
- Find trends in data
- Make improvements to cycle safety

Maybe we could estimate vehicle speed by calculating doppler effect on tire noise.
Maybe we could find out what time of day (and why) a part of the road is more dangerous.
Maybe we could do Automatic NumberPlate Recognition.

This is my final year project at University, on BSc Computer Science.

There are two main parts: pi and web

caution
========
This software is in development, and probably will not run properly, yet.

pi
========
Yep, you guessed it: this stuff runs on the Raspberry Pi. There are some things in there that are pi-only, such as the packages for gpio.

web
========
This is a HTTP server to draw pretty maps of the data.
