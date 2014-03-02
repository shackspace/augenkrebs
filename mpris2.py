from config import *
import dbus
import os
import subprocess
import time
from sys import stderr


# Open the MPRIS2 player and connect to it via DBUS/MPRIS2
os.environ['DISPLAY'] = DISPLAY
player_process = subprocess.Popen([MPRIS2_PLAYER_CMD] + MPRIS2_PLAYER_ARGS)


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
	last_track = get_tracklist()[-1:]
	last_track = no_track if not last_track else last_track[0]
	track_list.AddTrack(url,last_track,False)

def get_tracklist():
	tracklist = prop.Get('org.mpris.MediaPlayer2.TrackList','Tracks')
	return tracklist

def get_tracklist_urls():
	""" Returns a list of all track URLs from the current TrackList. """
	track_url_list = []
	for track_metadata in track_list.GetTracksMetadata(get_tracklist()):
		track_url_list.append(str(track_metadata[dbus.String('xesam:url')]))
	return track_url_list
