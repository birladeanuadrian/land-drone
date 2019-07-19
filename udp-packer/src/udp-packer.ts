import {EventEmitter} from "events";
import {UdpPacket} from "./udp-packet";

const MAX_BUFFER_SIZE = 1452;
const HEADER_DATA_OFFSET = 16;
const REGULAR_DATA_OFFSET = 10;

/**
 * Header buffer contents:
 * 8-byte ubigint le: unix timestamp ms - image unique identifier
 * 2-byte uint le: page number (is 0)
 * 2-byte uint le: number of pages
 * 4-byte uint le: image size
 * up to MAX_BUFFER_SIZE bytes - actual data
 */

/**
 * Data buffer contents:
 * 8-byte ubigint le: unix timestamp ms - image unique identifier
 * 2-byte uint le: page number
 * up to MAX_BUFFER_SIZE bytes - actual data
 */




export class UdpPacker extends EventEmitter {


    /**
     * Returns an array of udp packets
     * @param jpeg
     */
    public pack(jpeg: Buffer): Buffer[] {
        const now = new Date().getTime();
        const timestamp = BigInt(now);
        const outBuffers = [];
        const jpegSize = jpeg.length;

        const firstBuf = Buffer.alloc(MAX_BUFFER_SIZE);
        firstBuf.writeBigUInt64LE(timestamp);
        firstBuf.writeUInt16LE(0, 8);
        firstBuf.writeUInt32LE(jpeg.length, 12);
        outBuffers.push(firstBuf);
        const remainingSize = MAX_BUFFER_SIZE - HEADER_DATA_OFFSET;
        jpeg.copy(firstBuf, HEADER_DATA_OFFSET, 0, remainingSize);
        let jpegOffset = remainingSize;
        let page = 1;
        const writeSize = MAX_BUFFER_SIZE - REGULAR_DATA_OFFSET;

        while (true) {
            let end = jpegOffset + writeSize;
            if (end > jpegSize) {
                end = jpegSize;
            }
            const bufferSize = REGULAR_DATA_OFFSET + end - jpegOffset;
            const newBuffer = Buffer.alloc(bufferSize);
            newBuffer.writeBigUInt64LE(timestamp);
            newBuffer.writeUInt16LE(page, 8);
            page++;

            jpeg.copy(newBuffer, REGULAR_DATA_OFFSET, jpegOffset, end);
            const udpPacket = new UdpPacket(timestamp, page, newBuffer);
            // console.log('Copy', jpegOffset, end, newBuffer);
            outBuffers.push(newBuffer);


            if (end == jpegSize) {
                break;
            } else {
                jpegOffset = end;
            }
        }
        firstBuf.writeUInt16LE(page, 10);
        return outBuffers;
    }

    public extractData(udpPackage: Buffer) {
        const pageNumber = udpPackage.readUInt16LE(8);
        if (pageNumber === 0) {
            return Buffer.from(udpPackage).slice(HEADER_DATA_OFFSET);
        } else {
            return Buffer.from(udpPackage).slice(REGULAR_DATA_OFFSET);
        }
    }

    public unpackPackages(buffers: Buffer[]) {
        let dataBuffer = Buffer.alloc(0);

        for (let buffer of buffers) {
            dataBuffer = Buffer.concat([dataBuffer, this.extractData(buffer)]);
        }

        return dataBuffer;
    }

    public addForUnpack(buf: Buffer) {

    }
}
