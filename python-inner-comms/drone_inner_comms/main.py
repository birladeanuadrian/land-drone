from drone_inner_comms.inner_comms import AbstractInnerComms, Endpoint
from drone_inner_comms.rabbit.rabbit_inner_comms import RabbitInnerComms


class InnerComms(AbstractInnerComms):

    def __init__(self):
        super().__init__()
        self.worker: AbstractInnerComms = RabbitInnerComms()

    def send_message(self, endpoint: Endpoint, message: str, priority=1):
        self.worker.send_message(endpoint, message, priority)

    def on_message(self, endpoint: Endpoint, handler):
        self.worker.on_message(endpoint, handler)

    def stop_listening(self, endpoint: Endpoint):
        self.worker.stop_listening(endpoint)
