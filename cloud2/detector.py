import numpy as np
import tensorflow as tf
from logger import logger
from multiprocessing import Queue
from numpy import frombuffer, uint8
from image_transmitter import ImageTransmitter
import cv2
import time
import traceback
import os

CLOUD_SERVER_SECRET = 'secret'


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

    def process_frame(self, image):
        # Expand dimensions since the trained_model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(image, axis=0)

        (boxes, scores, classes, num) = self.sess.run(
            [self.detection_boxes, self.detection_scores, self.detection_classes, self.num_detections],
            feed_dict={self.image_tensor: image_np_expanded})

        im_height, im_width, _ = image.shape
        boxes_list = [None for i in range(boxes.shape[1])]
        for i in range(boxes.shape[1]):
            # noinspection PyTypeChecker
            boxes_list[i] = (int(boxes[0, i, 0] * im_height),
                             int(boxes[0, i, 1]*im_width),
                             int(boxes[0, i, 2] * im_height),
                             int(boxes[0, i, 3]*im_width))

        return boxes_list, scores[0].tolist(), [int(x) for x in classes[0].tolist()]

    def close(self):
        self.sess.close()
        self.default_graph.close()


class ImageProcessor:

    def __init__(self, image_queue: Queue, threshold=0.7):
        model_path = 'models/ssdlite_mobilenet_v2_coco_2018_05_09/frozen_inference_graph.pb'
        self.odapi = DetectorAPI(path_to_ckpt=model_path)
        self.threshold = threshold
        self.image_queue = image_queue
        self.track_people = False
        self.record = False
        self.image_transmitter = ImageTransmitter()
        self.writer = None

    def initialize_detector(self):
        test_image = cv2.imread('husky.jpg')
        try:
            self.odapi.process_frame(test_image)
            pass
        except Exception:
            traceback.print_exc()
            exit(1)

    def start_record(self):
        if os.path.isfile('outpy.avi'):
            os.unlink('outpy.avi')
        self.writer = cv2.VideoWriter('outpy.avi',
                                      cv2.VideoWriter_fourcc('M', 'J', 'P', 'G'),
                                      10,
                                      (480, 480))
        self.record = True

    def stop_record(self):
        self.record = False
        self.writer.release()

    def run(self):
        self.initialize_detector()
        logger.info('Detector listens for images')
        while True:
            [ts_drone_send, jpeg_buffer] = self.image_queue.get()
            delta_proc = 0
            now = int(time.time() * 1000)

            delta_rec = now - ts_drone_send

            if self.track_people:
                jpeg_buffer = self.process_image(jpeg_buffer)
                now2 = int(time.time() * 1000)
                delta_proc = now2 - now

            if self.record:

                np_arr = np.fromstring(jpeg_buffer, np.uint8)
                # cv_image = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
                mat = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                print('Size', mat.shape)
                self.writer.write(mat)
            self.image_transmitter.transmit_image(jpeg_buffer, ts_drone_send)


    def process_image(self, jpeg_buffer):
        d2 = frombuffer(jpeg_buffer, dtype=uint8)
        img = cv2.imdecode(d2, cv2.IMREAD_COLOR)

        boxes, scores, classes = self.odapi.process_frame(img)
        # drawing_boxes = []
        human_boxes = []

        for i in range(len(boxes)):
            if classes[i] == 1 and scores[i] > self.threshold:
                box = boxes[i]

                x = box[1]
                y = box[0]
                width = box[3] - box[1]
                height = box[2] - box[0]
                cv2.rectangle(img, (x, y), (x + width, y + height), (0, 0, 255), 4)
                human_boxes.append((box[1], box[0], width, height))

        _, buf = cv2.imencode('.jpeg', img)
        return buf.tostring()


if __name__ == '__main__':
    pass
