import {UdpPacker} from "udp-packer";
import * as cv from 'opencv4nodejs';
import * as dgram from 'dgram';
import Debug from 'debug';
import io from 'socket.io-client';
import {DroneComms} from './inner-comms';

const debug = Debug('app');
// const SERVER_IP = '192.168.0.122';
// const SERVER = '192.168.0.241';
const SERVER = '34.107.14.190';
const socket = dgram.createSocket('udp4');
const devicePort = 0;
const ioSocket = io(`http://${SERVER}:8080`);
const cap = new cv.VideoCapture(devicePort);
let frame = cap.read();

const imageHeight = frame.sizes[0];
const imageWidth = frame.sizes[1];
const desiredSize = imageHeight < imageWidth ? imageHeight : imageWidth;

const widthMiddle = imageWidth / 2 - desiredSize / 2;
const heightMiddle = imageHeight / 2 - desiredSize / 2;

function sendImage() {
    debug('start');
    frame = cap.read();
    debug('read image');

    let newFrame = frame.getRegion(new cv.Rect(
        widthMiddle,
        heightMiddle,
        desiredSize, desiredSize));

    const data = cv.imencode('.jpeg', newFrame);
    debug('encoded image');
    const udpPacks = UdpPacker.pack(data);
    debug('packed data');
    for (let idx=0; idx < udpPacks.length; idx++) {
        socket.send(udpPacks[idx].getBuffer(), 5000, SERVER, (err, bytes) => {
            // if (err) {
            //     console.error('got error', err);
            // }
            if (idx === udpPacks.length - 1) {
                debug('sent data');
                // process.exit(0);
            }
        });
    }
}

DroneComms.getComms().then(comms => {
    setInterval(sendImage, 120);

    ioSocket.on('drone-control', (msg: any) => {
        msg = JSON.parse(msg);
        console.log('Control message', msg);
        comms.sendMessage('engine', msg, 1)
            .then(() => {})
            .catch(err => console.error('Error', err))
    });
});
