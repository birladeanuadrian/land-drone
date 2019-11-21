import json
import cv2


person_id = 1


def get_tracker():
    return cv2.TrackerKCF_create()


class Person:
    def __init__(self):
        global person_id

        self.tracker: cv2.Tracker = get_tracker()
        self.id: int = person_id
        self.misses = 0
        self.present = 1
        self.bbox = None
        self.name = ''
        person_id += 1

    def reset_tracker(self, img, bbox):
        self.tracker: cv2.Tracker = get_tracker()
        self.tracker.init(img, bbox)

    def __str__(self):
        data = {
            'id': self.id,
            'misses': self.misses,
            'present': self.present,
            'bbox': self.bbox
        }
        return 'Person' + json.dumps(data)

    def __repr__(self):
        return self.__str__()


class UserIdentity:
    def __init__(self, user_id: int, cropped_box):
        self.user_id = user_id
        self.cropped_box = cropped_box


def rectangle_union(a, b):
    x = min(a[0], b[0])
    y = min(a[1], b[1])
    w = max(a[0]+a[2], b[0]+b[2]) - x
    h = max(a[1]+a[3], b[1]+b[3]) - y
    return x, y, w, h


def rectangle_intersection(a, b):
    x = max(a[0], b[0])
    y = max(a[1], b[1])
    w = min(a[0]+a[2], b[0]+b[2]) - x
    h = min(a[1]+a[3], b[1]+b[3]) - y
    if w < 0 or h < 0:
        return ()  # or (0,0,0,0) ?
    else:
        return x, y, w, h
