import engine
import engine_builder
import traceback
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
            self.engine.go(parsed_message.acceleration, parsed_message.direction)

        except CommsException:
            traceback.print_exc()

    def main(self):
        self.comms.on_message(self.endpoint, self.message_handler)


if __name__ == '__main__':
    engine_control = EngineControl()
    engine_control.main()
