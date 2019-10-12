import {allowedEndpoints, CommsInterface, EndpointType} from "../comms-interface";
import {Channel, Connection, connect} from 'amqplib';

export class RabbitDroneComms implements CommsInterface {

    static amqpUrl = process.env.AMQP_URL || '';
    connection: Connection|null = null;
    channel: Channel|null = null;

    private constructor(connection: Connection, channel: Channel) {
        this.connection = connection;
        this.channel = channel;
    }

    static async getComms() {
        const conn: Connection = await connect(RabbitDroneComms.amqpUrl);
        const channel: Channel = await conn.createChannel();
        const queueOptions = {durable: true, autoDelete: false};
        for (let endpoint of allowedEndpoints) {
            await channel.assertQueue(endpoint, queueOptions);
        }
        return new RabbitDroneComms(conn, channel);
    }

    onMessage(endpoint: EndpointType, handler: (message: any) => any): void {
        if (!this.channel) {
            throw new Error('Connection lost');
        }
        if (!allowedEndpoints.includes(endpoint)) {
            throw new Error(`Unknown endpoint ${endpoint}`);
        }
        this.channel.consume(endpoint, msg => {
            if (!msg) {
                return;
            }
            const header = msg.properties.headers;
            if (!header) {
                console.error('Message has no headers');
                return;
            }

            const msg_type = header['msg_type'];
            let body: any;
            if (msg_type === 'str') {
                body = msg.content.toString('utf8');
            } else if (msg_type === 'bytes') {
                body = msg.content;
            } else if (msg_type === 'dict') {
                body = JSON.parse(msg.content.toString('utf8'));
            } else {
                console.error('Unknown message type: ' + msg_type);
            }
            handler(body);
        }, {noAck: true}).catch(err => {
            throw err;
        });
    }

    async sendMessage(endpoint: EndpointType, message: any, priority: number = 1): Promise<void> {
        if (!this.channel) {
            throw new Error('Connection lost');
        }
        if (!allowedEndpoints.includes(endpoint)) {
            throw new Error(`Unknown endpoint ${endpoint}`);
        }
        let msg_type: string;
        let content: any;
        if (typeof message === 'string') {
            msg_type = 'str';
            content = Buffer.from(message);
        } else if (message instanceof Buffer) {
            msg_type = 'bytes';
            content = message;
        } else if (typeof message === 'object') {
            msg_type = 'dict';
            content = Buffer.from(JSON.stringify(message));
        } else {
            throw new Error('Unknown message type: ' + typeof message);
        }
        const headers = {msg_type};
        this.channel.publish('', endpoint, content, {priority, headers});
    }

    stop() {
        if (this.connection) {
            this.connection.close().then(() => {}).catch(() => {});
        }
    }
}
