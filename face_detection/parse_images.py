import os
import cv2


SOURCE_DIR = 'C:\\Users\\birla\\Pictures\\will_estes'
DEST_DIR = 'D:\\Work\\git\\LandDrone\\person-detector\\faces\\blue_bloods\\Will_Estes'
NEW_SIZE = (120, 200)


def main():
    if not os.path.isdir(DEST_DIR):
        os.makedirs(DEST_DIR)

    images = os.listdir(SOURCE_DIR)
    for image in images:
        path = os.path.join(SOURCE_DIR, image)

        img = cv2.imread(path, cv2.IMREAD_COLOR)
        new_img = cv2.resize(img, NEW_SIZE)
        new_path = os.path.join(DEST_DIR, image)
        cv2.imwrite(new_path, new_img)


if __name__ == '__main__':
    main()
