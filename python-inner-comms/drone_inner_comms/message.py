import json
from enum import Enum
from .exceptions import CommsException


class Action(Enum):
    FORWARD = 'forward'
    REVERSE = 'reverse'
    STEER = 'steer'
    STOP = 'stop'


ALLOWED_ACTIONS = [
    Action.FORWARD.value,
    Action.REVERSE.value,
    Action.STEER.value,
    Action.STOP.value
]


class EngineMessage:

    def __init__(self, action: Action, value: float):
        self.action: Action = action
        self.value: float = value

    @staticmethod
    def build(message):
        try:
            parsed_message = json.loads(message)
        except json.JSONDecodeError:
            raise CommsException("Invalid message format")

        if ('action' not in parsed_message) or ('value' not in parsed_message):
            raise CommsException("Message is missing keys")

        action = parsed_message['action']
        if action not in ALLOWED_ACTIONS:
            raise CommsException("Unknown action '{}'".format(action))

        value = float(parsed_message['value'])
        if value > 1 or value < -1:
            raise CommsException("Invalid value {}".format(value))

        return EngineMessage(Action(action), value)
