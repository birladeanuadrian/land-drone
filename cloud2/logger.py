import logging


class Logger:
    def __init__(self):
        self.logLevel = logging.INFO

    def debug(self, *args):
        if logging.DEBUG >= self.logLevel:
            print(*args)

    def info(self, *args):
        if logging.INFO >= self.logLevel:
            print(*args)

    def error(self, *args):
        if logging.ERROR >= self.logLevel:
            print(*args)


logger = Logger()
