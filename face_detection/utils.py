import cv2


person_id = 1


class Person:
    def __init__(self):
        global person_id

        self.tracker: cv2.Tracker
        self.id: int = person_id
        person_id += 1


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
