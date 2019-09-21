from adafruit_motorkit import MotorKit
import time

kit = MotorKit()
kit.motor4.throttle = 0.5
time.sleep(5)
kit.motor4.throttle = 0
