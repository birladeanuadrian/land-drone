import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import {ImageEmitter} from "udp-packer";
import {AngularImageEmitter} from "../../image-viewer/angular-image-emitter";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CloudSocketService {

  private socket: io.Socket;
  imageEmitter: AngularImageEmitter;

  constructor() {
    console.log('Cloud socket constructor');
    this.imageEmitter = new AngularImageEmitter();

    // this.socket = io(environment.ioServer, {
    //   path: environment.ioPath
    // });
    this.socket = io(environment.ioServer);
    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
      this.socket.emit('event', {test: 23})
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    this.socket.on('response', (...args) => {
      console.log('Received data', args);
    });

    this.socket.on('controller-login', () => {
      alert('Login successful');
    });

    this.socket.on('login-error', () => {
      alert('Login failed');
    });

    this.socket.on('reject-controller', () => {
      alert('Someone else is the active controller. Please try again later');
    });

  }

  listen() {
    this.socket.on('image', (base64Image: string, ts_drone_send: number, delta_rec: number, delta_proc: number, ts_cloud_send: number) => {
      const event = {
        buffer: base64Image,
        delta_proc: delta_proc,
        delta_rec: delta_rec,
        ts_cloud_send: ts_cloud_send,
        ts_drone_send: ts_drone_send
      };
      this.imageEmitter.emit('image', event);
    });
  }

  login(secret: string) {
    this.socket.emit('login', secret);
  }

  sendCommand(acceleration: number, direction: number) {
    const now = Date.now();
    const message = {acceleration, direction, now};
    this.socket.emit('control-message', JSON.stringify(message));
  }

  startTracking() {
    this.socket.emit('start-track');
  }

  stopTracking() {
    this.socket.emit('stop-track');
  }

  startRec() {
    this.socket.emit('start-rec');
  }

  stopRec() {
    this.socket.emit('stop-rec');
  }
}
