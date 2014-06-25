import queue
import threading
import subprocess
from GlobalPlayer.vlc import vlc

"""
  the global_player module provides:
   * the global_queue for communication with any GlobalThread object
     here, dictionaries with at least an 'action' and a 'response' field
   * the GlobalThread class for reacting to user input via the Flask server
     and controlling the vlc player
   * the call_me workaround function.
     To play a video stream such as a youtube video, one has to wait for an
     event from vlc, triggering a callback function. But this callback function
     cannot call another vlc function (such as play, which would be *really*
     nice). So we just queue another request in our global_queue from the
     outside call_me function. For a workaround, it's ok.
"""
global_queue = queue.Queue()


class GlobalThread(threading.Thread):
    """ The GlobalThread class reacts to user_input forwarded by the flask
        server to the global_queue. It processes the requests and controls
        the VLC player.
    """

    splashArguments = ["chromium", "--kiosk", "--incognito", "http://localhost:4000/icon"]

    def __init__(self, group=None, target=None, name=None, args=(), kwargs={}, *, daemon=None):
        super(GlobalThread, self).__init__()
        self.vlc_instance = vlc.Instance()
        self.vlc_player = self.vlc_instance.media_player_new()
        self.vlc_player.set_fullscreen(True)


    def run(self):
        while True:
            task = global_queue.get()

            if task['action'] == 'play' and not self.vlc_player.is_playing():
                self.hide_splashscreen()
                self.vlc_player.play()
                self.get_status(task['response'])

            elif task['action'] == 'pause' and self.vlc_player.is_playing():
                self.vlc_player.pause()
                self.get_status(task['response'])

            elif task['action'] == 'stop':
                self.show_splashscreen()
                self.vlc_player.stop()
                self.get_status(task['response'])

            elif task['action'] == 'open':
                self.hide_splashscreen()
                #TODO: find good rule for recognizing stream vs file
                if 'youtube' in task['url']:
                    task['response'].put({'status': 'trying'})

                    media = self.vlc_instance.media_new(task['url'])
                    self.vlc_player.set_media(media)
                    event_manager = self.vlc_player.event_manager()
                    event_manager.event_attach(\
                            vlc.EventType.MediaPlayerEndReached, callme)
                    self.vlc_player.play()

                else:
                    media = self.vlc_instance.media_new(task['url'])
                    self.vlc_player.set_media(media)
                    self.vlc_player.play()
                    task['response'].put({'status': 'success'})

            elif task['action'] == 'stream':
                try:
                    for item in self.vlc_player.get_media().subitems():
                        self.vlc_player.set_media(item)
                        self.vlc_player.play()
                except TypeError:
                    print("Whoops, no stream found!")

            elif task['action'] == 'get_status':
                self.get_status(task['response'])

            elif task['action'] == 'change_status':
                self.change_status(task['request'])
                self.get_status(task['response'])

            else:
                self.get_status(task['response'])

    def get_status(self, response_queue):
        """ get_status sends a complete status dictionary to the
            response_queue
        """
        #TODO: only return dict, don't call queue, but wth'
        response_dict = {}

        response_dict['play_status'] = str(self.vlc_player.get_state()).\
                split('.')[1]
        response_dict['length'] = self.vlc_player.get_length()
        response_dict['position'] = self.vlc_player.get_time()
        response_dict['muted'] = self.vlc_player.audio_get_mute()
        response_dict['volume'] = self.vlc_player.audio_get_volume()

        if self.vlc_player.get_media():
            response_dict['title'] = self.vlc_player.get_media().get_mrl()
        else:
            response_dict['title'] = ""


        audio_dict = {}
        for track in self.vlc_player.audio_get_track_description():
            audio_dict[track[0]] = track[1].decode()

        response_dict['audiotrack_list'] = list(audio_dict.values())
        response_dict['audio_delay'] = self.vlc_player.audio_get_delay()

        try:
            response_dict['audiotrack'] = audio_dict[self.vlc_player.\
                    audio_get_track()]
        except KeyError:
            response_dict['audiotrack'] = ""

        subtitle_dict = {}
        for track in self.vlc_player.video_get_spu_description():
            subtitle_dict[track[0]] = track[1].decode()

        response_dict['subtitle_list'] = list(subtitle_dict.values())
        response_dict['subtitle_delay'] = self.vlc_player.video_get_spu_delay()

        try:
            response_dict['subtitle'] = subtitle_dict[self.vlc_player.\
                    video_get_spu()]
        except KeyError:
            response_dict['subtitle'] = ""
                
        response_queue.put(response_dict)
        
    def change_status(self, request):
        """ change_status takes a request dictionary and will try to apply
            every requested status change contained
        """
        #TODO: ALL the input sanitizing
        for element in request.keys():
            if element == 'position':
                self.vlc_player.set_time(int(request[element]))

            elif element == 'subtitle':
                subtitle_dict = {}
                for track in self.vlc_player.video_get_spu_description():
                    subtitle_dict[track[1].decode()] = track[0]
                self.vlc_player.video_set_spu(subtitle_dict[request[element]])

            elif element == 'subtitle_delay':
                self.vlc_player.video_set_spu_delay(request[element])

            elif element == 'audiotrack':
                audio_dict = {}
                for track in self.vlc_player.audio_get_track_description():
                    audio_dict[track[1].decode()] = track[0]
                self.vlc_player.audio_set_track(audio_dict[request[element]])

            elif element == 'audio_delay':
                self.vlc_player.audio_set_delay(request[element])

            elif element == 'volume':
                self.vlc_player.audio_set_volume(request[element])

            elif element == 'muted':
                self.vlc_player.audio_set_mute(request[element])

    def show_splashscreen(self):
        # self.hide_splashscreen()
        subprocess.Popen(self.splashArguments)

    def hide_splashscreen(self):
        subprocess.Popen(["killall", "chromium"])
        

def callme(*args):
    """ see module doc string: workaround function """
    global_queue.put({'action': 'stream'})

