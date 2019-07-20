import 'mocha';
import * as fs from 'fs';
import {UdpPacker} from "../src";
import * as chai from 'chai';

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

        // const numberOfPages = firstPacket.getNumberOfPages();
        chai.assert.equal(imageDescriptor.numberOfPages, udpPackets.length);

        // const jpegSize = firstPacket.readUInt32LE(12);
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
});
