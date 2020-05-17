import socket
import cv2
import numpy as np

from image_unpacker import UdpPacket, UdpUnpacker

localIp = '0.0.0.0'
localPort = 5000

bufferSize = 1024

server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server.bind((localIp, localPort))
unpacker = UdpUnpacker()
print('Waiting for connections')

while True:
    data: bytes = server.recv(1024)
    print('Message size', len(data))
    packet = UdpPacket(data)
    img, ts = unpacker.add_packet(packet)
    if not img:
        continue

    d2 = np.frombuffer(img, dtype=np.uint8)
    with open(f'{ts}.jpg', 'wb') as f:
        f.write(img)
    # cv_img = cv2.imdecode(d2, cv2.IMREAD_COLOR)
    # print('Image', cv_img)
    exit(1)
    # cv2.imshow('image', cv_img)
