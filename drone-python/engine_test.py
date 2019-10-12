import time
from engine import Engine
import engine_builder


def test1():
    engine = engine_builder.get_engine()
    engine.forward(1)
    time.sleep(2)
    engine.stop()


def test2():
    engine = engine_builder.get_engine()
    engine.reverse(1)
    time.sleep(2)
    engine.stop()


test1()
test2()
