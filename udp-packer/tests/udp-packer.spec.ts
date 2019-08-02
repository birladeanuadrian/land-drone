import 'mocha';
import * as fs from 'fs';
import {UdpPacker} from '../src';
import * as chai from 'chai';
import { EventEmitter } from 'events';

function randomize(myArr: Array<any>) {
    let l = myArr.length, temp, index;
    while (l > 0) {
        index = Math.floor(Math.random() * l);
        l--;
        temp = myArr[l];
        myArr[l] = myArr[index];
        myArr[index] = temp;
    }
    return myArr;
}

describe('UdpPacker tests', () => {

    const jpegPath = 'C:\\Users\\birla\\Pictures\\husky.jpg';

    it('Should pack and exit', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        UdpPacker.pack(jpegBuffer);
    });

    it ('Should create a valid header', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        const udpPackets = UdpPacker.pack(jpegBuffer);
        const firstPacket = udpPackets[0];

        const pageNumber = firstPacket.getPage();
        chai.assert.equal(pageNumber, 0);

        const imageDescriptor = firstPacket.getImageDescriptor();

        chai.assert.equal(imageDescriptor.numberOfPages, udpPackets.length);
        chai.assert.equal(imageDescriptor.imageSize, jpegBuffer.length);
    });

    it ('Should number pages correctly', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        const udpPackets = UdpPacker.pack(jpegBuffer);

        for (let idx = 0; idx < udpPackets.length; idx++) {
            const packet = udpPackets[idx];
            const pageNumber = packet.getPage();
            chai.assert.equal(pageNumber, idx);
        }
    });

    it ('Should maintain data integrity', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        const udpPackets = UdpPacker.pack(jpegBuffer);
        console.log('UDP Packets', udpPackets.length);

        const firstPacket = udpPackets[0];
        const firstData = firstPacket.getData();
        let expectedData = Buffer.from(jpegBuffer);
        expectedData = expectedData.slice(0, firstData.length);
        chai.assert.equal(firstData.toString('hex'), expectedData.toString('hex'));

        const secondPacket = udpPackets[1];
        const secondData = secondPacket.getData();
        const secondActualData = jpegBuffer.slice(firstData.length, firstData.length + secondData.length);
        chai.assert.equal(secondData.length, secondActualData.length);
        chai.assert.equal(secondData.toString('hex'), secondActualData.toString('hex'));

        const reconstructedData = UdpPacker.unpackPackages(udpPackets);
        console.log('Buffer length', reconstructedData.length);
        chai.assert.equal(reconstructedData.toString('hex'), jpegBuffer.toString('hex'));
    });

    it ('Should pack and unpack image', () => {
        const imageEmitter = new EventEmitter();
        const udpPacker = new UdpPacker(imageEmitter);
        const jpegBuffer = fs.readFileSync(jpegPath);
        console.log('JPEG', jpegBuffer);
        const udpPackets = UdpPacker.pack(jpegBuffer);
        console.log('Lengths', udpPackets[0].getData().length, udpPackets[1].getData().length);

        return new Promise((resolve, reject) => {

            imageEmitter.on('image', (newJpegBuffer: Buffer) => {
                console.log('Got an image', newJpegBuffer);
                chai.assert.equal(newJpegBuffer.toString('hex'), jpegBuffer.toString('hex'));
                resolve();
            });

            setTimeout(() => {
                reject('UDP Packer timeout');
            }, 500);

            for (let idx = 0; idx < udpPackets.length; idx++) {
                udpPacker.addPacket(udpPackets[idx]);
            }
        });
    });

    it ('Should pack, randomize and unpack image', () => {
        const imageEmitter = new EventEmitter();
        const udpPacker = new UdpPacker(imageEmitter);
        const jpegBuffer = fs.readFileSync(jpegPath);
        console.log('JPEG', jpegBuffer);
        let udpPackets = UdpPacker.pack(jpegBuffer);
        udpPackets = randomize(udpPackets);
        console.log('First is header', udpPackets[0].isHeaderPacket());

        return new Promise((resolve, reject) => {

            imageEmitter.on('image', (newJpegBuffer: Buffer) => {
                console.log('Got an image', newJpegBuffer);
                chai.assert.equal(newJpegBuffer.toString('hex'), jpegBuffer.toString('hex'));
                resolve();
            });

            setTimeout(() => {
                reject('UDP Packer timeout');
            }, 500);

            for (let idx = 0; idx < udpPackets.length; idx++) {
                udpPacker.addPacket(udpPackets[idx]);
            }
        });
    });
});
