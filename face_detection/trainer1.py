import os
import cv2
import numpy as np
import random


SOURCE_PATH = 'D:\\Work\\git\\LandDrone\\face_detection\\models\\faces\\blue_bloods'


def rand():
    return random.randrange(0, 1000)


train_images = []
test_images = []
labels = []
people = os.listdir(SOURCE_PATH)
ids = 1
for person in people:
    person_dir = os.path.join(SOURCE_PATH, person)
    person_images = os.listdir(person_dir)
    for_train = person_images[:-1]
    test_image = person_images[-1:][0]
    person_id = ids
    ids += 1
    print('Person', person, person_id)
    for image in for_train:
        image_path = os.path.join(person_dir, image)
        mat = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        cv2.imshow('Training {} {}'.format(person_id, rand()), mat)
        # train_images.append(cv2.UMat(mat))
        train_images.append(mat)
        labels.append(person_id)

    mat = cv2.imread(os.path.join(person_dir, test_image), cv2.IMREAD_GRAYSCALE)
    test_images.append(mat)
    # test_images.append(cv2.UMat(mat))

train_images = np.array(train_images)
labels = np.array(labels)

# print('Images', train_images)
print('Labels', type(train_images), labels)

# model = cv2.face_FisherFaceRecognizer()
# model = cv2.face.FisherFaceRecognizer_create()
# model = cv2.face.EigenFaceRecognizer_create()
model = cv2.face.LBPHFaceRecognizer_create()
# model = cv2.face_FisherFaceRecognizer()
print('Training')
status = model.train(train_images, labels)
print('Finished training', status)
model.write("model.yml")

for image in test_images:
    image_id = rand()
    cv2.imshow('Test {}'.format(image_id), image)
    labels = model.predict(test_images[0])
    print('Predictions', labels)
    cv2.imshow('Person {} {}'.format(image_id, labels[0]), image)

# image = test_images[1]
# image_id = rand()
# cv2.imshow('Test {}'.format(image_id), image)
# labels = model.predict(test_images[0])
# print('Predictions', labels)
# cv2.imshow('Person {} {}'.format(image_id, labels[0]), image)

cv2.waitKey(0)
