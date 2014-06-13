import web
from web import form 
import os
import sys
import subprocess
sys.path.append(os.path.dirname(__file__))

from config import *
from mpris2 import *
render = web.template.render(TEMPLATEDIR)

class byteplayer:
	def quit(self):
		# close mpris2 player via dbus!
		print "STUB"
		
	def GET(self,url):
		params = web.input()
		try:
			if params.do == "Open":
				self.open(params.videourl)
			elif params.do == "Pause":
				self.pause()
			elif params.do == "Stop":
				self.stop()
			else:
				raise ValueError("Illegal value for URL parameter 'do'")
		except AttributeError:
			pass #AttributeErrors are raised if some URL parameters are not passed, so we can safely ignore them here
		if url != "": #redirect to main page after submitting via GET
			raise web.seeother('/')
		else:
			web.header("Content-Type", 'text/html')
			return render.byteplayer()

	def POST(self,url):
		return self.GET(url)

	def plainurl_play(self,url):
		commandline = TERMINALEMULATOR + [MPLAYER] + MPLAYERARGS + [url]
		subprocess.Popen(commandline)
		
	def youtubedl_play(self,url):
		playbackurl = subprocess.check_output(["youtube-dl"] + YOUTUBEDLARGS + [url])
		self.plainurl_play(playbackurl)

	def livestreamer_play(self,url):
		commandline = TERMINALEMULATOR + ["livestreamer",url] + LIVESTREAMERARGS
		subprocess.Popen(commandline)

	def open(self,url):
		#self.stop() #before opening a new video, stop any video potentially still running
		#TODO implement timeouts for calls to video URL processors like youtube-dl
		#for playfunc in [self.youtubedl_play,self.livestreamer_play,self.plainurl_play]:
		#	try:
		#		playfunc(url)
		#		break
		#	except:
		#		continue
		
		
		print "Someone wants to watch: " +url
		print "Trying to play this with " + player_name + " directly..."
		player.OpenUri(url)
		player.Play()
		
		status = mpris2_status()
		if status == "Stopped":
			print "STUB: " + player_name + " can't play this directly."
			print "STUB: Livestreamer etc. support isn't (re-)implemented yet."
		else:
			print "Success! Buffering might take some time though."
	
	def stop(self):
		player.Stop()

	def pause(self):
		player.PlayPause()
	def log_message(self, format, *args):
		return
