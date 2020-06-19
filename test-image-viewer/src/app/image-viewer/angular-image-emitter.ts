
export interface ImageInfo {
  buffer: string;
  ts_drone_send: number;
  delta_rec: number;
  delta_proc: number;
  ts_cloud_send: number;
}

export class AngularImageEmitter {

  private onCallback: (data: ImageInfo) => any;
  private eventTarget: EventTarget;

  constructor() {
    this.eventTarget = new EventTarget();
    this.eventTarget.addEventListener('image', (evt: CustomEvent) => {
      this.onCallback(evt.detail);
    });
  }

  // @ts-ignore
  on(type: 'image', func: (data: ImageInfo) => any) {
    this.onCallback = func;
  }

  emit(type: 'image', data: ImageInfo) {
    const ev = new CustomEvent('image', {detail: data});
    this.eventTarget.dispatchEvent(ev);
  }
}
