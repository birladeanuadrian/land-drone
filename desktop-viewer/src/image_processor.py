from threading import Thread
from queue import Queue
from view import DisplayImageWidget
from time import time


class ImageProcessor(Thread):

    def __init__(self, image_queue: Queue, image_display: DisplayImageWidget):
        super().__init__()
        self.queue = image_queue
        self.image_display: DisplayImageWidget = image_display

    def run(self) -> None:
        while True:
            timestamp, jpeg = self.queue.get(True)
            self.queue.empty()
            # print('Update image')
            self.image_display.update_image(jpeg)
            # print('Image updated', time() - timestamp)
