import struct
import socketio
import time

login_secret = 'secret2'


class ImageTransmitter:

    def __init__(self):
        self.sio = socketio.Client()
        self.sio.connect('http://localhost:8080')
        self.sio.emit('login', (login_secret,))

    @staticmethod
    def __pack_data(image: bytes, ts: int) -> bytes:
        return struct.pack('<Q', ts) + image

    def transmit_image(self, image: bytes, ts_drone_send: int):
        self.sio.emit('server-frame', (image, ts_drone_send))
