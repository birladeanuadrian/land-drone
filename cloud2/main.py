from multiprocessing import Queue
from udp import UdpServer
from detector import HumanDetectorTracker


def run():
    image_queue = Queue()

    udp_server = UdpServer(image_queue)
    # ws_server = WSServer(image_queue, False)
    # ws_server.run()
    hdt = HumanDetectorTracker(image_queue)
    udp_server.start()
    hdt.run()


if __name__ == '__main__':
    run()
