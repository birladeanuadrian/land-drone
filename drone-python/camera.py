import io
import base64
import hashlib
from time import sleep
from datetime import datetime
from picamera import PiCamera
from drone_inner_comms import InnerComms, Endpoint


comms = InnerComms()
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
    # stream.seek(0)
    # print('Length', stream.tell())
    # sleep(0.05)
    # stream.seek(0)
    # my_file.write(stream.read())
    # my_file.close()
    # break
    c = datetime.now()
    stream.seek(0)
    image_bytes = stream.read()
    # my_file.write(image_bytes)
    # my_file.close()
    # encoded_data = base64.b64encode(image_bytes)
    # print(hashlib.md5(encoded_data).hexdigest())
    comms.send_message(Endpoint.CAMERA, base64.b64encode(image_bytes))
    d = datetime.now()
    print('Send data', (d - c).total_seconds() * 1000)
    break
    # break
    # sleep(0.05)
