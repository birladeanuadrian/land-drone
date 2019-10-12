import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ImageViewerModule} from "./image-viewer/image-viewer.module";
import {ImageControlModule} from "./image-control/image-control.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AppComponent,
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
