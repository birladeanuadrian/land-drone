from threading import Thread
from queue import Queue
import socketio
from environment import SOCKET_IO_SERVER
from image_unpacker import UdpUnpacker, UdpPacket
from datetime import datetime


class Server(Thread):

    def __init__(self, image_unpacker: UdpUnpacker, queue: Queue):
        super().__init__()
        self.image_unpacker: UdpUnpacker = image_unpacker
        self.image_queue = queue
        self.client = socketio.Client()
        self.client.on('packet', self.on_packet)

    def on_packet(self, data: bytes):
        # print('Received packet')
        packet = UdpPacket(data)
        jpeg, timestamp = self.image_unpacker.add_packet(packet)
        if not jpeg:
            return

        # print('Image received', datetime.fromtimestamp(timestamp))
        # print('Image received', datetime.fromtimestamp(int(timestamp / 1000)))
        self.image_queue.put((timestamp, jpeg))

    def run(self):
        self.client.connect(SOCKET_IO_SERVER)
