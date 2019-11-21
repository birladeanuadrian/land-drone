import os
import glob
import numpy as np
import cv2 as cv
import tensorflow as tf
from fr_utils import *
from inception_blocks_v2 import *
from keras import backend as K


def triplet_loss(y_true, y_pred, alpha=0.3):
    anchor, positive, negative = y_pred[0], y_pred[1], y_pred[2]

    pos_dist = tf.reduce_sum(tf.compat.v1.square(tf.compat.v1.subtract(anchor,
                                                   positive)), axis=-1)
    neg_dist = tf.compat.v1.reduce_sum(tf.compat.v1.square(tf.compat.v1.subtract(anchor,
                                                   negative)), axis=-1)
    basic_loss = tf.add(tf.subtract(pos_dist, neg_dist), alpha)
    loss = tf.reduce_sum(tf.maximum(basic_loss, 0.0))

    return loss


def prepare_database():
    database = {}
    root_dir = "models\\faces\\blue_bloods"
    for directory in os.listdir(root_dir):
        person = directory
        person_dir = root_dir + "\\" + person + "\\*"
        print('Scan', person_dir)
        for temp_file in glob.glob(person_dir):
            print('Add {} to db'.format(temp_file))
            if person not in database:
                database[person] = []
            database[person].append(img_to_encoding(temp_file, FRmodel))
    return database


def who_is_it(image, database, model):
    encoding = img_to_encoding(image, model)
    min_dist = 100
    identity = None

    for (p_name, db_enc_list) in database.items():
        for db_enc in db_enc_list:
            dist = np.linalg.norm(db_enc - encoding)
            # print('distance for {} is {}'.format(p_name, dist))
            if dist < min_dist:
                min_dist = dist
                identity = p_name

    if min_dist > 0.9:
        return None
    else:
        return identity, min_dist


K.set_image_data_format('channels_first')
FRmodel = faceRecoModel(input_shape=(3, 96, 96))
FRmodel.compile(optimizer='adam', loss=triplet_loss, metrics=['accuracy'])
load_weights_from_FaceNet(FRmodel)
db = prepare_database()
for file in glob.glob("test\\*"):
    name, dist = who_is_it(file, db, FRmodel)
    print('Identity', file, name, dist)
