import { Component, OnInit } from '@angular/core';
import {AngularImageEmitter} from "./angular-image-emitter";
import {DomSanitizer} from "@angular/platform-browser";
import {CloudSocket} from "../shared/servies/cloud-socket";

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  private imageReceiver: CloudSocket;
  private readonly angularImageEmitter: AngularImageEmitter;
  image = '';
  delay = 0;

  constructor(private sanitizer: DomSanitizer) {
    this.angularImageEmitter = new AngularImageEmitter();
    this.imageReceiver = new CloudSocket(this.angularImageEmitter);
    this.imageReceiver.listen();
  }

  ngOnInit() {
    this.angularImageEmitter.on('image', data => {
      this.delay = new Date().getTime() - data.timestamp;
      // console.log('Delay', delay);
      const imageData = "data:image/jpeg;base64," + data.buffer.toString('base64');
      this.sanitizer.bypassSecurityTrustUrl(imageData);
      this.image = imageData;
    });
  }

}
