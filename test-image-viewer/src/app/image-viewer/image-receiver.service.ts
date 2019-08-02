import io from 'socket.io-client';
import {Buffer} from 'buffer';
import {UdpPacker, UdpPacket, ImageEmitter} from 'udp-packer';

export class ImageReceiverService {

  private socket: io.Socket;
  private udpPacker: UdpPacker;

  constructor(imageEmitter: ImageEmitter) {
    this.udpPacker = new UdpPacker(imageEmitter);
    this.socket = io('http://127.0.0.1:8080');
    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });
  }

  listen() {
    this.socket.on('packet', (data) => {
      this.udpPacker.addPacket(UdpPacket.fromBuffer(Buffer.from(data)));
    })
  }


}
