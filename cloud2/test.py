from multiprocessing import Queue
import cv2


if __name__ == '__main__':
    cap = cv2.VideoCapture(0)

    ret, frame = cap.read()
    frame = cv2.rotate(frame, cv2.ROTATE_180)
    cv2.imshow('image', frame)
    cv2.waitKey(0)
    # q = Queue(maxsize=1)
    # print('Add first message')
    # q.put([1, 2])
    # # print('Add second message')
    # # q.put([3, 4])
    #
    # print('Getting message')
    # a = q.get()
    # print('A', a)
