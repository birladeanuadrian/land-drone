import io from 'socket.io-client';
import {Buffer} from 'buffer';
import {UdpPacker, UdpPacket, ImageEmitter} from 'udp-packer';
// import {environment} from "../../environments/environment";
import {environment} from "../../../environments/environment";

export class CloudSocket {

  locationConnection: RTCPeerConnection;
  remoteConnection: RTCPeerConnection;
  sendChannel: RTCDataChannel;

  constructor(imageEmitter: ImageEmitter) {
    this.locationConnection = new RTCPeerConnection();
    this.remoteConnection = new RTCPeerConnection();
    this.sendChannel = this.locationConnection.createDataChannel('videoChannel');
  }

  listen() {
    this.remoteConnection.ondatachannel = (ev => {
      const receiveChannel = ev.channel;
      receiveChannel.onmessage = (event2) => {
        console.log('Data', event2.data);
      };

      receiveChannel.onopen = (event2) => {
        console.log('Opened', event2);
      };

      receiveChannel.onclose = (event2) => {
        console.log('Closed', event2);
      }
    });
  }
}
