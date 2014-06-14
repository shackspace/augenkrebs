#!/usr/bin/env python3

from flask import Flask
from flask import request
from flask import send_from_directory
import json

app = Flask(__name__, static_url_path='', static_folder='frontend/public')

@app.route('/')
def augenkrebs():
    return app.send_static_file('index.html')


@app.route('/api/open', methods=['POST'])
def api_open():
    bla = {"rand" : "h"}
    keks = str(request.json['path'])
    return json.dumps(bla)


@app.route('/api/status', methods=['GET', 'POST'])
def api_status():
    if request.method == 'GET':
        return 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
