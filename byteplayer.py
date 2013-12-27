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
			if params.do == "play":
				if params.urltype == "youtubedl":
					self.youtubedl_play(params.videourl)
				elif params.urltype == "plainurl":
					self.plainurl_play(params.videourl)
				else:
					raise ValueError("Illegal value for URL parameter 'urltype'")
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

	def youtubedl_play(self,url):
		playback_url = subprocess.check_output(["youtube-dl"] + YOUTUBEDLARGS + [url])
		self.plainurl_play(playback_url)

	def livestreamer_play(self,url):
		raise NotImplementedError("livestreamer integration is not implemented yet")
		#TODO implement livestreamer integration

	def plainurl_play(self,url):
		commandline = TERMINALEMULATOR + [MPLAYER] + MPLAYERARGS + [url]
		subprocess.Popen(commandline)
		#this function together with urltype=plainurl might come in handy when implementing a video database

	def stop(self):
		subprocess.call(["killall","-9",MPLAYER])

	def pause(self):
		pipein = open(MPLAYER_PIPE_NAME,'w')
		pipein.write('pause\n')
		pipein.close()
