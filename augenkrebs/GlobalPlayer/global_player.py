import queue
import threading
from GlobalPlayer.vlc import vlc

global_queue = queue.Queue()

class GlobalThread(threading.Thread):
    def __init__(self, group=None, target=None, name=None, args=(), kwargs={}, *, daemon=None):
        super(GlobalThread, self).__init__()
        self.vlc_instance = vlc.Instance()
        self.vlc_player = self.vlc_instance.media_player_new()


    def run(self):
        while True:
            task = global_queue.get()

            if task['action'] == 'open':
                #TODO: find good rule for recognizing stream vs file
                if 'youtube' in task['url']:
                    task['response'].put({'status': 'trying'})

                    media = self.vlc_instance.media_new(task['url'])
                    self.vlc_player.set_media(media)
                    event_manager = self.vlc_player.event_manager()
                    event_manager.event_attach(vlc.EventType.MediaPlayerEndReached, callme)
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
                pass

    def get_status(self, response_queue):
        response_dict = {}

        response_dict['is_playing'] = self.vlc_player.is_playing()
        response_dict['length'] = self.vlc_player.get_length()
        response_dict['position'] = self.vlc_player.get_time()
        response_dict['title'] = self.vlc_player.get_mrl()

        response_dict['muted'] = self.vlc_player.audio_get_mute()
        response_dict['volume'] = self.vlc_player.audio_get_volume()

        response_dict['audiotrack_list'] = [str(track[1].decode()) for track in \
                self.vlc_player.audio_get_track_description()]
        response_dict['audio_delay'] = self.vlc_player.audio_get_delay()
        response_dict['audiotrack'] = response_dict['audiotrack_list'][self.vlc_player.audio_get_track()]

        response_dict['subtitle_list'] = [track[1].decode() for track in \
                self.vlc_player.video_get_spu_description()]
        response_dict['subtitle_delay'] = self.vlc_player.video_get_spu_delay()

        try:
            response_dict['subtitle'] = response_dict['subtitle_list'][self.vlc_player.video_get_spu()]
        except IndexError:
            response_dict['subtitle'] = ""
                

        for elem in response_dict.keys():
            print(elem + " " + str(response_dict[elem]))

        response_queue.put(response_dict)
        


def callme(*args):
    global_queue.put({'action': 'stream'})

