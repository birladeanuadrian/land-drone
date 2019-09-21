import time
from engine import Engine


def test1():
    engine = Engine()
    engine.forward(1)
    time.sleep(5)
    engine.stop()


def test2():
    engine = Engine()
    engine.reverse(1)
    time.sleep(5)
    engine.stop()


test1()
test2()
