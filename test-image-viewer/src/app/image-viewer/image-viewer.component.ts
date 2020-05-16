import { Component, OnInit } from '@angular/core';
import {AngularImageEmitter} from "./angular-image-emitter";
import {DomSanitizer} from "@angular/platform-browser";
import {CloudSocket} from "../shared/servies/cloud-socket";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as jpeg from 'jpeg-js';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  private imageReceiver: CloudSocket;
  private readonly angularImageEmitter: AngularImageEmitter;
  private worker: Worker;
  image = '';
  delay = 0;

  constructor(private sanitizer: DomSanitizer) {
    this.angularImageEmitter = new AngularImageEmitter();
    this.imageReceiver = new CloudSocket(this.angularImageEmitter);
    this.imageReceiver.listen();
  }

  ngOnInit() {
    const cv: any = window['cv'];
    // console.log('CV', cv);
    // console.log('Read', cv.imread);
    // console.log('Image data', cv.matFromImageData);
    // cv.
    // @ts-ignore
    const imageElement: HTMLImageElement = document.getElementById('current-image');
    // @ts-ignore
    const canvas: HTMLCanvasElement = document.getElementById('img-canvas');
    const context = canvas.getContext('2d');
    cocoSsd.load({base: "lite_mobilenet_v2"}).then(model => {
      this.angularImageEmitter.on('image', msg => {
        const data = msg.buffer;
        this.delay = Date.now() - msg.timestamp;

        const start2 = Date.now();
        const imageData = "data:image/jpeg;base64," + data;
        this.sanitizer.bypassSecurityTrustUrl(imageData);
        this.image = imageData;
        const d = jpeg.decode(data.buffer);
        const buffer = new Uint8ClampedArray(d.data);
        const imageData2 = new ImageData(buffer, d.width, d.height);

        const pixels = tf.browser.fromPixels(imageData2);
        context.clearRect(0, 0, 600, 600);
        context.putImageData(imageData2, 0, 0);
        model.detect(pixels).then(predictions => {
          for (let prediction of predictions) {
            const bbox = prediction.bbox;
            context.rect(bbox[0], bbox[1], bbox[2], bbox[3]);
          }
          context.stroke();
          console.log('Transformed jpeg', Date.now() - start2);
        });
      });
    }).catch(err => console.error('Failed to load model', err));

  }

}
