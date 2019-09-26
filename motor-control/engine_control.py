import engine
import engine_builder
import sys
import traceback
if sys.platform == 'linux' or sys.platform == 'linux2':
    sys.path.append("/srv/python-inner-comms")
from drone_inner_comms import InnerComms, Endpoint, EngineMessage, CommsException, Action


class EngineControl:

    def __init__(self):
        self.engine: engine.Engine = engine_builder.get_engine()
        self.engine.forward(0)
        self.comms: InnerComms = InnerComms()
        self.endpoint = Endpoint.ENGINE

    def message_handler(self, message: str):
        print('Handler called', message)
        try:
            parsed_message = EngineMessage.build(message)
            print('Message', parsed_message)
            if parsed_message.action == Action.FORWARD:
                self.engine.forward(parsed_message.value)
            elif parsed_message.action == Action.REVERSE:
                self.engine.reverse(parsed_message.value)
            elif parsed_message.action == Action.STEER:
                self.engine.steer(parsed_message.value)
            elif parsed_message.action == Action.STOP:
                self.engine.stop()
        except CommsException:
            traceback.print_exc()

    def main(self):
        self.comms.on_message(self.endpoint, self.message_handler)


if __name__ == '__main__':
    engine_control = EngineControl()
    engine_control.main()
