import * as cv from 'opencv4nodejs';
import * as fs from 'fs';
import * as path from 'path';


const ROOT = 'D:\\Work\\git\\LandDrone\\person-detector\\models\\faces\\blue_bloods';
const personMap = new Map<string, number>();
let currentId = 1;

function getPersonId(name: string) {
    let id = personMap.get(name);
    if (!id) {
        personMap.set(name, currentId);
        id = currentId;
        currentId++;
    }
    return id;
}


async function run() {
    const recognizer = new cv.FisherFaceRecognizer();
    const people = fs.readdirSync(ROOT);
    const images: Array<cv.Mat> = [];
    const labels: Array<number> = [];
    for (let person of people) {
        const personDir = path.join(ROOT, person);
        const personImages = fs.readdirSync(personDir);
        for (let image of personImages) {
            const imagePath = path.join(personDir, image);
            const mat = cv.imread(imagePath);
            images.push(mat);
            labels.push(getPersonId(person));
        }
    }

    recognizer.train(images, labels);

}

run()
    .then(() => console.log('Recognizer finished running'))
    .catch(err => console.error('Error encountered', err));
