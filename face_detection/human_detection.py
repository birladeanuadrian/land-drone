# Code adapted from Tensorflow Object Detection Framework
# https://github.com/tensorflow/models/blob/master/research/object_detection/object_detection_tutorial.ipynb
# https://medium.com/object-detection-using-tensorflow-and-coco-pre/object-detection-using-tensorflow-and-coco-pre-trained-models-5d8386019a8
# https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md
# https://www.pyimagesearch.com/2018/07/30/opencv-object-tracking/
# Tensorflow Object Detection Detector

import os
import numpy as np
import tensorflow as tf
import time
import queue

from utils import *
from typing import List
from logger import logger
from face_detecter import FaceDetector


INTERSECTION_THRESHOLD = 0.65
RESET_THRESHOLD = 0.85
faces_queue = queue.Queue()
# gpu_devices = tf.config.experimental.list_physical_devices('GPU')
# print('GPU devices', gpu_devices)
# tf.config.experimental.set_memory_growth(gpu_devices[0], True)
# tf.config.experimental.set_virtual_device_configuration(gpu_devices[0], [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=512, )])


class DetectorAPI:
    def __init__(self, path_to_ckpt):
        self.path_to_ckpt = path_to_ckpt

        self.detection_graph = tf.compat.v1.Graph()
        with self.detection_graph.as_default():
            od_graph_def = tf.compat.v1.GraphDef()
            with tf.compat.v1.gfile.GFile(self.path_to_ckpt, 'rb') as fid:
                serialized_graph = fid.read()
                od_graph_def.ParseFromString(serialized_graph)
                tf.compat.v1.import_graph_def(od_graph_def, name='')

        self.default_graph = self.detection_graph.as_default()
        # gpu_options = tf.compat.v1.GPUOptions(per_process_gpu_memory_fraction=0.7, allow_growth=True)
        # gpu_config = tf.compat.v1.ConfigProto(gpu_options=gpu_options)
        # self.sess = tf.compat.v1.Session(graph=self.detection_graph, config=gpu_config)
        self.sess = tf.compat.v1.Session(graph=self.detection_graph)

        # Definite input and output Tensors for detection_graph
        self.image_tensor = self.detection_graph.get_tensor_by_name('image_tensor:0')
        # Each box represents a part of the image where a particular object was detected.
        self.detection_boxes = self.detection_graph.get_tensor_by_name('detection_boxes:0')
        # Each score represent how level of confidence for each of the objects.
        # Score is shown on the result image, together with the class label.
        self.detection_scores = self.detection_graph.get_tensor_by_name('detection_scores:0')
        self.detection_classes = self.detection_graph.get_tensor_by_name('detection_classes:0')
        self.num_detections = self.detection_graph.get_tensor_by_name('num_detections:0')
        # logger.info('Image tensor', self.image_tensor)
        logger.info('Detection boxes', self.detection_boxes)
        logger.info('Detection scores', self.detection_scores)
        logger.info('Detection classes', self.detection_classes)
        logger.info('Num detections', self.num_detections)
        # exit(1)

    def process_frame(self, image):
        # Expand dimensions since the trained_model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(image, axis=0)
        # Actual detection.
        # local_start_time = time.time()
        (boxes, scores, classes, num) = self.sess.run(
            [self.detection_boxes, self.detection_scores, self.detection_classes, self.num_detections],
            feed_dict={self.image_tensor: image_np_expanded})
        # local_end_time = time.time()

        # logger.info("Elapsed Time:", local_end_time-local_start_time)

        im_height, im_width, _ = image.shape
        boxes_list = [None for i in range(boxes.shape[1])]
        for i in range(boxes.shape[1]):
            # noinspection PyTypeChecker
            boxes_list[i] = (int(boxes[0, i, 0] * im_height),
                             int(boxes[0, i, 1]*im_width),
                             int(boxes[0, i, 2] * im_height),
                             int(boxes[0, i, 3]*im_width))

        return boxes_list, scores[0].tolist(), [int(x) for x in classes[0].tolist()], int(num[0])

    def close(self):
        self.sess.close()
        self.default_graph.close()


def queue_consume():
    while True:
        user_info: UserIdentity = faces_queue.get(True)
        print(user_info.cropped_box)
        cv2.imshow('Person {}'.format(user_info.user_id), user_info.cropped_box)
        key = cv2.waitKey(1)
        if key & 0xFF == ord('q'):
            break

times = []


