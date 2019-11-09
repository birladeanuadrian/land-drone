# Code adapted from Tensorflow Object Detection Framework
# https://github.com/tensorflow/models/blob/master/research/object_detection/object_detection_tutorial.ipynb
# https://medium.com/object-detection-using-tensorflow-and-coco-pre/object-detection-using-tensorflow-and-coco-pre-trained-models-5d8386019a8
# https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md
# Tensorflow Object Detection Detector

import os
import numpy as np
import tensorflow as tf
import cv2
import time
from utils import *
from imutils.video import VideoStream


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
        print('Detection boxes', self.detection_boxes)
        print('Detection scores', self.detection_scores)
        print('Detection classes', self.detection_classes)
        print('Num detections', self.num_detections)

    def process_frame(self, image):
        # Expand dimensions since the trained_model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(image, axis=0)
        # Actual detection.
        local_start_time = time.time()
        (boxes, scores, classes, num) = self.sess.run(
            [self.detection_boxes, self.detection_scores, self.detection_classes, self.num_detections],
            feed_dict={self.image_tensor: image_np_expanded})
        local_end_time = time.time()

        # print("Elapsed Time:", local_end_time-local_start_time)

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


def main():
    # model_path = 'models/faster_rcnn_inception_v2_coco_2018_01_28/frozen_inference_graph.pb'
    # model_path = 'models/ssd_mobilenet_v1_coco_2018_01_28/frozen_inference_graph.pb'
    model_path = 'models/ssdlite_mobilenet_v2_coco_2018_05_09/frozen_inference_graph.pb'
    odapi = DetectorAPI(path_to_ckpt=model_path)
    threshold = 0.5

    # cap = cv2.VideoCapture('big_bang_12_04.mp4')
    # cap = VideoStream('big_bang_12_04.mp4').start()
    # cap = cv2.VideoCapture(0)
    video_file = 'd:\\Work\\nonGit\\multi-object-tracking\\videos\\soccer_01.mp4'
    # video_file = 'd:\\Work\\nonGit\\multi-object-tracking\\videos\\los_angeles.mp4'
    # video_file = 'big_bang_12_04.mp4'
    if not os.path.isfile(video_file):
        print('Not a video file', video_file)
        exit(1)

    cap = cv2.VideoCapture(video_file)
    # vs = VideoStream(video_file).start()
    # cap = cv2.VideoCapture()
    print("Before while")
    trackers = cv2.MultiTracker_create()
    iteration = 0

    while True:
        start_time = time.time()
        r, img = cap.read()
        # img = vs.read()
        img = cv2.resize(img, (1280, 720))

        # Visualization of the results of a detection.

        boxes, scores, classes, num = odapi.process_frame(img)
        detection_boxes = []
        tracked_boxes = []

        for i in range(len(boxes)):
            # Class 1 represents human
            if classes[i] == 1 and scores[i] > threshold:
                box = boxes[i]
                width = box[3] - box[1]
                height = box[2] - box[0]
                detection_boxes.append((box[1], box[0], width, height))
                # print('Boxes', (box[1], box[0]), (box[3], box[2]))
                cv2.rectangle(img, (box[1], box[0]), (box[3], box[2]), (255, 0, 0), 2)
                # cv2.circle(img, (box[1], box[0]), 30, 10) # top left
                # cv2.circle(img, (box[3], box[2]), 60, 60) # down right
                if iteration == 0:
                    object_box = (box[1], box[0], width, height)
                    print('Object box', object_box)
                    tracker = cv2.TrackerCSRT_create()
                    trackers.add(tracker, img, object_box)

        if iteration > 0:
            success, boxes = trackers.update(img)
            print('Success', success, boxes)
            for box in boxes:
                (x, y, w, h) = [int(v) for v in box]
                tracked_boxes.append((x, y, w, h))
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

        for b1 in detection_boxes:
            for b2 in tracked_boxes:
                b3 = rectangle_intersection(b1, b2)
                if b3:
                    cv2.rectangle(img, (b3[0], b3[1]), (b3[0] + b3[2], b3[1] + b3[3]), (0, 0, 255), 2)

        iteration += 1
        cv2.imshow("preview", img)
        end_time = time.time()
        print('Elapsed time', (end_time - start_time))
        key = cv2.waitKey(1)
        if key & 0xFF == ord('q'):
            break


if __name__ == '__main__':
    main()
