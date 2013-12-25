import web
from web import form 
import os
import sys
import subprocess, shlex
sys.path.append(os.path.dirname(__file__))

from config import *
render = web.template.render(TEMPLATEDIR)

class byteplayer:
	def __init__(self):
		os.environ['DISPLAY'] = DISPLAY # maybe it's sufficient to only set this once, e.g. during program startup
		pass
		#self.mplayer_process = None
	
	def GET(self,url):
		params = web.input()
		try:
			if params.do == "play":
				self.play(params.videourl)
			elif params.do == "stop":
				self.stop()
			else:
				raise ValueError("Illegal value for URL parameter 'do'")
		except AttributeError:
			pass #AttributeErrors are raised if some URL parameters are not passed, so we can safely ignore them here
		web.header("Content-Type", 'text/html')
		return render.byteplayer()

	def play(self,url):
		playback_url = subprocess.check_output(["youtube-dl"] + YOUTUBEDLARGS + [url])
		commandline = TERMINALEMULATOR + " " + MPLAYER + " " + MPLAYERARGS + " " + playback_url
		#commandline = "urxvt -e " + commandline
		commandline = shlex.split(commandline)
		subprocess.Popen(commandline)

	def stop(self):
		subprocess.call(["killall","-9",MPLAYER])
