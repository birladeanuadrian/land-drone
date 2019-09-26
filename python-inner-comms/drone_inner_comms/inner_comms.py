from abc import ABC, abstractmethod
from enum import Enum


class Endpoint(Enum):
    COMMS = 'comms'
    ENGINE = 'engine'
    CC = 'cc'


class AbstractInnerComms(ABC):

    @abstractmethod
    def send_message(self, endpoint: Endpoint, message: str, priority=1):
        pass

    @abstractmethod
    def on_message(self, endpoint: Endpoint, handler):
        pass

    @abstractmethod
    def stop_listening(self, endpoint: Endpoint):
        pass
