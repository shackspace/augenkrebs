#!/usr/bin/env python3

from flask import Flask
from flask import request
from flask import send_from_directory
from flask import abort
import flask
from GlobalPlayer.global_player import global_queue
from GlobalPlayer.global_player import GlobalThread
import json
import queue

app = Flask(__name__, static_url_path='', static_folder='frontend/public')

@app.route('/')
def augenkrebs():
    return app.send_static_file('index.html')


@app.route('/api/open', methods=['POST'])
def api_open():
    try:
        local_queue = queue.Queue()
        global_queue.put({'action': 'open', 
                          'url': request.json['url'], 
                          'response': local_queue})
        return flask.Response(json.dumps(local_queue.get()), mimetype='application/json')
    except:
        abort(500)


@app.route('/api/status', methods=['GET', 'POST'])
def api_status():
    if request.method == 'GET':
        local_queue = queue.Queue()
        global_queue.put({'action': 'get_status', 'response': local_queue})
        return flask.Response(json.dumps(local_queue.get()), mimetype='application/json')

if __name__ == '__main__':
    global_thread = GlobalThread(daemon=True)
    global_thread.start()

    try:
        app.run(host='0.0.0.0', port=4000, debug=True)
    except KeyboardInterrupt:
        global_thread.player.stop()


