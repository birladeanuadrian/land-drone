from multiprocessing import Queue


if __name__ == '__main__':
    q = Queue(maxsize=1)
    print('Add first message')
    q.put([1, 2])
    # print('Add second message')
    # q.put([3, 4])

    print('Getting message')
    a = q.get()
    print('A', a)
