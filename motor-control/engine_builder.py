from adafruit_motorkit import MotorKit
from motor import Motor
from engine import Engine


def get_engine():
    kit = MotorKit()
    motor1 = Motor(kit.motor1, -1)
    motor2 = Motor(kit.motor2, 1)
    motor3 = Motor(kit.motor3, 1)
    motor4 = Motor(kit.motor4, -1)
    return Engine(motor1, motor2, motor3, motor4)