import socket
import struct
import socketio
import base64
import time

login_secret = 'secret2'


class ImageTransmitter:

    def __init__(self):
        self.sock = socket.socket(socket.AF_INET6, socket.SOCK_DGRAM)
        self.host = '::1'
        self.port = 4000
        self.sio = socketio.Client()
        self.sio.connect('http://localhost:8080')
        self.sio.emit('login', (login_secret,))

    @staticmethod
    def __pack_data(image: bytes, ts: int) -> bytes:
        return struct.pack('<Q', ts) + image

    def transmit_image(self, image: bytes, ts_drone_send: int, delta_rec: int, delta_proc: int):
        self.socketio_transmit(image, ts_drone_send, delta_rec, delta_proc)

    def socketio_transmit(self, image: bytes, ts_drone_send: int, delta_rec, delta_proc):
        now = int(time.time() * 1000)
        self.sio.emit('server-frame', (image, ts_drone_send, delta_rec, delta_proc, now))
