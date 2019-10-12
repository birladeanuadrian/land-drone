import {UdpPacker} from "udp-packer";
import * as cv from 'opencv4nodejs';
import * as dgram from 'dgram';
import Debug from 'debug';
import io from 'socket.io-client';
import {DroneComms} from './inner-comms';

const debug = Debug('app');
// const SERVER_IP = '192.168.0.122';
const UDP_SERVER = '35.234.90.125';
const HTTP_SERVER = '35.198.170.255';
const socket = dgram.createSocket('udp4');
const devicePort = 0;
const ioSocket = io(`http://${HTTP_SERVER}:8080`);
const cap = new cv.VideoCapture(devicePort);

function sendImage() {
    debug('start');
    let frame = cap.read();
    debug('read image');
    const data = cv.imencode('.jpeg', frame);
    debug('encoded image');
    const udpPacks = UdpPacker.pack(data);
    debug('packed data');
    for (let idx=0; idx < udpPacks.length; idx++) {
        socket.send(udpPacks[idx].getBuffer(), 5000, UDP_SERVER, (err, bytes) => {
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
    setInterval(sendImage, 150);

    ioSocket.on('control', (msg: any) => {
        msg = JSON.parse(msg);
        console.log('Control message', msg);
        comms.sendMessage('engine', msg, 1)
            .then(() => {})
            .catch(err => console.error('Error', err))
    });
});
