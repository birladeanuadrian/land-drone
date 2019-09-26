from time import sleep
from datetime import datetime
from picamera import PiCamera
import io


my_file = open('my_image.jpg', 'wb')
camera = PiCamera()
camera.resolution = (600, 400)
camera.start_preview()
sleep(2)

stream = io.BytesIO()
a = datetime.now()
for foo in camera.capture_continuous(stream, 'jpeg', use_video_port=True):
    b = datetime.now()
    print('Take time', (b - a).total_seconds() * 1000)
    a = datetime.now()

