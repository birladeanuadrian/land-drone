// import {Socket, createSocket} from 'dgram';
// // import {UdpPacker, UdpPacket} from "udp-packer";
// import {EventEmitter} from "events";
// import {Image} from "./datatypes";
// import {Worker} from 'cluster';
//
// export class Receiver {
//     udpServer: Socket;
//     udpPacker: UdpPacker;
//     imageEmitter: EventEmitter;
//     dispatcher: Worker;
//
//     constructor(dispatcher: Worker) {
//         this.dispatcher = dispatcher;
//         this.udpServer = createSocket({type: 'udp4'})
//         this.imageEmitter = new EventEmitter();
//         this.udpPacker = new UdpPacker(this.imageEmitter);
//         this.setupUdpServer();
//     }
//
//     private setupUdpServer() {
//         this.udpServer.on('error', err => {
//             console.error('UDP Error', err);
//             this.udpServer.close();
//         });
//
//         this.udpServer.on('message', (msg, rinfo) => {
//             this.udpPacker.addPacket(UdpPacket.fromBuffer(msg));
//         });
//
//         this.imageEmitter.on('image', (img: Image) => {
//             this.dispatcher.send({ts: img.timestamp, data: img.buffer.toString('base64')});
//         });
//     }
//
//     run() {
//         this.udpServer.bind(5000, () => {
//             console.log('UDP Server started');
//         });
//     }
// }
