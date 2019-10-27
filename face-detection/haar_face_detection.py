import cv2 as cv
import argparse
import os
from helper import current_milli_time


face_cascade1: cv.CascadeClassifier
face_cascade2: cv.CascadeClassifier
# eyes_cascade: cv.CascadeClassifier
OPENCV_DIR = 'C:\\Users\\birla\\Downloads\\opencv-3.4'


def detect_and_display(frame):
    global face_cascade1, face_cascade2
    frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    frame_gray = cv.equalizeHist(frame_gray)
    # -- Detect faces
    faces = face_cascade1.detectMultiScale(frame_gray)
    for (x, y, w, h) in faces:
        center = (x + w//2, y + h//2)
        frame = cv.ellipse(frame, center, (w//2, h//2), 0, 0, 360, (255, 0, 255), 4)

    faces2 = face_cascade2.detectMultiScale(frame_gray)
    for (x, y, w, h) in faces2:
        center = (x + w//2, y + h//2)
        frame = cv.ellipse(frame, center, (w//2, h//2), 0, 0, 360, (0, 255, 0), 3, 2)
    cv.imshow('Capture - Face detection', frame)


def main():
    global face_cascade1, face_cascade2

    face_cascade1_file = os.path.join(OPENCV_DIR, 'data', 'haarcascades', 'haarcascade_frontalface_alt.xml')
    face_cascade2_file = os.path.join(OPENCV_DIR, 'data', 'haarcascades', 'haarcascade_frontalface_alt2.xml')

    face_cascade1 = cv.CascadeClassifier()
    # -- 1. Load the cascades
    if not face_cascade1.load(cv.samples.findFile(face_cascade1_file)):
        print('--(!)Error loading face cascade')
        exit(0)

    face_cascade2 = cv.CascadeClassifier()
    if not face_cascade2.load(cv.samples.findFile(face_cascade2_file)):
        print('--(!)Error loading face cascade')
        exit(0)
    camera_device = 0
    # -- 2. Read the video stream
    cap = cv.VideoCapture(camera_device)
    if not cap.isOpened:
        print('--(!)Error opening video capture')
        exit(0)
    while True:
        ret, frame = cap.read()
        if frame is None:
            print('--(!) No captured frame -- Break!')
            break
        detect_and_display(frame)
        if cv.waitKey(10) == 27:
            break


if __name__ == '__main__':
    main()
