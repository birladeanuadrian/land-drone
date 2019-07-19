import 'mocha';
import * as fs from 'fs';
import {UdpPacker} from "../src";
import * as chai from 'chai';

describe('UdpPacker tests', () => {

    const jpegPath = 'C:\\Users\\birla\\Pictures\\husky.jpg';
    const udpPacker = new UdpPacker();

    it('Should pack and exit', () => {
        const jpegBuffer = fs.readFileSync(jpegPath);
        udpPacker.pack(jpegBuffer);
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
        console.log('UDP Packets', udpPackets.length);

        const firstPacket = udpPackets[0];
        const firstData = udpPacker.extractData(firstPacket);
        let expectedData = Buffer.from(jpegBuffer);
        expectedData = expectedData.slice(0, firstData.length);
        chai.assert.equal(firstData.toString('hex'), expectedData.toString('hex'));

        const secondPacket = udpPackets[1];
        const secondData = udpPacker.extractData(secondPacket);
        const secondActualData = jpegBuffer.slice(firstData.length, firstData.length + secondData.length);
        chai.assert.equal(secondData.length, secondActualData.length);
        chai.assert.equal(secondData.toString('hex'), secondActualData.toString('hex'));

        const reconstructedData = udpPacker.unpackPackages(udpPackets);
        console.log('Buffer length', reconstructedData.length);
        chai.assert.equal(reconstructedData.toString('hex'), jpegBuffer.toString('hex'));
    });
});
