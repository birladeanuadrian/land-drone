from flask import Flask, current_app, request
import os
from flask_socketio import SocketIO, emit
# import eventlet  # required by socketio
from flask_cors import CORS
from multiprocessing import Process, Queue
from threading import Thread
import base64


class WSServer:

    def __init__(self, image_queue: Queue, debug=False):
        self.ctx = {}
        self.app = Flask(__name__)
        CORS(self.app, resources={r"/*": {"origins": "*"}})
        self.socketio = SocketIO(self.app, cors_allowed_origins='*', policy_server=False)
        # self.socketio.on_event('event', self.event, namespace='clients')
        self.socketio.on_event('event', self.event)
        # self.socketio.on_event('new-image')
        self.debug = debug
        self.image_queue = image_queue

    # noinspection PyMethodMayBeStatic
    def event(self, json):
        emit('response', ('foo', 'bar', json), broadcast=True)

    def run(self):
        print('Starting ws server')
        t = self.socketio.start_background_task(self.start_server)
        self.listen_for_images()
        # t = Thread(target=self.listen_for_images)
        # t.start()
        # self.socketio.start_background_task()
        #
        # self.socketio.run(self.app, port=8080, debug=self.debug)

    def start_server(self):
        self.socketio.run(self.app, port=8080, debug=self.debug)

    def listen_for_images(self):
        with self.app.app_context():
            while True:
                [ts, image] = self.image_queue.get()
                data = base64.b64encode(image).decode('utf8')
                # with self.app.app_context():
                print('Sending image')
                # with self.app.app_context():
                emit('image', ts, data)
                print('Image was sent')


if __name__ == '__main__':
    server = WSServer()
    server.run()
