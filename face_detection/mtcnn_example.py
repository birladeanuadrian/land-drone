import time
import cv2 as cv
from helper import current_milli_time
from mtcnn.mtcnn import MTCNN


cap = cv.VideoCapture('big_bang_12_04.mp4')
detector = MTCNN()

while True:
    ret, frame = cap.read()
    if frame is None:
        print('Failed to capture camera')
        break

    start = current_milli_time()
    work_frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
    faces = detector.detect_faces(work_frame)
    for face in faces:
        x, y, width, height = face['box']
        cv.rectangle(frame, (x, y,), (x + width, y + height), (255, 0, 255))

    end = current_milli_time()
    print('Exec time', (end - start))
    cv.imshow('Capture', frame)
    if cv.waitKey(10) == 27:
        break
    # break

