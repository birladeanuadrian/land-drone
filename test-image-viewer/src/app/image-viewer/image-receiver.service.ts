import io from 'socket.io-client';
import {Buffer} from 'buffer';
import {UdpPacker, UdpPacket, ImageEmitter} from 'udp-packer';
import {environment} from "../../environments/environment";

export class ImageReceiverService {

  private socket: io.Socket;
  private udpPacker: UdpPacker;

  constructor(imageEmitter: ImageEmitter) {
    this.udpPacker = new UdpPacker(imageEmitter);
    console.log('Connecting to io server', environment.ioServer);
    this.socket = io(environment.ioServer);
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
