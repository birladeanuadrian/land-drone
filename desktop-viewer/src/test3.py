from PyQt5 import QtWidgets
from view import DisplayImageWidget
import cv2
import sys
import threading


def show_video():
    cap = cv2.VideoCapture(0)
    while not display_image_widget.terminate:
        ret, mat = cap.read()
        if not ret:
            continue
        ret, jpeg = cv2.imencode('.jpeg', mat)
        if not ret:
            continue
        jpeg = jpeg.tobytes()
        display_image_widget.update_image(jpeg)


if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    display_image_widget = DisplayImageWidget()
    display_image_widget.show()
    t = threading.Thread(target=show_video)
    t.start()
    ret_code = app.exec_()
    display_image_widget.terminate = True
    t.join()
    sys.exit(ret_code)
