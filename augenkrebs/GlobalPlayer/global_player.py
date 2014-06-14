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
                pass
            elif task['action'] == 'change_status':
                pass


def callme(*args):
    global_queue.put({'action': 'stream'})

