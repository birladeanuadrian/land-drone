import cv2
import numpy as np


recognizer = cv2.face_FisherFaceRecognizer()
recognizer.train()