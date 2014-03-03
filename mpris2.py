from config import *
import dbus
import os
import subprocess
import time
from sys import stderr
import atexit
import threading
import queue


# Open the MPRIS2 player and connect to it via DBUS/MPRIS2
os.environ['DISPLAY'] = DISPLAY
player_process = subprocess.Popen([MPRIS2_PLAYER_CMD] + MPRIS2_PLAYER_ARGS)
atexit.register(player_process.terminate) 

# Try to connect to DBUS with a timeout
player_name = None
player = None
for i in range(0, MPRIS2_CONNECT_TIMEOUT*10):
	try:
		proxy = dbus.SessionBus().get_object(MPRIS2_PLAYER_NAME,'/org/mpris/MediaPlayer2')
		prop = dbus.Interface(proxy, 'org.freedesktop.DBus.Properties')
		player = dbus.Interface(proxy, 'org.mpris.MediaPlayer2.Player')
		player_name = prop.Get('org.mpris.MediaPlayer2', 'Identity')
		track_list = dbus.Interface(proxy, 'org.mpris.MediaPlayer2.TrackList')
		no_track = dbus.SessionBus().get_object(MPRIS2_PLAYER_NAME,'/org/mpris/MediaPlayer2/TrackList/NoTrack')
		break
	except:
		time.sleep(0.1)
	
if player_name == None:
	print("Couldn't connect to mpris2 player via D-Bus in " + str(MPRIS2_CONNECT_TIMEOUT) + "s, giving up! \n" \
		+ " You can increase the MPRIS2_CONNECT_TIMEOUT in the config file. \n" \
		+ " Now trying to terminate the player process with SIGTERM. ", file=stderr)
	player_process.terminate()
	quit(1)

print("Connected to: " + player_name)

def mpris2_get(what):
	return prop.Get('org.mpris.MediaPlayer2.Player', what)

def mpris2_set(what,value):
	return prop.Set('org.mpris.MediaPlayer2.Player', what, value)


def append_to_tracklist(url):
	_tracklist.put(url)

def get_tracklist():
	return list(_tracklist.queue) #attention, this depends on the implementation of queue.Queue

def get_tracklist_titles():
	""" Returns a list of all track titles from the current TrackList. """
	return get_tracklist() #until we parse out the metadata, we just return the URLs
	#track_title_list = []
	#for track_metadata in track_list.GetTracksMetadata(get_tracklist()):
	#	try:
	#		track_title = str(track_metadata[dbus.String('xesam:title')])
	#	except:
	#		track_title = str(track_metadata[dbus.String('xesam:url')])
	#	track_title_list.append(track_title)
	#return track_title_list

_tracklist = queue.Queue()

def queue_thread_fun():
	while True:
		try:
			current_track_length = mpris2_get("Metadata")[dbus.String("mpris:length")]
			pos = mpris2_get("Position")
			remaining = (current_track_length - pos)/(10**6) #convert from μs to s
		except Exception as e:
			print("queue_thread caught exception ")
			print(e)
			remaining = 0
			time.sleep(2)
			continue
		if remaining >= 0 and remaining <= 2:
			time.sleep(remaining+0.1) #sleep for the remaining duration of the track plus 0.1 seconds
			player.OpenUri(_tracklist.get()) #play next track
		else:
			time.sleep(2) #sleep for two seconds, then poll again

queue_thread = threading.Thread(target=queue_thread_fun)
queue_thread.daemon = True
queue_thread.start()

