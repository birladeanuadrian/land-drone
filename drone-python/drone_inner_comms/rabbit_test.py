import unittest
import time
from drone_inner_comms.rabbit.rabbit_inner_comms import RabbitInnerComms, Endpoint


class RabbitCommsCase(unittest.TestCase):

    def setUp(self) -> None:
        self.rabbitComms = RabbitInnerComms()
        self.message = None

    def _message_handler(self, msg):
        self.message = msg

    def test_comms(self):
        message = 'test'
        endpoint = Endpoint.ENGINE

        print('On message')
        self.rabbitComms.on_message(endpoint, self._message_handler)
        print('After on message')

        self.rabbitComms.send_message(endpoint, message)
        time.sleep(1)
        self.assertEqual(self.message, message)
        self.rabbitComms.stop_listening(endpoint)


if __name__ == '__main__':
    unittest.main()
