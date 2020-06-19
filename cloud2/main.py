from multiprocessing import Queue
from udp import UdpServer
from detector import ImageProcessor


def run():
    image_queue = Queue()

    udp_server = UdpServer(image_queue)
    processor = ImageProcessor(image_queue)
    udp_server.start()
    processor.run()


if __name__ == '__main__':
    run()
