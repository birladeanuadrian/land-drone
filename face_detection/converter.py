import cv2
import os
from mtcnn.mtcnn import MTCNN
from common import FACE_SIZE


SOURCE_PATH = 'C:\\Users\\birla\\Pictures\\blue_bloods\\will_estes'
DEST_PATH = 'D:\\Work\\git\\LandDrone\\face_detection\\models\\faces\\blue_bloods\\Will_Estes'
# SOURCE_PATH = 'C:\\Users\\birla\\Pictures\\blue_bloods\\jack_boyle'
# DEST_PATH = 'D:\\Work\\git\\LandDrone\\face_detection\\models\\faces\\blue_bloods\\Jack_Boyle'
# SOURCE_PATH = 'C:\\Users\\birla\\Pictures\\blue_bloods\\donnie_wahlberg'
# DEST_PATH = 'D:\\Work\\git\\LandDrone\\face_detection\\models\\faces\\blue_bloods\\Donnie_Wahlberg'
# SOURCE_PATH = 'C:\\Users\\birla\\Pictures\\blue_bloods\\bridget_moynahan'
# DEST_PATH = 'D:\\Work\\git\\LandDrone\\face_detection\\models\\faces\\blue_bloods\\Bridget_Moynahan'


def convert_faces():
    images = os.listdir(SOURCE_PATH)
    detector = MTCNN()
    if not os.path.isdir(DEST_PATH):
        os.makedirs(DEST_PATH)

    for image in images:
        source_path = os.path.join(SOURCE_PATH, image)
        dest_path = os.path.join(DEST_PATH, image)

        frame = cv2.imread(source_path, cv2.IMREAD_COLOR)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        faces = detector.detect_faces(frame)
        if not len(faces):
            continue
        elif len(faces) > 1:
            print('Detected more than one face', image)
            continue

        face = faces[0]
        x, y, width, height = face['box']
        crop_img = frame[y:y + height, x:x + width]
        crop_img = cv2.cvtColor(crop_img, cv2.COLOR_RGB2BGR)
        crop_img = cv2.resize(crop_img, FACE_SIZE)
        cv2.imwrite(dest_path, crop_img)


if __name__ == '__main__':
    convert_faces()
