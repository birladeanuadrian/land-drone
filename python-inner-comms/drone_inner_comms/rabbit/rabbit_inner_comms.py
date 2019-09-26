import pika
import threading
from drone_inner_comms.inner_comms import AbstractInnerComms, Endpoint
from drone_inner_comms.rabbit.config import RABBIT_HOST, RABBIT_PORT, RABBIT_PWD, RABBIT_USER, RABBIT_VHOST


class RabbitInnerComms(AbstractInnerComms):

    def __init__(self):
        creds = pika.PlainCredentials(username=RABBIT_USER, password=RABBIT_PWD)
        conn_info = pika.ConnectionParameters(host=RABBIT_HOST, port=RABBIT_PORT, credentials=creds,
                                              virtual_host=RABBIT_VHOST)
        self.conn = pika.BlockingConnection(conn_info)
        self.channel: pika.adapters.blocking_connection.BlockingChannel = self.conn.channel()
        self.consumer_tags = {}

    def send_message(self, endpoint: Endpoint, message: str, priority=1):
        props = pika.BasicProperties(priority=priority)
        message = message.encode()
        self.channel.basic_publish('', endpoint.value, message, props)

    def on_message(self, endpoint: Endpoint, handler):
        def rabbit_message_handler(ch, method, props, body):
            print('Message received', body.decode())
            handler(body.decode())

        consumer_tag = self.channel.basic_consume(endpoint.value, rabbit_message_handler, True)
        self.consumer_tags[endpoint.value] = consumer_tag
        t = threading.Thread(target=self.channel.start_consuming)
        t.start()

    def stop_listening(self, endpoint: Endpoint):
        if endpoint.value not in self.consumer_tags:
            return

        consumer_tag = self.consumer_tags[endpoint.value]
        self.channel.stop_consuming(consumer_tag)
