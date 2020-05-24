from multiprocessing import Queue
from ws import WSServer
from udp import UdpServer


def run():

    image_queue = Queue()

    udp_server = UdpServer(image_queue)
    ws_server = WSServer(image_queue, False)
    udp_server.start()
    ws_server.run()

    print('Waiting for connections')


if __name__ == '__main__':
    run()
