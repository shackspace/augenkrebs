#!/usr/bin/env python3

import time
import os
import http.server
from config import *
from mpris2 import *
import history
import inspect
import urllib
import socket
import json


socket.setdefaulttimeout(2)


# read http files to RAM
pwd = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
files = {}
for filename in os.listdir(pwd + "/http"):
    try:
        with open(pwd+'/http/'+filename, 'r') as f:
            content = bytes(f.read(),"UTF-8")
        files["/"+filename] = content
    except Exception as e:
        print("WARNING: Can't read file "+filename+" (please clean up the http folder :p)")

hist = history.history()

# This is the server code
class byteplayer(http.server.BaseHTTPRequestHandler):
    # API calls
    def do_POST(s):
        length = int(s.headers['Content-Length'])
        post   = urllib.parse.parse_qs(s.rfile.read(length).decode('utf-8'))
        
        if "do" in post:
            action = post["do"][0]
            host = s.client_address[0]
            
            # not sure if this try catch is necessary
            try: host = socket.gethostbyaddr(host)[0]
            except: pass
            
            if action != "open": print(host + ": " + action);
            
            if action == "open" and "url" in post:
                url = post["url"][0]
                hist.append(url)
                print(host + " wants to watch: " +url+"\n" \
                    + "Trying to play this with " + player_name + " directly...")
                append_to_tracklist(url)

                time.sleep(0.6)
                status = mpris2_get("PlaybackStatus")
                if status == "Stopped":
                    print("STUB: " + player_name + " can't play this directly.\n" \
                    + "STUB: Livestreamer etc. support isn't (re-)implemented yet.")
                else:
                    print("Success! Buffering might take some time though.")
            
            
            elif action == "pause":     
                allow_playback()
                player.PlayPause()
            elif action == "stop":      stop_playback()
            elif action == "seek":      player.Seek(MPRIS2_SEEK_VALUE)
            elif action == "seek_back": player.Seek(-1*MPRIS2_SEEK_VALUE)
            elif action == "set_pos":   print("STUB: Seeking via the seekbar isn't implemented yet, use the buttons below for now.")
                # This would be the right way, but VLC crashes
                # player.SetPosition(post["val"][0])
            elif action == "set_vol":
                mpris2_set("Volume", float(post["val"][0]) / 100 )
            elif action == "delete_from_tracklist":
                delete_from_tracklist(int(post["index"][0]))
                
        
        s.do_GET() # return index.html
    # Static files
    def do_GET(s):
        s.send_response(200)
        s.end_headers()
        
        if s.path == "/": s.path = "/index.html"
        if s.path == "/status":
            s.wfile.write(bytes(json.dumps({
                "meta": mpris2_get("Metadata"),
                "pos":  mpris2_get("Position"),
                "vol":  float(mpris2_get("Volume")),
                "tracklist": get_tracklist_titles()
            }),"UTF-8"))
        elif s.path in files: s.wfile.write(files[s.path])
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
