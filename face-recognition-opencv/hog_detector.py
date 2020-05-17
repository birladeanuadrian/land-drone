import cv2
import numpy as np
from mtcnn import MTCNN


def main2():
    image_path = 'dataset/alan_grant/00000004.png'
    image = cv2.imread(image_path)
    # image = np.float32(image)

    winSize = (64, 64)
    blockSize = (16, 16)
    blockStride = (8, 8)
    cellSize = (8, 8)
    nbins = 9
    derivAperture = 1
    winSigma = 4.
    histogramNormType = 0
    L2HysThreshold = 2.0000000000000001e-01
    gammaCorrection = 0
    nlevels = 64

    hog = cv2.HOGDescriptor(winSize, blockSize, blockStride, cellSize, nbins, derivAperture, winSigma,
                            histogramNormType, L2HysThreshold, gammaCorrection, nlevels)

    winStride = (8, 8)
    padding = (8, 8)
    locations = ((10, 20),)
    hist = hog.compute(image, winStride, padding, locations)
    print('Histogram', len(hist), hist)


def main():
    detector = MTCNN()
    image_path = 'dataset/alan_grant/00000004.png'
    image = cv2.imread(image_path)
    # image = np.float32(image)
    faces = detector.detect_faces(image)
    face_info = faces[0]

    x, y, width, height = face_info['box']
    face = image[y:y + height, x:x + width]
    # cv2.imshow('Face', face)
    # cv2.waitKey(0)
    # return
    # hog = cv2.HOGDescriptor()
    # descriptor = hog.compute(face)
    # print('Descriptor', len(descriptor), descriptor)
    #
    # gx = cv2.Sobel(face, cv2.CV_32F, 1, 0, ksize=1)
    # gy = cv2.Sobel(face, cv2.CV_32F, 0, 1, ksize=1)
    #
    # mag, angle = cv2.cartToPolar(gx, gy, angleInDegrees=True)
    # gradient = hog.computeGradient(image, mag, angle)
    # print('Gradient', gradient)
    # print('Magnitude', mag)
    # print('Angles', angle)
    # cv2.imshow('Magnitude', mag)
    # cv2.imshow('Angles', angle)
    # cv2.waitKey(0)


main2()
