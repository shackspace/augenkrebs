#!/usr/bin/env python3

import time
import os
import http.server
from config import *
from mpris2 import *
import inspect
import urllib
import socket


socket.setdefaulttimeout(2)


# read http files to RAM
pwd = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
files = {}
for filename in os.listdir(pwd + "/http"):
	with open(pwd+'/http/'+filename, 'r') as f:
		content = bytes(f.read(),"UTF-8")
	files["/"+filename] = content

# This is the server code
class byteplayer(http.server.BaseHTTPRequestHandler):
	# API calls
	def do_POST(s):
		length = int(s.headers['Content-Length'])
		post   = urllib.parse.parse_qs(s.rfile.read(length).decode('utf-8'))
		
		if "do" in post:
			host = socket.gethostbyaddr(s.client_address[0])[0]
			action = post["do"][0]
			
			if action != "open": print(socket.gethostbyaddr(host) + ": " + action);
			
			if action == "open" and "url" in post:
				url = post["url"][0]
				print(host + " wants to watch: " +url+"\n" \
					+ "Trying to play this with " + player_name + " directly...")
				player.OpenUri(url)
				player.Play()
				
				status = mpris2_status()
				time.sleep(0.6)
				if status == "Stopped":
					print("STUB: " + player_name + " can't play this directly.\n" \
					+ "STUB: Livestreamer etc. support isn't (re-)implemented yet.")
				else:
					print("Success! Buffering might take some time though.")
			
			
			elif action == "pause":		player.PlayPause()
			elif action == "stop":		player.Stop()
			elif action == "seek":		player.Seek(MPRIS2_SEEK_VALUE)
			elif action == "seek_back":	player.Seek(-1*MPRIS2_SEEK_VALUE)
		
		s.do_GET() # return index.html
	# Static files
	def do_GET(s):
		s.send_response(200)
		s.end_headers()
		
		if s.path == "/": s.path = "/index.html"
		if s.path in files: s.wfile.write(files[s.path])
		else:
			s.wfile.write(bytes("404","UTF-8"))
	def log_message(self, format, *args):
		return

print("Running httpd")
httpd = http.server.HTTPServer(('', PORT), byteplayer)
try:
	httpd.serve_forever()
except KeyboardInterrupt:
	pass
httpd.server_close()
