import { Component, OnInit } from '@angular/core';
import {ImageReceiverService} from "./image-receiver.service";
import {AngularImageEmitter} from "./angular-image-emitter";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  private imageReceiver: ImageReceiverService;
  private readonly angularImageEmitter: AngularImageEmitter;
  image = '';
  delay = 0;

  constructor(private sanitizer: DomSanitizer) {
    this.angularImageEmitter = new AngularImageEmitter();
    this.imageReceiver = new ImageReceiverService(this.angularImageEmitter);
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
