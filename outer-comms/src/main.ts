import {UdpPacker} from "udp-packer";
// import * as cv from 'opencv4nodejs';
import * as dgram from 'dgram';
import Debug from 'debug';
import {Codec, StillCamera, StreamCamera, } from 'pi-camera-connect';

const debug = Debug('app');
const SERVER_IP = '192.168.0.122';
const socket = dgram.createSocket('udp4');
const devicePort = 0;
// const streamCamera = new StreamCamera({
//     width: 600,
//     height: 400,
//     codec: Codec.MJPEG
// });
// const cap = new cv.VideoCapture(devicePort);

function sendImage() {

    const stillCamera = new StillCamera({
        width: 600,
        height: 400,
        delay: 0,
    });
    debug('start');
    // let frame = cap.read();
    // debug('read image');
    // const data = cv.imencode('.jpeg', frame);
    stillCamera.takeImage().then(data => {
    // streamCamera.on('frame', data => {
        debug('encoded image');
        const udpPacks = UdpPacker.pack(data);
        debug('packed data');
        for (let idx=0; idx < udpPacks.length; idx++) {
            socket.send(udpPacks[idx].getBuffer(), 5000, SERVER_IP, (err, bytes) => {
                // if (err) {
                //     console.error('got error', err);
                // }
                if (idx === udpPacks.length - 1) {
                    debug('sent data');
                    process.exit(0);
                }
            });
        }
    });

}

socket.addListener('control', msg => {
    console.log('Control message');
});

// streamCamera.startCapture().then(() => {
    setInterval(sendImage, 1000);
// }).catch(err => console.error(err));
