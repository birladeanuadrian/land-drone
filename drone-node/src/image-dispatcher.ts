import {CommsInterface, DroneComms} from "./inner-comms";
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as dgram from 'dgram';
import {UdpPacker} from "udp-packer";

const SERVER_IP = '192.168.0.122';


class ImageDispatcher {

    private comms: CommsInterface|null;
    private socket: dgram.Socket;

    constructor() {
        this.comms = null;
        this.socket = dgram.createSocket('udp4');
    }

    async init() {
        this.comms = await DroneComms.getComms();
    }

    imageHandler(encodedImage: string) {
        const image = Buffer.from(encodedImage, 'base64');
        const udpPacks = UdpPacker.pack(image);
        for (let idx = 0; idx < udpPacks.length; idx++) {
            this.socket.send(udpPacks[idx].getBuffer(), 5000, SERVER_IP, (err, bytes) => {
                if (err) {
                    console.error('get error', err);
                }
            });
        }
    }

    main() {
        if (!this.comms) {
            throw new Error('Comms were not initialized');
        }

        this.comms.onMessage('camera', this.imageHandler.bind(this));
    }
}


if (require.main === module) {
    const dispatcher = new ImageDispatcher();
    dispatcher.init().then(() => dispatcher.main())
}
