import cv2 as cv

from faced import FaceDetector
from faced.utils import annotate_image

face_detector = FaceDetector()

cap = cv.VideoCapture(0)
while True:
    ret, frame = cap.read()
    if frame is None:
        print('Failed to capture camera')
        break

    rgb_img = cv.cvtColor(frame.copy(), cv.COLOR_BGR2RGB)
    bboxes = face_detector.predict(rgb_img)
    ann_img = annotate_image(rgb_img, bboxes)
    cv.imshow('image', ann_img)

# img = cv2.imread(img_path)
# rgb_img = cv2.cvtColor(img.copy(), cv2.COLOR_BGR2RGB)
#
# # Receives RGB numpy image (HxWxC) and
# # returns (x_center, y_center, width, height, prob) tuples.
# bboxes = face_detector.predict(rgb_img)
#
# # Use this utils function to annotate the image.
# ann_img = annotate_image(img, bboxes)
#
# # Show the image
# cv2.imshow('image',ann_img)
# cv2.waitKey(0)
# cv2.destroyAllWindows()