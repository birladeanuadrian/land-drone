import pika
import threading
import json
from drone_inner_comms.inner_comms import AbstractInnerComms, Endpoint, ALLOWED_ENDPOINTS
from drone_inner_comms.rabbit.config import RABBIT_HOST, RABBIT_PORT, RABBIT_PWD, RABBIT_USER, RABBIT_VHOST
from drone_inner_comms.exceptions import CommsException


class RabbitInnerComms(AbstractInnerComms):

    def __init__(self):
        creds = pika.PlainCredentials(username=RABBIT_USER, password=RABBIT_PWD)
        conn_info = pika.ConnectionParameters(host=RABBIT_HOST, port=RABBIT_PORT, credentials=creds,
                                              virtual_host=RABBIT_VHOST)
        self.conn = pika.BlockingConnection(conn_info)
        self.channel: pika.adapters.blocking_connection.BlockingChannel = self.conn.channel()
        for queue in ALLOWED_ENDPOINTS:
            self.channel.queue_declare(queue, auto_delete=False, durable=True)

        self.consumer_tags = {}

    def send_message(self, endpoint: Endpoint, message, priority=1):
        if type(message) == 'str':
            message = message.encode()
            msg_type = 'str'
        # elif type(message) == 'bytes' or type(message) == "<class 'bytes'>":
        elif isinstance(message, (bytes, bytearray)):
            message = message
            msg_type = 'str'
        elif type(message) == 'dict' or type(message) == 'list':
            message = json.dumps(message).encode()
            msg_type = 'dict'
        else:
            raise CommsException("Unknown type: '{}'".format(type(message)))

        props = pika.BasicProperties(priority=priority, headers={'msg_type': msg_type})
        self.channel.basic_publish('', endpoint.value, message, props)

    def on_message(self, endpoint: Endpoint, handler):
        def rabbit_message_handler(ch, method, props: pika.BasicProperties, body):
            # print('Props', props)
            headers = props.headers
            if 'msg_type' not in headers:
                print('Message type not in header')
                return

            msg_type = headers['msg_type']
            if msg_type == 'bytes':
                cb_param = body
            elif msg_type == 'str':
                cb_param = body.decode()
            elif msg_type == 'dict':
                cb_param = json.loads(body.decode())
            else:
                print('Unknown type: {}'.format(msg_type))
                return
            handler(cb_param)

        consumer_tag = self.channel.basic_consume(endpoint.value, rabbit_message_handler, True)
        self.consumer_tags[endpoint.value] = consumer_tag
        t = threading.Thread(target=self.channel.start_consuming)
        t.start()

    def stop_listening(self, endpoint: Endpoint):
        if endpoint.value not in self.consumer_tags:
            return

        consumer_tag = self.consumer_tags[endpoint.value]
        self.channel.stop_consuming(consumer_tag)
