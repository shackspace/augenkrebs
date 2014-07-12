#!/usr/bin/env python3
"""
 augenkrebs provides a web interface to control the play-back of video
 files and youtube videos (via VLC)
"""
import os
import sys
import json
import queue
from flask import Flask
from flask import Response
from flask import request
from GlobalPlayer.thread import GlobalThread, global_queue
from GlobalPlayer.splashscreen import show_splashscreen


JSON = 'application/json'
STATIC_DIR = os.path.dirname(os.path.realpath(__file)) + '/frontend/public'
app = Flask(__name__, static_url_path='', static_folder=STATIC_DIR)


@app.route('/')
@app.route('/about')
@app.route('/icon')
def augenkrebs():
    """ see frontend directory for index.html """
    return app.send_static_file('index.html')


@app.route('/api/open', methods=['POST'])
def api_open():
    local_queue = queue.Queue()
    global_queue.put({'action': 'open',
                      'url': request.json['url'],
                      'response': local_queue})
    return Response(json.dumps(local_queue.get()), mimetype=JSON)


#TODO rewrite play/pause/stop into one routine
@app.route('/api/play', methods=['GET'])
def api_play():
    """ a GET request on /api/play starts the playback and returns the
        complete status of the player /api/status
    """
    local_queue = queue.Queue()
    global_queue.put({'action': 'play', 'response': local_queue})
    return Response(json.dumps(local_queue.get()), mimetype=JSON)


@app.route('/api/pause', methods=['GET'])
def api_pause():
    """ a GET request on /api/pause pauses the playback and returns the
        complete status of the player /api/status
    """
    local_queue = queue.Queue()
    global_queue.put({'action': 'pause', 'response': local_queue})
    return Response(json.dumps(local_queue.get()), mimetype=JSON)


@app.route('/api/stop', methods=['GET'])
def api_stop():
    """ a GET request on /api/stop stops the playback and returns the
        complete status of the player as on /api/status
    """
    local_queue = queue.Queue()
    global_queue.put({'action': 'stop', 'response': local_queue})
    return Response(json.dumps(local_queue.get()), mimetype=JSON)


@app.route('/api/playlist', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_playlist():
    local_queue = queue.Queue()
    task = {'response': local_queue}

    if request.method == 'GET':
        task['action'] = 'get_playlist'
    elif request.method == 'POST':
        task['action'] = 'playlist_append'
        task['url'] = request.json['url']
    elif request.method == 'PUT':
        task['action'] = 'new_playlist'
        task['list'] = request.json
    elif request.method == 'DELETE':
        task['action'] = 'clear_playlist'

    global_queue.put(task)
    return Response(json.dumps(local_queue.get()), mimetype=JSON)

@app.route('/api/playlist/play_next', methods=['GET'])
def api_play_next():
    local_queue = queue.Queue()
    global_queue.put({'action': 'play_next', 'response': local_queue})
    return Response(json.dumps(local_queue.get()), mimetype=JSON)


@app.route('/api/status', methods=['GET', 'POST'])
def api_status():
    """ * a GET request on /api/status returns the complete status of the
          player as JSON
        * a POST request can specify one or more items found in the status JSON
          and their desired new value. A JSON detailing the new state is
          returned
    """
    if request.method == 'GET':
        local_queue = queue.Queue()
        global_queue.put({'action': 'get_status', 'response': local_queue})
        return Response(json.dumps(local_queue.get()), mimetype=JSON)

    elif request.method == 'POST':
        local_queue = queue.Queue()
        global_queue.put({'action': 'change_status',
                          'response': local_queue,
                          'request': request.json})
        return Response(json.dumps(local_queue.get()), mimetype=JSON)


if __name__ == '__main__':
    global_thread = GlobalThread(daemon=True)
    global_thread.start()
    show_splashscreen()
    app.run(host='0.0.0.0', port=4000, debug=True)
