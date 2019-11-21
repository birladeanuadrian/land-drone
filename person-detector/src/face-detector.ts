import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import * as fs from 'fs';
import * as cv from 'opencv4nodejs';
import {FaceDetection, NetParams, SsdMobilenetv1Options,} from 'face-api.js';
import {NeuralNetwork} from 'tfjs-image-recognition-base';

const { Canvas, Image, ImageData } = canvas;
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export class FaceDetector {

    private faceDetector: NeuralNetwork<NetParams>;
    private readonly detectionOptions: SsdMobilenetv1Options;

    constructor() {
        // @ts-ignore
        this.faceDetector = faceapi.nets.ssdMobilenetv1;
        this.detectionOptions = new faceapi.SsdMobilenetv1Options({minConfidence: 0.5})
    }

    async init() {
        await this.faceDetector.loadFromDisk('models\\weights');
    }

    async detectFaces(imgPath: string): Promise<Array<FaceDetection>> {
        console.log('Loading image');
        const image = await canvas.loadImage(imgPath);

        // @ts-ignore
        return faceapi.detectAllFaces(image, this.detectionOptions);
    }
}
