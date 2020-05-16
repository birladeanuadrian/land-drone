import SocketIO from 'socket.io';
import express from 'express';
import cors from "cors";
import {EncodedImage, Image} from "./datatypes";
import * as fs from 'fs';


export class Dispatcher {
    ioServer: any;
    app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(cors({origin: '*'}));
        this.app.use(express.json());
        this.app.use(express.urlencoded());
        this.ioServer = SocketIO()
    }

    run() {
        const server = this.app.listen(8080, () => {
            console.log('HTTP server is running');
        });

        this.ioServer = SocketIO(server, {
            origins: '*:*',
        });

        this.ioServer.on('connection', (socket: SocketIO.Socket) => {
            console.log('a user connected');

            socket.on('disconnect', () => {
                console.log('a user disconnected');
            });
        });

        this.ioServer.on('control-message', (msg: any) => {
           this.ioServer.emit('drone-control', msg);
        });

        this.app.get('/', (req, res) => res.send('Ok'));

        this.app.post('/control', (req, res) => {
            const acceleration: number = req.body.acceleration;
            const direction = req.body.direction;

            this.ioServer.emit('control', JSON.stringify({acceleration, direction}));
            res.json({ok: 1});
        });

        process.on('message', (msg: EncodedImage) => {
            this.ioServer.emit('image', msg.ts, msg.data);
            // fs.writeFileSync(`${msg.ts}.jpeg`, Buffer.from(msg.data, 'base64'));
        });
    }
}
