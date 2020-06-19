from adafruit_motor.motor import DCMotor


class Motor:

    def __init__(self, adafruit_motor: DCMotor, forward=1):
        self.motor = adafruit_motor
        self.forward_direction = forward
        self.throttle = 0

    def move(self, throttle):
        self.motor.throttle = throttle * self.forward_direction
