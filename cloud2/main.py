from multiprocessing import Queue
from udp import UdpServer
from detector import ImageProcessor
from web import WebApi


def run():
    image_queue = Queue()

    udp_server = UdpServer(image_queue)
    processor = ImageProcessor(image_queue)
    web_api = WebApi(processor)
    udp_server.start()
    web_api.start()
    processor.run()


if __name__ == '__main__':
    run()
