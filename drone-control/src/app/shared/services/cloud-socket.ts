import io from 'socket.io-client';
import {Buffer} from 'buffer';
import {UdpPacker, UdpPacket, ImageEmitter} from 'udp-packer';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

export class CloudSocket {

    private socket: io.Socket;
    private udpPacker: UdpPacker;
    private http: HttpClient;

    constructor(imageEmitter: ImageEmitter, http: HttpClient) {
        this.http = http;
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
        });
    }

    sendCommand(direction: number, acceleration: number) {
        const url = environment.ioServer + '/control';
        console.log('Send command', url, direction, acceleration);
        this.http.post(url, {direction, acceleration}).subscribe();
    }


}
