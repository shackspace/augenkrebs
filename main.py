#!/usr/bin/env python2
# -- coding: utf-8 --
# vim: ts=2 sts=2 sw=2 expandtab
#
# TODO: Find an elegant way to print meaningful errors
#       (which is NOT replacing every line with 5 lines
#		(try cmd except print quit)!)
#
# TODO: sort this import stuff, don't mix it with anything
#
import web
import cgi
web.config.debug = True

import sys
import os
import time
import datetime
import dbus

sys.path.append(os.path.dirname(__file__))
from config import *
from byteplayer import *
from powermanagement import *


# Open the MPRIS2 player and connect to it via DBUS/MPRIS2
os.environ['DISPLAY'] = DISPLAY
line = [MPRIS2_PLAYER_CMD] + MPRIS2_PLAYER_ARGS
subprocess.Popen(line)

proxy = dbus.SessionBus().get_object(MPRIS2_PLAYER_NAME,'/org/mpris/MediaPlayer2')
prop = dbus.Interface(proxy, 'org.freedesktop.DBus.Properties')
print "Connected to: " + prop.Get('org.mpris.MediaPlayer2', 'Identity')


# Open the webserver
urls = (
	'/powermanagement(.*)', 'powermanagement',
	'/(.*)', 'byteplayer'
    )
app = web.application(urls, globals())
try:
	if __name__ == "__main__":
		app.run()
except:
	print ""
	print "Couldn't start the webserver!"
	print "Maybe port 8080 is already in use?"
	print "Try another one like this:"
	print "  ./main.py 1337"
	print ""
	quit()
application = app.wsgifunc()
