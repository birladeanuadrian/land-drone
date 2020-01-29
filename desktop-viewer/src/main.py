import sys
from PyQt5 import QtGui, QtWidgets
from view import DisplayImageWidget
from listener import Server
from image_unpacker import UdpUnpacker
from image_processor import ImageProcessor
from queue import Queue


app = QtWidgets.QApplication(sys.argv)
display_image_widget = DisplayImageWidget()

unpacker = UdpUnpacker()
image_queue = Queue()
image_processor = ImageProcessor(image_queue, display_image_widget)
image_processor.start()
server = Server(unpacker, image_queue)
server.start()


display_image_widget.show()
exit(app.exec_())

server.join()
