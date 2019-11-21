import threading
import queue
import pika
import base64
from utils import *


class FaceDetector(threading.Thread):

    def __init__(self, person_queue: queue.Queue):
        super().__init__()
        self.person_queue: queue.Queue = person_queue
        creds = pika.credentials.PlainCredentials(
            username='guest', password='guest'
        )
        self.conn = pika.BlockingConnection(
            pika.ConnectionParameters('localhost', 5672, '/', creds)
        )
        self.channel: pika.adapters.blocking_connection.BlockingChannel = self.conn.channel()
        self.channel.queue_declare('people', False, True)
        self.channel.exchange_declare('people-exch', 'fanout', False, True, False)
        self.channel.queue_bind('people', 'people-exch')

    def run(self) -> None:
        while True:
            user_info: UserIdentity = self.person_queue.get(True)
            headers = {
                'Id': user_info.user_id
            }
            status, data = cv2.imencode('.jpg', user_info.cropped_box)
            if not status:
                print('Failed to encode data to jpeg')
                continue
            data = base64.b64encode(data)
            props = pika.BasicProperties(headers=headers)
            self.channel.basic_publish('people-exch', '', data, props)

