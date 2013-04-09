from urllib import urlopen
import websocket
import sys
import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
def handshake(host, port):
    u = urlopen("http://%s:%d/socket.io/1/" % (host, port))
    if u.getcode() == 200:
        response = u.readline()
        (sid, hbtimeout, ctimeout, supported) = response.split(":")
        supportedlist = supported.split(",")
        if "websocket" in supportedlist:
            return (sid, hbtimeout, ctimeout)
        else:
            raise TransportException()
    else:
        raise InvalidResponseException()

try:
    (sid, hbtimeout, ctimeout) = handshake("127.0.0.1", 8000) #handshaking according to socket.io spec.
except Exception as e:
    print e
    sys.exit(1)

ws = websocket.create_connection("ws://%s:%d/socket.io/1/websocket/%s" % ("127.0.0.1", 8000, sid))

while True:
   alpha = 0
   beta = 0
   gamma = 0
   delta = 0
   inch = 0
   cm = 0

   # set up gpio pin 12 as output
   GPIO.setup(12, GPIO.OUT)
   # Be sure there is no signal to parallax ping: pin 11, 0 = False
   GPIO.output(12, 0)

   # send parallax ping a signal: pin 11, 1 = True
   GPIO.output(12, 1)
         
   time.sleep(0.00075)
   # set up gpio pin 12 as input
   GPIO.setup(12, GPIO.IN)


   #GPIO.input(12)

   # Start time
   alpha = time.time()

   # while GPIP.input(12) == 1 and delta < 20:
   while GPIO.input(12) == 1:
      # while the pin is high, wait.
      delta = delta + 1
   else:
      # Stop time
      beta = time.time()
      gamma = beta - alpha
      # print parallax ping value
      # calc for speed of sound at inches per second should be "correct"
      #calc for speed at centimeters per second should be "correct"
      cm = round(34320.48 * gamma)
      #displays time, inches, cm should be the distance the object is from the device
      #print "Time: ", gamma
      #print "Inch: ", inch

      ws.send('2::')
      ws.send('5:1::{"name":"distance", "args":' + str(cm) + '}')
      #increase count by 1
      time.sleep(0.1)

print "Closing connection"
ws.close()