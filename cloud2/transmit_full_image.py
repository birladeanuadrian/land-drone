import time
import base64
import socketio
import cv2


def main():
    login_secret = 'secret2'

    sio = socketio.Client()
    # sio.connect('http://34.107.14.190:8080')
    # sio.emit('login', (login_secret,))
    cap = cv2.VideoCapture(0)

    while True:
        st = int(time.time() * 1000)
        ret, img = cap.read()
        ret, buf = cv2.imencode('.jpeg', img)
        b_buf = base64.b64encode(buf.tostring()).decode('utf8')
        # print('Buffer1', b_buf)
        # print('Buffer2', b_buf.decode('utf8'))
        # exit(0)
        now = int(time.time() * 1000)
        ts_drone_send = now
        delta_rec = 0
        delta_proc = 0

        sio.emit('server-frame', (b_buf, ts_drone_send, delta_rec, delta_proc, now))
        end = int(time.time() * 1000)
        print('Delta', end - st)
        time.sleep(0.09)


main()
