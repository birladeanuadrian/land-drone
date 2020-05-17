import { Component, OnInit } from '@angular/core';
// import * as cv from 'opencv.js';



@Component({
  selector: 'app-image-capture',
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.scss']
})
export class ImageCaptureComponent implements OnInit {

  constructor() { }

  async executeCommands(imageElement: HTMLImageElement) {
    const modelUrl = 'http://localhost:4200/assets/models/model.json';
    const canvas = document.getElementById('img-canvas');
    console.log('Image element', imageElement, imageElement );
    console.log('Instance', imageElement instanceof HTMLImageElement);
    // @ts-ignore
    const image = await tf.browser.fromPixels(imageElement);
    console.log('Image', image);
    // const model = await tf.loadGraphModel(modelUrl);


    // const model2 = await loadGraphModel(modelUrl);
    // console.log('Model2', model);
    // const predictions = model2.predict(image);
    // console.log('Predictions', predictions);

    console.log('Loading model');
    // const model3 = await cocoSsd.load({base: 'lite_mobilenet_v2'});
    const times = [];
    // console.log('Model Loaded', model3);
    // for (let idx = 0; idx < 100; idx++) {
    //   const start = Date.now();
    //   const predictions = await model3.detect(imageElement);
    //   const end = Date.now();
    //   console.log('Predictions', end - start,  predictions);
    //   if (idx !== 0) {
    //     times.push(end - start);
    //   }
    // }

    console.log('Average', times.reduce((acc, current) => acc + current) / times.length);
    // await tf.browser.toPixels(image, )


    // const pixelData =
    // const image = await tf.browser.fromPixels()
    // console.log('Model', model);
    // const prediction = model.predict(image);
    // console.log('Prediction', prediction);
  }

  async loadModel () {
    const imageUrl = 'http://localhost:4200/assets/people.jpg';

    // @ts-ignore
    const imageElement: HTMLImageElement = document.getElementById('people');
    imageElement.onload = () => {
      this.executeCommands(imageElement)
        .then(() => console.log('Commands executed'))
        .catch(err => console.error('Error', err));
    };
  }

  ngOnInit() {
    this.loadModel()
      .then(() => console.log('Model loaded'))
      .catch(err => console.error('Error encountered', err));
  }
}
