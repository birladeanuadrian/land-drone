import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {WebcamImage} from "ngx-webcam";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @ViewChild("video", {static: true})
  public video: ElementRef;

  @ViewChild("canvas", {static: true})
  public canvas: ElementRef;

  videoOptions: MediaTrackConstraints = {
    width: 600,
    height: 600,
    aspectRatio: 1,
  };

  webcamImage: WebcamImage = null;

  public captures: Array<any>;

  private trigger: Subject<void> = new Subject<void>();

  public constructor() {
    this.captures = [];
  }

  public ngOnInit() {
    // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    //     // this.video.nativeElement.src = window.URL.createObjectURL(stream);
    //     this.video.srcObject = stream;
    //     this.video.nativeElement.play();
    //   });
    // }
  }

  // capture() {
  //   const context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
  //   this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  // }

  handleImage(webcamImage: WebcamImage) {
    console.log('Received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

}
