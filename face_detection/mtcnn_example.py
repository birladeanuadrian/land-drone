import time
import cv2 as cv
from common import current_milli_time
from mtcnn.mtcnn import MTCNN


cap = cv.VideoCapture('blue-bloods-s10e07-720.mp4')
detector = MTCNN()

while True:
    ret, frame = cap.read()
    if frame is None:
        print('Failed to capture camera')
        break

    frame = cv.resize(frame, (300, 300))

    start = current_milli_time()
    work_frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
    # work_frame = cv.resize(work_frame, (300, 300))
    faces = detector.detect_faces(work_frame)
    for face in faces:
        x, y, width, height = face['box']
        cv.rectangle(frame, (x, y,), (x + width, y + height), (255, 0, 255))

    end = current_milli_time()
    exec_time = end - start
    fps = 1000 / (end - start)
    print('Exec time', (end - start), fps)
    cv.imshow('Capture', frame)
    if cv.waitKey(10) == 27:
        break
    # break

