import cv2
import numpy as np
from io import BytesIO

d = open('husky.jpg', 'rb').read()
# print('Data', d)
# d2 = BytesIO(d)
# img = cv2.imread()
# img = cv2.imdecode(d, cv2.IMREAD_COLOR)
# img = cv2.imread('husky.jpg', cv2.IMREAD_COLOR)

# ret, buf = cv2.imencode('.jpg', img)
# print('Buffer', buf)

d2 = np.frombuffer(d, dtype=np.uint8)
img2 = cv2.imdecode(d2, cv2.IMREAD_COLOR)

cv2.imshow('husky', img2)
cv2.waitKey(0)
