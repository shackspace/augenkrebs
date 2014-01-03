#!/usr/bin/env python2
# -- coding: utf-8 --
# vim: ts=2 sts=2 sw=2 expandtab

import web
import cgi
web.config.debug = True

import sys
import os
import time
import datetime

sys.path.append(os.path.dirname(__file__))
from config import *
from byteplayer import *
from powermanagement import *

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
