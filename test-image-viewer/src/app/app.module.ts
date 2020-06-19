import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { CameraComponent } from './camera/camera.component';
import {WebcamModule} from "ngx-webcam";
import { ControlComponent } from './control/control.component';
import {FormsModule} from "@angular/forms";
import {ImageViewerComponent} from "./image-viewer/image-viewer.component";

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    ControlComponent,
    ImageViewerComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    WebcamModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
