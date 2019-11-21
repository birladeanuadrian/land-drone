import 'mocha';
import * as fs from 'fs';
import {FaceDetector} from "../src/face-detector";

describe('Face detector tests', () => {

    it ('Should detect faces', async () => {
        const faceDetector = new FaceDetector();
        await faceDetector.init();
        const imagePath = 'C:\\Users\\birla\\Pictures\\blue_bloods\\jack_boyle\\01.jpg';
        const mat =
        const buffer = fs.readFileSync(imagePath);
        console.log('Image', buffer);
        const faces = await faceDetector.detectFaces(imagePath);
        for (let face of faces) {

        }
    }).timeout(10000);
});
