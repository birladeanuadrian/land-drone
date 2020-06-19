from motor import Motor


class Engine:

    def __init__(self, motor1: Motor, motor2: Motor, motor3: Motor, motor4: Motor):
        self.throttle = 0
        self.top_left_motor = motor1
        self.bottom_left_motor = motor2
        self.bottom_right_motor = motor3
        self.top_right_motor = motor4
        self.all_motors = [self.top_left_motor, self.bottom_left_motor, self.bottom_right_motor, self.top_right_motor]

    def forward(self, throttle):
        print('Forward', throttle)
        self.throttle = throttle
        for motor in self.all_motors:
            motor.move(self.throttle)

    def reverse(self, throttle):
        print('Reverse', throttle)
        self.throttle = -1 * throttle
        for motor in self.all_motors:
            motor.move(self.throttle)

    def steer(self, direction):
        print('Steer', direction)
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
        self.bottom_right_motor.move(self.throttle * intensity)
        self.top_right_motor.move(self.throttle * intensity)

    def _steer_left(self, intensity):
        self.top_left_motor.move(self.throttle * intensity)
        self.bottom_left_motor.move(self.throttle * intensity)

    def stop(self):
        print('Stop')
        for motor in self.all_motors:
            motor.move(0)
