import * as cv from 'opencv4nodejs';
import * as fs from 'fs';
import * as path from 'path';
import {FaceDetector} from "./face-detector";


const SOURCE_PATH = 'C:\\Users\\birla\\Pictures\\blue_bloods\\will_estes';
const DEST_PATH = 'D:\\Work\\git\\LandDrone\\person-detector\\models\\faces\\blue_bloods\\Will_Estes';


async function convertFaces() {
    const files = fs.readdirSync(SOURCE_PATH);
    console.log('Files', files);
    const faceDetector = new FaceDetector();
    await faceDetector.init();

    if (!fs.existsSync(DEST_PATH)) {
        fs.mkdirSync(DEST_PATH);
    }

    for (let file of files) {
        try {
            const sourcePath = path.join(SOURCE_PATH, file);
            const destPath = path.join(DEST_PATH, file.split('.')[0] + '.jpg');

            const det = await faceDetector.detectFaces(sourcePath);
            const mat = cv.imread(sourcePath, cv.IMREAD_UNCHANGED);

            for (let face of det) {
                const box = face.box;
                const roi = new cv.Rect(box.x, box.y, box.width, box.height);
                let faceMat = mat.getRegion(roi);
                faceMat = faceMat.resize(120, 200);
                cv.imwrite(destPath, faceMat);
            }
            console.log('Finished parsing', file, destPath);
        } catch (e) {
            console.error('Partial error', file, e);
        }
    }
}

convertFaces()
    .then(() => console.log('Faces converted'))
    .catch(err => console.error('Error encountered', err));
