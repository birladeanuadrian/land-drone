import 'mocha';
import * as fs from 'fs';
import {UdpPacker} from "../src";
import * as path from 'path';
import * as chai from 'chai';

describe('UdpPacker tests', () => {

    const jpegPath = 'C:\\Users\\birla\\Pictures\\husky.jpg';
    const udpPacker = new UdpPacker();

    it('Should pack and exit', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        const udpPackets = udpPacker.pack(jpegBuffer);
        // const newPath = path.join(path.dirname(jpegPath), 'husky2.jpg');
        // console.log('Packets', udpPackets.length);
    });

    it ('Should create a valid header', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        const udpPackets = udpPacker.pack(jpegBuffer);
        const firstPacket = udpPackets[0];

        const pageNumber = firstPacket.readUInt16LE(8);
        chai.assert.equal(pageNumber, 0);

        const numberOfPages = firstPacket.readUInt16LE(10);
        chai.assert.equal(numberOfPages, udpPackets.length);

        const jpegSize = firstPacket.readUInt32LE(12);
        chai.assert.equal(jpegSize, jpegBuffer.length);
    });

    it ('Should number pages correctly', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        const udpPackets = udpPacker.pack(jpegBuffer);

        for (let idx = 0; idx < udpPackets.length; idx++) {
            const packet = udpPackets[idx];
            const pageNumber = packet.readUInt16LE(8);
            chai.assert.equal(pageNumber, idx);
        }
    });

    it ('Should maintain data integrity', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        const udpPackets = udpPacker.pack(jpegBuffer);

        let reconstructedBuffer = Buffer.from([]);

        
    });
});
