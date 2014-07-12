import queue
import threading
import subprocess
from GlobalPlayer.player import Player

"""
  the thread module provides:
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
    player = Player()

    def run(self):
        while True:
            task = global_queue.get()

            try:
                function = getattr(self.player, task['action'])
                self.player.function(task)
            except:
                self.player.get_status(task['response'])
                

def callme(*args):
    """ see module doc string: workaround function """
    global_queue.put({'action': 'stream'})

