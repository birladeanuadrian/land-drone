import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.scss']
})
export class ImageControlComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

  arrowUp(event) {
    console.log('Arrow up', event);
  }

  arrowDown(event) {
    console.log('Arrow down', event);
  }

  arrowLeft(event) {
    console.log('Arrow left', event);
  }

  arrowRight(event) {
    console.log('Arrow right', event);
  }

}
