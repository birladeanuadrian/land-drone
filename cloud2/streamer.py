from flask import Flask, render_template, Response
import cv2


app = Flask(__name__)
app.template_folder = '.'


class Camera:

    @staticmethod
    def frames():
        cam = cv2.VideoCapture(0)
        if not cam.isOpened():
            raise RuntimeError('Could not start camera')

        while True:
            _, img = cam.read()
            yield cv2.imencode('.jpg', img)[1].tobytes()


@app.route('/')
def index():
    return render_template('index.html')


def gen(camera):
    # while True:
    #     frame = camera.frames()
    for frame in camera.frames():
        print('Frame', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
