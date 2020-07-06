from flask import Flask
from detector import ImageProcessor
from threading import Thread


class WebApi(Thread):

    def __init__(self, image_processor: ImageProcessor):
        super().__init__()
        self.app = Flask(__name__)
        self.image_processor = image_processor
        self.app.add_url_rule('/start-tracking', 'start-track', self.track_people)
        self.app.add_url_rule('/stop-tracking', 'stop-track', self.stop_track_people)
        self.app.add_url_rule('/start-record', 'start-record', self.start_record)
        self.app.add_url_rule('/stop-record', 'stop-record', self.stop_record)

    def track_people(self):
        print('Start Tracking', flush=True)
        self.image_processor.track_people = True

    def stop_track_people(self):
        print('Stop tracking', flush=True)
        self.image_processor.track_people = False

    def start_record(self):
        print('Start Record', flush=True)
        self.image_processor.start_record()

    def stop_record(self):
        print('Stop Record', flush=True)
        self.image_processor.stop_record()

    def run(self) -> None:
        self.app.run('127.0.0.1', 3000)
