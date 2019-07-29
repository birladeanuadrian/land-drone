import { Component, OnInit } from '@angular/core';
import {ImageReceiverService} from "./image-receiver.service";

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  constructor(private imageReceiver: ImageReceiverService) {
    this.imageReceiver.listen();
  }

  ngOnInit() {
  }

}
