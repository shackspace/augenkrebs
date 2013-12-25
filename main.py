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
#import utils
from config import *
from byteplayer import *

urls = (
	'/(.*)', 'byteplayer'
    )


app = web.application(urls, globals())

if __name__ == "__main__":
  app.run()

application = app.wsgifunc()