import cv2 as cv

IMG_PATH1 = 'C:\\Users\\abirladeanu.CLJ\\Pictures\\Frank\'s sauce.jpg'
IMG_PATH2 = 'C:\\Users\\abirladeanu.CLJ\\Pictures\\sauce2.jpg'

img = cv.imread(IMG_PATH1)
img2 = cv.resize(img, (600, 600))
cv.imwrite(IMG_PATH2, img2, [cv.IMWRITE_JPEG_QUALITY, 90])
