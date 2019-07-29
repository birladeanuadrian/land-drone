import {EventEmitter, Injectable} from '@angular/core';
import io from 'socket.io-client';
import {Buffer} from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class ImageReceiverService extends EventEmitter<Buffer> {

  private socket: io.Socket;
  private ready = false;

  constructor() {
    super();
    this.socket = io('http://127.0.0.1:5000');
    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });
  }

  listen() {
    this.socket.on('packet', data => {
      console.log('Just received data', data.length);
    })
  }


}
