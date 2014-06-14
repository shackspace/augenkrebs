#!/usr/bin/env python3

from flask import Flask
from flask import request
from flask import send_from_directory

app = Flask(__name__, static_url_path='', static_folder='frontend/public')

@app.route('/', methods=['GET', 'POST'])
def augenkrebs():
    if request.method == 'GET':
        return app.send_static_file('index.html')
    elif request.method == 'POST':
        return 'POST WORLLLLD!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
