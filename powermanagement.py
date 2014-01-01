import web
from web import form 
import os
import sys
import subprocess
sys.path.append(os.path.dirname(__file__))

from config import *

class powermanagement:
	def GET(self,url):
		params = web.input()
		try:
			if params.action == "suspend":
				self.suspend()
				raise web.seeother('/')
			else:
				raise ValueError("Invalid action name submitted to powermanagement.py")
		except AttributeError:
			pass

	def POST(self,url):
		return self.GET(url)

	def suspend(self):
		subprocess.Popen(SUSPEND_COMMAND)