def main():
    # model_path = 'models/faster_rcnn_inception_v2_coco_2018_01_28/frozen_inference_graph.pb'
    # model_path = 'models/ssd_mobilenet_v1_coco_2018_01_28/frozen_inference_graph.pb'
    model_path = 'models/ssdlite_mobilenet_v2_coco_2018_05_09/frozen_inference_graph.pb'
    # model_path = 'models/ssd_mobilenet_v2_coco_2018_03_29/frozen_inference_graph.pb'
    odapi = DetectorAPI(path_to_ckpt=model_path)
    threshold = 0.7


    # how ssdlite actually works, expected data format/size
    # debugging: de cate ori se apeleaza reteaua, face cropping intern?
    # sar cu stride?

    # face recognition scaling?
    # foarte clar use case-uri, constrangeri

    # cap = cv2.VideoCapture('big_bang_12_04.mp4')
    # cap = VideoStream('big_bang_12_04.mp4').start()
    # cap = cv2.VideoCapture(0)
    # video_file = 'd:\\Work\\nonGit\\multi-object-tracking\\videos\\soccer_01.mp4'
    # video_file = 'd:\\Work\\nonGit\\multi-object-tracking\\videos\\soccer_02.mp4'
    video_file = 'blue-bloods-s10e07-720.mp4'
    if not os.path.isfile(video_file):
        logger.error('Not a video file', video_file)
        exit(1)

    cap = cv2.VideoCapture(video_file)
    logger.info("Before while")
    person_list: List[Person] = []
    # face_detector = FaceDetector(faces_queue)
    # face_detector.start()

    while True:
        created_humans = 0
        r, img = cap.read()
        start_time = time.time()
        img = cv2.resize(img, (600, 600,))

        boxes, scores, classes, num = odapi.process_frame(img)
        drawing_boxes = []
        human_boxes = []

        for i in range(len(boxes)):
            if classes[i] == 1 and scores[i] > threshold:
                box = boxes[i]

                x = box[1]
                y = box[0]
                width = box[3] - box[1]
                height = box[2] - box[0]
                cv2.rectangle(img, (x, y), (x + width, y + height), (0, 0, 255), 4)
                human_boxes.append((box[1], box[0], width, height))

        # logger.debug('Boxes', human_boxes)
        logger.debug('Humans detected', len(human_boxes))
        logger.debug('Humans known', len(person_list))

        # update the location of each person
        # logger.debug('person list', person_list)
        # delete_people = []
        # for person in person_list:
        #     logger.debug('Current person: {}'.format(person.id))
        #     success, box = person.tracker.update(img)
        #     if not success or not box:
        #         person.present = 0
        #         person.misses += 1
        #         delete_people.append(person)
        #         continue
        #
        #     logger.debug('Check person', person.id)
        #     person.misses = 0
        #     person.present = 1
        #     person.bbox = box
        #     (x, y, w, h) = [int(v) for v in box]
        #     drawing_boxes.append(box)
        #     area = w * h
        #     for box2 in human_boxes:
        #         intersection = rectangle_intersection(box, box2)
        #         if not intersection:
        #             continue
        #
        #         (x3, y3, w3, h3) = intersection
        #         area3 = w3 * h3
        #         fraction = area3 / area
        #         if fraction > 1:
        #             fraction = 1 / fraction
        #
        #         logger.debug('Areas', area, area3, fraction)
        #
        #         if fraction >= INTERSECTION_THRESHOLD:
        #             human_boxes.remove(box2)
        #
        #         if fraction < RESET_THRESHOLD:
        #             person.reset_tracker(img, box2)
        #             logger.debug('Reset tracker')
        #         break
        #
        # for person in delete_people:
        #     person_list.remove(person)
        #
        # logger.debug('Remaining boxes', len(human_boxes))
        # for box in human_boxes:
        #     person = Person()
        #     person.tracker.init(img, box)
        #     person.bbox = box
        #     person_list.append(person)
        #     logger.debug('Created new human', person.id)
        #     created_humans += 1
        #
        # logger.debug('People', len(person_list))
        # for person in person_list:
        #     if not person.present:
        #         continue
        #     (x, y, w, h) = [int(v) for v in person.bbox]
        #     cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        #     cv2.putText(img, 'Person {}'.format(person.id), (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)
        #     if not person.name:
        #         body = img[y:y + h, x:x + w].copy()
        #         user_info = UserIdentity(person.id, body)
        #         faces_queue.put(user_info)

        cv2.imshow("preview", img)
        end_time = time.time()
        time_diff = (end_time - start_time)
        fps = 1 / time_diff
        times.append(fps)
        logger.info('Elapsed time', len(person_list), time_diff, fps)
        key = cv2.waitKey(1)
        if key & 0xFF == ord('q'):
            break
        if len(times) == 1000:
            break


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
    finally:
        if len(times):
            avg_fps = sum(times) / len(times)
            print('Average FPS: {} in {} images'.format(avg_fps, len(times)))
