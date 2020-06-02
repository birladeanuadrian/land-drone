import socket
from numpy import frombuffer, uint8
from multiprocessing import Queue, Process
from image_unpacker import UdpPacket, UdpUnpacker


def clear_queue(q: Queue):
    while q.qsize():
        q.get()


class UdpServer(Process):
    def __init__(self, queue: Queue):
        super().__init__()
        self.server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.image_queue = queue
        self.unpacker = UdpUnpacker()

    def run(self):
        local_ip = '0.0.0.0'
        local_port = 5000
        self.server.bind((local_ip, local_port))
        print('Udp server has started')
        while True:
            data: bytes = self.server.recv(1024)
            packet = UdpPacket(data)
            img, ts = self.unpacker.add_packet(packet)
            if not img:
                continue
            # d2 = frombuffer(img, dtype=uint8)
            # print('Adding new image')
            clear_queue(self.image_queue)
            self.image_queue.put([ts, img])
