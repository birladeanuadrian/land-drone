import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ImageViewerModule} from "./image-viewer/image-viewer.module";
import {ImageControlModule} from "./image-control/image-control.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ImageCaptureComponent } from './image-capture/image-capture.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageCaptureComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ImageViewerModule,
    ImageControlModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
