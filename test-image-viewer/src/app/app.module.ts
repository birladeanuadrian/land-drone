import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ImageViewerModule} from "./image-viewer/image-viewer.module";
import {ImageControlModule} from "./image-control/image-control.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ImageCaptureComponent } from './image-capture/image-capture.component';
import { CameraComponent } from './camera/camera.component';
import {WebcamModule} from "ngx-webcam";

@NgModule({
  declarations: [
    AppComponent,
    ImageCaptureComponent,
    CameraComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ImageViewerModule,
    ImageControlModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
