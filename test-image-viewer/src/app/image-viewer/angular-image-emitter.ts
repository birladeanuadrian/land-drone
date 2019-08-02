import {ImageEmitter} from 'udp-packer';
import {Buffer} from "buffer";

export class AngularImageEmitter implements ImageEmitter {

  private onCallback: (data: {timestamp: number, buffer: Buffer}) => any;
  private eventTarget: EventTarget;

  constructor() {
    this.eventTarget = new EventTarget();
    this.eventTarget.addEventListener('image', (evt: CustomEvent) => {
      this.onCallback(evt.detail);
    });
  }

  on(type: 'image', func: (data: {timestamp: number, buffer: Buffer}) => any) {
    this.onCallback = func;
  }

  emit(type: 'image', data: {timestamp: number, buffer: Buffer}) {
    const ev = new CustomEvent('image', {detail: data});
    this.eventTarget.dispatchEvent(ev);
  }

}
