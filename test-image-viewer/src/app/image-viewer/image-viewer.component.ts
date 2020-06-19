import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {CloudSocketService} from "../shared/services/cloud-socket.service";

export interface AverageStats {
  avgFullDelay: number;
  avgCloudRecTime: number;
  avgCloudProcTime: number;
  avgClientRecTime: number;
  fps: number;
}

const arraySum = (arr: number[]) => arr.reduce((acc, elem) => acc + elem);

const average = (arr: number[]) => arr.reduce((acc, elem) => acc + elem) / arr.length;

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  image = '';
  delay = 0;
  fps = 0;

  private fullDelays: number[] = [];
  private cloudRecTimes: number[] = [];
  private cloudProcTimes: number[] = [];
  private clientRecTimes: number[] = [];

  averages: AverageStats[] = [];
  processedImages = 0;

  constructor(private sanitizer: DomSanitizer,
              private cloudSocketService: CloudSocketService) {
    this.cloudSocketService.listen();
  }

  ngOnInit() {
    let interval = null;
    this.cloudSocketService.imageEmitter.on('image', msg => {
      const data = msg.buffer;

      const imageData = "data:image/jpeg;base64," + data;
      this.sanitizer.bypassSecurityTrustUrl(imageData);
      this.image = imageData;
      const now = Date.now();
      const delay = now - msg.ts_drone_send;
      this.delay = delay;
      this.processedImages += 1;

      this.fullDelays.push(delay);
      this.cloudRecTimes.push(msg.delta_rec);
      this.cloudProcTimes.push(msg.delta_proc);
      this.clientRecTimes.push(now - msg.ts_cloud_send);

      if (!interval) {
        interval = setInterval(() => this.updateDelays(), 1000);
      }
    });
  }

  private updateDelays() {
    const fps = this.processedImages;
    this.processedImages = 0;
    if (!fps) {
      return;
    }
    const avg: AverageStats = {
      // @ts-ignore
      avgFullDelay: parseInt(average(this.fullDelays)),
      // @ts-ignore
      avgClientRecTime: parseInt(average(this.clientRecTimes)),
      // @ts-ignore
      avgCloudProcTime: parseInt(average(this.cloudProcTimes)),
      // @ts-ignore
      avgCloudRecTime: parseInt(average(this.cloudRecTimes)),
      fps: fps
    }
    this.fps = fps;
    this.averages[0] = avg;
  }

}
