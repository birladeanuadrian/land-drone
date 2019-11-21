import time


FACE_SIZE = (96, 96)


def current_milli_time():
    return int(round(time.time() * 1000))
