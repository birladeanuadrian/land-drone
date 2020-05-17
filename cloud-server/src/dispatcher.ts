import SocketIO from 'socket.io';
import express from 'express';
import cors from "cors";
import {EncodedImage, Image} from "./datatypes";
import * as fs from 'fs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf2 from '@tensorflow/tfjs-node';
import * as tfgpu from '@tensorflow/tfjs-node-gpu';


export class Dispatcher {
    ioServer: any;
    app: express.Application;
    model: cocoSsd.ObjectDetection|null;

    constructor() {
        this.model = null;
        this.app = express();
        this.app.use(cors({origin: '*'}));
        this.app.use(express.json());
        this.app.use(express.urlencoded());
        this.ioServer = SocketIO();
        this.setup();
        tfgpu.
    }

    private setup() {
        cocoSsd.load({base: 'lite_mobilenet_v2'}).then(model => {
            this.model = model;
        }).catch(err => {
            console.error('Failed to load mobilenet', err);
            process.exit(1);
        });
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
            const ts1 = Date.now();
            const tfImage = tf2.node.decodeImage(Buffer.from(msg.data, 'base64'));
            const ts2 = Date.now();
            // @ts-ignore
            this.model?.detect(tfImage)
                .then(predictions => {
                    const ts3 = Date.now();
                    console.log('Predictions', (ts2 - ts1), (ts3 - ts1));
                    this.ioServer.emit('image', msg.ts, msg.data);
                }).catch(err => {
                    console.error('Failed to detect objects', err);
            });

            // fs.writeFileSync(`${msg.ts}.jpeg`, Buffer.from(msg.data, 'base64'));
        });
    }
}
