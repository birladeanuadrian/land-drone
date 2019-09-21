"""
    1   Vehicle   4
    2   Vehicle   3
"""
from motor import Motor


class Engine:

    def __init__(self, motor1: Motor, motor2: Motor, motor3: Motor, motor4: Motor):
        self.throttle = 0
        self.motor1 = motor1
        self.motor2 = motor2
        self.motor3 = motor3
        self.motor4 = motor4
        self.all_motors = [self.motor1, self.motor2, self.motor3, self.motor4]

    def forward(self, throttle):
        self.throttle = throttle
        for motor in self.all_motors:
            motor.move(self.throttle)

    def reverse(self, throttle):
        self.throttle = -1 * throttle
        for motor in self.all_motors:
            motor.move(self.throttle)

    def steer(self, direction):
        """
        :param direction:
            -1 -> left
            1 -> right
        :return:
        """
        if direction == 0:
            self.forward(self.throttle)
        elif direction < 0:
            self._steer_left(direction * -1)
        else:
            self._steer_right(direction)

    def _steer_right(self, intensity):
        self.motor3.move(self.throttle * intensity)
        self.motor4.move(self.throttle * intensity)

    def _steer_left(self, intensity):
        self.motor1.move(self.throttle * intensity)
        self.motor2.move(self.throttle * intensity)

    def stop(self):
        for motor in self.all_motors:
            motor.move(0)
