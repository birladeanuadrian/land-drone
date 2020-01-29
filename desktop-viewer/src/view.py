from PyQt5 import QtWidgets
from PyQt5.QtWidgets import QApplication, QLabel
from PyQt5.QtGui import QImage, QPixmap
import cv2


class View:
    def __init__(self):
        self.app = QApplication([])
        self.app.setApplicationName('Land Drone')
        self.app.setApplicationDisplayName('Land Drone')
        self.label = QLabel('Hello world!')
        self.label.show()

    def run(self):
        mat = cv2.imread('husky.jpg', cv2.IMREAD_COLOR)
        print('Image', mat)
        cv2.imshow('image', mat)
        print('Before exec')
        self.app.exec_()
        self.cleanup()

    def cleanup(self):
        print('On termination')


class DisplayImageWidget(QtWidgets.QWidget):
    def __init__(self, parent=None):
        super(DisplayImageWidget, self).__init__(parent)

        self.button = QtWidgets.QPushButton('Show picture')
        self.image_frame = QtWidgets.QLabel()

        self.layout = QtWidgets.QVBoxLayout()
        self.layout.addWidget(self.button)
        self.layout.addWidget(self.image_frame)
        self.setLayout(self.layout)
        self.terminate = False

    def update_image(self, jpeg):
        image = QImage()
        image.loadFromData(jpeg)
        self.image_frame.setPixmap(QPixmap.fromImage(image))
