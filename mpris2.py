from config import *
import dbus
import os
import subprocess
import time


# Open the MPRIS2 player and connect to it via DBUS/MPRIS2
os.environ['DISPLAY'] = DISPLAY
subprocess.Popen([MPRIS2_PLAYER_CMD] + MPRIS2_PLAYER_ARGS)


# Try to connect to DBUS with a timeout
connected = False
player = False
for i in xrange(0, MPRIS2_CONNECT_TIMEOUT*10):
	try:
		proxy = dbus.SessionBus().get_object(MPRIS2_PLAYER_NAME,'/org/mpris/MediaPlayer2')
		prop = dbus.Interface(proxy, 'org.freedesktop.DBus.Properties')
		player = dbus.Interface(proxy, 'org.mpris.MediaPlayer2.Player')
		connected = True
		break
	except:
		time.sleep(0.1)
	
if connected == False:
	print "Couldn't connect to mpris2 player via D-Bus in " + str(MPRIS2_CONNECT_TIMEOUT) + "s, giving up!"
	print "You can increase the MPRIS2_CONNECT_TIMEOUT in the config file."
	print "The player process is still open, you'll have to kill it manually."
	quit()

print "Connected to: " + prop.Get('org.mpris.MediaPlayer2', 'Identity')
