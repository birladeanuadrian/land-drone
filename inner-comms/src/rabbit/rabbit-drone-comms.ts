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
            const message = msg.content.toString('utf8');
            handler(message);
        }).catch(err => {
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
        const content = Buffer.from(message);
        this.channel.publish('', endpoint, content, {priority});
    }

    stop() {
        if (this.connection) {
            this.connection.close().then(() => {}).catch(() => {});
        }
    }
}
