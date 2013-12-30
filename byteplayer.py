import web
from web import form 
import os
import sys
import subprocess
sys.path.append(os.path.dirname(__file__))

from config import *
render = web.template.render(TEMPLATEDIR)

class byteplayer:
	def __init__(self):
		os.environ['DISPLAY'] = DISPLAY # maybe it's sufficient to only set this once, e.g. during program startup
		if not os.path.exists(MPLAYER_PIPE_NAME):
			os.mkfifo(MPLAYER_PIPE_NAME)
	
	def GET(self,url):
		params = web.input()
		try:
			if params.do == "open":
				self.open(params.videourl)
			elif params.do == "pause":
				self.pause()
			elif params.do == "stop":
				self.stop()
			else:
				raise ValueError("Illegal value for URL parameter 'do'")
		except AttributeError:
			pass #AttributeErrors are raised if some URL parameters are not passed, so we can safely ignore them here
		web.header("Content-Type", 'text/html')
		return render.byteplayer()
	
	def open(self,url):
		# TODO: improve code, the try catch stuff prints an
		# exception to the terminal!
		# Also to avoid nested try catch statements, create a wrapper
		# function as soon as there are more URL grabbers
		try:
			url = subprocess.check_output(["youtube-dl"] + YOUTUBEDLARGS + [url])
		except:
			# TODO: try livestreamer etc.
			pass
		
		commandline = TERMINALEMULATOR + [MPLAYER] + MPLAYERARGS + [url]
		subprocess.Popen(commandline)
	
	def stop(self):
		subprocess.call(["killall","-9",MPLAYER])

	def pause(self):
		pipein = open(MPLAYER_PIPE_NAME,'w')
		pipein.write('pause\n')
		pipein.close()
