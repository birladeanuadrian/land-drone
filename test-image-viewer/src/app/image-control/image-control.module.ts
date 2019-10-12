import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageControlComponent} from "./image-control.component";
import {NgxGaugeModule} from "ngx-gauge";


@NgModule({
  declarations: [
    ImageControlComponent
  ],
  imports: [
    CommonModule,
    NgxGaugeModule
  ],
  exports: [
    ImageControlComponent
  ]
})
export class ImageControlModule { }
