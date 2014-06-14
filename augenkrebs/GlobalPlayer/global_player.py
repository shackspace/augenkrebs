import queue
import threading

global_queue = queue.Queue()

class GlobalThread(threading.Thread):

    def run(self):
        while True:
            task = global_queue.get()

            if task['action'] == 'start':

                pass

            elif task['action'] == 'stream':
                pass
            elif task['action'] == 'get_status':
                pass
            elif task['action'] == 'change_status':
                pass


def callme(*args):
    global_queue.put({'action': 'stream'})

