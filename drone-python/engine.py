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
        print('Forward', throttle)
        # self.throttle = throttle
        for motor in self.all_motors:
            motor.move(throttle)

    def reverse(self, throttle):
        print('Reverse', throttle)
        # self.throttle = -1 * throttle
        for motor in self.all_motors:
            motor.move(throttle)

    # def steer(self, direction):
    #     print('Steer', direction)
    #     """
    #     :param direction:
    #         -1 -> left
    #         1 -> right
    #     :return:
    #     """
    #     if direction == 0:
    #         self.forward(self.throttle)
    #     elif direction < 0:
    #         self._steer_left(direction * -1)
    #     else:
    #         self._steer_right(direction)

    def go(self, throttle, direction):
        if direction == 0:
            self.forward(throttle)
        elif direction < 0:
            self._steer_left(throttle, -1 * direction)
        elif direction > 0:
            self._steer_right(throttle, direction)

    def _steer_right(self, throttle, intensity):
        intensity = 1 - intensity
        print('Steer right', throttle, intensity)
        self.motor1.move(throttle)
        self.motor2.move(throttle)
        self.motor3.move(throttle * intensity)
        self.motor4.move(throttle * intensity)

    def _steer_left(self, throttle, intensity):
        intensity = 1 - intensity
        print('Steer left', throttle, intensity)
        self.motor1.move(throttle * intensity)
        self.motor2.move(throttle * intensity)
        self.motor3.move(throttle)
        self.motor4.move(throttle)

    def stop(self):
        print('Stop')
        for motor in self.all_motors:
            motor.move(0)
